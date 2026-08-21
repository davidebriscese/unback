using System.Net;
using System.Net.Http.Json;
using Xunit;

namespace NoBg.Tests;

public class StaticFrontendTests
{
    private const string WebRoot = "TestAssets/wwwroot";

    private static ApiFactory WithFrontend(Dictionary<string, string?>? settings = null) =>
        new(settings, WebRoot);

    [Fact]
    public async Task Root_serves_the_default_locale()
    {
        using var factory = WithFrontend();
        using var client = factory.CreateClient();

        using var response = await client.GetAsync("/");

        Assert.Equal(HttpStatusCode.OK, response.StatusCode);
        Assert.Contains("english-page", await response.Content.ReadAsStringAsync());
        Assert.True(response.Headers.CacheControl?.NoCache);
    }

    [Theory]
    [InlineData("/it")]
    [InlineData("/it/")]
    public async Task Locale_paths_serve_that_locale(string path)
    {
        using var factory = WithFrontend();
        using var client = factory.CreateClient();

        using var response = await client.GetAsync(path);

        Assert.Equal(HttpStatusCode.OK, response.StatusCode);
        Assert.Contains("italian-page", await response.Content.ReadAsStringAsync());
    }

    [Theory]
    [InlineData("/en")]
    [InlineData("/en/")]
    public async Task Default_locale_paths_redirect_to_the_canonical_root(string path)
    {
        using var factory = WithFrontend();
        using var client = factory.CreateClientWithoutRedirects();

        using var response = await client.GetAsync(path);

        Assert.Equal(HttpStatusCode.MovedPermanently, response.StatusCode);
        Assert.Equal("/", response.Headers.Location?.OriginalString);
    }

    [Fact]
    public async Task Hashed_assets_are_cached_forever()
    {
        using var factory = WithFrontend();
        using var client = factory.CreateClient();

        using var response = await client.GetAsync("/_next/static/app.js");

        Assert.Equal(HttpStatusCode.OK, response.StatusCode);
        Assert.Contains("immutable", response.Headers.CacheControl?.ToString());
    }

    [Fact]
    public async Task Unknown_page_serves_the_exported_404()
    {
        using var factory = WithFrontend();
        using var client = factory.CreateClient();

        using var response = await client.GetAsync("/does-not-exist");

        Assert.Equal(HttpStatusCode.NotFound, response.StatusCode);
        Assert.Contains("not-found-page", await response.Content.ReadAsStringAsync());
    }

    [Fact]
    public async Task Unknown_api_path_answers_json()
    {
        using var factory = WithFrontend();
        using var client = factory.CreateClient();

        using var response = await client.GetAsync("/api/v1/nope");

        Assert.Equal(HttpStatusCode.NotFound, response.StatusCode);
        Assert.Equal(ErrorCodes.NotFound, (await response.Content.ReadFromJsonAsync<ApiError>())!.Code);
    }

    /// <summary>Static files are served before the limiter, so page loads never spend API permits.</summary>
    [Fact]
    public async Task Page_loads_do_not_consume_rate_limit_permits()
    {
        using var factory = WithFrontend(new()
        {
            ["NoBg:RateLimit:PermitLimit"] = "1",
            ["NoBg:RateLimit:DailyLimit"] = "1",
        });
        using var client = factory.CreateClient();

        for (var i = 0; i < 10; i++)
        {
            Assert.Equal(HttpStatusCode.OK, (await client.GetAsync("/")).StatusCode);
            Assert.Equal(HttpStatusCode.OK, (await client.GetAsync("/_next/static/app.js")).StatusCode);
        }
    }
}
