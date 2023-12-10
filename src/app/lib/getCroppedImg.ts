import { PixelCrop } from "react-image-crop";

export async function getCroppedImg(image: HTMLImageElement, crop: PixelCrop) {
  const scaleX = image.naturalWidth / image.width;
  const scaleY = image.naturalHeight / image.height;

  const canvas = new OffscreenCanvas(96, 96);

  const ctx = canvas.getContext("2d");
  if (!ctx) {
    throw new Error("No 2d context");
  }

  ctx.drawImage(
    image,
    crop.x * scaleX,
    crop.y * scaleY,
    crop.width * scaleX,
    crop.height * scaleY,
    0,
    0,
    canvas.width,
    canvas.height
  );

  return canvas.convertToBlob({ type: "image/webp" });
}
