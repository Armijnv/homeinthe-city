import type { DashboardCity, DashboardContext } from "@/app/lib/dashboard";

export type CityChangeType =
  | "cityContent"
  | "recommendations"
  | "mapPlaceAdded"
  | "mapPlaceUpdated"
  | "mapPlaceDeleted";

export function cityChangeLogDocument({
  context,
  city,
  changeType,
  description,
}: {
  context: DashboardContext;
  city: DashboardCity;
  changeType: CityChangeType;
  description: string;
}) {
  if (context.isAdmin || !city._id) return null;

  // TODO: Send an admin email here if notification infrastructure is added.

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
    provider: context.provider?._id
      ? { _type: "reference", _ref: context.provider._id }
      : undefined,
  };
}
