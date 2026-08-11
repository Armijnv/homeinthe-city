import type { DashboardContext } from "@/app/lib/dashboard";
import type { ActivityFieldChange } from "@/app/lib/activityChanges";
import type { InterpreterServicePageDefinition } from "@/app/lib/interpreterServicePages";
import { interpreterServicePublicPath } from "@/app/lib/interpreterServicePages";

function loggedValue(value: unknown) {
  if (value === undefined) return "Not set";
  if (typeof value === "string") return value;
  return JSON.stringify(value, null, 2);
}

export function servicePageChangeLogDocument({
  context,
  definition,
  servicePageId,
  changeType,
  changes,
}: {
  context: DashboardContext;
  definition: InterpreterServicePageDefinition;
  servicePageId: string;
  changeType: "servicePageCreated" | "servicePageEdited";
  changes: ActivityFieldChange[];
}) {
  const actorName =
    context.provider?.name || context.user.fullName || context.signedInEmail;

  return {
    _type: "servicePageChangeLog",
    changedAt: new Date().toISOString(),
    servicePage: { _type: "reference", _ref: servicePageId },
    pageName: definition.title,
    pageKey: definition.key,
    pageSlug: definition.servicePageSlug,
    citySlug: definition.citySlug,
    publicPath: interpreterServicePublicPath(definition),
    changeType,
    description: `${changeType === "servicePageCreated" ? "Created" : "Updated"} ${definition.title}.`,
    actorName,
    actorEmail: context.signedInEmail,
    actorUserId: context.user.id,
    actorRole: context.isAdmin ? "Administrator" : "Interpreter",
    provider: context.provider?._id
      ? { _type: "reference", _ref: context.provider._id }
      : undefined,
    changedFields: changes.map((change) => change.field),
    changes: changes.map((change, index) => ({
      _type: "object",
      _key: `${change.field.replace(/[^A-Za-z0-9_-]/g, "-")}-${index}`,
      field: change.field,
      beforeValue: loggedValue(change.beforeValue),
      afterValue: loggedValue(change.afterValue),
    })),
  };
}
