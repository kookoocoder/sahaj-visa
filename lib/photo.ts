export type PreparedImage = {
  dataUrl: string;
  mime: "image/jpeg";
  bytes: number;
  width: number;
  height: number;
  fileName: string;
  prepared: true;
  originalWidth: number;
  originalHeight: number;
  originalBytes: number;
};

function loadImage(src: string) {
  return new Promise<HTMLImageElement>((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error("Could not read that image."));
    img.src = src;
  });
}

function canvasToJpeg(canvas: HTMLCanvasElement, quality: number) {
  return canvas.toDataURL("image/jpeg", quality);
}

function byteLength(dataUrl: string) {
  const b64 = dataUrl.split(",")[1] ?? "";
  return Math.ceil((b64.length * 3) / 4);
}

/** Centre-crop to square and compress into the live portal's usual 10–300 KB JPEG window. */
export async function prepareSquarePhoto(file: File, size = 600): Promise<PreparedImage> {
  const originalBytes = file.size;
  const src = URL.createObjectURL(file);
  try {
    const img = await loadImage(src);
    const side = Math.min(img.width, img.height);
    const sx = (img.width - side) / 2;
    const sy = (img.height - side) / 2;
    const canvas = document.createElement("canvas");
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext("2d");
    if (!ctx) throw new Error("Canvas unavailable.");
    ctx.fillStyle = "#f4f1ea";
    ctx.fillRect(0, 0, size, size);
    ctx.drawImage(img, sx, sy, side, side, 0, 0, size, size);

    let quality = 0.9;
    let dataUrl = canvasToJpeg(canvas, quality);
    let bytes = byteLength(dataUrl);
    while (bytes > 280 * 1024 && quality > 0.4) {
      quality -= 0.08;
      dataUrl = canvasToJpeg(canvas, quality);
      bytes = byteLength(dataUrl);
    }
    while (bytes < 12 * 1024 && quality < 0.95) {
      quality += 0.05;
      dataUrl = canvasToJpeg(canvas, quality);
      bytes = byteLength(dataUrl);
    }

    return {
      dataUrl,
      mime: "image/jpeg",
      bytes,
      width: size,
      height: size,
      fileName: file.name.replace(/\.[^.]+$/, "") + "-square.jpg",
      prepared: true,
      originalWidth: img.width,
      originalHeight: img.height,
      originalBytes,
    };
  } finally {
    URL.revokeObjectURL(src);
  }
}

export async function fileToUpload(file: File, prepareSquare = false) {
  if (prepareSquare && file.type.startsWith("image/")) {
    const prepared = await prepareSquarePhoto(file);
    return prepared;
  }
  const dataUrl = await new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(new Error("Could not read file."));
    reader.readAsDataURL(file);
  });
  let width: number | undefined;
  let height: number | undefined;
  if (file.type.startsWith("image/")) {
    const img = await loadImage(dataUrl);
    width = img.width;
    height = img.height;
  }
  return {
    dataUrl,
    mime: file.type || "application/octet-stream",
    bytes: file.size,
    width,
    height,
    fileName: file.name,
    prepared: false as const,
  };
}

export function dataUrlToBuffer(dataUrl: string) {
  const b64 = dataUrl.split(",")[1];
  if (!b64) return null;
  return Buffer.from(b64, "base64");
}
