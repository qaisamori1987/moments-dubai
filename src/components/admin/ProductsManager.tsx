"use client";
import Link from "next/link";
import { useEffect, useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { bulkSetCategory, reorderProducts } from "@/app/admin/catalog-actions";
import type { RawCollection, RawProduct } from "@/lib/store/types";

export default function ProductsManager({
  products,
  collections,
}: {
  products: RawProduct[];
  collections: RawCollection[];
}) {
  const router = useRouter();
  const [items, setItems] = useState(products);
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [bulkHandle, setBulkHandle] = useState(collections[0]?.handle ?? "");
  const [pending, startTransition] = useTransition();
  const dragId = useRef<string | null>(null);

  // Re-sync from the server after a persisted change (order or categories).
  const sig = products.map((p) => `${p.id}:${p.collections.join("|")}`).join(",");
  useEffect(() => setItems(products), [sig]); // eslint-disable-line react-hooks/exhaustive-deps

  const q = query.trim().toLowerCase();
  const filtered = q
    ? items.filter(
        (p) =>
          p.title.en.toLowerCase().includes(q) ||
          p.title.ar.includes(query.trim()) ||
          p.collections.some((h) => h.includes(q)),
      )
    : items;
  const dragEnabled = q === "";

  function toggle(id: string) {
    setSelected((s) => {
      const n = new Set(s);
      n.has(id) ? n.delete(id) : n.add(id);
      return n;
    });
  }

  function onDrop(targetId: string) {
    const from = dragId.current;
    dragId.current = null;
    if (!from || from === targetId) return;
    const next = [...items];
    const fromIdx = next.findIndex((p) => p.id === from);
    const toIdx = next.findIndex((p) => p.id === targetId);
    if (fromIdx < 0 || toIdx < 0) return;
    const [moved] = next.splice(fromIdx, 1);
    next.splice(toIdx, 0, moved);
    setItems(next);
    startTransition(async () => {
      await reorderProducts(next.map((p) => p.id));
      router.refresh();
    });
  }

  function runBulk(mode: "add" | "remove") {
    const ids = [...selected];
    if (ids.length === 0 || !bulkHandle) return;
    startTransition(async () => {
      await bulkSetCategory(ids, bulkHandle, mode);
      setSelected(new Set());
      router.refresh();
    });
  }

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="font-display text-3xl text-charcoal">
          Products <span className="text-mocha">({items.length})</span>
        </h1>
        <Link href="/admin/products/new" className="rounded-full bg-burgundy px-4 py-2 text-sm text-ivory transition hover:opacity-90">
          + Add product
        </Link>
      </div>

      <input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search by name or category…"
        className="mt-4 w-full rounded-lg border border-blush/70 bg-white px-4 py-2.5 text-sm outline-none focus:border-rose"
      />

      {/* Bulk action bar */}
      {selected.size > 0 && (
        <div className="mt-3 flex flex-wrap items-center gap-2 rounded-xl border border-rose/50 bg-blush/20 px-3 py-2 text-sm">
          <span className="font-medium text-burgundy">{selected.size} selected</span>
          <select
            value={bulkHandle}
            onChange={(e) => setBulkHandle(e.target.value)}
            className="rounded-lg border border-blush/70 bg-white px-2 py-1.5 text-sm"
          >
            {collections.map((c) => (
              <option key={c.handle} value={c.handle}>{c.title.en}</option>
            ))}
          </select>
          <button onClick={() => runBulk("add")} disabled={pending} className="rounded-lg bg-burgundy px-3 py-1.5 text-ivory transition hover:opacity-90 disabled:opacity-50">Add to category</button>
          <button onClick={() => runBulk("remove")} disabled={pending} className="rounded-lg border border-burgundy/40 px-3 py-1.5 text-burgundy transition hover:bg-burgundy hover:text-ivory disabled:opacity-50">Remove from category</button>
          <button onClick={() => setSelected(new Set())} className="ms-auto text-mocha hover:text-burgundy">Clear</button>
        </div>
      )}

      <p className="mt-3 text-xs text-mocha">
        {dragEnabled ? "Drag the ⋮⋮ handle to reorder · " : "Clear search to reorder · "}
        Tick rows to bulk-assign categories.{pending && " Saving…"}
      </p>

      <div className="mt-2 divide-y divide-blush/40 rounded-xl border border-blush/40 bg-ivory">
        {filtered.map((p) => (
          <div
            key={p.id}
            draggable={dragEnabled}
            onDragStart={() => (dragId.current = p.id)}
            onDragOver={(e) => e.preventDefault()}
            onDrop={() => onDrop(p.id)}
            className="flex items-center gap-3 px-3 py-2"
          >
            <span className={`cursor-grab select-none text-mocha ${dragEnabled ? "" : "opacity-30"}`}>⋮⋮</span>
            <input type="checkbox" checked={selected.has(p.id)} onChange={() => toggle(p.id)} />
            <div className="h-12 w-10 shrink-0 overflow-hidden rounded bg-cream">
              {p.image && /* eslint-disable-next-line @next/next/no-img-element */ <img src={p.image} alt="" className="h-full w-full object-cover" />}
            </div>
            <div className="min-w-0 flex-1">
              <div className="line-clamp-1 text-sm font-medium text-charcoal">
                {p.title.en || "(untitled)"} {p.featured && <span className="text-gold">★</span>}
              </div>
              <div className="line-clamp-1 text-xs text-mocha">{p.collections.join(", ") || "no category"}</div>
            </div>
            <Link href={`/admin/products/${p.id}`} className="shrink-0 text-sm text-burgundy hover:underline">Edit</Link>
          </div>
        ))}
        {filtered.length === 0 && <div className="px-3 py-8 text-center text-sm text-mocha">No products match “{query}”.</div>}
      </div>
    </div>
  );
}
