import { requireAdmin } from "@/lib/auth/guard";
import ProductForm from "@/components/admin/ProductForm";
import { readCatalog } from "@/lib/store/catalog";

export const dynamic = "force-dynamic";

export default async function NewProductPage() {
  await requireAdmin();
  const { collections } = await readCatalog();
  return (
    <div>
      <h1 className="mb-6 font-display text-3xl text-charcoal">Add product</h1>
      <ProductForm collections={collections} />
    </div>
  );
}
