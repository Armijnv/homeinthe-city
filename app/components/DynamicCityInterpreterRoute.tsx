import type { Metadata } from "next";
import { notFound } from "next/navigation";
import CityInterpreterPage from "@/app/components/CityInterpreterPage";
import {
  cityInterpreterName,
  cityInterpreterPath,
  automaticCityInterpreterDescription,
  automaticCityInterpreterTitle,
  interpreterLanguages,
  type CityInterpreterCoverage,
} from "@/app/lib/cityInterpreterCoverage";
import type { InterpreterCmsPage, InterpreterLanguage } from "@/app/lib/interpreterTypes";
import { JsonLdScript, serviceJsonLd } from "@/app/lib/structuredData";
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
  return (
    <>
      <JsonLdScript
        data={dynamicCityInterpreterStructuredData(city, lang, page)}
      />
      <CityInterpreterPage
        city={city}
        lang={lang}
        page={page}
      />
    </>
  );
}

export async function dynamicCityInterpreterMetadata(
  citySlug: string,
  lang: InterpreterLanguage,
): Promise<Metadata> {
  const city = await dynamicCityInterpreterCoverage(citySlug);
  if (!city?.interpreters?.length) return {};
  const pageSlug = city.servicePage?.slug?.current;
  const page = pageSlug
    ? await client.fetch<InterpreterCmsPage | null>(servicePageQuery, { slug: pageSlug })
    : null;
  const path = cityInterpreterPath(citySlug, lang);
  const title = page?.[`seoTitle_${lang}`] || page?.[`title_${lang}`] || automaticCityInterpreterTitle(city, lang);
  const description = page?.[`seoDescription_${lang}`] || page?.[`intro_${lang}`] || automaticCityInterpreterDescription(city, lang);
  const languages = Object.fromEntries(
    (["en", "pt", "nl"] as const).map((language) => [
      language,
      `https://homeinthe.city${cityInterpreterPath(citySlug, language)}`,
    ]),
  );
  return {
    title,
    ...(description ? { description } : {}),
    alternates: {
      canonical: `https://homeinthe.city${path}`,
      languages: { ...languages, "x-default": languages.en },
    },
    openGraph: {
      title,
      ...(description ? { description } : {}),
      url: `https://homeinthe.city${path}`,
      siteName: "Home in the City",
      locale: lang === "pt" ? "pt_BR" : lang === "nl" ? "nl_NL" : "en_US",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      ...(description ? { description } : {}),
    },
  };
}

function dynamicCityInterpreterStructuredData(
  city: CityInterpreterCoverage,
  lang: InterpreterLanguage,
  page: InterpreterCmsPage | null,
) {
  const citySlug = city.slug?.current || "";
  const name = cityInterpreterName(city, lang);
  const title = page?.[`seoTitle_${lang}`] || page?.[`title_${lang}`] || automaticCityInterpreterTitle(city, lang);
  const description =
    page?.[`seoDescription_${lang}`] || page?.[`intro_${lang}`] ||
    automaticCityInterpreterDescription(city, lang);
  return serviceJsonLd({
    url: `https://homeinthe.city${cityInterpreterPath(citySlug, lang)}`,
    name: title,
    description,
    image: "https://homeinthe.city/og-armijn2.jpg",
    serviceType: [`Business interpreter in ${name}`, "Local business coordination"],
    areaServed: { "@type": "City", name, addressCountry: city.country || "BR" },
    availableLanguage: Array.from(new Set((city.interpreters || []).flatMap(interpreterLanguages))),
    inLanguage: lang === "pt" ? "pt-BR" : lang === "nl" ? "nl-NL" : "en",
  });
}
