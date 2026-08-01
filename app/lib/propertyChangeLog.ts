import type { DashboardContext } from "@/app/lib/dashboard";

export type PropertyFieldChange = {
  field: string;
  beforeValue?: unknown;
  afterValue?: unknown;
};

function loggedValue(value: unknown) {
  if (value === undefined) return "Not set";
  if (typeof value === "string") return value;
  return JSON.stringify(value, null, 2);
}

export function propertyChangeLogDocument({
  context,
  propertyId,
  propertyTitle,
  propertySlug,
  changeType,
  changes,
}: {
  context: DashboardContext;
  propertyId: string;
  propertyTitle: string;
  propertySlug?: string;
  changeType: "propertyCreated" | "propertyEdited" | "propertyDeleted";
  changes: PropertyFieldChange[];
}) {
  return {
    _type: "propertyChangeLog",
    changedAt: new Date().toISOString(),
    property: { _type: "reference", _ref: propertyId },
    propertyTitle,
    propertySlug,
    changeType,
    changedFields: changes.map((change) => change.field),
    changes: changes.map((change) => ({
      _type: "object",
      _key: change.field.replace(/[^a-zA-Z0-9_-]/g, "-"),
      field: change.field,
      beforeValue: loggedValue(change.beforeValue),
      afterValue: loggedValue(change.afterValue),
    })),
    actorName: context.user.fullName || context.signedInEmail,
    actorEmail: context.signedInEmail,
    actorUserId: context.user.id,
    actorRole: context.isAdmin ? "Administrator" : "Realtor",
  };
}
