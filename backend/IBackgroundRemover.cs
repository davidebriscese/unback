namespace NoBg;

/// <summary>
/// Background removal engine. Abstracted so tests can exercise the HTTP surface without
/// loading the ONNX model.
/// </summary>
public interface IBackgroundRemover
{
    string ModelName { get; }

    /// <summary>Returns the transparent PNG, or null if the server is saturated.</summary>
    Task<byte[]?> TryRemoveBackgroundAsync(Stream imageStream, CancellationToken ct);
}
