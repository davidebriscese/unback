/**
 * Paints the transparent cut-out onto a solid colour, in the browser. The API always returns a
 * transparent PNG; picking a background is a local choice, so it costs no extra request.
 */
export async function compositePng(source: Blob, color: string): Promise<Blob> {
  const bitmap = await createImageBitmap(source);
  try {
    const canvas = document.createElement("canvas");
    canvas.width = bitmap.width;
    canvas.height = bitmap.height;

    const context = canvas.getContext("2d");
    if (!context) throw new Error("2d canvas is unavailable");

    context.fillStyle = color;
    context.fillRect(0, 0, canvas.width, canvas.height);
    context.drawImage(bitmap, 0, 0);

    return await new Promise<Blob>((resolve, reject) =>
      canvas.toBlob(
        (blob) => (blob ? resolve(blob) : reject(new Error("canvas encoding failed"))),
        "image/png",
      ),
    );
  } finally {
    bitmap.close();
  }
}
