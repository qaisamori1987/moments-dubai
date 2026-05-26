"use server";
import { updateTag } from "next/cache";
import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/auth/guard";
import { readCatalog, writeCatalog } from "@/lib/store/catalog";
import { uploadMedia } from "@/lib/store/media";
import type { Catalog, RawCollection, RawProduct } from "@/lib/store/types";

function slugify(s: string): string {
  return s.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

function uniqueHandle(base: string, taken: Set<string>): string {
  const root = slugify(base) || "item";
  if (!taken.has(root)) return root;
  let i = 2;
  while (taken.has(`${root}-${i}`)) i++;
  return `${root}-${i}`;
}

/** Persist + bust the storefront's cached catalog reads. */
async function commit(catalog: Catalog) {
  await writeCatalog(catalog);
  updateTag("catalog");
}

async function resolveImage(formData: FormData, existing: string | undefined): Promise<string | undefined> {
  const file = formData.get("imageFile");
  if (file instanceof File && file.size > 0) return uploadMedia(file);
  const cleared = formData.get("imageCleared") === "1";
  return cleared ? undefined : existing || undefined;
}

// ---- Products ---------------------------------------------------------------

export async function saveProduct(formData: FormData): Promise<void> {
  await requireAdmin();
  const cat = await readCatalog();
  const id = String(formData.get("id") ?? "").trim();

  const titleEn = String(formData.get("titleEn") ?? "").trim();
  const titleAr = String(formData.get("titleAr") ?? "").trim();
  const fields = {
    title: { en: titleEn, ar: titleAr || titleEn },
    description: {
      en: String(formData.get("descEn") ?? "").trim(),
      ar: String(formData.get("descAr") ?? "").trim(),
    },
    swatch: String(formData.get("swatch") ?? "#f5ede3").trim() || "#f5ede3",
    price: Number(formData.get("price") ?? 0) || 0,
    tags: formData.getAll("tags").map(String),
    collections: formData.getAll("collections").map(String),
    featured: formData.get("featured") === "on",
  };

  if (id) {
    const p = cat.products.find((x) => x.id === id);
    if (!p) redirect("/admin/products");
    Object.assign(p!, fields, { image: await resolveImage(formData, p!.image) });
  } else {
    const taken = new Set(cat.products.map((p) => p.handle));
    const handle = uniqueHandle(titleEn, taken);
    const product: RawProduct = {
      id: handle,
      handle,
      image: await resolveImage(formData, undefined),
      ...fields,
    };
    cat.products.unshift(product);
  }
  await commit(cat);
  redirect("/admin/products");
}

export async function deleteProduct(formData: FormData): Promise<void> {
  await requireAdmin();
  const id = String(formData.get("id") ?? "");
  const cat = await readCatalog();
  cat.products = cat.products.filter((p) => p.id !== id);
  await commit(cat);
  redirect("/admin/products");
}

// ---- Collections (category sections) ---------------------------------------

export async function saveCollection(formData: FormData): Promise<void> {
  await requireAdmin();
  const cat = await readCatalog();
  const id = String(formData.get("id") ?? "").trim();
  const titleEn = String(formData.get("titleEn") ?? "").trim();
  const titleAr = String(formData.get("titleAr") ?? "").trim();
  const fields = {
    title: { en: titleEn, ar: titleAr || titleEn },
    description: {
      en: String(formData.get("descEn") ?? "").trim(),
      ar: String(formData.get("descAr") ?? "").trim(),
    },
    swatch: String(formData.get("swatch") ?? "#e8c9c1").trim() || "#e8c9c1",
  };

  if (id) {
    const c = cat.collections.find((x) => x.id === id);
    if (!c) redirect("/admin/collections");
    Object.assign(c!, fields, { image: await resolveImage(formData, c!.image) });
  } else {
    const taken = new Set(cat.collections.map((c) => c.handle));
    const handle = uniqueHandle(titleEn, taken);
    const collection: RawCollection = {
      id: handle,
      handle,
      image: await resolveImage(formData, undefined),
      ...fields,
    };
    cat.collections.push(collection);
  }
  await commit(cat);
  redirect("/admin/collections");
}

export async function deleteCollection(formData: FormData): Promise<void> {
  await requireAdmin();
  const id = String(formData.get("id") ?? "");
  const cat = await readCatalog();
  const handle = cat.collections.find((c) => c.id === id)?.handle;
  cat.collections = cat.collections.filter((c) => c.id !== id);
  // Remove the deleted category from every product & reel that referenced it.
  if (handle) {
    for (const p of cat.products) p.collections = p.collections.filter((h) => h !== handle);
    for (const r of cat.reels) r.collections = r.collections.filter((h) => h !== handle);
  }
  await commit(cat);
  redirect("/admin/collections");
}

// ---- Reels ------------------------------------------------------------------

export async function saveReel(formData: FormData): Promise<void> {
  await requireAdmin();
  const id = String(formData.get("id") ?? "");
  const cat = await readCatalog();
  const r = cat.reels.find((x) => x.id === id);
  if (!r) redirect("/admin/reels");
  r!.collections = formData.getAll("collections").map(String);
  r!.tags = formData.getAll("tags").map(String);
  r!.featured = formData.get("featured") === "on";
  await commit(cat);
  redirect("/admin/reels");
}

export async function deleteReel(formData: FormData): Promise<void> {
  await requireAdmin();
  const id = String(formData.get("id") ?? "");
  const cat = await readCatalog();
  cat.reels = cat.reels.filter((x) => x.id !== id);
  await commit(cat);
  redirect("/admin/reels");
}
