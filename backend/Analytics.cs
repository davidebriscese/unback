using System.Text.RegularExpressions;
using Microsoft.Extensions.Options;

namespace Unback;

/// <summary>
/// Serves the Google tag bootstrap from this app's own origin, so the measurement ID is runtime
/// configuration instead of something baked into the page at build time. That is the whole point:
/// a build-time ID would have to be committed somewhere to reach production, and would then ride
/// along into every published image. Here one image ships to everyone and each operator decides,
/// with one environment variable, whether it reports anywhere at all.
/// </summary>
public static partial class Analytics
{
    public static void MapAnalyticsScript(this WebApplication app)
    {
        var configured = app.Services.GetRequiredService<IOptions<UnbackOptions>>()
            .Value.Analytics.MeasurementId.Trim();

        // Rejected rather than escaped: the value is interpolated straight into JavaScript, and a
        // real measurement ID has no room for anything but letters, digits and one dash.
        var valid = MeasurementId().IsMatch(configured);
        if (!valid && configured.Length > 0)
            app.Logger.LogWarning(
                "Ignoring Unback:Analytics:MeasurementId: {Value} is not a G-XXXXXXXXXX measurement ID.",
                configured);

        // Resolved once at startup, not per request: the body is a constant for the process.
        var body = valid ? Bootstrap(configured) : string.Empty;
        app.Logger.LogInformation(valid
            ? "Analytics enabled, reporting to {Id}."
            : "Analytics disabled: no measurement ID configured.", configured);

        app.MapGet("/analytics.js", (HttpContext http) =>
        {
            // Short cache: long enough to stay off the critical path on repeat visits, short
            // enough that turning analytics off actually takes effect.
            http.Response.Headers.CacheControl = "public,max-age=300";
            return Results.Text(body, "text/javascript; charset=utf-8");
        }).ExcludeFromDescription();
    }

    /// <summary>Google's own snippet, wrapped so it leaks no globals beyond gtag and dataLayer.</summary>
    private static string Bootstrap(string id) =>
        $$"""
        (function(){
        window.dataLayer=window.dataLayer||[];
        window.gtag=function(){window.dataLayer.push(arguments)};
        gtag('js',new Date());
        gtag('config','{{id}}');
        var s=document.createElement('script');
        s.async=true;
        s.src='https://www.googletagmanager.com/gtag/js?id={{id}}';
        document.head.appendChild(s);
        })();
        """;

    [GeneratedRegex("^G-[A-Z0-9]{4,20}$")]
    private static partial Regex MeasurementId();
}
