import { contentProvider } from "./content";
import { shopifyProvider } from "./shopify";
import type { CommerceProvider } from "./types";

const useShopify =
  !!process.env.SHOPIFY_STORE_DOMAIN &&
  !!process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN;

/**
 * The one import the storefront uses: `import { commerce } from "@/lib/commerce"`.
 *
 * Default = local JSON content (src/content/*.json), editable without code.
 * When the backoffice exists, add an `apiProvider` and select it here — the
 * rest of the app is unaffected.
 */
export const commerce: CommerceProvider = useShopify ? shopifyProvider : contentProvider;

export const usingLocalContent = !useShopify;

export type * from "./types";
