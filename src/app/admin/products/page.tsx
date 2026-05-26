import ProductsManager from "@/components/admin/ProductsManager";
import { requireAdmin } from "@/lib/auth/guard";
import { readCatalog } from "@/lib/store/catalog";

export const dynamic = "force-dynamic";

export default async function ProductsPage() {
  await requireAdmin();
  const { products, collections } = await readCatalog();
  return <ProductsManager products={products} collections={collections} />;
}
