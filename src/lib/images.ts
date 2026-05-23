const MAX_FILE_SIZE = 2 * 1024 * 1024;
const MAX_WIDTH = 1400;
const JPEG_QUALITY = 0.82;

export function isValidImageUrl(url: string): boolean {
  if (!url.trim()) return false;
  if (url.startsWith("data:image/")) return true;
  try {
    const parsed = new URL(url);
    return parsed.protocol === "http:" || parsed.protocol === "https:";
  } catch {
    return false;
  }
}

export function readFileAsDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(new Error("读取文件失败"));
    reader.readAsDataURL(file);
  });
}

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error("图片加载失败"));
    img.src = src;
  });
}

export async function compressImageFile(file: File): Promise<string> {
  if (!file.type.startsWith("image/")) {
    throw new Error("请选择图片文件");
  }
  if (file.size > MAX_FILE_SIZE) {
    throw new Error("图片不能超过 2MB，请换一张较小的图片");
  }

  const dataUrl = await readFileAsDataUrl(file);
  const img = await loadImage(dataUrl);

  const scale = img.width > MAX_WIDTH ? MAX_WIDTH / img.width : 1;
  const width = Math.round(img.width * scale);
  const height = Math.round(img.height * scale);

  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;

  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("无法处理图片");

  ctx.drawImage(img, 0, 0, width, height);

  const outputType = file.type === "image/png" ? "image/png" : "image/jpeg";
  return canvas.toDataURL(outputType, JPEG_QUALITY);
}

export async function resolveImageSource(input: string | File): Promise<string> {
  if (typeof input === "string") {
    const trimmed = input.trim();
    if (!isValidImageUrl(trimmed)) {
      throw new Error("请输入有效的图片 URL");
    }
    return trimmed;
  }
  return compressImageFile(input);
}

export function getImageAlt(
  src: string,
  imageAltMap?: Record<string, string>,
  fallback = "设定插图",
): string {
  return imageAltMap?.[src]?.trim() || fallback;
}
