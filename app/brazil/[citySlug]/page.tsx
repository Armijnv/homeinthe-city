import type { Metadata } from "next";
import { notFound } from "next/navigation";
import CityPage from "@/app/components/CityPage";
import {
  cityGuideDescription,
  cityGuideInLanguage,
  cityGuideIsPublic,
  cityGuideLanguageEnabled,
  cityGuideMetadata,
  cityGuidePath,
  cityGuideSiteUrl,
  cityGuideTitle,
  type CityGuideContent,
} from "@/app/lib/cityGuides";
import { getCityPageData } from "@/app/lib/cityPageData";
import { cityGuideJsonLd, JsonLdScript } from "@/app/lib/structuredData";
import { client } from "@/sanity/lib/client";
import { cityQuery } from "@/sanity/lib/queries";

type PageProps = {
  params: Promise<{ citySlug: string }>;
};

async function getCity(citySlug: string) {
  return client.fetch<CityGuideContent | null>(cityQuery, { slug: citySlug });
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { citySlug } = await params;
  const city = await getCity(citySlug);

  if (!city || !cityGuideIsPublic(city) || !cityGuideLanguageEnabled(city, citySlug, "en")) {
    notFound();
  }

  return cityGuideMetadata({ city, lang: "en", citySlug });
}

export default async function Page({ params }: PageProps) {
  const { citySlug } = await params;
  const { city, propertyListings, liveInfo } = await getCityPageData(citySlug);

  if (!city || !cityGuideIsPublic(city)) notFound();
  if (!cityGuideLanguageEnabled(city, citySlug, "en")) notFound();

  const url = `${cityGuideSiteUrl}${cityGuidePath("en", citySlug)}`;
  const description = cityGuideDescription({ city, lang: "en", citySlug });

  return (
    <div className="relative isolate">
      <JsonLdScript
        data={cityGuideJsonLd({
          url,
          name: cityGuideTitle({ city, lang: "en", citySlug }),
          description,
          inLanguage: cityGuideInLanguage.en,
        })}
      />
      <CityPage
        lang="en"
        citySlug={citySlug}
        initialCity={city}
        initialPropertyListings={propertyListings}
        initialLiveInfo={liveInfo}
      />
    </div>
  );
}
