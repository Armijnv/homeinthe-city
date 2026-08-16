import "server-only";

import { notFound } from "next/navigation";
import { getDashboardContext } from "@/app/lib/dashboard";
import {
  interpreterServicePageForKey,
  type InterpreterServicePageKey,
  type InterpreterServicePageDefinition,
} from "@/app/lib/interpreterServicePages";
import { canEditInterpreterServicePage } from "@/app/lib/interpreterServicePolicy";
import { client } from "@/sanity/lib/client";
import { cityInterpreterCoverageBySlugQuery } from "@/sanity/lib/queries";
import type { CityInterpreterCoverage } from "@/app/lib/cityInterpreterCoverage";

export async function requireInterpreterServiceAccess(
  pageKey: InterpreterServicePageKey | string,
) {
  let definition = interpreterServicePageForKey(pageKey);
  const dynamicCitySlug = pageKey.startsWith("city:") ? pageKey.slice(5) : "";
  if (!definition && dynamicCitySlug) {
    const city = await client.fetch<CityInterpreterCoverage | null>(
      cityInterpreterCoverageBySlugQuery,
      { citySlug: dynamicCitySlug },
    );
    if (city?._id && city.interpreters?.length) {
      const cityName = city.name_en || city.name_pt || city.name_nl || dynamicCitySlug;
      definition = {
        key: `city:${dynamicCitySlug}`,
        title: `Interpreter services in ${cityName}`,
        detail: cityName,
        citySlug: dynamicCitySlug,
        cityId: city._id,
        primaryHostId: city.primaryHost?._id,
        servicePageSlug: city.servicePage?.slug?.current || `interpreter-${dynamicCitySlug}`,
        languages: ["en", "pt", "nl"],
        paths: {
          en: `/interpreter/${dynamicCitySlug}`,
          pt: `/pt/interprete/${dynamicCitySlug}`,
          nl: `/nl/tolk/${dynamicCitySlug}`,
        },
      } satisfies InterpreterServicePageDefinition;
    }
  }
  if (!definition) notFound();

  if (definition.citySlug && !definition.primaryHostId) {
    const city = await client.fetch<CityInterpreterCoverage | null>(
      cityInterpreterCoverageBySlugQuery,
      { citySlug: definition.citySlug },
    );
    definition = {
      ...definition,
      cityId: definition.cityId || city?._id,
      primaryHostId: city?.primaryHost?._id,
    };
  }

  const returnTo = `/dashboard/interpreter-services/${definition.key}`;
  const context = await getDashboardContext(returnTo);

  if (
    !canEditInterpreterServicePage({
      provider: context.provider,
      isAdmin: context.isAdmin,
      citySlug: definition.citySlug,
      primaryHostId: definition.primaryHostId,
    })
  ) {
    notFound();
  }

  return { context, definition };
}
