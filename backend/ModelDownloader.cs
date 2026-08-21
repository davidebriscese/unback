using System.Security.Cryptography;

namespace Unback;

/// <summary>
/// Fetches the ONNX model on first start. The model is deliberately not baked into the container
/// image: it lands in a mounted volume, so upgrading the image does not re-download it.
/// </summary>
public static class ModelDownloader
{
    private const int MaxAttempts = 3;

    public static async Task EnsureModelAsync(string modelPath, ModelOptions model, ILogger logger)
    {
        if (File.Exists(modelPath))
        {
            if (await MatchesChecksumAsync(modelPath, model.Sha256))
            {
                logger.LogInformation("ONNX model already present: {Path}", modelPath);
                return;
            }

            logger.LogWarning("Checksum mismatch on {Path}: discarding it and downloading again.", modelPath);
            File.Delete(modelPath);
        }

        Directory.CreateDirectory(Path.GetDirectoryName(modelPath)!);

        for (var attempt = 1; ; attempt++)
        {
            try
            {
                await DownloadAsync(modelPath, model, logger);
                return;
            }
            catch (Exception ex) when (attempt < MaxAttempts)
            {
                var delay = TimeSpan.FromSeconds(Math.Pow(2, attempt));
                logger.LogWarning(ex, "Model download failed (attempt {Attempt}/{Max}), retrying in {Seconds}s.",
                    attempt, MaxAttempts, delay.TotalSeconds);
                await Task.Delay(delay);
            }
        }
    }

    private static async Task DownloadAsync(string modelPath, ModelOptions model, ILogger logger)
    {
        if (model.Sha256.Length == 0)
            logger.LogWarning("No Sha256 configured for model {Name}: the download will not be "
                + "integrity-checked. Set Unback:Model:Sha256 to verify a custom model.", model.Name);

        using var http = new HttpClient { Timeout = TimeSpan.FromMinutes(15) };
        using var response = await http.GetAsync(model.Url, HttpCompletionOption.ResponseHeadersRead);
        response.EnsureSuccessStatusCode();

        var total = response.Content.Headers.ContentLength;
        logger.LogInformation("Downloading model {Name} ({Size}) from {Url}", model.Name,
            total is { } length ? $"{length / 1024 / 1024}MB" : "unknown size", model.Url);

        var tmpPath = modelPath + ".tmp";
        string hash;

        try
        {
            // Hash while streaming to disk, so verification costs no second read of ~170MB.
            await using (var body = await response.Content.ReadAsStreamAsync())
            await using (var file = File.Create(tmpPath))
            using (var sha = SHA256.Create())
            {
                var buffer = new byte[81920];
                long received = 0;
                var nextMilestone = 25;

                int read;
                while ((read = await body.ReadAsync(buffer)) > 0)
                {
                    await file.WriteAsync(buffer.AsMemory(0, read));
                    sha.TransformBlock(buffer, 0, read, null, 0);
                    received += read;

                    if (total is { } size && size > 0 && received * 100 / size >= nextMilestone)
                    {
                        logger.LogInformation("Model download {Percent}%", nextMilestone);
                        nextMilestone += 25;
                    }
                }

                sha.TransformFinalBlock([], 0, 0);
                hash = Convert.ToHexStringLower(sha.Hash!);
            }

            if (model.Sha256.Length > 0 && !hash.Equals(model.Sha256, StringComparison.OrdinalIgnoreCase))
                throw new InvalidOperationException(
                    $"Model checksum mismatch: expected {model.Sha256}, got {hash}.");
        }
        catch
        {
            // Never leave a partial or unverified file behind for the next start to trust.
            if (File.Exists(tmpPath))
                File.Delete(tmpPath);
            throw;
        }

        File.Move(tmpPath, modelPath, overwrite: true);
        logger.LogInformation("Model saved to {Path}", modelPath);
    }

    private static async Task<bool> MatchesChecksumAsync(string path, string expectedSha256)
    {
        if (expectedSha256.Length == 0)
            return true;

        await using var file = File.OpenRead(path);
        var hash = Convert.ToHexStringLower(await SHA256.HashDataAsync(file));
        return hash.Equals(expectedSha256, StringComparison.OrdinalIgnoreCase);
    }
}
