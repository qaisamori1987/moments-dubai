/** Bilingual string — Arabic primary, English alongside. */
export type L = { en: string; ar: string };

export type RawCollection = {
  id: string;
  handle: string;
  swatch: string;
  image?: string;
  title: L;
  description: L;
};

export type RawProduct = {
  id: string;
  handle: string;
  swatch: string;
  image?: string;
  price: number;
  tags: string[];
  collections: string[];
  featured?: boolean;
  title: L;
  description: L;
};

export type RawReel = {
  id: string;
  type: string;
  tags: string[];
  collections: string[];
  title: L;
  poster: string;
  video: string | null;
  featured: boolean;
};

export type Catalog = {
  products: RawProduct[];
  collections: RawCollection[];
  reels: RawReel[];
};
