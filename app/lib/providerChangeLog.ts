import type { DashboardContext } from "@/app/lib/dashboard";
import type { ProviderFieldChange } from "@/app/lib/clerkIdentityPolicy";

export type ProviderChangeType =
  | "providerCreated"
  | "providerEdited"
  | "providerSelfPublished"
  | "managedCityAssigned"
  | "managedCityRemoved";

function changeLogValue(value: unknown) {
  if (value === undefined) return "Not set";
  if (typeof value === "string") return value;
  return JSON.stringify(value, null, 2);
}

export function providerChangeLogDocument({
  context,
  providerId,
  providerName,
  providerSlug,
  changeType,
  description,
  changes = [],
}: {
  context: DashboardContext;
  providerId: string;
  providerName: string;
  providerSlug?: string;
  changeType: ProviderChangeType;
  description: string;
  changes?: ProviderFieldChange[];
}) {
  return {
    _type: "providerChangeLog",
    changedAt: new Date().toISOString(),
    provider: { _type: "reference", _ref: providerId },
    providerName,
    providerSlug,
    changeType,
    description: description.slice(0, 200),
    changedFields: changes.map((change) => change.field),
    changes: changes.map((change) => ({
      _type: "object",
      _key: change.field.replace(/[^a-zA-Z0-9_-]/g, "-"),
      field: change.field,
      beforeValue: changeLogValue(change.beforeValue),
      afterValue: changeLogValue(change.afterValue),
    })),
    actorName: context.user.fullName || context.signedInEmail,
    actorEmail: context.signedInEmail,
    actorUserId: context.user.id,
  };
}
