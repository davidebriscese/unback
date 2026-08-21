namespace Unback;

/// <summary>
/// Self-probe used as the container healthcheck: the ASP.NET runtime images ship no curl or
/// wget, so the app checks itself. Invoked as <c>dotnet backend.dll healthcheck</c>.
/// </summary>
public static class HealthCheck
{
    public static async Task<int> RunAsync()
    {
        var url = Environment.GetEnvironmentVariable("HEALTHCHECK_URL")
                  ?? $"http://localhost:{ListenPort()}/healthz";

        using var http = new HttpClient { Timeout = TimeSpan.FromSeconds(5) };
        try
        {
            using var response = await http.GetAsync(url);
            return response.IsSuccessStatusCode ? 0 : 1;
        }
        catch
        {
            return 1;
        }
    }

    /// <summary>The port the app listens on, so the probe follows a changed ASPNETCORE_URLS.</summary>
    private static string ListenPort()
    {
        var urls = Environment.GetEnvironmentVariable("ASPNETCORE_URLS");
        if (!string.IsNullOrEmpty(urls))
        {
            var first = urls.Split(';', StringSplitOptions.RemoveEmptyEntries | StringSplitOptions.TrimEntries)[0];
            var colon = first.LastIndexOf(':');
            if (colon >= 0 && int.TryParse(first[(colon + 1)..].TrimEnd('/'), out var port))
                return port.ToString();
        }
        return "8080";
    }
}
