namespace NoBg;

public sealed class NoBgOptions
{
    public const string SectionName = "NoBg";

    public ModelOptions Model { get; set; } = new();

    public long MaxUploadBytes { get; set; } = 15 * 1024 * 1024;

    /// <summary>Cap sui pixel totali (larghezza × altezza) per bloccare decompression bomb.</summary>
    public long MaxImagePixels { get; set; } = 25_000_000;

    /// <summary>Inferenze simultanee: le altre richieste aspettano in coda fino al timeout, poi 503.</summary>
    public int MaxConcurrentInferences { get; set; } = 2;

    public int InferenceQueueTimeoutSeconds { get; set; } = 10;

    public RateLimitOptions RateLimit { get; set; } = new();

    /// <summary>Origini CORS consentite. Vuoto = qualsiasi porta su localhost (solo sviluppo).</summary>
    public string[] AllowedOrigins { get; set; } = [];
}

public sealed class ModelOptions
{
    public string Name { get; set; } = "isnet-general-use";
    public string Url { get; set; } =
        "https://github.com/danielgatis/rembg/releases/download/v0.0.0/isnet-general-use.onnx";
    public int InputSize { get; set; } = 1024;
    public float[] Mean { get; set; } = [0.485f, 0.456f, 0.406f];
    public float[] Std { get; set; } = [1f, 1f, 1f];
}

public sealed class RateLimitOptions
{
    public int PermitLimit { get; set; } = 10;
    public int WindowSeconds { get; set; } = 60;
}
