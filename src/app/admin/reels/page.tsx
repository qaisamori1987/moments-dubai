import Link from "next/link";
import { requireAdmin } from "@/lib/auth/guard";
import { readCatalog } from "@/lib/store/catalog";

export const dynamic = "force-dynamic";

export default async function ReelsPage() {
  await requireAdmin();
  const { reels } = await readCatalog();

  return (
    <div>
      <h1 className="font-display text-3xl text-charcoal">Reels <span className="text-mocha">({reels.length})</span></h1>
      <p className="mt-1 text-sm text-mocha">Reels come from your Instagram export. Edit a reel’s categories, recipient and whether it plays inline on the homepage.</p>

      <div className="mt-6 grid grid-cols-3 gap-3 sm:grid-cols-4 lg:grid-cols-6">
        {reels.map((r) => (
          <Link
            key={r.id}
            href={`/admin/reels/${r.id}`}
            className="group rounded-xl border border-blush/50 bg-ivory p-1.5 transition hover:border-rose"
          >
            <div className="relative aspect-[9/16] w-full overflow-hidden rounded-lg bg-cream">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={r.poster} alt="" className="h-full w-full object-cover" />
              {r.featured && (
                <span className="absolute end-1 top-1 rounded-full bg-gold/90 px-1.5 py-0.5 text-[9px] text-ivory">★</span>
              )}
            </div>
            <div className="mt-1 line-clamp-1 px-0.5 text-[11px] text-mocha">{r.collections[0] ?? "—"}</div>
          </Link>
        ))}
      </div>
    </div>
  );
}
