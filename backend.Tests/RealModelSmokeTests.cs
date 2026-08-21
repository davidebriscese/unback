using System.Net;
using Xunit;

namespace NoBg.Tests;

/// <summary>
/// Exercises a running instance with the real model. Opt in with NOBG_E2E=1 (and optionally
/// NOBG_E2E_URL); skipped otherwise, so CI never downloads 170MB of weights.
/// </summary>
public class RealModelSmokeTests
{
    private static string? BaseUrl => Environment.GetEnvironmentVariable("NOBG_E2E") == "1"
        ? Environment.GetEnvironmentVariable("NOBG_E2E_URL") ?? "http://localhost:5210"
        : null;

    [Fact]
    public async Task Real_instance_returns_a_partially_transparent_png()
    {
        if (BaseUrl is null)
            return;

        using var client = new HttpClient { BaseAddress = new Uri(BaseUrl), Timeout = TimeSpan.FromMinutes(2) };
        var photo = await File.ReadAllBytesAsync(
            Path.Combine(AppContext.BaseDirectory, "TestAssets", "photo.jpg"));

        using var response = await client.PostAsync("/api/v1/remove", ApiFactory.Upload(photo, "image/jpeg", "photo.jpg"));
        Assert.Equal(HttpStatusCode.OK, response.StatusCode);

        using var result = SixLabors.ImageSharp.Image.Load<SixLabors.ImageSharp.PixelFormats.Rgba32>(
            await response.Content.ReadAsByteArrayAsync());

        var alphas = new HashSet<byte>();
        result.ProcessPixelRows(accessor =>
        {
            for (var y = 0; y < accessor.Height; y++)
                foreach (var pixel in accessor.GetRowSpan(y))
                    alphas.Add(pixel.A);
        });

        // A real cut-out has both transparent and opaque pixels; a failed one is uniformly opaque.
        Assert.Contains((byte)0, alphas);
        Assert.True(alphas.Count > 2, "the alpha channel should vary across the image");
    }
}
