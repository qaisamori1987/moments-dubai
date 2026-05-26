import "server-only";
import { cache } from "react";
import seedCollections from "@/content/collections.json";
import seedProducts from "@/content/products.json";
import seedReels from "@/content/reels.json";
import type { Catalog } from "./types";

/**
 * The catalog store — the single source of truth the storefront reads and the
 * admin writes. Two interchangeable backends:
 *
 *  - **Vercel Blob** (production): when BLOB_READ_WRITE_TOKEN is set. The whole
 *    catalog lives in one `catalog.json` blob. Survives across deploys and is
 *    editable from the live admin.
 *  - **Local filesystem** (development): reads/writes src/content/*.json so
 *    edits stay version-controllable while building.
 *
 * The bundled src/content/*.json files are the SEED: used as the initial value
 * and the fallback before anything has been saved.
 */

const BLOB_KEY = "catalog.json";
const useBlob = !!process.env.BLOB_READ_WRITE_TOKEN;

function seed(): Catalog {
  return {
    products: seedProducts as unknown as Catalog["products"],
    collections: seedCollections as unknown as Catalog["collections"],
    reels: seedReels as unknown as Catalog["reels"],
  };
}

// ---- Blob backend -----------------------------------------------------------

async function blobUrl(): Promise<string | null> {
  const { list } = await import("@vercel/blob");
  const { blobs } = await list({ prefix: BLOB_KEY, limit: 1 });
  return blobs[0]?.url ?? null;
}

async function readBlob(fresh: boolean): Promise<Catalog> {
  const url = await blobUrl();
  if (!url) return seed();
  // Admin reads fresh (read-your-own-writes); storefront reads a tagged cache
  // (busted on save via updateTag, with a 60s time-based backstop).
  const res = await fetch(
    url,
    fresh ? { cache: "no-store" } : { next: { tags: ["catalog"], revalidate: 60 } },
  );
  if (!res.ok) return seed();
  return (await res.json()) as Catalog;
}

async function writeBlob(catalog: Catalog): Promise<void> {
  const { put } = await import("@vercel/blob");
  await put(BLOB_KEY, JSON.stringify(catalog, null, 2), {
    access: "public",
    addRandomSuffix: false,
    allowOverwrite: true,
    contentType: "application/json",
  });
}

// ---- Filesystem backend (dev) ----------------------------------------------

const FILES = { products: "products.json", collections: "collections.json", reels: "reels.json" } as const;

async function contentDir() {
  const path = await import("node:path");
  return path.join(process.cwd(), "src", "content");
}

async function readFs(): Promise<Catalog> {
  const fs = await import("node:fs/promises");
  const dir = await contentDir();
  const path = await import("node:path");
  const def = seed();
  const out = {} as Catalog;
  for (const key of Object.keys(FILES) as (keyof Catalog)[]) {
    try {
      const raw = await fs.readFile(path.join(dir, FILES[key]), "utf8");
      (out as Record<string, unknown>)[key] = JSON.parse(raw);
    } catch {
      (out as Record<string, unknown>)[key] = def[key];
    }
  }
  return out;
}

async function writeFs(catalog: Catalog): Promise<void> {
  const fs = await import("node:fs/promises");
  const path = await import("node:path");
  const dir = await contentDir();
  for (const key of Object.keys(FILES) as (keyof Catalog)[]) {
    await fs.writeFile(path.join(dir, FILES[key]), JSON.stringify(catalog[key], null, 2) + "\n", "utf8");
  }
}

// ---- Public API -------------------------------------------------------------

/** Fresh read (no cache) — used by the admin so it always sees latest. */
export async function readCatalog(): Promise<Catalog> {
  return useBlob ? readBlob(true) : readFs();
}

/** Per-request-deduped, cacheable read — used by the storefront. */
export const loadCatalog = cache(async (): Promise<Catalog> => {
  return useBlob ? readBlob(false) : readFs();
});

export async function writeCatalog(catalog: Catalog): Promise<void> {
  if (useBlob) await writeBlob(catalog);
  else await writeFs(catalog);
}

export const storageBackend = useBlob ? "blob" : "filesystem";
