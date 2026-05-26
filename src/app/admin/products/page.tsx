import Link from "next/link";
import { requireAdmin } from "@/lib/auth/guard";
import { readCatalog } from "@/lib/store/catalog";

export const dynamic = "force-dynamic";

export default async function ProductsPage() {
  await requireAdmin();
  const { products } = await readCatalog();

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="font-display text-3xl text-charcoal">Products <span className="text-mocha">({products.length})</span></h1>
        <Link href="/admin/products/new" className="rounded-full bg-burgundy px-4 py-2 text-sm text-ivory transition hover:opacity-90">
          + Add product
        </Link>
      </div>

      <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
        {products.map((p) => (
          <Link
            key={p.id}
            href={`/admin/products/${p.id}`}
            className="group rounded-2xl border border-blush/50 bg-ivory p-2 transition hover:border-rose hover:shadow-sm"
          >
            <div className="relative aspect-[4/5] w-full overflow-hidden rounded-xl bg-cream">
              {p.image ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={p.image} alt="" className="h-full w-full object-cover" />
              ) : (
                <span className="grid h-full w-full place-items-center text-xs text-mocha">no image</span>
              )}
              {p.featured && (
                <span className="absolute end-1 top-1 rounded-full bg-gold/90 px-2 py-0.5 text-[10px] text-ivory">★ featured</span>
              )}
            </div>
            <div className="mt-2 line-clamp-1 text-sm font-medium text-charcoal">{p.title.en || "(untitled)"}</div>
            <div className="line-clamp-1 text-xs text-mocha">{p.collections.join(", ") || "no category"}</div>
          </Link>
        ))}
      </div>
    </div>
  );
}
