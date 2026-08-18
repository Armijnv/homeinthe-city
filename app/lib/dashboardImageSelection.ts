export const dashboardFileInputClass =
  "w-full rounded-lg border border-white/15 bg-white/10 px-4 py-3 text-sm text-stone-200 file:mr-4 file:rounded-md file:border-0 file:bg-[#d6a85a] file:px-3 file:py-2 file:text-sm file:font-medium file:text-[#1a1f2e]";

// Vercel Functions reject requests above 4.5 MB before a Server Action runs.
// Keep each prepared image modest and leave room for the rest of the form.
export const maxDashboardImageSize = 1_500 * 1024;
export const maxDashboardImageRequestSize = 3_500 * 1024;
export const dashboardImageMaximumDimension = 2560;
export const dashboardImageTargetSize = 1_200 * 1024;

const supportedImageExtensions = new Set([
  "jpg",
  "jpeg",
  "png",
  "webp",
  "gif",
  "heic",
  "heif",
]);

function fileExtension(filename: string) {
  return filename.split(".").pop()?.toLowerCase() || "";
}

export function selectedDashboardImageError(file: File, label: string) {
  const extension = fileExtension(file.name);
  const type = file.type.toLowerCase();

  if (file.size > maxDashboardImageSize) {
    return `${label} could not be prepared for upload. Please try another photo.`;
  }

  if (type && !type.startsWith("image/") && !supportedImageExtensions.has(extension)) {
    return "Please choose an image file.";
  }

  if (!type && extension && !supportedImageExtensions.has(extension)) {
    return "Please choose a JPG, PNG, WebP, GIF, HEIC or HEIF image.";
  }

  return "";
}

function normalizedImageFilename(filename: string) {
  return `${filename.replace(/\.[^.]+$/, "") || "uploaded-photo"}.jpg`;
}

function setInputFiles(input: HTMLInputElement, files: File[]) {
  const transfer = new DataTransfer();
  files.forEach((file) => transfer.items.add(file));
  input.files = transfer.files;
}

async function canvasBlob(canvas: HTMLCanvasElement, quality: number) {
  return new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, "image/jpeg", quality));
}

/**
 * Converts ordinary browser-decodable photos into a responsive JPEG master
 * before they ever enter a Server Action. The canvas draw applies EXIF
 * orientation, preserves aspect ratio, and never enlarges a small image.
 */
export async function prepareDashboardImage(file: File, label: string): Promise<File> {
  const initialError = selectedDashboardImageError(file, label);
  if (initialError && file.size <= maxDashboardImageSize) throw new Error(initialError);

  const extension = fileExtension(file.name);
  if (extension === "gif" || file.type.toLowerCase() === "image/gif") {
    if (file.size > maxDashboardImageSize) {
      throw new Error(`${label} could not be prepared for upload. Please choose a smaller image.`);
    }
    return file;
  }

  let bitmap: ImageBitmap;
  try {
    bitmap = await createImageBitmap(file, { imageOrientation: "from-image" });
  } catch {
    // Some browsers cannot decode HEIC/HEIF. Small files can still use the
    // established server-side Sharp conversion; large ones fail before upload.
    if (["heic", "heif"].includes(extension) && file.size <= maxDashboardImageSize) return file;
    throw new Error(
      `${label} format is not supported by this browser. Please choose a JPG, PNG or WebP image.`,
    );
  }

  try {
    let width = bitmap.width;
    let height = bitmap.height;
    const scale = Math.min(1, dashboardImageMaximumDimension / Math.max(width, height));
    width = Math.max(1, Math.round(width * scale));
    height = Math.max(1, Math.round(height * scale));
    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    const context = canvas.getContext("2d");
    if (!context) throw new Error("Unable to prepare image.");
    context.fillStyle = "#ffffff";
    context.fillRect(0, 0, width, height);
    context.drawImage(bitmap, 0, 0, width, height);

    let quality = 0.84;
    let blob = await canvasBlob(canvas, quality);
    while (blob && blob.size > dashboardImageTargetSize && quality > 0.62) {
      quality -= 0.08;
      blob = await canvasBlob(canvas, quality);
    }
    if (!blob || blob.size > maxDashboardImageSize) {
      throw new Error(`${label} could not be prepared for upload. Please try another photo.`);
    }
    return new File([blob], normalizedImageFilename(file.name), { type: "image/jpeg" });
  } finally {
    bitmap.close();
  }
}

export async function prepareDashboardImageInput(
  input: HTMLInputElement,
  label: string,
) {
  const selected = Array.from(input.files || []);
  if (!selected.length) return { files: [] as File[], error: "" };

  try {
    const files = await Promise.all(selected.map((file) => prepareDashboardImage(file, label)));
    const otherSize = Array.from(
      input.form?.querySelectorAll<HTMLInputElement>('input[type="file"][data-dashboard-image]') || [],
    )
      .filter((other) => other !== input)
      .flatMap((other) => Array.from(other.files || []))
      .reduce((total, file) => total + file.size, 0);
    if (otherSize + files.reduce((total, file) => total + file.size, 0) > maxDashboardImageRequestSize) {
      throw new Error("This form has too many images to upload at once. Save fewer images at a time.");
    }
    setInputFiles(input, files);
    return { files, error: "" };
  } catch (error) {
    input.value = "";
    return {
      files: [] as File[],
      error: error instanceof Error ? error.message : `${label} could not be prepared for upload. Please try another photo.`,
    };
  }
}
