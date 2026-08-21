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
}
