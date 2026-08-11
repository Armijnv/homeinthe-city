import type { Metadata } from "next";
import { notFound } from "next/navigation";
import {
  BackToDashboard,
  DashboardActionRow,
  DashboardPanel,
  DashboardShell,
} from "@/app/dashboard/dashboard-ui";
import { cityName, getDashboardContext } from "@/app/lib/dashboard";
import {
  interpreterServicePages,
  interpreterServicePublicPath,
} from "@/app/lib/interpreterServicePages";
import { canEditInterpreterServicePage } from "@/app/lib/interpreterServicePolicy";

export const metadata: Metadata = { title: "Provider Workspace" };

export default async function ProviderWorkspacePage() {
  const context = await getDashboardContext("/dashboard/provider");
  const { provider, providerEdit } = context;

  if (!provider) notFound();

  const roles = new Set([provider.primaryRole, ...(provider.roles || [])]);
  const isInterpreter = roles.has("interpreter");
  const providerSlug = provider.slug?.current;
  const assignedInterpreterPages = interpreterServicePages.filter(
    (page) =>
      page.citySlug &&
      canEditInterpreterServicePage({
        provider,
        isAdmin: context.isAdmin,
        citySlug: page.citySlug,
      }),
  );

  return (
    <DashboardShell
      eyebrow={isInterpreter ? "Interpreter" : "Provider profile"}
      title={isInterpreter ? "Interpreter workspace" : "Provider workspace"}
      intro="Manage the public profile information connected to your signed-in account."
    >
      <BackToDashboard />
      <div className="grid gap-4 lg:grid-cols-2">
        <DashboardPanel title="Profile" eyebrow="Public presence">
          <DashboardActionRow
            title="Edit profile"
            detail={
              providerEdit.canEdit
                ? "Update the profile fields available to your account"
                : "Self-editing is not enabled"
            }
            href={providerEdit.canEdit ? "/account/profile/edit" : undefined}
          />
          <DashboardActionRow
            title="View public profile"
            detail={provider.status || "Not published"}
            href={providerSlug ? `/providers/${providerSlug}` : undefined}
          />
        </DashboardPanel>

        <DashboardPanel title="Profile coverage" eyebrow="Details">
          <DashboardActionRow
            title="Languages"
            detail={
              provider.ownership?.selfEditableFields?.includes("languages")
                ? "Editable from your profile editor"
                : "Shown on your public profile"
            }
            href={providerEdit.canEdit ? "/account/profile/edit" : undefined}
          />
          <DashboardActionRow
            title="Cities served"
            detail={
              provider.cities?.length
                ? provider.cities.map(cityName).join(", ")
                : "No cities listed"
            }
            href={providerEdit.canEdit ? "/account/profile/edit" : undefined}
          />
          {isInterpreter ? (
            <DashboardActionRow title="Availability" detail="Planned for a future update" />
          ) : null}
        </DashboardPanel>
      </div>
      {isInterpreter ? (
        <div className="mt-4 grid gap-4 lg:grid-cols-2">
          <DashboardPanel title="Interpreter service pages" eyebrow="Assigned cities">
            {assignedInterpreterPages.length ? (
              assignedInterpreterPages.map((page) => (
                <DashboardActionRow
                  key={page.key}
                  title={page.title}
                  detail="Edit the city interpreter service page"
                  href={`/dashboard/interpreter-services/${page.key}`}
                />
              ))
            ) : (
              <DashboardActionRow
                title="No assigned interpreter page"
                detail="An interpreter role and public city assignment are both required"
              />
            )}
          </DashboardPanel>
          <DashboardPanel title="Public interpreter pages" eyebrow="Preview">
            {assignedInterpreterPages.map((page) => (
              <DashboardActionRow
                key={page.key}
                title={page.detail}
                detail={interpreterServicePublicPath(page)}
                href={interpreterServicePublicPath(page)}
              />
            ))}
          </DashboardPanel>
        </div>
      ) : null}
    </DashboardShell>
  );
}
