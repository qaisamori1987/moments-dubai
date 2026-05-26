import Link from "next/link";
import { saveProduct } from "@/app/admin/catalog-actions";
import type { RawCollection, RawProduct } from "@/lib/store/types";

const input = "w-full rounded-lg border border-blush/70 bg-white px-3 py-2 text-sm outline-none focus:border-rose";
const label = "block text-xs font-medium uppercase tracking-wide text-mocha";

export default function ProductForm({
  product,
  collections,
}: {
  product?: RawProduct;
  collections: RawCollection[];
}) {
  const p = product;
  return (
    <form action={saveProduct} className="space-y-6">
      <input type="hidden" name="id" defaultValue={p?.id ?? ""} />

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className={label} htmlFor="titleEn">Title (English)</label>
          <input id="titleEn" name="titleEn" required defaultValue={p?.title.en ?? ""} className={input} />
        </div>
        <div>
          <label className={label} htmlFor="titleAr">Title (Arabic)</label>
          <input id="titleAr" name="titleAr" dir="rtl" defaultValue={p?.title.ar ?? ""} className={input} />
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className={label} htmlFor="descEn">Description (English)</label>
          <textarea id="descEn" name="descEn" rows={3} defaultValue={p?.description.en ?? ""} className={input} />
        </div>
        <div>
          <label className={label} htmlFor="descAr">Description (Arabic)</label>
          <textarea id="descAr" name="descAr" dir="rtl" rows={3} defaultValue={p?.description.ar ?? ""} className={input} />
        </div>
      </div>

      <div>
        <span className={label}>Image</span>
        <div className="mt-2 flex items-center gap-4">
          {p?.image ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={p.image} alt="" className="h-24 w-20 rounded-lg object-cover ring-1 ring-blush/60" />
          ) : (
            <div className="grid h-24 w-20 place-items-center rounded-lg bg-cream text-xs text-mocha">none</div>
          )}
          <div className="space-y-2 text-sm">
            <input type="file" name="imageFile" accept="image/*" className="block text-sm text-mocha" />
            {p?.image && (
              <label className="flex items-center gap-2 text-xs text-mocha">
                <input type="checkbox" name="imageCleared" value="1" /> remove current image
              </label>
            )}
          </div>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <div>
          <label className={label} htmlFor="price">Price (AED — hidden on site)</label>
          <input id="price" name="price" type="number" min="0" step="1" defaultValue={p?.price ?? 0} className={input} />
        </div>
        <div>
          <label className={label} htmlFor="swatch">Fallback colour</label>
          <input id="swatch" name="swatch" type="color" defaultValue={p?.swatch ?? "#f5ede3"} className="mt-1 h-9 w-16 rounded border border-blush/70 bg-white" />
        </div>
        <div>
          <span className={label}>Recipient</span>
          <div className="mt-2 flex gap-4 text-sm text-charcoal">
            {["girl", "boy"].map((t) => (
              <label key={t} className="flex items-center gap-2 capitalize">
                <input type="checkbox" name="tags" value={t} defaultChecked={p?.tags.includes(t)} /> {t}
              </label>
            ))}
          </div>
        </div>
      </div>

      <div>
        <span className={label}>Categories</span>
        <div className="mt-2 grid grid-cols-2 gap-2 sm:grid-cols-3">
          {collections.map((c) => (
            <label key={c.handle} className="flex items-center gap-2 rounded-lg border border-blush/50 px-3 py-2 text-sm">
              <input type="checkbox" name="collections" value={c.handle} defaultChecked={p?.collections.includes(c.handle)} />
              {c.title.en}
            </label>
          ))}
        </div>
      </div>

      <label className="flex items-center gap-2 text-sm text-charcoal">
        <input type="checkbox" name="featured" defaultChecked={p?.featured} /> Show in homepage featured row
      </label>

      <div className="flex gap-3 pt-2">
        <button type="submit" className="rounded-lg bg-burgundy px-5 py-2.5 text-sm text-ivory transition hover:opacity-90">
          {p ? "Save changes" : "Create product"}
        </button>
        <Link href="/admin/products" className="rounded-lg border border-blush/70 px-5 py-2.5 text-sm text-mocha transition hover:text-burgundy">
          Cancel
        </Link>
      </div>
    </form>
  );
}
