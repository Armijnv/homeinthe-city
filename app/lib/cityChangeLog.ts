import type { DashboardCity, DashboardContext } from "@/app/lib/dashboard";
import type { ActivityFieldChange } from "@/app/lib/activityChanges";

export type CityChangeType =
  | "cityCreated"
  | "cityContent"
  | "cityStatus"
  | "cityCoordinates"
  | "recommendations"
  | "recommendationAdded"
  | "recommendationUpdated"
  | "recommendationDeleted"
  | "mapPlaceAdded"
  | "mapPlaceUpdated"
  | "mapPlaceDeleted";

export function cityChangeLogDocument({
  context,
  city,
  changeType,
  description,
  changes = [],
}: {
  context: DashboardContext;
  city: DashboardCity;
  changeType: CityChangeType;
  description: string;
  changes?: ActivityFieldChange[];
}) {
  if (!city._id) return null;

  const actorName =
    context.provider?.name || context.user.fullName || context.signedInEmail;

  return {
    _type: "cityChangeLog",
    changedAt: new Date().toISOString(),
    city: { _type: "reference", _ref: city._id },
    cityName: city.name_en || city.name_pt || city.name_nl || city.slug?.current,
    citySlug: city.slug?.current,
    changeType,
    description: description.slice(0, 200),
    actorName,
    actorEmail: context.signedInEmail,
    actorUserId: context.user.id,
    actorRole: context.isAdmin ? "Administrator" : "City Host",
    changedFields: changes.map((change) => change.field),
    changes: changes.map((change) => ({
      _type: "object",
      _key: change.field.replace(/[^a-zA-Z0-9_-]/g, "-"),
      field: change.field,
      beforeValue: loggedValue(change.beforeValue),
      afterValue: loggedValue(change.afterValue),
    })),
    provider: context.provider?._id
      ? { _type: "reference", _ref: context.provider._id }
      : undefined,
  };
}

function loggedValue(value: unknown) {
  if (value === undefined) return "Not set";
  if (typeof value === "string") return value;
  return JSON.stringify(value, null, 2);
}
