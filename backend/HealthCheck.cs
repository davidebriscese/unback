namespace NoBg;

/// <summary>
/// Self-probe used as the container healthcheck: the ASP.NET runtime images ship no curl or
/// wget, so the app checks itself. Invoked as <c>dotnet backend.dll healthcheck</c>.
/// </summary>
public static class HealthCheck
{
    public static async Task<int> RunAsync()
    {
        var url = Environment.GetEnvironmentVariable("HEALTHCHECK_URL")
                  ?? "http://localhost:8080/healthz";

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
}
