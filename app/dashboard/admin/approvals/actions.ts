"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireAdmin } from "@/app/lib/dashboard";
import { client } from "@/sanity/lib/client";
import { assertSanityWriteToken, writeClient } from "@/sanity/lib/writeClient";
import {
  providerApprovalRevisionMessage,
  providerApprovalRevisionStatus,
  providerPatchFromSnapshot,
  publishedId,
} from "@/sanity/lib/providerSubmissionApproval";

type ProviderSubmissionForAction = {
  _id?: string;
  status?: string;
  provider?: {
    _ref?: string;
    _id?: string;
    _rev?: string;
  };
  baselineProviderRevision?: string;
  profileSnapshot?: Record<string, unknown>;
};

async function fetchSubmission(submissionId: string) {
  return client.fetch<ProviderSubmissionForAction | null>(
    `*[_type == "providerSubmission" && _id == $submissionId][0]{
      _id,
      status,
      baselineProviderRevision,
      provider->{_id, _rev},
      profileSnapshot
    }`,
    { submissionId },
  );
}

function reviewerLabel(email?: string) {
  return email || "Dashboard admin";
}

function approvalReturnPath(formData: FormData, submissionId: string) {
  const requestedPath = String(formData.get("returnTo") || "");
  const detailPath = `/dashboard/admin/approvals/${encodeURIComponent(submissionId)}`;
  const activityPath = `/dashboard/admin/activity/${encodeURIComponent(`approval:${submissionId}`)}`;

  if (requestedPath === detailPath) return detailPath;
  if (requestedPath === activityPath) return activityPath;
  return "/dashboard/admin/approvals";
}

function redirectApprovalError(returnPath: string, message: string): never {
  const separator = returnPath.includes("?") ? "&" : "?";
  redirect(`${returnPath}${separator}error=${encodeURIComponent(message)}`);
}

function isRevisionConflict(error: unknown) {
  if (!error || typeof error !== "object") return false;

  const candidate = error as { message?: string; statusCode?: number };
  return (
    candidate.statusCode === 409 ||
    candidate.message?.toLowerCase().includes("revision") === true
  );
}

export async function approveProviderSubmissionAction(formData: FormData) {
  const context = await requireAdmin("/dashboard/admin/approvals");
  assertSanityWriteToken();

  const submissionId = publishedId(String(formData.get("submissionId") || ""));
  if (!submissionId) return;
  const returnPath = approvalReturnPath(formData, submissionId);

  const submission = await fetchSubmission(submissionId);
  const providerId = submission?.provider?._id;
  const currentProviderRevision = submission?.provider?._rev;
  const providerPatch = providerPatchFromSnapshot(submission?.profileSnapshot);

  if (!submission || submission.status !== "review" || !providerId || !providerPatch) {
    return;
  }

  const revisionStatus = providerApprovalRevisionStatus(
    submission.baselineProviderRevision,
    currentProviderRevision,
  );

  if (revisionStatus !== "ready") {
    redirectApprovalError(
      returnPath,
      providerApprovalRevisionMessage(revisionStatus),
    );
  }
  const baselineProviderRevision = submission.baselineProviderRevision;

  if (!baselineProviderRevision) return;

  try {
    await writeClient
      .transaction()
      .patch(providerId, (patch) =>
        patch
          .ifRevisionId(baselineProviderRevision)
          .set(providerPatch),
      )
      .patch(submissionId, {
        set: {
          status: "approved",
          reviewedAt: new Date().toISOString(),
          reviewedBy: reviewerLabel(context.signedInEmail),
        },
      })
      .commit();
  } catch (error) {
    if (isRevisionConflict(error)) {
      redirectApprovalError(
        returnPath,
        providerApprovalRevisionMessage("provider-changed"),
      );
    }

    throw error;
  }

  revalidatePath("/dashboard/admin/approvals");
  revalidatePath("/dashboard/admin");
  revalidatePath("/dashboard/admin/activity");
  revalidatePath(returnPath);
  redirect(returnPath);
}

export async function rejectProviderSubmissionAction(formData: FormData) {
  const context = await requireAdmin("/dashboard/admin/approvals");
  assertSanityWriteToken();

  const submissionId = publishedId(String(formData.get("submissionId") || ""));
  if (!submissionId) return;
  const returnPath = approvalReturnPath(formData, submissionId);

  const reviewNote =
    String(formData.get("reviewNote") || "").trim() || "Rejected without a note.";

  await writeClient.patch(submissionId).set({
    status: "rejected",
    reviewedAt: new Date().toISOString(),
    reviewedBy: reviewerLabel(context.signedInEmail),
    reviewNote,
  }).commit();

  revalidatePath("/dashboard/admin/approvals");
  revalidatePath("/dashboard/admin");
  revalidatePath("/dashboard/admin/activity");
  revalidatePath(returnPath);
  redirect(returnPath);
}
