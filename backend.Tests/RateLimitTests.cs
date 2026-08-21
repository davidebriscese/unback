using System.Net;
using System.Net.Http.Json;
using Xunit;

namespace NoBg.Tests;

public class RateLimitTests
{
    private const string Endpoint = "/api/v1/remove";

    private static Task<HttpResponseMessage> Remove(HttpClient client) =>
        client.PostAsync(Endpoint, ApiFactory.Upload(ApiFactory.PngBytes()));

    [Fact]
    public async Task Burst_limit_rejects_the_request_after_the_permits_run_out()
    {
        using var factory = new ApiFactory(new()
        {
            ["NoBg:RateLimit:PermitLimit"] = "2",
            ["NoBg:RateLimit:WindowSeconds"] = "60",
        });
        using var client = factory.CreateClient();

        for (var i = 0; i < 2; i++)
            Assert.Equal(HttpStatusCode.OK, (await Remove(client)).StatusCode);

        using var rejected = await Remove(client);

        Assert.Equal(HttpStatusCode.TooManyRequests, rejected.StatusCode);
        Assert.Equal(ErrorCodes.RateLimited,
            (await rejected.Content.ReadFromJsonAsync<ApiError>())!.Code);
        Assert.True(rejected.Headers.RetryAfter?.Delta?.TotalSeconds is > 0 and <= 60);
    }

    [Fact]
    public async Task Daily_cap_rejects_with_its_own_code_and_a_longer_retry_window()
    {
        using var factory = new ApiFactory(new()
        {
            ["NoBg:RateLimit:PermitLimit"] = "100",
            ["NoBg:RateLimit:DailyLimit"] = "3",
        });
        using var client = factory.CreateClient();

        for (var i = 0; i < 3; i++)
            Assert.Equal(HttpStatusCode.OK, (await Remove(client)).StatusCode);

        using var rejected = await Remove(client);

        Assert.Equal(HttpStatusCode.TooManyRequests, rejected.StatusCode);
        Assert.Equal(ErrorCodes.DailyLimitReached,
            (await rejected.Content.ReadFromJsonAsync<ApiError>())!.Code);
        Assert.True(rejected.Headers.RetryAfter?.Delta?.TotalSeconds > 60);
    }

    [Fact]
    public async Task Daily_cap_of_zero_disables_the_daily_tier()
    {
        using var factory = new ApiFactory(new()
        {
            ["NoBg:RateLimit:PermitLimit"] = "100",
            ["NoBg:RateLimit:DailyLimit"] = "0",
        });
        using var client = factory.CreateClient();

        for (var i = 0; i < 5; i++)
            Assert.Equal(HttpStatusCode.OK, (await Remove(client)).StatusCode);
    }

    [Fact]
    public async Task Health_checks_are_never_rate_limited()
    {
        using var factory = new ApiFactory(new()
        {
            ["NoBg:RateLimit:PermitLimit"] = "1",
            ["NoBg:RateLimit:DailyLimit"] = "1",
        });
        using var client = factory.CreateClient();

        for (var i = 0; i < 10; i++)
            Assert.Equal(HttpStatusCode.OK, (await client.GetAsync("/healthz")).StatusCode);
    }
}
