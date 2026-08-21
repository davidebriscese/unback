namespace NoBg;

public sealed class NoBgOptions
{
    public const string SectionName = "NoBg";

    public ModelOptions Model { get; set; } = new();

    public long MaxUploadBytes { get; set; } = 15 * 1024 * 1024;

    /// <summary>Cap on total pixels (width × height), to stop decompression bombs.</summary>
    public long MaxImagePixels { get; set; } = 25_000_000;

    /// <summary>Simultaneous inferences. Extra requests queue up to the timeout, then get a 503.</summary>
    public int MaxConcurrentInferences { get; set; } = 2;

    public int InferenceQueueTimeoutSeconds { get; set; } = 10;

    /// <summary>Wall-clock budget for one request. Raise it on slow hardware.</summary>
    public int RequestTimeoutSeconds { get; set; } = 60;

    public RateLimitOptions RateLimit { get; set; } = new();

    /// <summary>Allowed CORS origins. Empty = any origin, which is what a public keyless API wants.</summary>
    public string[] AllowedOrigins { get; set; } = [];
}

public sealed class ModelOptions
{
    public string Name { get; set; } = "isnet-general-use";

    public string Url { get; set; } =
        "https://github.com/danielgatis/rembg/releases/download/v0.0.0/isnet-general-use.onnx";

    /// <summary>Expected SHA-256 of the model file, lowercase hex. Empty disables verification.</summary>
    public string Sha256 { get; set; } = string.Empty;

    public int InputSize { get; set; } = 1024;
    public float[] Mean { get; set; } = [0.485f, 0.456f, 0.406f];
    public float[] Std { get; set; } = [1f, 1f, 1f];
}

public sealed class RateLimitOptions
{
    /// <summary>Requests allowed per <see cref="WindowSeconds"/>, per IP address.</summary>
    public int PermitLimit { get; set; } = 10;

    public int WindowSeconds { get; set; } = 60;

    /// <summary>Requests allowed per rolling 24h, per IP address. 0 disables the daily cap.</summary>
    public int DailyLimit { get; set; } = 100;
}
