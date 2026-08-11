export type AdminActivitySummaryKey = "profilePhotos" | "profileUpdates" | "cityUpdates" | "mapPlaces" | "recommendations" | "properties" | "servicePages";

type SummaryActivity = {
  kind: "provider" | "city" | "property" | "approval" | "service";
  changeType?: string;
  changes: Array<{ field?: string }>;
};

export function adminActivitySummaryKey(activity: SummaryActivity): AdminActivitySummaryKey | null {
  if (activity.kind === "service") return "servicePages";
  if (activity.kind === "property") return "properties";
  if (activity.kind === "provider" || activity.kind === "approval") {
    return activity.changes.some((change) => change.field === "mainPhoto")
      ? "profilePhotos"
      : "profileUpdates";
  }
  if (activity.kind !== "city") return null;
  if (activity.changeType?.startsWith("mapPlace")) return "mapPlaces";
  if (activity.changeType?.startsWith("recommendation")) return "recommendations";
  return "cityUpdates";
}
