namespace Unback;

/// <summary>Body of every non-2xx API response.</summary>
/// <param name="Code">Stable machine-readable identifier, safe to branch on.</param>
/// <param name="Error">Human-readable English explanation.</param>
public sealed record ApiError(string Code, string Error);

/// <summary>Body of <c>GET /healthz</c>.</summary>
public sealed record HealthResponse(string Status, string Model, string Version);

/// <summary>Values of <see cref="ApiError.Code"/>. Part of the public API contract: never rename.</summary>
public static class ErrorCodes
{
    public const string InvalidRequest = "invalid_request";
    public const string MissingFile = "missing_file";
    public const string UnsupportedMediaType = "unsupported_media_type";
    public const string FileTooLarge = "file_too_large";
    public const string PayloadTooLarge = "payload_too_large";
    public const string InvalidImage = "invalid_image";
    public const string TooManyPixels = "too_many_pixels";
    public const string RateLimited = "rate_limited";
    public const string DailyLimitReached = "daily_limit_reached";
    public const string ServerBusy = "server_busy";
    public const string Timeout = "timeout";
    public const string NotFound = "not_found";
    public const string InternalError = "internal_error";
}
