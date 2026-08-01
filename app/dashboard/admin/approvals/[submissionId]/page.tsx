import type { Metadata } from "next";
import { notFound } from "next/navigation";
import {
  DashboardBackLink,
  DashboardShell,
} from "@/app/dashboard/dashboard-ui";
import { activityFieldLabel, humanActivityValue } from "@/app/lib/activityPresentation";
import { requireAdmin } from "@/app/lib/dashboard";
import { client } from "@/sanity/lib/client";
import {
  changedSnapshotFields,
  publishedId,
} from "@/sanity/lib/providerSubmissionApproval";
import {
  approveProviderSubmissionAction,
  rejectProviderSubmissionAction,
} from "../actions";

type PageProps = {
  params: Promise<{
    submissionId: string;
  }>;
  searchParams: Promise<{ error?: string }>;
};

type ProviderSubmissionDetail = {
  _id: string;
  submittedAt?: string;
  ownerEmail?: string;
  status?: string;
  provider?: {
    name?: string;
    slug?: {
      current?: string;
    };
  } | null;
  profileSnapshot?: Record<string, unknown>;
};

const providerSubmissionDetailQuery = `
  *[_type == "providerSubmission" && _id == $submissionId][0]{
    _id,
    submittedAt,
    ownerEmail,
    status,
    provider->{name, slug},
    profileSnapshot
  }
`;

export const metadata: Metadata = {
  title: "Provider Submission Draft",
};

function referenceIds(value: unknown, ids = new Set<string>()) {
  if (Array.isArray(value)) value.forEach((entry) => referenceIds(entry, ids));
  else if (value && typeof value === "object") {
    const record = value as Record<string, unknown>;
    if (typeof record._ref === "string") ids.add(record._ref);
    Object.values(record).forEach((entry) => referenceIds(entry, ids));
  }
  return ids;
}

export default async function ProviderSubmissionDraftPage({
  params,
  searchParams,
}: PageProps) {
  const [{ submissionId }, { error }] = await Promise.all([params, searchParams]);
  await requireAdmin(`/dashboard/admin/approvals/${submissionId}`);
  const id = publishedId(decodeURIComponent(submissionId));

  if (!id) notFound();

  const submission = await client.fetch<ProviderSubmissionDetail | null>(
    providerSubmissionDetailQuery,
    { submissionId: id },
  );

  if (!submission) notFound();

  const fields = changedSnapshotFields(submission.profileSnapshot);
  const ids = [...referenceIds(submission.profileSnapshot)];
  const referencedRecords = ids.length ? await client.fetch<Array<{ _id: string; name?: string }>>(
    `*[_id in $ids]{_id, "name": coalesce(name, name_en, name_pt, name_nl, title_en, title_pt, title_nl, originalFilename)}`,
    { ids },
  ) : [];
  const references = Object.fromEntries(referencedRecords.map((record) => [record._id, { name: record.name || "Linked item" }]));

  return (
    <DashboardShell
      eyebrow="Admin"
      title={submission.provider?.name || submission.ownerEmail || "Provider draft"}
      intro="Inspect the submitted provider profile snapshot before approving or rejecting it."
    >
      <div className="mb-8 flex flex-wrap gap-3">
        <DashboardBackLink
          href="/dashboard/admin/approvals"
          label="Provider approvals"
        />
      </div>

      {error ? (
        <p className="mb-6 rounded-xl border border-red-300/40 bg-red-950/30 p-4 text-sm text-red-100">
          {error}
        </p>
      ) : null}

      {submission.status === "review" ? (
        <section className="mb-8 flex flex-wrap gap-3 rounded-2xl border border-white/10 bg-white/10 p-6">
          <form action={approveProviderSubmissionAction}>
            <input type="hidden" name="submissionId" value={submission._id} />
            <input
              type="hidden"
              name="returnTo"
              value={`/dashboard/admin/approvals/${encodeURIComponent(submission._id)}`}
            />
            <button
              type="submit"
              className="rounded-lg border border-white/15 px-4 py-3 text-sm text-white transition hover:border-[#d6a85a] hover:text-[#d6a85a]"
            >
              Approve
            </button>
          </form>
          <form action={rejectProviderSubmissionAction} className="grid w-full gap-3 sm:w-auto sm:grid-cols-[minmax(12rem,1fr)_auto]">
            <input type="hidden" name="submissionId" value={submission._id} />
            <input
              name="reviewNote"
              placeholder="Optional rejection note"
              className="min-h-11 min-w-0 rounded-lg border border-white/15 bg-white/10 px-4 py-3 text-sm text-white placeholder:text-stone-400"
            />
            <button
              type="submit"
              className="rounded-lg border border-white/15 px-4 py-3 text-sm text-white transition hover:border-[#d6a85a] hover:text-[#d6a85a]"
            >
              Reject
            </button>
          </form>
        </section>
      ) : null}

      <section className="grid gap-3">
        {fields.map((field) => (
          <article key={field} className="rounded-xl border border-white/10 bg-white/5 p-4 sm:p-5">
            <h2 className="font-medium text-white">{activityFieldLabel(field)}</h2>
            <p className="mt-2 whitespace-pre-wrap break-words text-sm leading-6 text-stone-200">{humanActivityValue(submission.profileSnapshot?.[field], references)}</p>
          </article>
        ))}
      </section>
    </DashboardShell>
  );
}
