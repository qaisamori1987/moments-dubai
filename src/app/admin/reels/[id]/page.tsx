import Link from "next/link";
import { notFound } from "next/navigation";
import { deleteReel, saveReel } from "@/app/admin/catalog-actions";
import { requireAdmin } from "@/lib/auth/guard";
import { readCatalog } from "@/lib/store/catalog";

export const dynamic = "force-dynamic";
const label = "block text-xs font-medium uppercase tracking-wide text-mocha";

export default async function EditReelPage({ params }: PageProps<"/admin/reels/[id]">) {
  await requireAdmin();
  const { id } = await params;
  const { reels, collections } = await readCatalog();
  const reel = reels.find((r) => r.id === id);
  if (!reel) notFound();

  return (
    <div className="grid gap-8 sm:grid-cols-[200px_1fr]">
      <div>
        <div className="aspect-[9/16] w-full overflow-hidden rounded-xl bg-cream ring-1 ring-blush/60">
          {reel.video ? (
            <video src={reel.video} poster={reel.poster} controls playsInline className="h-full w-full object-cover" />
          ) : (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={reel.poster} alt="" className="h-full w-full object-cover" />
          )}
        </div>
        <p className="mt-2 text-xs text-mocha">{reel.video ? "Plays inline (encoded)" : "Poster only · links to Instagram"}</p>
      </div>

      <div>
        <h1 className="mb-6 font-display text-3xl text-charcoal">Edit reel</h1>
        <form action={saveReel} className="space-y-6">
          <input type="hidden" name="id" defaultValue={reel.id} />

          <div>
            <span className={label}>Categories</span>
            <div className="mt-2 grid grid-cols-2 gap-2">
              {collections.map((c) => (
                <label key={c.handle} className="flex items-center gap-2 rounded-lg border border-blush/50 px-3 py-2 text-sm">
                  <input type="checkbox" name="collections" value={c.handle} defaultChecked={reel.collections.includes(c.handle)} />
                  {c.title.en}
                </label>
              ))}
            </div>
          </div>

          <div>
            <span className={label}>Recipient</span>
            <div className="mt-2 flex gap-4 text-sm text-charcoal">
              {["girl", "boy"].map((t) => (
                <label key={t} className="flex items-center gap-2 capitalize">
                  <input type="checkbox" name="tags" value={t} defaultChecked={reel.tags.includes(t)} /> {t}
                </label>
              ))}
            </div>
          </div>

          <label className="flex items-center gap-2 text-sm text-charcoal">
            <input type="checkbox" name="featured" defaultChecked={reel.featured} /> Featured (plays inline on homepage)
          </label>

          <div className="flex gap-3 pt-2">
            <button type="submit" className="rounded-lg bg-burgundy px-5 py-2.5 text-sm text-ivory transition hover:opacity-90">Save changes</button>
            <Link href="/admin/reels" className="rounded-lg border border-blush/70 px-5 py-2.5 text-sm text-mocha transition hover:text-burgundy">Cancel</Link>
          </div>
        </form>

        <form action={deleteReel} className="mt-10 border-t border-blush/50 pt-6">
          <input type="hidden" name="id" defaultValue={reel.id} />
          <button className="rounded-lg border border-burgundy/40 px-4 py-2 text-sm text-burgundy transition hover:bg-burgundy hover:text-ivory">
            Delete this reel
          </button>
        </form>
      </div>
    </div>
  );
}
