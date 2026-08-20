using System.Diagnostics;
using System.Threading.RateLimiting;
using Microsoft.AspNetCore.Diagnostics;
using NoBg;
using SixLabors.ImageSharp;

var builder = WebApplication.CreateBuilder(args);

var options = builder.Configuration.GetSection(NoBgOptions.SectionName).Get<NoBgOptions>() ?? new NoBgOptions();

// Le richieste oltre il limite vengono rifiutate da Kestrel con 413 prima di arrivare all'endpoint
builder.WebHost.ConfigureKestrel(kestrel =>
    kestrel.Limits.MaxRequestBodySize = options.MaxUploadBytes + 1024 * 1024);

builder.Services.AddCors(cors => cors.AddDefaultPolicy(policy =>
{
    if (options.AllowedOrigins.Length > 0)
    {
        policy.WithOrigins(options.AllowedOrigins).AllowAnyHeader().AllowAnyMethod();
    }
    else
    {
        // Nessuna origine configurata: qualsiasi porta su localhost (solo sviluppo)
        policy.SetIsOriginAllowed(origin =>
                Uri.TryCreate(origin, UriKind.Absolute, out var uri) &&
                uri.Host is "localhost" or "127.0.0.1")
            .AllowAnyHeader()
            .AllowAnyMethod();
    }
}));

builder.Services.AddRateLimiter(limiter =>
{
    limiter.RejectionStatusCode = StatusCodes.Status429TooManyRequests;
    limiter.OnRejected = async (context, ct) =>
    {
        if (context.Lease.TryGetMetadata(MetadataName.RetryAfter, out var retryAfter))
            context.HttpContext.Response.Headers.RetryAfter =
                ((int)Math.Ceiling(retryAfter.TotalSeconds)).ToString();
        await context.HttpContext.Response.WriteAsJsonAsync(
            new { error = "Troppe richieste da questo indirizzo: riprova tra poco." }, ct);
    };
    limiter.AddPolicy("per-ip", context => RateLimitPartition.GetFixedWindowLimiter(
        context.Connection.RemoteIpAddress?.ToString() ?? "unknown",
        _ => new FixedWindowRateLimiterOptions
        {
            PermitLimit = options.RateLimit.PermitLimit,
            Window = TimeSpan.FromSeconds(options.RateLimit.WindowSeconds),
            QueueLimit = 0,
        }));
});

builder.Services.AddRequestTimeouts(timeouts =>
    timeouts.AddPolicy("inference", TimeSpan.FromSeconds(60)));

var modelPath = Path.Combine(builder.Environment.ContentRootPath, "Models", $"{options.Model.Name}.onnx");
builder.Services.AddSingleton(_ => new BackgroundRemover(
    options.Model,
    modelPath,
    options.MaxConcurrentInferences,
    TimeSpan.FromSeconds(options.InferenceQueueTimeoutSeconds)));

var app = builder.Build();

app.UseExceptionHandler(errorApp => errorApp.Run(async context =>
{
    var ex = context.Features.Get<IExceptionHandlerFeature>()?.Error;
    var status = ex is BadHttpRequestException bad
        ? bad.StatusCode
        : StatusCodes.Status500InternalServerError;
    context.Response.StatusCode = status;
    await context.Response.WriteAsJsonAsync(new
    {
        error = status == StatusCodes.Status413PayloadTooLarge
            ? "Richiesta troppo grande."
            : "Errore interno del server.",
    });
}));

app.UseCors();
app.UseRateLimiter();
app.UseRequestTimeouts();

await ModelDownloader.EnsureModelAsync(modelPath, options.Model.Url, app.Logger);

var remover = app.Services.GetRequiredService<BackgroundRemover>();
remover.Warmup();
app.Logger.LogInformation("Modello {Model} caricato e riscaldato, pronto a ricevere immagini.", options.Model.Name);

app.MapGet("/", () => "no-bg API - POST /api/remove-background (multipart, campo 'file')");

app.MapGet("/healthz", (BackgroundRemover bg) => Results.Ok(new { status = "ok", model = bg.ModelName }));

app.MapPost("/api/remove-background", async Task<IResult> (IFormFile? file, BackgroundRemover bg, HttpContext http) =>
{
    var ct = http.RequestAborted;

    if (file is null || file.Length == 0)
        return Results.BadRequest(new { error = "Nessun file caricato: usa il campo form 'file'." });
    if (file.Length > options.MaxUploadBytes)
        return Results.BadRequest(new { error = $"Immagine troppo grande (max {options.MaxUploadBytes / 1024 / 1024}MB)." });
    if (!file.ContentType.StartsWith("image/", StringComparison.OrdinalIgnoreCase))
        return Results.BadRequest(new { error = "Il file non è un'immagine." });

    try
    {
        await using var stream = file.OpenReadStream();

        // Identify legge solo l'header: blocca le decompression bomb prima del decode completo
        var info = await Image.IdentifyAsync(stream, ct);
        if ((long)info.Width * info.Height > options.MaxImagePixels)
            return Results.BadRequest(new
            {
                error = $"Immagine con troppi pixel ({info.Width}x{info.Height}): max {options.MaxImagePixels / 1_000_000}MP.",
            });
        stream.Position = 0;

        var started = Stopwatch.GetTimestamp();
        var png = await bg.TryRemoveBackgroundAsync(stream, ct);
        if (png is null)
        {
            http.Response.Headers.RetryAfter = "10";
            return Results.Json(
                new { error = "Server al momento saturo: riprova tra qualche secondo." },
                statusCode: StatusCodes.Status503ServiceUnavailable);
        }

        app.Logger.LogInformation("Elaborata immagine {Width}x{Height} in {Ms}ms",
            info.Width, info.Height, (int)Stopwatch.GetElapsedTime(started).TotalMilliseconds);
        return Results.File(png, "image/png", "no-bg.png");
    }
    catch (UnknownImageFormatException)
    {
        return Results.BadRequest(new { error = "Formato immagine non riconosciuto." });
    }
    catch (InvalidImageContentException)
    {
        return Results.BadRequest(new { error = "Immagine corrotta o non valida." });
    }
})
.DisableAntiforgery()
.RequireRateLimiting("per-ip")
.WithRequestTimeout("inference");

app.Run();
