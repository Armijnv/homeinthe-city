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
  cityInterpreterName,
  cityInterpreterPath,
  type CityInterpreterCoverage,
} from "@/app/lib/cityInterpreterCoverage";
import { canEditInterpreterServicePage } from "@/app/lib/interpreterServicePolicy";
import { client } from "@/sanity/lib/client";
import { cityInterpreterCoverageQuery } from "@/sanity/lib/queries";

export const metadata: Metadata = { title: "Provider Workspace" };

export default async function ProviderWorkspacePage() {
  const context = await getDashboardContext("/dashboard/provider");
  const { provider, providerEdit } = context;

  if (!provider) notFound();

  const roles = new Set([provider.primaryRole, ...(provider.roles || [])]);
  const isInterpreter = roles.has("interpreter");
  const providerSlug = provider.slug?.current;
  const interpreterCities = isInterpreter
    ? (await client.fetch<CityInterpreterCoverage[]>(cityInterpreterCoverageQuery)).filter(
        (city) =>
          city.interpreters?.some(
            (interpreter) => interpreter._id === provider._id,
          ),
      )
    : [];
  const editableInterpreterCities = interpreterCities.filter((city) =>
    canEditInterpreterServicePage({
      provider,
      isAdmin: context.isAdmin,
      citySlug: city.slug?.current,
      primaryHostId: city.primaryHost?._id,
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
            {interpreterCities.length ? (
              interpreterCities.map((city) => {
                const citySlug = city.slug?.current;
                const canEdit = editableInterpreterCities.includes(city);
                const name = cityInterpreterName(city, "en");
                return (
                  <DashboardActionRow
                    key={city._id}
                    title={`Interpreter services in ${name}`}
                    detail={
                      canEdit
                        ? "Edit the city interpreter service page"
                        : "City management access is required to edit this page"
                    }
                    href={
                      canEdit && citySlug
                        ? `/dashboard/cities/${citySlug}/interpreter`
                        : undefined
                    }
                  />
                );
              })
            ) : (
              <DashboardActionRow
                title="No assigned interpreter page"
                detail="An interpreter role and public city assignment are both required"
              />
            )}
          </DashboardPanel>
          <DashboardPanel title="Public interpreter pages" eyebrow="Preview">
            {interpreterCities.map((city) => {
              const citySlug = city.slug?.current;
              if (!citySlug) return null;
              const path = cityInterpreterPath(citySlug, "en");
              return (
                <DashboardActionRow
                  key={city._id}
                  title={cityInterpreterName(city, "en")}
                  detail={path}
                  href={path}
                />
              );
            })}
          </DashboardPanel>
        </div>
      ) : null}
    </DashboardShell>
  );
}
