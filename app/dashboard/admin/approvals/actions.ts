"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireAdmin } from "@/app/lib/dashboard";
import { client } from "@/sanity/lib/client";
import { assertSanityWriteToken, writeClient } from "@/sanity/lib/writeClient";
import {
  providerPatchFromSnapshot,
  publishedId,
} from "@/sanity/lib/providerSubmissionApproval";

type ProviderSubmissionForAction = {
  _id?: string;
  status?: string;
  provider?: {
    _ref?: string;
  };
  profileSnapshot?: Record<string, unknown>;
};

async function fetchSubmission(submissionId: string) {
  return client.fetch<ProviderSubmissionForAction | null>(
    `*[_type == "providerSubmission" && _id == $submissionId][0]{
      _id,
      status,
      provider,
      profileSnapshot
    }`,
    { submissionId },
  );
}

function reviewerLabel(email?: string) {
  return email || "Dashboard admin";
}

export async function approveProviderSubmissionAction(formData: FormData) {
  const context = await requireAdmin("/dashboard/admin/approvals");
  assertSanityWriteToken();

  const submissionId = publishedId(String(formData.get("submissionId") || ""));
  if (!submissionId) return;

  const submission = await fetchSubmission(submissionId);
  const providerId = submission?.provider?._ref;
  const providerPatch = providerPatchFromSnapshot(submission?.profileSnapshot);

  if (!submission || submission.status !== "review" || !providerId || !providerPatch) {
    return;
  }

  await writeClient
    .transaction()
    .patch(providerId, {
      set: providerPatch,
    })
    .patch(submissionId, {
      set: {
        status: "approved",
        reviewedAt: new Date().toISOString(),
        reviewedBy: reviewerLabel(context.signedInEmail),
      },
    })
    .commit();

  revalidatePath("/dashboard/admin/approvals");
  redirect("/dashboard/admin/approvals");
}

export async function rejectProviderSubmissionAction(formData: FormData) {
  const context = await requireAdmin("/dashboard/admin/approvals");
  assertSanityWriteToken();

  const submissionId = publishedId(String(formData.get("submissionId") || ""));
  if (!submissionId) return;

  const reviewNote =
    String(formData.get("reviewNote") || "").trim() || "Rejected without a note.";

  await writeClient.patch(submissionId).set({
    status: "rejected",
    reviewedAt: new Date().toISOString(),
    reviewedBy: reviewerLabel(context.signedInEmail),
    reviewNote,
  }).commit();

  revalidatePath("/dashboard/admin/approvals");
  redirect("/dashboard/admin/approvals");
}
