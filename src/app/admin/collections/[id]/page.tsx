import { notFound } from "next/navigation";
import CollectionForm from "@/components/admin/CollectionForm";
import { deleteCollection } from "@/app/admin/catalog-actions";
import { requireAdmin } from "@/lib/auth/guard";
import { readCatalog } from "@/lib/store/catalog";

export const dynamic = "force-dynamic";

export default async function EditCollectionPage({ params }: PageProps<"/admin/collections/[id]">) {
  await requireAdmin();
  const { id } = await params;
  const { collections } = await readCatalog();
  const collection = collections.find((c) => c.id === id);
  if (!collection) notFound();

  return (
    <div>
      <h1 className="mb-6 font-display text-3xl text-charcoal">Edit category</h1>
      <CollectionForm collection={collection} />

      <form action={deleteCollection} className="mt-10 border-t border-blush/50 pt-6">
        <input type="hidden" name="id" defaultValue={collection.id} />
        <button className="rounded-lg border border-burgundy/40 px-4 py-2 text-sm text-burgundy transition hover:bg-burgundy hover:text-ivory">
          Delete this category
        </button>
        <p className="mt-2 text-xs text-mocha">Products keep existing; they’re just removed from this category.</p>
      </form>
    </div>
  );
}
