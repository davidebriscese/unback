/**
 * Bundled demo photos, so the tool can be tried without hunting for a file.
 * Unsplash License — credits in the repository README.
 */
export const samples = [
  { id: "portrait", src: "/samples/portrait.jpg" },
  { id: "product", src: "/samples/product.jpg" },
  { id: "animal", src: "/samples/animal.jpg" },
] as const;

export type SampleId = (typeof samples)[number]["id"];

export async function loadSample(src: string): Promise<File> {
  const response = await fetch(src);
  const blob = await response.blob();
  return new File([blob], src.split("/").pop() ?? "sample.jpg", { type: blob.type });
}
