using System.Text.RegularExpressions;
using Microsoft.Extensions.FileProviders;

namespace Unback;

/// <summary>
/// Serves the statically exported frontend out of wwwroot. The export emits one HTML file per
/// locale page (en.html, it.html, en/privacy.html, …) plus content-hashed assets under
/// _next/static; this maps the canonical URLs — "/" and "/privacy" for the default locale,
/// "/{locale}" and "/{locale}/…" for the others — onto those files. Locales are discovered from
/// the files themselves, so shipping a new language needs no C# change. Everything self-disables
/// when no export is present, which is the normal state in development.
/// </summary>
public static partial class FrontendHosting
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

        var files = new PhysicalFileProvider(app.Environment.WebRootPath);

        app.Use(async (context, next) =>
        {
            var path = context.Request.Path.Value ?? "/";

            // One canonical address per page: no trailing slash on extensionless URLs, and the
            // default locale lives at the root, so its prefixed twin ("/en/…") redirects too.
            var normalized = path.Length > 1 && path.EndsWith('/') && !path.Contains('.')
                ? path.TrimEnd('/')
                : path;
            var (locale, remainder, explicitPrefix) = SplitLocale(normalized, locales);
            var canonical = explicitPrefix && locale == DefaultLocale
                ? (remainder.Length == 0 ? "/" : remainder)
                : normalized;

            if (canonical != path)
            {
                context.Response.Redirect(canonical + context.Request.QueryString, permanent: true);
                return;
            }

            var candidate = $"{locale}{remainder}.html";
            if (files.GetFileInfo(candidate).Exists)
                context.Request.Path = $"/{candidate}";

            await next();
        });

        app.UseStaticFiles(new StaticFileOptions
        {
            // Bound explicitly: the ambient web-root provider is not always the configured one.
            FileProvider = files,
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

    /// <summary>"/it/privacy" → ("it", "/privacy", true); "/privacy" → (default, "/privacy", false).</summary>
    private static (string Locale, string Remainder, bool ExplicitPrefix) SplitLocale(
        string path, HashSet<string> locales)
    {
        if (path == "/")
            return (DefaultLocale, string.Empty, false);

        var end = path.IndexOf('/', 1);
        var first = end < 0 ? path[1..] : path[1..end];
        return locales.Contains(first)
            ? (first, end < 0 ? string.Empty : path[end..], true)
            : (DefaultLocale, path, false);
    }

    private static HashSet<string> DiscoverLocales(string? webRootPath)
    {
        if (string.IsNullOrEmpty(webRootPath) || !Directory.Exists(webRootPath))
            return [];

        // The export also emits 404.html and framework pages such as _not-found.html, so only
        // BCP-47-shaped names count as locales.
        return Directory.EnumerateFiles(webRootPath, "*.html")
            .Select(Path.GetFileNameWithoutExtension)
            .OfType<string>()
            .Where(name => LocaleName().IsMatch(name))
            .ToHashSet(StringComparer.Ordinal);
    }

    [GeneratedRegex("^[a-z]{2}(-[A-Za-z0-9]{2,8})?$")]
    private static partial Regex LocaleName();
}
