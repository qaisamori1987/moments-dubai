import Link from "next/link";
import { requireAdmin } from "@/lib/auth/guard";
import { readCatalog } from "@/lib/store/catalog";

export const dynamic = "force-dynamic";

export default async function CollectionsPage() {
  await requireAdmin();
  const { collections, products } = await readCatalog();
  const count = (handle: string) => products.filter((p) => p.collections.includes(handle)).length;

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="font-display text-3xl text-charcoal">Categories <span className="text-mocha">({collections.length})</span></h1>
        <Link href="/admin/collections/new" className="rounded-full bg-burgundy px-4 py-2 text-sm text-ivory transition hover:opacity-90">
          + Add category
        </Link>
      </div>

      <div className="mt-6 space-y-2">
        {collections.map((c) => (
          <Link
            key={c.id}
            href={`/admin/collections/${c.id}`}
            className="flex items-center gap-4 rounded-2xl border border-blush/50 bg-ivory p-3 transition hover:border-rose hover:shadow-sm"
          >
            <div className="h-14 w-14 shrink-0 overflow-hidden rounded-lg" style={{ background: c.swatch }}>
              {c.image && (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={c.image} alt="" className="h-full w-full object-cover" />
              )}
            </div>
            <div className="min-w-0 flex-1">
              <div className="font-medium text-charcoal">{c.title.en}</div>
              <div className="truncate text-xs text-mocha">/{c.handle} · {count(c.handle)} products</div>
            </div>
            <span className="text-sm text-mocha">Edit →</span>
          </Link>
        ))}
      </div>
    </div>
  );
}
