import Link from "next/link";
import { saveCollection } from "@/app/admin/catalog-actions";
import type { RawCollection } from "@/lib/store/types";

const input = "w-full rounded-lg border border-blush/70 bg-white px-3 py-2 text-sm outline-none focus:border-rose";
const label = "block text-xs font-medium uppercase tracking-wide text-mocha";

export default function CollectionForm({ collection }: { collection?: RawCollection }) {
  const c = collection;
  return (
    <form action={saveCollection} className="space-y-6">
      <input type="hidden" name="id" defaultValue={c?.id ?? ""} />

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className={label} htmlFor="titleEn">Name (English)</label>
          <input id="titleEn" name="titleEn" required defaultValue={c?.title.en ?? ""} className={input} />
        </div>
        <div>
          <label className={label} htmlFor="titleAr">Name (Arabic)</label>
          <input id="titleAr" name="titleAr" dir="rtl" defaultValue={c?.title.ar ?? ""} className={input} />
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className={label} htmlFor="descEn">Description (English)</label>
          <textarea id="descEn" name="descEn" rows={2} defaultValue={c?.description.en ?? ""} className={input} />
        </div>
        <div>
          <label className={label} htmlFor="descAr">Description (Arabic)</label>
          <textarea id="descAr" name="descAr" dir="rtl" rows={2} defaultValue={c?.description.ar ?? ""} className={input} />
        </div>
      </div>

      <div className="flex items-end gap-6">
        <div>
          <span className={label}>Cover image</span>
          <div className="mt-2 flex items-center gap-4">
            {c?.image ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={c.image} alt="" className="h-20 w-20 rounded-lg object-cover ring-1 ring-blush/60" />
            ) : (
              <div className="grid h-20 w-20 place-items-center rounded-lg bg-cream text-xs text-mocha">none</div>
            )}
            <input type="file" name="imageFile" accept="image/*" className="text-sm text-mocha" />
          </div>
        </div>
        <div>
          <label className={label} htmlFor="swatch">Fallback colour</label>
          <input id="swatch" name="swatch" type="color" defaultValue={c?.swatch ?? "#e8c9c1"} className="mt-1 block h-9 w-16 rounded border border-blush/70 bg-white" />
        </div>
      </div>

      <div className="flex gap-3 pt-2">
        <button type="submit" className="rounded-lg bg-burgundy px-5 py-2.5 text-sm text-ivory transition hover:opacity-90">
          {c ? "Save changes" : "Create category"}
        </button>
        <Link href="/admin/collections" className="rounded-lg border border-blush/70 px-5 py-2.5 text-sm text-mocha transition hover:text-burgundy">
          Cancel
        </Link>
      </div>
    </form>
  );
}
