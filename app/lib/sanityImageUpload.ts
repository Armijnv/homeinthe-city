import { writeClient } from "@/sanity/lib/writeClient";

export const maxSanityImageSize = 10 * 1024 * 1024;

const supportedImageTypes = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
]);

const heicImageTypes = new Set([
  "image/heic",
  "image/heif",
  "image/heic-sequence",
  "image/heif-sequence",
]);

const supportedImageExtensions = new Map([
  ["jpg", "image/jpeg"],
  ["jpeg", "image/jpeg"],
  ["png", "image/png"],
  ["webp", "image/webp"],
  ["gif", "image/gif"],
  ["heic", "image/heic"],
  ["heif", "image/heif"],
]);

export class SanityImageUploadError extends Error {}

export type SanityImageValue = {
  _type: "image";
  alt: string;
  asset: {
    _type: "reference";
    _ref: string;
  };
};

function fileExtension(filename: string) {
  return filename.split(".").pop()?.toLowerCase() || "";
}

function supportedImageContentType(file: File) {
  const browserType = file.type.toLowerCase();
  if (supportedImageTypes.has(browserType)) return browserType;
  if (heicImageTypes.has(browserType)) return browserType;

  const extensionType = supportedImageExtensions.get(fileExtension(file.name));
  if (extensionType && (!browserType || browserType === "application/octet-stream")) {
    return extensionType;
  }

  return null;
}

function isHeicImage(file: File, contentType: string) {
  return (
    heicImageTypes.has(file.type.toLowerCase()) ||
    heicImageTypes.has(contentType) ||
    ["heic", "heif"].includes(fileExtension(file.name))
  );
}

async function uploadableImageBody(file: File, contentType: string) {
  const body = Buffer.from(await file.arrayBuffer());

  if (!isHeicImage(file, contentType)) {
    return { body, contentType, filename: file.name };
  }

  const { default: sharp } = await import("sharp");
  const jpeg = await sharp(body, { limitInputPixels: 64_000_000 })
    .rotate()
    .jpeg({ quality: 90, mozjpeg: true })
    .toBuffer();

  return {
    body: jpeg,
    contentType: "image/jpeg",
    filename: `${file.name.replace(/\.[^.]+$/, "") || "uploaded-photo"}.jpg`,
  };
}

export async function uploadSanityImage(
  file: File,
  alt: string,
): Promise<SanityImageValue> {
  const contentType = supportedImageContentType(file);
  if (!contentType) {
    throw new SanityImageUploadError(
      "Image must be a JPG, PNG, WebP, GIF, HEIC or HEIF file.",
    );
  }

  if (file.size > maxSanityImageSize) {
    throw new SanityImageUploadError("Image must be smaller than 10 MB.");
  }

  const upload = await uploadableImageBody(file, contentType);
  const asset = await writeClient.assets.upload("image", upload.body, {
    contentType: upload.contentType,
    filename: upload.filename,
  });

  return {
    _type: "image",
    alt,
    asset: {
      _type: "reference",
      _ref: asset._id,
    },
  };
}
