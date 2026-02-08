import "server-only";

import { randomUUID } from "node:crypto";

import { createSupabaseServerClient, isSupabaseConfigured } from "@/lib/supabase/server";

const ALLOWED_EXTENSIONS = new Set(["jpg", "jpeg", "png", "webp", "avif"]);

function sanitizeFileName(rawName: string): string {
  const base = rawName
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9._-]/g, "");

  return base || "image";
}

function getExtension(fileName: string, contentType: string): string {
  const fileExt = fileName.split(".").pop()?.toLowerCase() || "";
  if (ALLOWED_EXTENSIONS.has(fileExt)) {
    return fileExt;
  }

  if (contentType === "image/jpeg") {
    return "jpg";
  }
  if (contentType === "image/png") {
    return "png";
  }
  if (contentType === "image/webp") {
    return "webp";
  }
  if (contentType === "image/avif") {
    return "avif";
  }

  throw new Error("Format image non supporte (jpg, jpeg, png, webp, avif)");
}

function getFilesFromFormData(formData: FormData, fieldName: string): File[] {
  return formData
    .getAll(fieldName)
    .filter((entry): entry is File => entry instanceof File && entry.size > 0);
}

async function uploadToSupabase(files: File[]): Promise<string[]> {
  const supabase = createSupabaseServerClient();
  const bucket = process.env.SUPABASE_STORAGE_BUCKET || "products";
  const urls: string[] = [];

  for (const file of files) {
    const extension = getExtension(file.name, file.type);
    const safeName = sanitizeFileName(file.name.replace(/\.[^.]+$/, ""));
    const key = `${Date.now()}-${randomUUID().slice(0, 8)}-${safeName}.${extension}`;
    const objectPath = `products/${key}`;
    const buffer = Buffer.from(await file.arrayBuffer());

    const { error } = await supabase.storage.from(bucket).upload(objectPath, buffer, {
      contentType: file.type || `image/${extension}`,
      upsert: false
    });

    if (error) {
      throw new Error(`Upload image impossible: ${error.message}`);
    }

    const { data } = supabase.storage.from(bucket).getPublicUrl(objectPath);
    if (!data?.publicUrl) {
      throw new Error("URL publique image introuvable");
    }
    urls.push(data.publicUrl);
  }

  return urls;
}

export async function uploadProductImages(formData: FormData, fieldName: string): Promise<string[]> {
  const files = getFilesFromFormData(formData, fieldName);
  if (files.length === 0) {
    return [];
  }

  if (!isSupabaseConfigured()) {
    throw new Error(
      "Supabase non configure: upload image indisponible. Configure NEXT_PUBLIC_SUPABASE_URL et SUPABASE_SERVICE_ROLE_KEY."
    );
  }

  return uploadToSupabase(files);
}
