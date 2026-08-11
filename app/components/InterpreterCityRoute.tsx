import InterpreterServicePage from "@/app/components/InterpreterServicePage";
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
import { servicePageQuery } from "@/sanity/lib/queries";

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
  const page = await getInterpreterCmsPage(city.servicePageSlug);

  return (
    <>
      <JsonLdScript data={interpreterStructuredData(city, input.lang)} />
      <InterpreterServicePage citySlug={input.citySlug} lang={input.lang} page={page} />
    </>
  );
}
