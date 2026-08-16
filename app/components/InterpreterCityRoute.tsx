import InterpreterServicePage from "@/app/components/InterpreterServicePage";
import CityInterpreterPage from "@/app/components/CityInterpreterPage";
import type { CityInterpreterCoverage } from "@/app/lib/cityInterpreterCoverage";
import {
  interpreterCity,
  interpreterMetadata,
  interpreterStructuredData,
  type InterpreterCitySlug,
  type InterpreterCmsPage,
  type InterpreterLanguage,
} from "@/app/lib/interpreterPages";
import { JsonLdScript } from "@/app/lib/structuredData";
import { client } from "@/sanity/lib/client";
import { cityInterpreterCoverageBySlugQuery, servicePageQuery } from "@/sanity/lib/queries";

type RouteInput = {
  citySlug: InterpreterCitySlug;
  lang: InterpreterLanguage;
};

export async function getInterpreterCmsPage(cmsSlug?: string) {
  if (!cmsSlug) return null;
  return client.fetch<InterpreterCmsPage | null>(servicePageQuery, { slug: cmsSlug });
}

export async function getInterpreterCityMetadata(input: RouteInput) {
  const city = interpreterCity(input.citySlug);
  const page = await getInterpreterCmsPage(city.servicePageSlug);
  return interpreterMetadata(city, input.lang, page);
}

export default async function InterpreterCityRoute(input: RouteInput) {
  const city = interpreterCity(input.citySlug);
  const coverage = await client.fetch<CityInterpreterCoverage | null>(
    cityInterpreterCoverageBySlugQuery,
    { citySlug: input.citySlug },
  );
  if (coverage?.servicePage?.slug?.current) {
    const sharedPage = await getInterpreterCmsPage(coverage.servicePage.slug.current);
    return <CityInterpreterPage city={coverage} lang={input.lang} page={sharedPage} />;
  }
  const page = await getInterpreterCmsPage(city.servicePageSlug);

  return (
    <>
      <JsonLdScript data={interpreterStructuredData(city, input.lang)} />
      <InterpreterServicePage citySlug={input.citySlug} lang={input.lang} page={page} />
    </>
  );
}
