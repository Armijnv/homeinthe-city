import type { Metadata } from "next";
import {
  DashboardBackLink,
  DashboardShell,
  TableLink,
} from "@/app/dashboard/dashboard-ui";
import { requireAdmin } from "@/app/lib/dashboard";
import { client } from "@/sanity/lib/client";
import { changedSnapshotFields } from "@/sanity/lib/providerSubmissionApproval";
import { providerChangeFieldLabel } from "@/app/lib/providerChangePresentation";
import {
  approveProviderSubmissionAction,
  rejectProviderSubmissionAction,
} from "./actions";

type ProviderSubmission = {
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

type PageProps = {
  searchParams: Promise<{ error?: string }>;
};

const pendingProviderSubmissionsQuery = `
  *[_type == "providerSubmission" && status == "review"]|order(submittedAt desc){
    _id,
    submittedAt,
    ownerEmail,
    status,
    provider->{
      name,
      slug
    },
    profileSnapshot
  }
`;

export const metadata: Metadata = {
  title: "Approval Center",
};

function formatDate(value?: string) {
  if (!value) return "No date";
  return new Intl.DateTimeFormat("en", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}

function changeSummary(snapshot?: Record<string, unknown>) {
  const fields = changedSnapshotFields(snapshot);
  if (!fields.length) return "No editable fields detected";
  return fields.map(providerChangeFieldLabel).join(", ");
}

export default async function ApprovalCenterPage({ searchParams }: PageProps) {
  await requireAdmin("/dashboard/admin/approvals");
  const [{ error }, submissions] = await Promise.all([
    searchParams,
    client.fetch<ProviderSubmission[]>(pendingProviderSubmissionsQuery),
  ]);

  return (
    <DashboardShell
      eyebrow="Admin"
      title="Approval Center"
      intro="Review pending provider profile edits and approve or reject them without opening Sanity Studio."
    >
      <DashboardBackLink href="/dashboard/admin" label="Admin workspace" />
      {error ? (
        <p className="mb-6 rounded-xl border border-red-300/40 bg-red-950/30 p-4 text-sm text-red-100">
          {error}
        </p>
      ) : null}
      <div className="grid gap-4 lg:grid-cols-2">
        {submissions.map((submission) => (
          <article key={submission._id} className="rounded-xl border border-white/10 bg-white/5 p-4 sm:p-5">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
              <div className="font-medium text-white">
                {submission.provider?.name || submission.ownerEmail || "Provider"}
              </div>
              <div className="mt-1 text-xs text-stone-400">{submission.ownerEmail}</div>
              </div>
              <span className="text-xs text-stone-400">{formatDate(submission.submittedAt)}</span>
            </div>
            <p className="mt-4 text-sm leading-6 text-stone-200"><span className="text-stone-500">Changed: </span>{changeSummary(submission.profileSnapshot)}</p>
            <div className="mt-4 flex flex-wrap gap-3 border-t border-white/10 pt-4">
              <TableLink href={`/dashboard/admin/approvals/${encodeURIComponent(submission._id)}`}>Review changes</TableLink>
              <form action={approveProviderSubmissionAction}>
                <input type="hidden" name="submissionId" value={submission._id} />
                <input
                  type="hidden"
                  name="returnTo"
                  value="/dashboard/admin/approvals"
                />
                <button
                  type="submit"
                  className="min-h-11 rounded-lg bg-[#d6a85a] px-4 py-2 text-sm font-semibold text-[#1a1f2e]"
                >
                  Approve
                </button>
              </form>
            </div>
              <form action={rejectProviderSubmissionAction} className="mt-3 grid gap-2 sm:grid-cols-[minmax(0,1fr)_auto]">
                <input type="hidden" name="submissionId" value={submission._id} />
                <input
                  name="reviewNote"
                  placeholder="Optional note"
                  className="min-h-11 min-w-0 rounded-lg border border-white/15 bg-white/10 px-3 py-2 text-sm text-white placeholder:text-stone-400"
                />
                <button
                  type="submit"
                  className="min-h-11 rounded-lg border border-white/15 px-4 py-2 text-sm text-white transition hover:border-[#d6a85a] hover:text-[#d6a85a]"
                >
                  Reject
                </button>
              </form>
          </article>
        ))}
      </div>
      {!submissions.length ? <p className="rounded-xl border border-white/10 bg-white/5 p-5 text-stone-300">No provider edits are awaiting approval.</p> : null}
    </DashboardShell>
  );
}
