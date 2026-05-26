# Catalog content

The storefront's catalog lives here as plain JSON — **edit these files to change what the site sells. No code required.**

- `collections.json` — the gift categories shown on the homepage and as `/collections/<handle>` pages.
- `products.json` — the gifts shown in collections and on `/products/<handle>` pages.

Every text field is bilingual: `{ "en": "...", "ar": "..." }`. Arabic is the primary language.

## Add a product

Append an object to `products.json`:

```jsonc
{
  "id": "p-unique-id",                 // any unique string
  "handle": "url-slug",                // becomes /products/url-slug
  "swatch": "linear-gradient(135deg, #f5ede3, #e8c9c1)", // placeholder until real photos
  "price": 250,                        // AED
  "tags": ["newborn", "girl"],         // used by filters: boy | girl | chocolate | keepsake | bestseller | newborn
  "collections": ["newborn-gifts"],    // collection handles this product appears in
  "title":       { "en": "...", "ar": "..." },
  "description": { "en": "...", "ar": "..." }
}
```

## Notes

- `collections[]` on a product must reference an existing `handle` in `collections.json`.
- Prices are **AED**, whole numbers. (Moments doesn't publish prices on Instagram — set real ones here.)
- After editing, the dev server hot-reloads. For production, redeploy.
- This is temporary by design: when the backoffice is built it will manage this same data through a UI instead of hand-editing JSON.
