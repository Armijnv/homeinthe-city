export const dashboardFileInputClass =
  "w-full rounded-lg border border-white/15 bg-white/10 px-4 py-3 text-sm text-stone-200 file:mr-4 file:rounded-md file:border-0 file:bg-[#d6a85a] file:px-3 file:py-2 file:text-sm file:font-medium file:text-[#1a1f2e]";

export const maxDashboardImageSize = 10 * 1024 * 1024;

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
    return `${label} must be smaller than 10 MB.`;
  }

  if (type && !type.startsWith("image/") && !supportedImageExtensions.has(extension)) {
    return "Please choose an image file.";
  }

  if (!type && extension && !supportedImageExtensions.has(extension)) {
    return "Please choose a JPG, PNG, WebP, GIF, HEIC or HEIF image.";
  }

  return "";
}
