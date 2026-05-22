"use client";

import type { DocumentActionComponent } from "sanity";
import { useClient, useCurrentUser } from "sanity";
import { apiVersion } from "../env";

type ReferenceValue = {
  _ref?: string;
};

type ProviderSubmissionDocument = {
  _id?: string;
  _type?: string;
  status?: string;
  provider?: ReferenceValue;
  profileSnapshot?: Record<string, unknown>;
};

const allowedProfileSnapshotFields = [
  "name",
  "slug",
  "roles",
  "primaryRole",
  "cities",
  "languages",
  "headline_en",
  "headline_pt",
  "headline_nl",
  "intro_en",
  "intro_pt",
  "intro_nl",
  "about_en",
  "about_pt",
  "about_nl",
  "contactOptions",
  "mainPhoto",
] as const;

function publishedId(id?: string) {
  return id?.replace(/^drafts\./, "");
}

function definedOnly(value: unknown): unknown {
  if (Array.isArray(value)) {
    return value.map(definedOnly);
  }

  if (value && typeof value === "object") {
    return Object.fromEntries(
      Object.entries(value)
        .filter(([, entryValue]) => entryValue !== undefined)
        .map(([entryKey, entryValue]) => [entryKey, definedOnly(entryValue)]),
    );
  }

  return value;
}

function providerPatchFromSnapshot(snapshot?: Record<string, unknown>) {
  if (!snapshot) return null;

  const providerPatch: Record<string, unknown> = {};

  allowedProfileSnapshotFields.forEach((fieldName) => {
    if (Object.hasOwn(snapshot, fieldName)) {
      providerPatch[fieldName] = definedOnly(snapshot[fieldName]);
    }
  });

  return Object.keys(providerPatch).length ? providerPatch : null;
}

function reviewerName(user: ReturnType<typeof useCurrentUser>) {
  if (!user) return "Sanity Studio";

  const studioUser = user as {
    email?: string;
    name?: string;
    id?: string;
  };

  return studioUser.email || studioUser.name || studioUser.id || "Sanity Studio";
}

export const ApproveProviderSubmissionAction: DocumentActionComponent = (props) => {
  const client = useClient({ apiVersion });
  const currentUser = useCurrentUser();
  const document = (props.draft ||
    props.published ||
    props.version) as ProviderSubmissionDocument | null;
  const status = document?.status;
  const disabled = status !== "review";

  if (props.type !== "providerSubmission") return null;

  return {
    label: "Approve provider edits",
    disabled,
    title: disabled
      ? "Only provider submissions in review can be approved."
      : undefined,
    onHandle: async () => {
      const submissionId = publishedId(document?._id || props.id);
      const providerId = document?.provider?._ref;
      const providerPatch = providerPatchFromSnapshot(document?.profileSnapshot);

      if (!submissionId || !providerId || !providerPatch) {
        window.alert("This submission is missing a provider or profile snapshot.");
        return;
      }

      await client
        .transaction()
        .patch(providerId, {
          set: providerPatch,
        })
        .patch(submissionId, {
          set: {
            status: "approved",
            reviewedAt: new Date().toISOString(),
            reviewedBy: reviewerName(currentUser),
          },
        })
        .commit();

      props.onComplete();
    },
  };
};

ApproveProviderSubmissionAction.displayName = "ApproveProviderSubmissionAction";

export const RejectProviderSubmissionAction: DocumentActionComponent = (props) => {
  const client = useClient({ apiVersion });
  const currentUser = useCurrentUser();
  const document = (props.draft ||
    props.published ||
    props.version) as ProviderSubmissionDocument | null;
  const status = document?.status;
  const disabled = status !== "review";

  if (props.type !== "providerSubmission") return null;

  return {
    label: "Reject provider edits",
    disabled,
    title: disabled
      ? "Only provider submissions in review can be rejected."
      : undefined,
    onHandle: async () => {
      const submissionId = publishedId(document?._id || props.id);
      const reviewNote = window.prompt("Review note");

      if (!submissionId || reviewNote === null) return;

      await client
        .patch(submissionId)
        .set({
          status: "rejected",
          reviewedAt: new Date().toISOString(),
          reviewedBy: reviewerName(currentUser),
          reviewNote: reviewNote.trim() || "Rejected without a note.",
        })
        .commit();

      props.onComplete();
    },
  };
};

RejectProviderSubmissionAction.displayName = "RejectProviderSubmissionAction";
