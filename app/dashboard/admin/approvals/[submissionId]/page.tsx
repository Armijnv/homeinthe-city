import type { Metadata } from "next";
import { notFound } from "next/navigation";
import {
  BackToDashboard,
  DashboardShell,
  DataTable,
  TableLink,
} from "@/app/dashboard/dashboard-ui";
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

function displayValue(value: unknown) {
  if (value === null || value === undefined) return "Empty";
  if (typeof value === "string") return value || "Empty";
  return JSON.stringify(value, null, 2);
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

  return (
    <DashboardShell
      eyebrow="Admin"
      title={submission.provider?.name || submission.ownerEmail || "Provider draft"}
      intro="Inspect the submitted provider profile snapshot before approving or rejecting it."
    >
      <div className="mb-8 flex flex-wrap gap-3">
        <BackToDashboard />
        <TableLink href="/dashboard/admin/approvals">Back to approvals</TableLink>
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
          <form action={rejectProviderSubmissionAction} className="flex flex-wrap gap-3">
            <input type="hidden" name="submissionId" value={submission._id} />
            <input
              name="reviewNote"
              placeholder="Optional rejection note"
              className="rounded-lg border border-white/15 bg-white/10 px-4 py-3 text-sm text-white placeholder:text-stone-400"
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

      <DataTable headers={["Field", "Submitted value"]}>
        {fields.map((field) => (
          <tr key={field}>
            <td className="px-5 py-4 font-medium text-white">{field}</td>
            <td className="px-5 py-4">
              <pre className="max-w-xl whitespace-pre-wrap rounded-lg bg-black/20 p-3 text-xs text-stone-200">
                {displayValue(submission.profileSnapshot?.[field])}
              </pre>
            </td>
          </tr>
        ))}
      </DataTable>
    </DashboardShell>
  );
}
