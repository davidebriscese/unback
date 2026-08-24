namespace Unback;

public sealed class UnbackOptions
{
    public const string SectionName = "Unback";

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

    // isnet-general-use is trained with mean 0.5 / std 1 (rembg's IsnetGeneralUseSession). The
    // u2net family uses the ImageNet mean instead — override these when switching models.
    public float[] Mean { get; set; } = [0.5f, 0.5f, 0.5f];
    public float[] Std { get; set; } = [1f, 1f, 1f];

    // The saliency map is soft wherever the model hesitates - a grey jumper against a grey wall,
    // a neon shoe on a neon backdrop - so the middle of the subject comes back half transparent.
    // Stretching [AlphaFloor, AlphaCeiling] over the full alpha range makes confident pixels
    // opaque and faint ones vanish, while the band between them keeps the soft ramp hair needs.
    // Set 0 and 1 to get rembg's untouched map back.
    public float AlphaFloor { get; set; } = 0.15f;
    public float AlphaCeiling { get; set; } = 0.55f;
}

public sealed class RateLimitOptions
{
    /// <summary>Requests allowed per <see cref="WindowSeconds"/>, per IP address.</summary>
    public int PermitLimit { get; set; } = 10;

    public int WindowSeconds { get; set; } = 60;

    /// <summary>Requests allowed per rolling 24h, per IP address. 0 disables the daily cap.</summary>
    public int DailyLimit { get; set; } = 100;
}
