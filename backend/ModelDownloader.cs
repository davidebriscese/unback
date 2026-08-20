namespace NoBg;

public static class ModelDownloader
{
    public static async Task EnsureModelAsync(string modelPath, string modelUrl, ILogger logger)
    {
        if (File.Exists(modelPath))
        {
            logger.LogInformation("Modello ONNX già presente: {Path}", modelPath);
            return;
        }

        Directory.CreateDirectory(Path.GetDirectoryName(modelPath)!);

        using var http = new HttpClient { Timeout = TimeSpan.FromMinutes(10) };
        using var response = await http.GetAsync(modelUrl, HttpCompletionOption.ResponseHeadersRead);
        response.EnsureSuccessStatusCode();

        var totalMb = response.Content.Headers.ContentLength is { } len
            ? $"{len / 1024 / 1024}MB"
            : "dimensione sconosciuta";
        logger.LogInformation("Scarico il modello ({Size}) da {Url}...", totalMb, modelUrl);

        var tmpPath = modelPath + ".tmp";
        await using (var body = await response.Content.ReadAsStreamAsync())
        await using (var file = File.Create(tmpPath))
        {
            await body.CopyToAsync(file);
        }

        File.Move(tmpPath, modelPath, overwrite: true);
        logger.LogInformation("Modello scaricato in {Path}", modelPath);
    }
}
