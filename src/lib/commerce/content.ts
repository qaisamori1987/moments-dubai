import { loadCatalog } from "@/lib/store/catalog";
import type { L, RawCollection, RawProduct, RawReel } from "@/lib/store/types";
import type { Collection, CommerceProvider, Money, Product, Reel } from "./types";

/**
 * Local content provider — reads the catalog from the store (Vercel Blob in
 * production, src/content/*.json in development; see src/lib/store/catalog.ts).
 *
 * This is the editable seam: the admin writes through the same store, so edits
 * appear here without code changes.
 */

const pick = (l: L, locale: string) => (locale === "ar" ? l.ar : l.en);
const aed = (amount: number): Money => ({ amount, currencyCode: "AED" });

function toCollection(c: RawCollection, locale: string): Collection {
  return {
    id: c.id,
    handle: c.handle,
    swatch: c.swatch,
    image: c.image,
    title: pick(c.title, locale),
    description: pick(c.description, locale),
  };
}

function toProduct(p: RawProduct, locale: string): Product {
  return {
    id: p.id,
    handle: p.handle,
    swatch: p.swatch,
    price: aed(p.price),
    tags: p.tags,
    collections: p.collections,
    featured: p.featured,
    image: p.image,
    title: pick(p.title, locale),
    description: pick(p.description, locale),
    variants: [
      { id: `${p.id}-v1`, title: "Default", price: aed(p.price), availableForSale: true },
    ],
  };
}

function toReel(r: RawReel, locale: string): Reel {
  return { ...r, title: pick(r.title, locale) };
}

export const contentProvider: CommerceProvider = {
  async getCollections(locale) {
    const { collections } = await loadCatalog();
    return collections.map((c) => toCollection(c, locale));
  },
  async getProducts({ locale, collection }) {
    const { products } = await loadCatalog();
    const list = collection
      ? products.filter((p) => p.collections.includes(collection))
      : products;
    return list.map((p) => toProduct(p, locale));
  },
  async getProduct(handle, locale) {
    const { products } = await loadCatalog();
    const found = products.find((p) => p.handle === handle);
    return found ? toProduct(found, locale) : null;
  },
  async getReels({ locale, collection, featuredOnly }) {
    const { reels } = await loadCatalog();
    let list = reels;
    if (collection) list = list.filter((r) => r.collections.includes(collection));
    if (featuredOnly) list = list.filter((r) => r.featured);
    list = [...list].sort((a, b) => Number(b.featured) - Number(a.featured));
    return list.map((r) => toReel(r, locale));
  },
};
