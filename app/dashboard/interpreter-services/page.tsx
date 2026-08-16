import type { Metadata } from "next";
import {
  BackToDashboard,
  DashboardActionRow,
  DashboardPanel,
  DashboardShell,
  Pill,
} from "@/app/dashboard/dashboard-ui";
import {
  cityInterpreterName,
  cityInterpreterPath,
  type CityInterpreterCoverage,
} from "@/app/lib/cityInterpreterCoverage";
import { getDashboardContext } from "@/app/lib/dashboard";
import { interpreterServicePageForKey, interpreterServicePublicPath } from "@/app/lib/interpreterServicePages";
import { canEditInterpreterServicePage } from "@/app/lib/interpreterServicePolicy";
import { client } from "@/sanity/lib/client";
import { cityInterpreterCoverageQuery } from "@/sanity/lib/queries";

export const metadata: Metadata = { title: "Interpreter Service Pages" };

export default async function InterpreterServicesDashboardPage() {
  const context = await getDashboardContext("/dashboard/interpreter-services");
  const cities = await client.fetch<CityInterpreterCoverage[]>(cityInterpreterCoverageQuery);
  const editableCities = cities.filter((city) =>
    canEditInterpreterServicePage({
      provider: context.provider,
      isAdmin: context.isAdmin,
      citySlug: city.slug?.current,
      primaryHostId: city.primaryHost?._id,
    }),
  );
  const brazil = interpreterServicePageForKey("brazil");

  return (
    <DashboardShell
      eyebrow={context.isAdmin ? "Administrator" : "Interpreter"}
      title="Interpreter service pages"
      intro="City pages are listed from current published interpreter coverage. Provider city assignments control coverage; editorial content is managed with the matching city."
    >
      <BackToDashboard />
      <div className="grid gap-4 lg:grid-cols-2">
        {context.isAdmin && brazil ? (
          <DashboardPanel title={brazil.title} eyebrow="General page">
            <div className="flex flex-wrap items-center gap-2 py-3 first:pt-0"><Pill>Public route live</Pill></div>
            <DashboardActionRow title="Edit interpreter page" detail={brazil.detail} href={`/dashboard/interpreter-services/${brazil.key}`} />
            <DashboardActionRow title="View public page" detail={interpreterServicePublicPath(brazil)} href={interpreterServicePublicPath(brazil)} />
          </DashboardPanel>
        ) : null}
        {editableCities.map((city) => {
          const citySlug = city.slug?.current;
          if (!citySlug) return null;
          const cityName = cityInterpreterName(city, "en");
          return (
            <DashboardPanel key={city._id} title={`Interpreter services in ${cityName}`} eyebrow="City interpreter page">
              <div className="flex flex-wrap items-center gap-2 py-3 first:pt-0">
                <Pill>Public coverage active</Pill>
                <Pill>{city.servicePage ? "Editorial content saved" : "Provider coverage only"}</Pill>
              </div>
              <DashboardActionRow title="Edit city interpreter page" detail={`${city.interpreters?.length || 0} published interpreter${city.interpreters?.length === 1 ? "" : "s"}`} href={`/dashboard/cities/${citySlug}/interpreter`} />
              <DashboardActionRow title="View public page" detail={cityInterpreterPath(citySlug, "en")} href={cityInterpreterPath(citySlug, "en")} />
            </DashboardPanel>
          );
        })}
      </div>
      {!editableCities.length && !context.isAdmin ? (
        <p className="rounded-xl border border-white/10 bg-white/5 p-5 text-stone-300">No city interpreter page is available to this account.</p>
      ) : null}
    </DashboardShell>
  );
}
