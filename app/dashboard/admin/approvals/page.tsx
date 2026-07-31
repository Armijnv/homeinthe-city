import type { Metadata } from "next";
import {
  BackToDashboard,
  DashboardShell,
  DataTable,
  TableLink,
} from "@/app/dashboard/dashboard-ui";
import { requireAdmin } from "@/app/lib/dashboard";
import { client } from "@/sanity/lib/client";
import { changedSnapshotFields } from "@/sanity/lib/providerSubmissionApproval";
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
  return fields.join(", ");
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
      <BackToDashboard />
      {error ? (
        <p className="mb-6 rounded-xl border border-red-300/40 bg-red-950/30 p-4 text-sm text-red-100">
          {error}
        </p>
      ) : null}
      <DataTable
        headers={[
          "Provider",
          "Submitted",
          "Changes",
          "Draft",
          "Approve",
          "Reject",
        ]}
      >
        {submissions.map((submission) => (
          <tr key={submission._id}>
            <td className="px-5 py-4">
              <div className="font-medium text-white">
                {submission.provider?.name || submission.ownerEmail || "Provider"}
              </div>
              <div className="mt-1 text-xs text-stone-400">{submission.ownerEmail}</div>
            </td>
            <td className="px-5 py-4">{formatDate(submission.submittedAt)}</td>
            <td className="px-5 py-4">{changeSummary(submission.profileSnapshot)}</td>
            <td className="px-5 py-4">
              <TableLink
                href={`/dashboard/admin/approvals/${encodeURIComponent(submission._id)}`}
              >
                View draft
              </TableLink>
            </td>
            <td className="px-5 py-4">
              <form action={approveProviderSubmissionAction}>
                <input type="hidden" name="submissionId" value={submission._id} />
                <input
                  type="hidden"
                  name="returnTo"
                  value="/dashboard/admin/approvals"
                />
                <button
                  type="submit"
                  className="rounded-lg border border-white/15 px-3 py-2 text-sm text-white transition hover:border-[#d6a85a] hover:text-[#d6a85a]"
                >
                  Approve
                </button>
              </form>
            </td>
            <td className="px-5 py-4">
              <form action={rejectProviderSubmissionAction} className="space-y-2">
                <input type="hidden" name="submissionId" value={submission._id} />
                <input
                  name="reviewNote"
                  placeholder="Optional note"
                  className="w-full rounded-lg border border-white/15 bg-white/10 px-3 py-2 text-sm text-white placeholder:text-stone-400"
                />
                <button
                  type="submit"
                  className="rounded-lg border border-white/15 px-3 py-2 text-sm text-white transition hover:border-[#d6a85a] hover:text-[#d6a85a]"
                >
                  Reject
                </button>
              </form>
            </td>
          </tr>
        ))}
      </DataTable>
    </DashboardShell>
  );
}
