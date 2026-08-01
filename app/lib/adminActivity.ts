import "server-only";

import { client } from "@/sanity/lib/client";

export type ActivityKind = "provider" | "city" | "property" | "approval";

export type ActivityChange = {
  field?: string;
  beforeValue?: string;
  afterValue?: string;
};

export type AdminActivity = {
  key: string;
  id: string;
  kind: ActivityKind;
  occurredAt?: string;
  actor: string;
  actorRole?: string;
  action: string;
  location: string;
  changeType?: string;
  description?: string;
  changes: ActivityChange[];
  status?: string;
  actorEmail?: string;
  actorUserId?: string;
};

type RawActivity = {
  _id: string;
  occurredAt?: string;
  actorName?: string;
  actorEmail?: string;
  actorUserId?: string;
  actorRole?: string;
  changeType?: string;
  description?: string;
  subjectName?: string;
  subjectRole?: string;
  location?: string;
  changes?: ActivityChange[];
  changedFields?: string[];
  status?: string;
  reviewedBy?: string;
  ownerEmail?: string;
  profileSnapshot?: Record<string, unknown>;
};

const activityQueries: Record<ActivityKind, string> = {
  provider: `*[_type == "providerChangeLog"] | order(changedAt desc){
    _id, "occurredAt": changedAt, actorName, actorEmail, actorUserId, actorRole, changeType,
    description, "subjectName": coalesce(providerName, provider->name),
    "subjectRole": provider->primaryRole, changes, changedFields
  }`,
  city: `*[_type == "cityChangeLog"] | order(changedAt desc){
    _id, "occurredAt": changedAt, actorName, actorEmail, actorUserId, actorRole, changeType,
    description, "location": coalesce(cityName, city->name_en, city->name_pt, city->name_nl),
    "subjectRole": provider->primaryRole, changes, changedFields
  }`,
  property: `*[_type == "propertyChangeLog"] | order(changedAt desc){
    _id, "occurredAt": changedAt, actorName, actorEmail, actorUserId, actorRole, changeType,
    "subjectName": coalesce(propertyTitle, property->title_en, property->title_pt, property->title_nl),
    "location": coalesce(property->city->name_en, property->city->name_pt, property->city->name_nl, property->cityName),
    changes, changedFields
  }`,
  approval: `*[_type == "providerSubmission"] | order(coalesce(reviewedAt, submittedAt) desc){
    _id, "occurredAt": coalesce(reviewedAt, submittedAt), status, reviewedBy, ownerEmail,
    "subjectName": coalesce(provider->name, ownerEmail), "subjectRole": coalesce(profileSnapshot.primaryRole, provider->primaryRole), profileSnapshot
  }`,
};

const roleLabels: Record<string, string> = {
  admin: "Administrator",
  interpreter: "Interpreter",
  guide: "City Host",
  realtor: "Realtor",
};

function providerAction(raw: RawActivity) {
  const name = raw.subjectName || "a provider";
  const fields = raw.changes?.map((change) => change.field) || raw.changedFields || [];
  if (fields.includes("mainPhoto")) return `updated ${name}'s profile photo`;
  if (raw.changeType === "providerCreated") return `created ${name}'s provider profile`;
  if (raw.changeType === "providerSelfPublished") return `published changes to ${name}'s profile`;
  if (raw.changeType === "managedCityAssigned") return `assigned a city to ${name}`;
  if (raw.changeType === "managedCityRemoved") return `removed a city from ${name}`;
  return `updated ${name}'s provider profile`;
}

function cityAction(raw: RawActivity) {
  const subject = raw.description?.replace(/^(Added|Updated|Deleted) (recommendation|map place):?\s*/i, "").replace(/\.$/, "");
  if (raw.changeType === "cityCreated") return "created the city workspace";
  if (raw.changeType === "cityStatus") return "changed city publication status";
  if (raw.changeType === "cityCoordinates") return "updated city coordinates";
  if (raw.changeType === "mapPlaceAdded") return raw.description || "added a map place";
  if (raw.changeType === "mapPlaceUpdated") return raw.description || "updated a map place";
  if (raw.changeType === "mapPlaceDeleted") return raw.description || "deleted a map place";
  if (raw.changeType === "recommendationAdded") return `added the recommendation “${subject || "Untitled recommendation"}”`;
  if (raw.changeType === "recommendationUpdated") return `updated the recommendation “${subject || "Untitled recommendation"}”`;
  if (raw.changeType === "recommendationDeleted") return `deleted the recommendation “${subject || "Untitled recommendation"}”`;
  if (raw.changeType === "recommendations") return "updated city recommendations";
  return "updated city content";
}

function propertyAction(raw: RawActivity) {
  const title = raw.subjectName || "a property listing";
  const status = raw.changes?.find((change) => change.field === "status")?.afterValue;
  if (raw.changeType === "propertyDeleted") return `deleted the ${title} property listing`;
  if (status === "available") return `published the ${title} property listing`;
  if (status === "hidden") return `unpublished the ${title} property listing`;
  if (status === "archived") return `archived the ${title} property listing`;
  if (raw.changeType === "propertyCreated") return `created the ${title} property listing`;
  return `updated the ${title} property listing`;
}

function approvalAction(raw: RawActivity) {
  const name = raw.subjectName || "a provider";
  if (raw.status === "approved") return `approved ${name}'s provider profile changes`;
  if (raw.status === "rejected") return `rejected ${name}'s provider profile changes`;
  return `submitted ${name}'s provider profile changes for review`;
}

function toActivity(kind: ActivityKind, raw: RawActivity): AdminActivity {
  const isReviewed = kind === "approval" && ["approved", "rejected"].includes(raw.status || "");
  const actor = isReviewed
    ? raw.reviewedBy || "Administrator"
    : raw.actorName || raw.ownerEmail || raw.actorEmail || raw.subjectName || "Unknown user";
  const action = kind === "provider" ? providerAction(raw)
    : kind === "city" ? cityAction(raw)
    : kind === "property" ? propertyAction(raw)
    : approvalAction(raw);
  const location = raw.location || raw.subjectName || (kind === "approval" ? "Provider approvals" : "Platform");
  const changes = raw.changes?.length
    ? raw.changes
    : kind === "approval" && raw.profileSnapshot
      ? Object.entries(raw.profileSnapshot).map(([field, value]) => ({ field, beforeValue: "Not retained", afterValue: typeof value === "string" ? value : JSON.stringify(value, null, 2) }))
      : raw.description
        ? [{ field: kind === "city" ? "content" : "summary", beforeValue: "Not retained", afterValue: raw.description }]
        : [];

  return {
    key: `${kind}:${raw._id}`,
    id: raw._id,
    kind,
    occurredAt: raw.occurredAt,
    actor,
    actorRole: isReviewed
      ? "Administrator"
      : raw.actorRole || (kind === "provider" && raw.changeType !== "providerSelfPublished" ? "Administrator" : roleLabels[raw.subjectRole || ""] || (kind === "city" ? "City Host" : undefined)),
    action,
    location,
    changeType: raw.changeType,
    description: raw.description,
    changes,
    status: raw.status,
    actorEmail: raw.actorEmail,
    actorUserId: raw.actorUserId,
  };
}

export async function fetchAdminActivities({
  kinds = ["provider", "city", "property", "approval"],
  since,
  limit = 100,
}: {
  kinds?: ActivityKind[];
  since?: string;
  limit?: number;
} = {}) {
  const groups = await Promise.all(
    kinds.map(async (kind) => (await client.fetch<RawActivity[]>(activityQueries[kind])).map((raw) => toActivity(kind, raw))),
  );
  return groups
    .flat()
    .filter((activity) => !since || (activity.occurredAt && activity.occurredAt >= since))
    .sort((a, b) => (b.occurredAt || "").localeCompare(a.occurredAt || ""))
    .slice(0, limit);
}

export async function fetchAdminActivity(key: string) {
  const separator = key.indexOf(":");
  const kind = key.slice(0, separator) as ActivityKind;
  const id = key.slice(separator + 1);
  if (!activityQueries[kind] || !id) return null;
  const records = await client.fetch<RawActivity[]>(activityQueries[kind]);
  const raw = records.find((record) => record._id === id) || null;
  return raw ? toActivity(kind, raw) : null;
}

export function relativeActivityTime(value?: string) {
  if (!value) return "time unavailable";
  const seconds = Math.round((new Date(value).getTime() - Date.now()) / 1000);
  const formatter = new Intl.RelativeTimeFormat("en", { numeric: "auto" });
  const ranges: Array<[Intl.RelativeTimeFormatUnit, number]> = [["year", 31536000], ["month", 2592000], ["day", 86400], ["hour", 3600], ["minute", 60]];
  for (const [unit, size] of ranges) {
    if (Math.abs(seconds) >= size) return formatter.format(Math.round(seconds / size), unit);
  }
  return formatter.format(seconds, "second");
}
