import { client } from "@/sanity/lib/client";

export default async function StudioDraftNotice({ documentId }: { documentId?: string }) {
  if (!documentId) return null;
  const hasDraft = await client.fetch<boolean>(`count(*[_id == "drafts." + $documentId]) > 0`, { documentId });
  return hasDraft ? <p className="mb-6 rounded-xl border border-amber-300/40 bg-amber-950/30 p-4 text-sm leading-6 text-amber-50">A Sanity Studio draft also exists for this record. Dashboard changes affect the published version and do not update that draft.</p> : null;
}
