import collectionsData from "@/content/collections.json";
import productsData from "@/content/products.json";
import reelsData from "@/content/reels.json";
import type { Collection, CommerceProvider, Money, Product, Reel } from "./types";

/**
 * Local content provider — reads the catalog from src/content/*.json.
 *
 * This is the editable seam: change products/prices/copy in the JSON files,
 * no code. When the backoffice is built, swap this for an `apiProvider` that
 * reads from it (one line in index.ts) — pages don't change.
 */

/** Bilingual string — Arabic is primary, English alongside. */
type L = { en: string; ar: string };
const pick = (l: L, locale: string) => (locale === "ar" ? l.ar : l.en);
const aed = (amount: number): Money => ({ amount, currencyCode: "AED" });

type RawCollection = { id: string; handle: string; swatch: string; image?: string; title: L; description: L };
type RawProduct = RawCollection & { price: number; tags: string[]; collections: string[]; featured?: boolean };
type RawReel = {
  id: string; type: string; tags: string[]; collections: string[];
  title: L; poster: string; video: string | null; featured: boolean;
};

const COLLECTIONS = collectionsData as unknown as RawCollection[];
const PRODUCTS = productsData as unknown as RawProduct[];
const REELS = reelsData as unknown as RawReel[];

function toReel(r: RawReel, locale: string): Reel {
  return { ...r, title: pick(r.title, locale) };
}

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

export const contentProvider: CommerceProvider = {
  async getCollections(locale) {
    return COLLECTIONS.map((c) => toCollection(c, locale));
  },
  async getProducts({ locale, collection }) {
    const list = collection
      ? PRODUCTS.filter((p) => p.collections.includes(collection))
      : PRODUCTS;
    return list.map((p) => toProduct(p, locale));
  },
  async getProduct(handle, locale) {
    const found = PRODUCTS.find((p) => p.handle === handle);
    return found ? toProduct(found, locale) : null;
  },
  async getReels({ locale, collection, featuredOnly }) {
    let list = REELS;
    if (collection) list = list.filter((r) => r.collections.includes(collection));
    if (featuredOnly) list = list.filter((r) => r.featured);
    // Playable (encoded) reels first so the inline videos surface ahead of posters.
    list = [...list].sort((a, b) => Number(b.featured) - Number(a.featured));
    return list.map((r) => toReel(r, locale));
  },
};
