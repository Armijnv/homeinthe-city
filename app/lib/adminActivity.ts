import "server-only";

import { client } from "@/sanity/lib/client";
import { activityValuesEqual } from "@/app/lib/activityChanges";

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
  references?: Record<string, { name: string; type?: string; imageUrl?: string }>;
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
  providerCurrent?: Record<string, unknown>;
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
    "subjectName": coalesce(provider->name, ownerEmail), "subjectRole": coalesce(profileSnapshot.primaryRole, provider->primaryRole), profileSnapshot,
    "providerCurrent": provider->{name, slug, roles, primaryRole, cities, managedCities, languages, headline_en, headline_pt, headline_nl, intro_en, intro_pt, intro_nl, about_en, about_pt, about_nl, contactOptions, mainPhoto}
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
  const self = raw.actorName?.trim().toLowerCase() === name.trim().toLowerCase();
  const owner = self ? "their" : `${name}'s`;
  if (fields.length === 1 && fields.includes("mainPhoto")) return `changed ${owner} profile photo`;
  if (fields.length === 1 && fields[0]?.match(/^intro_(en|pt|nl)$/)) {
    const language = { en: "English", pt: "Portuguese", nl: "Dutch" }[fields[0].slice(-2)] || "localized";
    return `updated ${owner} ${language} introduction`;
  }
  if (fields.length === 1 && fields[0]?.match(/^about_(en|pt|nl)$/)) {
    const language = { en: "English", pt: "Portuguese", nl: "Dutch" }[fields[0].slice(-2)] || "localized";
    return `updated ${owner} ${language} bio`;
  }
  if (fields.length === 1 && fields[0] === "languages") return `updated ${owner} languages`;
  if (fields.length === 1 && fields[0] === "cities") return `updated ${owner} cities served`;
  if (fields.length === 1 && fields[0] === "headline_en") return `updated ${owner} English headline`;
  if (fields.length === 1 && fields[0] === "headline_pt") return `updated ${owner} Portuguese headline`;
  if (fields.length === 1 && fields[0] === "headline_nl") return `updated ${owner} Dutch headline`;
  if (fields.length === 1 && fields[0] === "contactOptions") return `updated ${owner} contact information`;
  if (raw.changeType === "providerCreated") return `created ${name}'s provider profile`;
  if (raw.changeType === "providerSelfPublished") return `updated ${owner} profile`;
  if (raw.changeType === "managedCityAssigned") return `assigned a city to ${name}`;
  if (raw.changeType === "managedCityRemoved") return `removed a city from ${name}`;
  return `updated ${name}'s provider profile`;
}

function cityAction(raw: RawActivity) {
  const subject = raw.description?.replace(/^(Added|Updated|Deleted) (recommendation|map place):?\s*/i, "").replace(/\.$/, "");
  const fields = raw.changes?.map((change) => change.field) || raw.changedFields || [];
  if (raw.changeType === "cityCreated") return "created the city workspace";
  if (raw.changeType === "cityStatus") return "changed city publication status";
  if (raw.changeType === "cityCoordinates") return "updated city coordinates";
  if (raw.changeType === "mapPlaceAdded") return `added the map place “${subject || "Untitled place"}”`;
  if (raw.changeType === "mapPlaceUpdated") return `updated the map place “${subject || "Untitled place"}”`;
  if (raw.changeType === "mapPlaceDeleted") return `deleted the map place “${subject || "Untitled place"}”`;
  if (raw.changeType === "recommendationAdded") return `added the recommendation “${subject || "Untitled recommendation"}”`;
  if (raw.changeType === "recommendationUpdated") return `updated the recommendation “${subject || "Untitled recommendation"}”`;
  if (raw.changeType === "recommendationDeleted") return `deleted the recommendation “${subject || "Untitled recommendation"}”`;
  if (raw.changeType === "recommendations") return "updated city recommendations";
  if (fields.length === 1 && fields[0]?.match(/^intro_(en|pt|nl)$/)) {
    const language = { en: "English", pt: "Portuguese", nl: "Dutch" }[fields[0].slice(-2)] || "localized";
    return `updated the ${language} city introduction`;
  }
  if (fields.length === 1 && fields[0] === "heroImage") return "changed the city page background";
  if (fields.length === 1 && fields[0] === "mainImage") return "changed the city hero image";
  return "updated city content";
}

function propertyAction(raw: RawActivity) {
  const title = raw.subjectName || "a property listing";
  const fields = raw.changes?.map((change) => change.field) || raw.changedFields || [];
  const status = raw.changes?.find((change) => change.field === "status")?.afterValue;
  if (raw.changeType === "propertyDeleted") return `deleted ${title}`;
  if (status === "available") return `published ${title}`;
  if (status === "hidden") return `unpublished ${title}`;
  if (status === "archived") return `archived ${title}`;
  if (raw.changeType === "propertyCreated") return `created ${title}`;
  if (fields.length === 1 && fields[0]?.match(/^(intro|description)_(en|pt|nl)$/)) {
    const language = { en: "English", pt: "Portuguese", nl: "Dutch" }[fields[0].slice(-2)] || "localized";
    return `updated the ${language} introduction for ${title}`;
  }
  if (fields.length === 1 && ["mainImage", "gallery"].includes(fields[0] || "")) return `updated the photos for ${title}`;
  if (fields.length === 1 && fields[0] === "price") return `updated the price for ${title}`;
  if (fields.some((field) => ["linkedRealtor", "realtor", "owner"].includes(field || ""))) return `changed the assigned realtor for ${title}`;
  return `updated ${title}`;
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
  const approvalChanges = kind === "approval" && raw.status !== "approved" && raw.profileSnapshot
    ? Object.entries(raw.profileSnapshot).flatMap(([field, value]) => activityValuesEqual(raw.providerCurrent?.[field], value, ["_type", "_key"])
      ? []
      : [{ field, beforeValue: loggedActivityValue(raw.providerCurrent?.[field]), afterValue: loggedActivityValue(value) }])
    : [];
  const changes = raw.changes?.length
    ? raw.changes
    : approvalChanges.length
      ? approvalChanges
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

function loggedActivityValue(value: unknown) {
  if (value === undefined) return "Not set";
  return typeof value === "string" ? value : JSON.stringify(value, null, 2);
}

function referencedIds(changes: ActivityChange[]) {
  const ids = new Set<string>();
  const visit = (value: unknown) => {
    if (Array.isArray(value)) return value.forEach(visit);
    if (!value || typeof value !== "object") return;
    const record = value as Record<string, unknown>;
    if (typeof record._ref === "string") ids.add(record._ref);
    Object.values(record).forEach(visit);
  };
  for (const change of changes) {
    for (const value of [change.beforeValue, change.afterValue]) {
      if (!value || value === "Not set" || value === "Not retained") continue;
      try { visit(JSON.parse(value)); } catch { /* Plain text has no references. */ }
    }
  }
  return [...ids];
}

async function activityReferences(activity: AdminActivity) {
  const ids = referencedIds(activity.changes);
  if (!ids.length) return {};
  const records = await client.fetch<Array<{ _id: string; type?: string; name?: string; imageUrl?: string }>>(
    `*[_id in $ids]{_id, "type": _type, "name": coalesce(name, title_en, title_pt, title_nl, name_en, name_pt, name_nl, originalFilename), "imageUrl": select(_type == "sanity.imageAsset" => url)}`,
    { ids },
  );
  return Object.fromEntries(records.map((record) => [record._id, { name: record.name || "Linked item", type: record.type, imageUrl: record.imageUrl }]));
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
  if (!raw) return null;
  const activity = toActivity(kind, raw);
  activity.references = await activityReferences(activity);
  return activity;
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
