import "server-only";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

const ALLOWED = ["image/jpeg", "image/png", "image/webp", "image/gif"];

/**
 * Stores an uploaded image and returns its public URL.
 * - Production (Vercel): Vercel Blob (needs BLOB_READ_WRITE_TOKEN)
 * - Local development: ./public/uploads
 */
export async function saveImage(file: File, folder: string): Promise<string> {
  if (!ALLOWED.includes(file.type)) throw new Error("Only JPG, PNG, WEBP or GIF images are allowed.");
  if (file.size > 6 * 1024 * 1024) throw new Error("Image must be smaller than 6 MB.");

  const safeName = file.name.toLowerCase().replace(/[^a-z0-9.]+/g, "-").slice(-60);
  const key = `${folder}/${Date.now()}-${safeName}`;

  if (process.env.BLOB_READ_WRITE_TOKEN) {
    const { put } = await import("@vercel/blob");
    const blob = await put(key, file, { access: "public", contentType: file.type });
    return blob.url;
  }

  if (process.env.VERCEL) {
    throw new Error("Image storage is not configured. Connect a Vercel Blob store (BLOB_READ_WRITE_TOKEN) or paste an image URL.");
  }

  const dir = path.join(process.cwd(), "public", "uploads", folder);
  await mkdir(dir, { recursive: true });
  await writeFile(path.join(process.cwd(), "public", "uploads", key), Buffer.from(await file.arrayBuffer()));
  return `/uploads/${key}`;
}
