using System.Net.Http.Headers;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc.Testing;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using SixLabors.ImageSharp;
using SixLabors.ImageSharp.PixelFormats;

namespace NoBg.Tests;

/// <summary>
/// Boots the real HTTP pipeline with a stub engine, so tests cover routing, validation, rate
/// limiting and static hosting without loading the model. Each instance owns its rate-limit state.
/// </summary>
public sealed class ApiFactory(
    Dictionary<string, string?>? settings = null,
    string? webRoot = null) : WebApplicationFactory<Program>
{
    public FakeBackgroundRemover Remover { get; } = new();

    protected override void ConfigureWebHost(IWebHostBuilder builder)
    {
        builder.UseEnvironment("Testing");

        if (webRoot is not null)
            builder.UseWebRoot(Path.Combine(AppContext.BaseDirectory, webRoot));

        builder.ConfigureAppConfiguration(config =>
            config.AddInMemoryCollection(settings ?? []));

        // Registered last, so it wins over the real engine the app registers.
        builder.ConfigureServices(services =>
            services.AddSingleton<IBackgroundRemover>(Remover));
    }

    public HttpClient CreateClientWithoutRedirects() =>
        CreateClient(new WebApplicationFactoryClientOptions { AllowAutoRedirect = false });

    /// <summary>A multipart body carrying one file part. A null content type omits the header.</summary>
    public static MultipartFormDataContent Upload(
        byte[] bytes,
        string? contentType = "image/png",
        string fileName = "photo.png")
    {
        var part = new ByteArrayContent(bytes);
        if (contentType is not null)
            part.Headers.ContentType = new MediaTypeHeaderValue(contentType);

        return new MultipartFormDataContent { { part, "file", fileName } };
    }

    /// <summary>A decodable PNG: the endpoint inspects the header before reaching the engine.</summary>
    public static byte[] PngBytes(int width = 8, int height = 8)
    {
        using var image = new Image<Rgba32>(width, height);
        using var buffer = new MemoryStream();
        image.SaveAsPng(buffer);
        return buffer.ToArray();
    }
}
