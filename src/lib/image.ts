const DEFAULT_MAX_SIZE = 1024;
const DEFAULT_QUALITY = 0.72;

interface OptimizeImageOptions {
  maxWidth?: number;
  maxHeight?: number;
  quality?: number;
  mimeType?: "image/jpeg" | "image/webp";
}

const loadImageFromFile = (file: File): Promise<HTMLImageElement> =>
  new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      URL.revokeObjectURL(url);
      resolve(img);
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("Impossible de lire l'image."));
    };
    img.src = url;
  });

const dataUrlFromCanvas = (
  canvas: HTMLCanvasElement,
  mimeType: "image/jpeg" | "image/webp",
  quality: number,
) => canvas.toDataURL(mimeType, quality);

export const optimizeImageFileToDataUrl = async (
  file: File,
  options: OptimizeImageOptions = {},
): Promise<string> => {
  const maxWidth = options.maxWidth ?? DEFAULT_MAX_SIZE;
  const maxHeight = options.maxHeight ?? DEFAULT_MAX_SIZE;
  const quality = options.quality ?? DEFAULT_QUALITY;
  const mimeType = options.mimeType ?? "image/jpeg";

  const image = await loadImageFromFile(file);
  const ratio = Math.min(maxWidth / image.width, maxHeight / image.height, 1);
  const targetWidth = Math.max(1, Math.round(image.width * ratio));
  const targetHeight = Math.max(1, Math.round(image.height * ratio));

  const canvas = document.createElement("canvas");
  canvas.width = targetWidth;
  canvas.height = targetHeight;
  const ctx = canvas.getContext("2d");
  if (!ctx) {
    throw new Error("Impossible de traiter l'image.");
  }
  ctx.drawImage(image, 0, 0, targetWidth, targetHeight);
  return dataUrlFromCanvas(canvas, mimeType, quality);
};
