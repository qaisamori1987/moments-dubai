# Shopify setup — Moments Dubai

The storefront runs on **mock data** until these steps are done. There is **zero code change** to go live: fill two env vars and the app switches to Shopify automatically (`src/lib/commerce/index.ts`).

## 1. Create the store
1. Go to <https://www.shopify.com> → start a plan (the **Basic** plan is enough to launch; it includes the Storefront API).
2. Pick the store name and set the country to **United Arab Emirates**, currency **AED**.

## 2. Add products (this is your wife's day-to-day home)
- **Products → Add product**: title, description, photos, price.
- Group them into **Collections** that match the site: `Newborn Gifts`, `Baby Shower`, `Chocolate Setups`, `Ready to Send`. The collection *handle* (lowercase, hyphenated) is what the storefront filters by.
- Everything here — prices, photos, stock, new products — is editable by her with no developer and no deploy. That was the whole point of the architecture.

## 3. Get the Storefront API token
1. **Settings → Apps and sales channels → Develop apps** → *Allow custom app development* (one-time).
2. **Create an app** (e.g. "Moments Storefront").
3. **Configuration → Storefront API** → enable scopes:
   `unauthenticated_read_product_listings`, `unauthenticated_read_product_inventory`,
   and (for cart/checkout later) `unauthenticated_write_checkouts`, `unauthenticated_read_checkouts`.
4. **Install app**, then **API credentials → Storefront API access token** — copy it.

## 4. Wire it up
Create `.env.local` (copy from `.env.example`):

```
SHOPIFY_STORE_DOMAIN=your-store.myshopify.com
SHOPIFY_STOREFRONT_ACCESS_TOKEN=the-token-you-copied
```

Restart `npm run dev`. The site now reads live products. Done.

## 5. Payments & checkout (when ready for UAE)
In Shopify admin → **Settings → Payments**, enable a UAE-friendly gateway and methods:
- **Apple Pay** + cards (via Shopify Payments where available, or **Tap / Checkout.com / PayTabs / Telr**)
- **Cash on Delivery** (still expected in the UAE)
- **Tabby / Tamara** (BNPL — lifts conversion on higher-ticket hampers)

Headless checkout hands the final payment step to Shopify's hosted checkout — which is exactly what keeps PCI/fraud liability off us.

## Translations (Arabic)
Install Shopify's free **Translate & Adapt** app and add Arabic. Product/collection text then lives in the admin (not the code), keeping the bilingual workflow non-technical.
