using System.Net;
using System.Net.Http.Json;
using Xunit;

namespace NoBg.Tests;

public class RemoveEndpointTests
{
    private const string Endpoint = "/api/v1/remove";

    private static async Task<string> CodeOf(HttpResponseMessage response) =>
        (await response.Content.ReadFromJsonAsync<ApiError>())!.Code;

    [Fact]
    public async Task Valid_image_returns_an_uncacheable_png()
    {
        using var factory = new ApiFactory();
        using var client = factory.CreateClient();

        using var response = await client.PostAsync(Endpoint, ApiFactory.Upload(ApiFactory.PngBytes()));

        Assert.Equal(HttpStatusCode.OK, response.StatusCode);
        Assert.Equal("image/png", response.Content.Headers.ContentType?.MediaType);
        Assert.Equal("no-bg.png", response.Content.Headers.ContentDisposition?.FileName);
        Assert.True(response.Headers.CacheControl?.NoStore);
        Assert.Equal(FakeBackgroundRemover.Result, await response.Content.ReadAsByteArrayAsync());
    }

    [Fact]
    public async Task Missing_file_part_is_rejected()
    {
        using var factory = new ApiFactory();
        using var client = factory.CreateClient();

        using var body = new MultipartFormDataContent { { new StringContent("ignored"), "other" } };
        using var response = await client.PostAsync(Endpoint, body);

        Assert.Equal(HttpStatusCode.BadRequest, response.StatusCode);
        Assert.Equal(ErrorCodes.MissingFile, await CodeOf(response));
    }

    [Fact]
    public async Task Empty_file_is_rejected()
    {
        using var factory = new ApiFactory();
        using var client = factory.CreateClient();

        using var response = await client.PostAsync(Endpoint, ApiFactory.Upload([]));

        Assert.Equal(HttpStatusCode.BadRequest, response.StatusCode);
        Assert.Equal(ErrorCodes.MissingFile, await CodeOf(response));
    }

    [Fact]
    public async Task Non_image_content_type_is_rejected()
    {
        using var factory = new ApiFactory();
        using var client = factory.CreateClient();

        using var response = await client.PostAsync(Endpoint,
            ApiFactory.Upload(ApiFactory.PngBytes(), "text/plain", "notes.txt"));

        Assert.Equal(HttpStatusCode.UnsupportedMediaType, response.StatusCode);
        Assert.Equal(ErrorCodes.UnsupportedMediaType, await CodeOf(response));
    }

    /// <summary>A part without a Content-Type header used to reach a null dereference.</summary>
    [Fact]
    public async Task Missing_content_type_is_rejected_without_crashing()
    {
        using var factory = new ApiFactory();
        using var client = factory.CreateClient();

        using var response = await client.PostAsync(Endpoint,
            ApiFactory.Upload(ApiFactory.PngBytes(), contentType: null));

        Assert.Equal(HttpStatusCode.UnsupportedMediaType, response.StatusCode);
        Assert.Equal(ErrorCodes.UnsupportedMediaType, await CodeOf(response));
    }

    [Fact]
    public async Task Oversized_file_is_rejected()
    {
        using var factory = new ApiFactory(new() { ["NoBg:MaxUploadBytes"] = "1024" });
        using var client = factory.CreateClient();

        using var response = await client.PostAsync(Endpoint, ApiFactory.Upload(new byte[2048]));

        Assert.Equal(HttpStatusCode.RequestEntityTooLarge, response.StatusCode);
        Assert.Equal(ErrorCodes.FileTooLarge, await CodeOf(response));
    }

    [Fact]
    public async Task Image_with_too_many_pixels_is_rejected_before_decoding()
    {
        using var factory = new ApiFactory(new() { ["NoBg:MaxImagePixels"] = "100" });
        using var client = factory.CreateClient();

        using var response = await client.PostAsync(Endpoint, ApiFactory.Upload(ApiFactory.PngBytes(20, 20)));

        Assert.Equal(HttpStatusCode.UnprocessableContent, response.StatusCode);
        Assert.Equal(ErrorCodes.TooManyPixels, await CodeOf(response));
    }

    [Fact]
    public async Task Undecodable_bytes_are_rejected()
    {
        using var factory = new ApiFactory();
        using var client = factory.CreateClient();

        using var response = await client.PostAsync(Endpoint,
            ApiFactory.Upload([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]));

        Assert.Equal(HttpStatusCode.BadRequest, response.StatusCode);
        Assert.Equal(ErrorCodes.InvalidImage, await CodeOf(response));
    }

    [Fact]
    public async Task Saturated_engine_answers_503_with_retry_after()
    {
        using var factory = new ApiFactory();
        factory.Remover.Saturated = true;
        using var client = factory.CreateClient();

        using var response = await client.PostAsync(Endpoint, ApiFactory.Upload(ApiFactory.PngBytes()));

        Assert.Equal(HttpStatusCode.ServiceUnavailable, response.StatusCode);
        Assert.Equal(ErrorCodes.ServerBusy, await CodeOf(response));
        Assert.Equal(10, response.Headers.RetryAfter?.Delta?.TotalSeconds);
    }
}
