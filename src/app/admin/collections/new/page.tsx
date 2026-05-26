import { requireAdmin } from "@/lib/auth/guard";
import CollectionForm from "@/components/admin/CollectionForm";

export const dynamic = "force-dynamic";

export default async function NewCollectionPage() {
  await requireAdmin();
  return (
    <div>
      <h1 className="mb-6 font-display text-3xl text-charcoal">Add category</h1>
      <CollectionForm />
    </div>
  );
}
