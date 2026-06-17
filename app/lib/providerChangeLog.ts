import type { DashboardContext } from "@/app/lib/dashboard";

export type ProviderChangeType =
  | "providerCreated"
  | "providerEdited"
  | "managedCityAssigned"
  | "managedCityRemoved";

export function providerChangeLogDocument({
  context,
  providerId,
  providerName,
  providerSlug,
  changeType,
  description,
}: {
  context: DashboardContext;
  providerId: string;
  providerName: string;
  providerSlug?: string;
  changeType: ProviderChangeType;
  description: string;
}) {
  return {
    _type: "providerChangeLog",
    changedAt: new Date().toISOString(),
    provider: { _type: "reference", _ref: providerId },
    providerName,
    providerSlug,
    changeType,
    description: description.slice(0, 200),
    actorName: context.user.fullName || context.signedInEmail,
    actorEmail: context.signedInEmail,
    actorUserId: context.user.id,
  };
}
