import { notFound } from "next/navigation";
import CityInterpreterPage from "@/app/components/CityInterpreterPage";
import { cityInterpreterName, type CityInterpreterCoverage } from "@/app/lib/cityInterpreterCoverage";
import type { InterpreterCmsPage, InterpreterLanguage } from "@/app/lib/interpreterPages";
import { client } from "@/sanity/lib/client";
import { cityInterpreterCoverageBySlugQuery, servicePageQuery } from "@/sanity/lib/queries";

export async function dynamicCityInterpreterCoverage(citySlug: string) {
  return client.fetch<CityInterpreterCoverage | null>(cityInterpreterCoverageBySlugQuery, { citySlug });
}

export async function DynamicCityInterpreterRoute({ citySlug, lang }: { citySlug: string; lang: InterpreterLanguage }) {
  const city = await dynamicCityInterpreterCoverage(citySlug);
  if (!city?.interpreters?.length) notFound();
  const pageSlug = city.servicePage?.slug?.current;
  const page = pageSlug ? await client.fetch<InterpreterCmsPage | null>(servicePageQuery, { slug: pageSlug }) : null;
  return <CityInterpreterPage city={city} lang={lang} page={page} />;
}

export async function dynamicCityInterpreterMetadata(citySlug: string, lang: InterpreterLanguage) {
  const city = await dynamicCityInterpreterCoverage(citySlug);
  if (!city?.interpreters?.length) return {};
  const name = cityInterpreterName(city, lang);
  return { title: `Interpreter services in ${name}` };
}
