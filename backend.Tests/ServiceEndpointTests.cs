using System.Net;
using System.Net.Http.Json;
using System.Text.Json;
using Xunit;

namespace Unback.Tests;

public class ServiceEndpointTests
{
    [Fact]
    public async Task Healthz_reports_the_loaded_model_and_version()
    {
        using var factory = new ApiFactory();
        using var client = factory.CreateClient();

        using var response = await client.GetAsync("/healthz");
        var health = await response.Content.ReadFromJsonAsync<HealthResponse>();

        Assert.Equal(HttpStatusCode.OK, response.StatusCode);
        Assert.Equal("ok", health!.Status);
        Assert.Equal("fake-model", health.Model);
        Assert.False(string.IsNullOrWhiteSpace(health.Version));
    }

    [Fact]
    public async Task Openapi_document_describes_the_remove_operation()
    {
        using var factory = new ApiFactory();
        using var client = factory.CreateClient();

        using var response = await client.GetAsync("/openapi/v1.json");
        using var document = JsonDocument.Parse(await response.Content.ReadAsStringAsync());

        Assert.Equal(HttpStatusCode.OK, response.StatusCode);

        var operation = document.RootElement.GetProperty("paths").GetProperty("/api/v1/remove").GetProperty("post");
        Assert.True(operation.GetProperty("requestBody").GetProperty("content")
            .TryGetProperty("multipart/form-data", out _));
        Assert.True(operation.GetProperty("responses").GetProperty("200").GetProperty("content")
            .TryGetProperty("image/png", out _));
        Assert.Contains("Unback", document.RootElement.GetProperty("info").GetProperty("title").GetString());
    }

    [Theory]
    [InlineData("/healthz")]
    [InlineData("/does-not-exist")]
    public async Task Security_headers_are_present_on_every_response(string path)
    {
        using var factory = new ApiFactory();
        using var client = factory.CreateClient();

        using var response = await client.GetAsync(path);

        Assert.Equal("nosniff", response.Headers.GetValues("X-Content-Type-Options").Single());
        Assert.True(response.Headers.Contains("Content-Security-Policy"));
        Assert.Equal("DENY", response.Headers.GetValues("X-Frame-Options").Single());
    }

    [Fact]
    public async Task Analytics_script_is_empty_until_a_measurement_id_is_configured()
    {
        using var factory = new ApiFactory();
        using var client = factory.CreateClient();

        using var response = await client.GetAsync("/analytics.js");

        Assert.Equal(HttpStatusCode.OK, response.StatusCode);
        Assert.Empty(await response.Content.ReadAsStringAsync());
    }

    [Fact]
    public async Task Analytics_script_carries_the_configured_measurement_id()
    {
        using var factory = new ApiFactory(new Dictionary<string, string?>
        {
            ["Unback:Analytics:MeasurementId"] = "G-ABCD123456",
        });
        using var client = factory.CreateClient();

        using var response = await client.GetAsync("/analytics.js");
        var script = await response.Content.ReadAsStringAsync();

        Assert.Contains("gtag('config','G-ABCD123456')", script);
        Assert.Contains("googletagmanager.com/gtag/js?id=G-ABCD123456", script);
    }

    [Theory]
    [InlineData("nonsense")]
    [InlineData("G-ABC');alert(1);//")]
    public async Task Analytics_script_refuses_anything_that_is_not_a_measurement_id(string configured)
    {
        // The value lands inside a JavaScript literal, so a rejected id must produce no script at
        // all rather than an escaped one.
        using var factory = new ApiFactory(new Dictionary<string, string?>
        {
            ["Unback:Analytics:MeasurementId"] = configured,
        });
        using var client = factory.CreateClient();

        using var response = await client.GetAsync("/analytics.js");

        Assert.Empty(await response.Content.ReadAsStringAsync());
    }

    [Fact]
    public async Task Content_security_policy_admits_the_analytics_tag()
    {
        using var factory = new ApiFactory();
        using var client = factory.CreateClient();

        using var response = await client.GetAsync("/healthz");
        var policy = response.Headers.GetValues("Content-Security-Policy").Single();
        var directives = policy.Split(';', StringSplitOptions.TrimEntries | StringSplitOptions.RemoveEmptyEntries)
            .ToDictionary(d => d.Split(' ')[0], d => d);

        // Without these the browser blocks gtag.js outright and the page silently stops reporting,
        // which is the kind of breakage nobody notices until a month of data is missing.
        Assert.Contains("https://www.googletagmanager.com", directives["script-src"]);
        Assert.Contains("https://*.google-analytics.com", directives["connect-src"]);

        // Everything else stays locked to this origin.
        Assert.Equal("default-src 'self'", directives["default-src"]);
        Assert.Equal("object-src 'none'", directives["object-src"]);
        Assert.Equal("frame-ancestors 'none'", directives["frame-ancestors"]);
    }
}
