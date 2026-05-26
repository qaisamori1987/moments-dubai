import type { Collection, CommerceProvider, Money, Product } from "./types";

/**
 * Shopify Storefront API provider.
 *
 * Activates automatically once SHOPIFY_STORE_DOMAIN and
 * SHOPIFY_STOREFRONT_ACCESS_TOKEN are set (see src/lib/commerce/index.ts).
 * See SHOPIFY_SETUP.md for how to obtain those.
 *
 * Localization: every query runs under @inContext(language:, country:) so
 * Shopify returns Arabic content on /ar without any per-string mapping here.
 */
const API_VERSION = "2024-10";

function endpoint() {
  const domain = process.env.SHOPIFY_STORE_DOMAIN;
  if (!domain) throw new Error("SHOPIFY_STORE_DOMAIN is not set");
  return `https://${domain}/api/${API_VERSION}/graphql.json`;
}

/** locale ("en" | "ar") → Shopify LanguageCode enum. */
const langOf = (locale: string) => (locale === "ar" ? "AR" : "EN");

async function shopifyFetch<T>(query: string, variables?: Record<string, unknown>): Promise<T> {
  const token = process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN;
  if (!token) throw new Error("SHOPIFY_STOREFRONT_ACCESS_TOKEN is not set");

  const res = await fetch(endpoint(), {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Shopify-Storefront-Access-Token": token,
    },
    body: JSON.stringify({ query, variables }),
    next: { revalidate: 60 },
  });

  if (!res.ok) throw new Error(`Shopify API error: ${res.status}`);
  const json = (await res.json()) as { data: T; errors?: unknown };
  if (json.errors) throw new Error(`Shopify GraphQL error: ${JSON.stringify(json.errors)}`);
  return json.data;
}

const money = (m: { amount: string; currencyCode: string }): Money => ({
  amount: parseFloat(m.amount),
  currencyCode: m.currencyCode,
});

const ctxArgs = "$language: LanguageCode!, $country: CountryCode!";
const inContext = "@inContext(language: $language, country: $country)";
const ctxVars = (locale: string) => ({ language: langOf(locale), country: "AE" });

const SWATCH = "linear-gradient(135deg, #f5ede3, #e8c9c1)";

type GqlProduct = {
  id: string;
  handle: string;
  title: string;
  description: string;
  tags: string[];
  priceRange: { minVariantPrice: { amount: string; currencyCode: string } };
  collections: { nodes: { handle: string }[] };
  variants: {
    nodes: {
      id: string;
      title: string;
      availableForSale: boolean;
      price: { amount: string; currencyCode: string };
    }[];
  };
};

const PRODUCT_FIELDS = /* GraphQL */ `
  id handle title description tags
  priceRange { minVariantPrice { amount currencyCode } }
  collections(first: 10) { nodes { handle } }
  variants(first: 25) {
    nodes { id title availableForSale price { amount currencyCode } }
  }
`;

function toProduct(p: GqlProduct): Product {
  return {
    id: p.id,
    handle: p.handle,
    title: p.title,
    description: p.description,
    price: money(p.priceRange.minVariantPrice),
    swatch: SWATCH,
    tags: p.tags,
    collections: p.collections.nodes.map((n) => n.handle),
    variants: p.variants.nodes.map((v) => ({
      id: v.id,
      title: v.title,
      price: money(v.price),
      availableForSale: v.availableForSale,
    })),
  };
}

export const shopifyProvider: CommerceProvider = {
  async getCollections(locale) {
    const data = await shopifyFetch<{
      collections: { nodes: Omit<Collection, "swatch">[] };
    }>(
      /* GraphQL */ `
        query Collections(${ctxArgs}) ${inContext} {
          collections(first: 20) { nodes { id handle title description } }
        }
      `,
      ctxVars(locale),
    );
    return data.collections.nodes.map((c) => ({ ...c, swatch: SWATCH }));
  },

  async getProducts({ locale, collection }) {
    if (collection) {
      const data = await shopifyFetch<{ collection: { products: { nodes: GqlProduct[] } } | null }>(
        /* GraphQL */ `
          query CollectionProducts(${ctxArgs}, $handle: String!) ${inContext} {
            collection(handle: $handle) {
              products(first: 50) { nodes { ${PRODUCT_FIELDS} } }
            }
          }
        `,
        { ...ctxVars(locale), handle: collection },
      );
      return (data.collection?.products.nodes ?? []).map(toProduct);
    }
    const data = await shopifyFetch<{ products: { nodes: GqlProduct[] } }>(
      /* GraphQL */ `
        query Products(${ctxArgs}) ${inContext} {
          products(first: 50) { nodes { ${PRODUCT_FIELDS} } }
        }
      `,
      ctxVars(locale),
    );
    return data.products.nodes.map(toProduct);
  },

  async getProduct(handle, locale) {
    const data = await shopifyFetch<{ product: GqlProduct | null }>(
      /* GraphQL */ `
        query Product(${ctxArgs}, $handle: String!) ${inContext} {
          product(handle: $handle) { ${PRODUCT_FIELDS} }
        }
      `,
      { ...ctxVars(locale), handle },
    );
    return data.product ? toProduct(data.product) : null;
  },
};
