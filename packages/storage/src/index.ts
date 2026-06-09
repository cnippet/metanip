import { v2 as cloudinary } from "cloudinary";

function isConfigured(): boolean {
  return Boolean(
    process.env.CLOUDINARY_CLOUD_NAME &&
    process.env.CLOUDINARY_API_KEY &&
    process.env.CLOUDINARY_API_SECRET,
  );
}

if (isConfigured()) {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });
}

export type UploadResult = { url: string; publicId: string };

export async function upload(
  data: string,
  options?: { folder?: string },
): Promise<UploadResult | null> {
  if (!isConfigured()) return null;
  const result = await cloudinary.uploader.upload(data, {
    folder: options?.folder ?? "metanip",
    resource_type: "image",
  });
  return { url: result.secure_url, publicId: result.public_id };
}

export async function remove(publicId: string): Promise<void> {
  if (!isConfigured()) return;
  await cloudinary.uploader.destroy(publicId);
}
