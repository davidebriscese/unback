using Microsoft.Extensions.FileProviders;

namespace NoBg;

/// <summary>
/// Serves the statically exported frontend out of wwwroot. The export emits one HTML file per
/// locale (en.html, it.html, …) plus content-hashed assets under _next/static; this maps the
/// canonical URLs — "/" for the default locale, "/{locale}" for the others — onto those files.
/// Locales are discovered from the files themselves, so shipping a new language needs no C# change.
/// Everything self-disables when no export is present, which is the normal state in development.
/// </summary>
public static class FrontendHosting
{
    private const string DefaultLocale = "en";

    public static void UseStaticFrontend(this WebApplication app)
    {
        var locales = DiscoverLocales(app.Environment.WebRootPath);
        if (!locales.Contains(DefaultLocale))
        {
            app.Logger.LogInformation("No frontend export found in wwwroot: serving the API only.");
            return;
        }

        app.Use(async (context, next) =>
        {
            var path = context.Request.Path.Value ?? "/";

            if (path == "/")
            {
                context.Request.Path = $"/{DefaultLocale}.html";
            }
            else if (path.Trim('/') is var locale && locales.Contains(locale))
            {
                var canonical = locale == DefaultLocale ? "/" : $"/{locale}";
                if (path != canonical)
                {
                    context.Response.Redirect(canonical + context.Request.QueryString, permanent: true);
                    return;
                }
                context.Request.Path = $"/{locale}.html";
            }

            await next();
        });

        app.UseStaticFiles(new StaticFileOptions
        {
            // Bound explicitly: the ambient web-root provider is not always the configured one.
            FileProvider = new PhysicalFileProvider(app.Environment.WebRootPath),
            OnPrepareResponse = context =>
            {
                var path = context.Context.Request.Path.Value ?? string.Empty;
                context.Context.Response.Headers.CacheControl =
                    path.Contains("/_next/static/", StringComparison.Ordinal)
                        ? "public,max-age=31536000,immutable" // filenames carry a content hash
                        : path.EndsWith(".html", StringComparison.OrdinalIgnoreCase)
                            ? "no-cache"
                            : "public,max-age=3600";
            },
        });

        app.Logger.LogInformation("Serving frontend locales: {Locales}", string.Join(", ", locales.Order()));
    }

    /// <summary>Answers unmatched routes: the exported 404 page for humans, JSON under /api.</summary>
    public static void MapFrontendFallback(this WebApplication app)
    {
        var notFoundPage = Path.Combine(app.Environment.WebRootPath ?? string.Empty, "404.html");

        app.MapFallback(async context =>
        {
            context.Response.StatusCode = StatusCodes.Status404NotFound;

            if (!context.Request.Path.StartsWithSegments("/api") && File.Exists(notFoundPage))
            {
                context.Response.ContentType = "text/html; charset=utf-8";
                context.Response.Headers.CacheControl = "no-cache";
                await context.Response.SendFileAsync(notFoundPage);
                return;
            }

            await context.Response.WriteAsJsonAsync(new ApiError(ErrorCodes.NotFound,
                "Not found. POST an image to /api/v1/remove — full spec at /openapi/v1.json."));
        }).ExcludeFromDescription();
    }

    private static HashSet<string> DiscoverLocales(string? webRootPath)
    {
        if (string.IsNullOrEmpty(webRootPath) || !Directory.Exists(webRootPath))
            return [];

        return Directory.EnumerateFiles(webRootPath, "*.html")
            .Select(Path.GetFileNameWithoutExtension)
            .OfType<string>()
            .Where(name => name != "404")
            .ToHashSet(StringComparer.Ordinal);
    }
}
