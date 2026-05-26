import Link from "next/link";
import { requireAdmin } from "@/lib/auth/guard";
import { readCatalog, storageBackend } from "@/lib/store/catalog";

export const dynamic = "force-dynamic";

export default async function AdminDashboard() {
  await requireAdmin();
  const { products, collections, reels } = await readCatalog();

  const cards = [
    { href: "/admin/products", label: "Products", count: products.length, hint: "Add, edit, delete & categorize" },
    { href: "/admin/collections", label: "Categories", count: collections.length, hint: "Create & manage category sections" },
    { href: "/admin/reels", label: "Reels", count: reels.length, hint: "Manage reel placement" },
  ];

  return (
    <div>
      <h1 className="font-display text-3xl text-charcoal">Dashboard</h1>
      <p className="mt-1 text-sm text-mocha">
        Storage: <span className="font-medium text-burgundy">{storageBackend}</span>
        {storageBackend === "filesystem" && " (local — edits write to src/content/*.json)"}
      </p>
      <div className="mt-8 grid gap-4 sm:grid-cols-3">
        {cards.map((c) => (
          <Link
            key={c.href}
            href={c.href}
            className="rounded-2xl border border-blush/60 bg-ivory p-6 transition hover:border-rose hover:shadow-sm"
          >
            <div className="font-display text-4xl text-burgundy">{c.count}</div>
            <div className="mt-2 font-medium text-charcoal">{c.label}</div>
            <div className="text-sm text-mocha">{c.hint}</div>
          </Link>
        ))}
      </div>
    </div>
  );
}
