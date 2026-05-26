import { notFound } from "next/navigation";
import ProductForm from "@/components/admin/ProductForm";
import { deleteProduct } from "@/app/admin/catalog-actions";
import { requireAdmin } from "@/lib/auth/guard";
import { readCatalog } from "@/lib/store/catalog";

export const dynamic = "force-dynamic";

export default async function EditProductPage({ params }: PageProps<"/admin/products/[id]">) {
  await requireAdmin();
  const { id } = await params;
  const { products, collections } = await readCatalog();
  const product = products.find((p) => p.id === id);
  if (!product) notFound();

  return (
    <div>
      <h1 className="mb-6 font-display text-3xl text-charcoal">Edit product</h1>
      <ProductForm product={product} collections={collections} />

      <form action={deleteProduct} className="mt-10 border-t border-blush/50 pt-6">
        <input type="hidden" name="id" defaultValue={product.id} />
        <button className="rounded-lg border border-burgundy/40 px-4 py-2 text-sm text-burgundy transition hover:bg-burgundy hover:text-ivory">
          Delete this product
        </button>
      </form>
    </div>
  );
}
