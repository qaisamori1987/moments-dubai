export type Money = { amount: number; currencyCode: string };

export type ProductVariant = {
  id: string;
  title: string;
  price: Money;
  availableForSale: boolean;
};

export type Product = {
  id: string;
  handle: string;
  title: string;
  description: string;
  price: Money;
  /** Soft gradient fallback shown when `image` is absent. */
  swatch: string;
  /** Optional web path to a real photo, e.g. "/images/posts/<id>.jpg". */
  image?: string;
  tags: string[];
  /** Handles of the collections this product belongs to (for occasion filtering). */
  collections: string[];
  /** Shown in the homepage "featured" row. */
  featured?: boolean;
  variants: ProductVariant[];
};

export type Collection = {
  id: string;
  handle: string;
  title: string;
  description: string;
  swatch: string;
  image?: string;
};

/**
 * A categorized Instagram reel. Recognized from the reel's thumbnail and
 * placed into the collections it belongs to (see src/content/reels.json).
 * `video` is set only for the curated few encoded for inline playback; the
 * rest show the poster and link out to Instagram.
 */
export type Reel = {
  id: string;
  type: string;
  title: string;
  tags: string[];
  collections: string[];
  poster: string;
  video: string | null;
  featured: boolean;
};

/**
 * The seam between the storefront and whatever runs commerce.
 * Mock today; Shopify Storefront API once the store + token exist.
 *
 * `locale` is first-class on every read: Arabic is the primary customer
 * language here, so titles/descriptions must come back localized
 * (Shopify resolves this via @inContext(language:); see shopify.ts).
 */
export interface CommerceProvider {
  getCollections(locale: string): Promise<Collection[]>;
  getProducts(opts: { locale: string; collection?: string }): Promise<Product[]>;
  getProduct(handle: string, locale: string): Promise<Product | null>;
  /**
   * Categorized reels (optional — only the content provider has them today).
   * Filter by `collection` handle and/or `featuredOnly`.
   */
  getReels?(opts: { locale: string; collection?: string; featuredOnly?: boolean }): Promise<Reel[]>;
}
