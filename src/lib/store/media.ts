import "server-only";

/**
 * Store an uploaded image/video and return a public URL.
 *  - Blob backend → uploaded to Vercel Blob, returns an https:// URL.
 *  - FS backend (dev) → written to public/images/uploads, returns a /path.
 */

const useBlob = !!process.env.BLOB_READ_WRITE_TOKEN;

function safeName(name: string): string {
  const dot = name.lastIndexOf(".");
  const ext = (dot >= 0 ? name.slice(dot + 1) : "").toLowerCase().replace(/[^a-z0-9]/g, "") || "bin";
  const base = (dot >= 0 ? name.slice(0, dot) : name)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
    .slice(0, 40) || "file";
  return `${base}-${Date.now().toString(36)}.${ext}`;
}

export async function uploadMedia(file: File): Promise<string> {
  const name = safeName(file.name || "upload");
  if (useBlob) {
    const { put } = await import("@vercel/blob");
    const { url } = await put(`uploads/${name}`, file, {
      access: "public",
      addRandomSuffix: true,
      contentType: file.type || undefined,
    });
    return url;
  }
  const fs = await import("node:fs/promises");
  const path = await import("node:path");
  const dir = path.join(process.cwd(), "public", "images", "uploads");
  await fs.mkdir(dir, { recursive: true });
  const buf = Buffer.from(await file.arrayBuffer());
  await fs.writeFile(path.join(dir, name), buf);
  return `/images/uploads/${name}`;
}
