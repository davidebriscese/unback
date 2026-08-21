namespace NoBg.Tests;

/// <summary>Stands in for the ONNX engine: hands back a canned PNG, or null to feign saturation.</summary>
public sealed class FakeBackgroundRemover : IBackgroundRemover
{
    public static readonly byte[] Result = [0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A];

    public string ModelName => "fake-model";

    /// <summary>When true, every call reports the inference queue as full.</summary>
    public bool Saturated { get; set; }

    public Task<byte[]?> TryRemoveBackgroundAsync(Stream imageStream, CancellationToken ct) =>
        Task.FromResult(Saturated ? null : Result);
}
