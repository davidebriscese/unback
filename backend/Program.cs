using System.Diagnostics;
using System.Reflection;
using System.Threading.RateLimiting;
using Microsoft.AspNetCore.Diagnostics;
using Microsoft.Extensions.Options;
using NoBg;
using SixLabors.ImageSharp;

if (args is ["healthcheck"])
    return await HealthCheck.RunAsync();

const string PerIpPolicy = "per-ip";
const string InferencePolicy = "inference";

var builder = WebApplication.CreateBuilder(args);

builder.Services.Configure<NoBgOptions>(builder.Configuration.GetSection(NoBgOptions.SectionName));

// Snapshot for the few knobs Kestrel and the pipeline need before DI exists. Everything reached
// per request goes through IOptions instead, so configuration stays overridable.
var startup = builder.Configuration.GetSection(NoBgOptions.SectionName).Get<NoBgOptions>() ?? new NoBgOptions();

var version = (Assembly.GetExecutingAssembly()
        .GetCustomAttribute<AssemblyInformationalVersionAttribute>()?.InformationalVersion ?? "0.0.0")
    .Split('+')[0];

// Requests beyond this are rejected by Kestrel with a 413 before reaching the endpoint
builder.WebHost.ConfigureKestrel(kestrel =>
    kestrel.Limits.MaxRequestBodySize = startup.MaxUploadBytes + 1024 * 1024);

builder.Services.AddCors(cors => cors.AddDefaultPolicy(policy =>
{
    // A keyless public API is meant to be called from anywhere: abuse is bounded by the rate
    // limits, not by CORS. Self-hosters can lock an instance down through AllowedOrigins.
    if (startup.AllowedOrigins.Length > 0)
        policy.WithOrigins(startup.AllowedOrigins);
    else
        policy.AllowAnyOrigin();

    policy.AllowAnyHeader()
        .AllowAnyMethod()
        .WithExposedHeaders("Retry-After", "Content-Disposition");
}));

builder.Services.AddRateLimiter(limiter =>
{
    limiter.RejectionStatusCode = StatusCodes.Status429TooManyRequests;
    limiter.OnRejected = async (context, ct) =>
    {
        var retryAfter = context.Lease.TryGetMetadata(MetadataName.RetryAfter, out var window)
            ? (int)Math.Ceiling(window.TotalSeconds)
            : 0;
        if (retryAfter > 0)
            context.HttpContext.Response.Headers.RetryAfter = retryAfter.ToString();

        // The middleware does not say which limiter rejected the request, but a retry window
        // longer than the burst window can only have come from the daily one.
        var daily = retryAfter > RateLimitOf(context.HttpContext).WindowSeconds;
        await context.HttpContext.Response.WriteAsJsonAsync(daily
            ? new ApiError(ErrorCodes.DailyLimitReached,
                "Daily fair-use limit reached. Try again tomorrow, or self-host your own instance.")
            : new ApiError(ErrorCodes.RateLimited,
                "Too many requests from this address. Try again shortly."), ct);
    };

    // Burst limit, applied to the remove endpoint only.
    limiter.AddPolicy(PerIpPolicy, context =>
    {
        var rateLimit = RateLimitOf(context);
        return RateLimitPartition.GetFixedWindowLimiter(ClientKey(context), _ => new FixedWindowRateLimiterOptions
        {
            PermitLimit = rateLimit.PermitLimit,
            Window = TimeSpan.FromSeconds(rateLimit.WindowSeconds),
            QueueLimit = 0,
        });
    });

    // Daily fair-use cap. The global limiter is the only built-in way to stack a second window on
    // top of an endpoint policy: two RequireRateLimiting calls do not compose, the last one wins.
    limiter.GlobalLimiter = PartitionedRateLimiter.Create<HttpContext, string>(context =>
    {
        var dailyLimit = RateLimitOf(context).DailyLimit;
        return dailyLimit > 0 && context.Request.Path.StartsWithSegments("/api")
            ? RateLimitPartition.GetFixedWindowLimiter(ClientKey(context), _ => new FixedWindowRateLimiterOptions
            {
                PermitLimit = dailyLimit,
                Window = TimeSpan.FromDays(1),
                QueueLimit = 0,
            })
            : RateLimitPartition.GetNoLimiter("unlimited");
    });
});

builder.Services.AddRequestTimeouts(timeouts =>
    timeouts.AddPolicy(InferencePolicy, TimeSpan.FromSeconds(startup.RequestTimeoutSeconds)));

builder.Services.AddOpenApi(openApi => openApi.AddDocumentTransformer((document, _, _) =>
{
    document.Info.Title = "no-bg API";
    document.Info.Version = "v1";
    document.Info.Description =
        "Free background removal. Send an image, get a transparent PNG back — no API key, no signup.\n\n"
        + $"Fair use: {startup.RateLimit.PermitLimit} requests per {startup.RateLimit.WindowSeconds}s and "
        + $"{startup.RateLimit.DailyLimit} per day, per IP address. Rejected requests answer 429 with a "
        + "Retry-After header. Need more? Self-host: https://github.com/davidebriscese/no-bg";
    return Task.CompletedTask;
}));

var modelsDirectory = Path.Combine(builder.Environment.ContentRootPath, "Models");

// Built through a factory so the ONNX session only opens when the engine is actually resolved:
// tests override IBackgroundRemover and never touch the concrete type.
builder.Services.AddSingleton(sp =>
{
    var config = sp.GetRequiredService<IOptions<NoBgOptions>>().Value;
    return new BackgroundRemover(
        config.Model,
        Path.Combine(modelsDirectory, $"{config.Model.Name}.onnx"),
        config.MaxConcurrentInferences,
        TimeSpan.FromSeconds(config.InferenceQueueTimeoutSeconds));
});
builder.Services.AddSingleton<IBackgroundRemover>(sp => sp.GetRequiredService<BackgroundRemover>());

var app = builder.Build();

app.UseExceptionHandler(errorApp => errorApp.Run(async context =>
{
    var error = context.Features.Get<IExceptionHandlerFeature>()?.Error;
    var status = error is BadHttpRequestException bad
        ? bad.StatusCode
        : StatusCodes.Status500InternalServerError;
    context.Response.StatusCode = status;

    await context.Response.WriteAsJsonAsync(status switch
    {
        StatusCodes.Status413PayloadTooLarge => new ApiError(ErrorCodes.PayloadTooLarge, "Request body too large."),
        < StatusCodes.Status500InternalServerError => new ApiError(ErrorCodes.InvalidRequest, "Malformed request."),
        _ => new ApiError(ErrorCodes.InternalError, "Internal server error."),
    });
}));

// Static assets are served before routing and the rate limiter: the static middleware bows out
// once an endpoint has been matched (the fallback matches everything), and page loads must never
// spend API permits. UseRouting is therefore explicit, so it is not auto-inserted ahead of this.
app.UseStaticFrontend();

app.UseRouting();
app.UseCors();
app.UseRateLimiter();
app.UseRequestTimeouts();

if (!app.Environment.IsEnvironment("Testing"))
{
    var config = app.Services.GetRequiredService<IOptions<NoBgOptions>>().Value;
    await ModelDownloader.EnsureModelAsync(
        Path.Combine(modelsDirectory, $"{config.Model.Name}.onnx"), config.Model, app.Logger);

    app.Services.GetRequiredService<BackgroundRemover>().Warmup();
    app.Logger.LogInformation("Model {Model} loaded and warm, ready for images.", config.Model.Name);
}

app.MapOpenApi("/openapi/v1.json");

app.MapGet("/healthz", (IBackgroundRemover bg) => new HealthResponse("ok", bg.ModelName, version))
    .WithTags("Service")
    .WithSummary("Service health")
    .WithDescription("Reports the loaded model and the running version. Never rate limited.");

app.MapPost("/api/v1/remove", async Task<IResult> (
        IFormFile? file,
        IBackgroundRemover bg,
        IOptions<NoBgOptions> config,
        HttpContext http) =>
    {
        var options = config.Value;
        var ct = http.RequestAborted;

        if (file is null || file.Length == 0)
            return Results.BadRequest(new ApiError(ErrorCodes.MissingFile,
                "No image uploaded: send it as the multipart form field 'file'."));

        if (file.Length > options.MaxUploadBytes)
            return Results.Json(new ApiError(ErrorCodes.FileTooLarge,
                    $"Image too large: the limit is {options.MaxUploadBytes / 1024 / 1024}MB."),
                statusCode: StatusCodes.Status413PayloadTooLarge);

        if (file.ContentType is null || !file.ContentType.StartsWith("image/", StringComparison.OrdinalIgnoreCase))
            return Results.Json(new ApiError(ErrorCodes.UnsupportedMediaType, "The uploaded file is not an image."),
                statusCode: StatusCodes.Status415UnsupportedMediaType);

        try
        {
            await using var stream = file.OpenReadStream();

            // Identify only reads the header: it stops decompression bombs before a full decode
            var info = await Image.IdentifyAsync(stream, ct);
            if ((long)info.Width * info.Height > options.MaxImagePixels)
                return Results.Json(new ApiError(ErrorCodes.TooManyPixels,
                        $"Image has too many pixels ({info.Width}x{info.Height}): the limit is {options.MaxImagePixels / 1_000_000}MP."),
                    statusCode: StatusCodes.Status422UnprocessableEntity);
            stream.Position = 0;

            var started = Stopwatch.GetTimestamp();
            var png = await bg.TryRemoveBackgroundAsync(stream, ct);
            if (png is null)
            {
                http.Response.Headers.RetryAfter = options.InferenceQueueTimeoutSeconds.ToString();
                return Results.Json(new ApiError(ErrorCodes.ServerBusy,
                        "The server is busy right now. Try again in a few seconds."),
                    statusCode: StatusCodes.Status503ServiceUnavailable);
            }

            app.Logger.LogInformation("Processed a {Width}x{Height} image in {Ms}ms",
                info.Width, info.Height, (int)Stopwatch.GetElapsedTime(started).TotalMilliseconds);

            // Results are user photos: never let a browser or proxy keep them.
            http.Response.Headers.CacheControl = "no-store";
            return Results.File(png, "image/png", "no-bg.png");
        }
        catch (UnknownImageFormatException)
        {
            return Results.BadRequest(new ApiError(ErrorCodes.InvalidImage, "Unrecognised image format."));
        }
        catch (InvalidImageContentException)
        {
            return Results.BadRequest(new ApiError(ErrorCodes.InvalidImage, "The image is corrupted or invalid."));
        }
    })
// Stream is how this generator spells a binary body: {"type":"string","format":"binary"}
.Produces<Stream>(StatusCodes.Status200OK, "image/png")
.Produces<ApiError>(StatusCodes.Status400BadRequest)
.Produces<ApiError>(StatusCodes.Status413PayloadTooLarge)
.Produces<ApiError>(StatusCodes.Status415UnsupportedMediaType)
.Produces<ApiError>(StatusCodes.Status422UnprocessableEntity)
.Produces<ApiError>(StatusCodes.Status429TooManyRequests)
.Produces<ApiError>(StatusCodes.Status503ServiceUnavailable)
.WithTags("Background removal")
.WithSummary("Remove an image background")
.WithDescription("Takes one image as multipart/form-data field 'file' and returns the same image "
                 + "as a PNG with a transparent background. Nothing is stored server-side.")
.RequireRateLimiting(PerIpPolicy)
.WithRequestTimeout(InferencePolicy)
.DisableAntiforgery();

app.MapFrontendFallback();

app.Run();
return 0;

static string ClientKey(HttpContext context) =>
    context.Connection.RemoteIpAddress?.ToString() ?? "unknown";

static RateLimitOptions RateLimitOf(HttpContext context) =>
    context.RequestServices.GetRequiredService<IOptions<NoBgOptions>>().Value.RateLimit;

public partial class Program;
