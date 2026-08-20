using Microsoft.ML.OnnxRuntime;
using Microsoft.ML.OnnxRuntime.Tensors;
using SixLabors.ImageSharp;
using SixLabors.ImageSharp.PixelFormats;
using SixLabors.ImageSharp.Processing;

namespace NoBg;

/// <summary>
/// Rimozione dello sfondo via ONNX Runtime, parametrizzata sul modello (u2net/isnet e simili).
/// Pre/post-processing replicano rembg: resize all'input del modello, divisione per il pixel
/// massimo, normalizzazione mean/std; la mappa di salienza in uscita viene normalizzata
/// min-max e applicata come canale alpha all'immagine originale.
/// </summary>
public sealed class BackgroundRemover : IDisposable
{
    private readonly InferenceSession _session;
    private readonly string _inputName;
    private readonly SemaphoreSlim _gate;
    private readonly TimeSpan _queueTimeout;
    private readonly int _inputSize;
    private readonly float[] _mean;
    private readonly float[] _std;

    public string ModelName { get; }

    public BackgroundRemover(ModelOptions model, string modelPath, int maxConcurrentInferences, TimeSpan queueTimeout)
    {
        ModelName = model.Name;
        _inputSize = model.InputSize;
        _mean = model.Mean;
        _std = model.Std;
        _session = new InferenceSession(modelPath);
        _inputName = _session.InputMetadata.Keys.First();
        _gate = new SemaphoreSlim(maxConcurrentInferences, maxConcurrentInferences);
        _queueTimeout = queueTimeout;
    }

    /// <summary>Esegue un'inferenza a vuoto per pagare subito il costo di JIT/allocazioni.</summary>
    public void Warmup()
    {
        using var blank = new Image<Rgba32>(_inputSize, _inputSize);
        using var ms = new MemoryStream();
        blank.SaveAsPng(ms);
        ms.Position = 0;
        RemoveBackground(ms);
    }

    /// <summary>Restituisce null se il server è saturo (coda piena oltre il timeout).</summary>
    public async Task<byte[]?> TryRemoveBackgroundAsync(Stream imageStream, CancellationToken ct)
    {
        if (!await _gate.WaitAsync(_queueTimeout, ct))
            return null;
        try
        {
            return await Task.Run(() => RemoveBackground(imageStream), ct);
        }
        finally
        {
            _gate.Release();
        }
    }

    private byte[] RemoveBackground(Stream imageStream)
    {
        using var original = Image.Load<Rgba32>(imageStream);
        original.Mutate(x => x.AutoOrient());

        var inputTensor = Preprocess(original);

        using var results = _session.Run(
            new[] { NamedOnnxValue.CreateFromTensor(_inputName, inputTensor) });
        var mask = results[0].AsTensor<float>().ToDenseTensor().Buffer.Span;

        ApplyMaskAsAlpha(original, mask.Slice(0, _inputSize * _inputSize));

        using var output = new MemoryStream();
        original.SaveAsPng(output);
        return output.ToArray();
    }

    private DenseTensor<float> Preprocess(Image<Rgba32> original)
    {
        int size = _inputSize;
        using var resized = original.Clone(ctx => ctx.Resize(new ResizeOptions
        {
            Size = new Size(size, size),
            Sampler = KnownResamplers.Lanczos3,
            Mode = ResizeMode.Stretch,
        }));

        var pixels = new Rgba32[size * size];
        resized.CopyPixelDataTo(pixels);

        // rembg divide per il valore massimo dei pixel, non per 255
        float maxPixel = 0f;
        foreach (var p in pixels)
        {
            maxPixel = Math.Max(maxPixel, Math.Max(p.R, Math.Max(p.G, p.B)));
        }
        if (maxPixel <= 0f) maxPixel = 1f;

        int plane = size * size;
        var data = new float[3 * plane];
        for (int i = 0; i < plane; i++)
        {
            var p = pixels[i];
            data[i] = (p.R / maxPixel - _mean[0]) / _std[0];
            data[plane + i] = (p.G / maxPixel - _mean[1]) / _std[1];
            data[2 * plane + i] = (p.B / maxPixel - _mean[2]) / _std[2];
        }
        return new DenseTensor<float>(data, new[] { 1, 3, size, size });
    }

    private void ApplyMaskAsAlpha(Image<Rgba32> original, ReadOnlySpan<float> mask)
    {
        int size = _inputSize;
        float min = float.MaxValue, max = float.MinValue;
        foreach (var v in mask)
        {
            if (v < min) min = v;
            if (v > max) max = v;
        }
        float range = max - min;
        if (range <= 0f) range = 1f;

        var normalized = new byte[mask.Length];
        for (int i = 0; i < normalized.Length; i++)
        {
            normalized[i] = (byte)Math.Clamp((mask[i] - min) / range * 255f, 0f, 255f);
        }

        using var maskImage = Image.LoadPixelData<L8>(normalized, size, size);
        using var maskResized = maskImage.Clone(ctx => ctx.Resize(new ResizeOptions
        {
            Size = new Size(original.Width, original.Height),
            Sampler = KnownResamplers.Lanczos3,
            Mode = ResizeMode.Stretch,
        }));

        original.ProcessPixelRows(maskResized, (srcAccessor, maskAccessor) =>
        {
            for (int y = 0; y < srcAccessor.Height; y++)
            {
                var srcRow = srcAccessor.GetRowSpan(y);
                var maskRow = maskAccessor.GetRowSpan(y);
                for (int x = 0; x < srcRow.Length; x++)
                {
                    srcRow[x].A = maskRow[x].PackedValue;
                }
            }
        });
    }

    public void Dispose()
    {
        _session.Dispose();
        _gate.Dispose();
    }
}
