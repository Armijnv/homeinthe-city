import type { Metadata } from "next";
import { notFound } from "next/navigation";
import CityDashboardEditors, {
  type CityDashboardEditorData,
} from "@/app/dashboard/cities/[citySlug]/CityDashboardEditors";
import {
  saveCityContentAction,
  saveCityRecommendationsAction,
} from "@/app/dashboard/cities/[citySlug]/actions";
import {
  BackToDashboard,
  DashboardCard,
  DashboardShell,
  type DashboardCardProps,
} from "@/app/dashboard/dashboard-ui";
import { cityGuidePath } from "@/app/lib/cityGuides";
import { cityName, requireCityHost, type DashboardCity } from "@/app/lib/dashboard";
import { client } from "@/sanity/lib/client";

type PageProps = {
  params: Promise<{
    citySlug: string;
  }>;
};

export const metadata: Metadata = {
  title: "City Dashboard",
};

type CityDashboardData = DashboardCity & CityDashboardEditorData;

const cityDashboardQuery = `
  *[_type == "city" && slug.current == $citySlug][0]{
    _id,
    name_en,
    name_pt,
    name_nl,
    slug,
    guideStatus,
    enabledLanguages,
    "hostLanguages": primaryHost->languages[].language,
    country,
    headline_en,
    headline_pt,
    headline_nl,
    intro_en,
    intro_pt,
    intro_nl,
    introBlocks_en,
    introBlocks_pt,
    introBlocks_nl,
    sidebarCards[]{
      _key,
      title_en,
      title_pt,
      title_nl,
      text_en,
      text_pt,
      text_nl,
      button_en,
      button_pt,
      button_nl,
      href_en,
      href_pt,
      href_nl
    },
    mapPlaces[]{
      _key,
      name,
      name_en,
      name_pt
    },
    recommendationGuides[]{
      _key,
      title_en,
      title_pt,
      title_nl,
      introduction_en,
      introduction_pt,
      introduction_nl,
      content_en,
      content_pt,
      content_nl,
      recommendationType,
      customCategory_en,
      customCategory_pt,
      customCategory_nl,
      relatedMapPlaceKeys,
      featuredImage{
        _type,
        alt,
        asset->{
          "_type": "reference",
          "_ref": _id,
          url
        },
        crop,
        hotspot
      },
      relatedProvider,
      relatedCity
    },
    recommendations[]{
      _key
    }
  }
`;

export default async function CityDashboardPage({ params }: PageProps) {
  const { citySlug } = await params;
  const context = await requireCityHost(citySlug);
  const city = await client.fetch<CityDashboardData | null>(cityDashboardQuery, {
    citySlug,
  });

  if (!city) {
    notFound();
  }

  const name = cityName(city);
  const cards: DashboardCardProps[] = [
    {
      title: "Map places",
      text: "Add, edit, and delete city map places directly from the dashboard.",
      href: `/dashboard/cities/${citySlug}/map`,
      action: "Manage map places",
      status: "Available now",
    },
    {
      title: "Coordinates",
      text: "Review map place and property listing coordinate status.",
      href: `/dashboard/cities/${citySlug}/map`,
      action: "Review coordinates",
      status: "Available now",
    },
    {
      title: "Public city page",
      text: `Open the live public city guide for ${name}.`,
      href: cityGuidePath("en", citySlug),
      action: "View public page",
      status: city.guideStatus || "live",
    },
  ];

  return (
    <DashboardShell
      eyebrow="City host"
      title={name}
      intro="Edit the public city guide, local recommendations, map places, and coordinate readiness without opening Sanity Studio."
    >
      <BackToDashboard />
      <div className="mb-10 grid gap-5 md:grid-cols-2">
        {cards.map((card) => (
          <DashboardCard key={card.title} {...card} />
        ))}
      </div>

      <CityDashboardEditors
        key={(city.recommendationGuides || [])
          .map(
            (recommendation) =>
              `${recommendation._key}:${recommendation.featuredImage?.asset?._ref || ""}`,
          )
          .join("|")}
        city={city}
        canManageLanguages={context.isAdmin}
        saveContentAction={saveCityContentAction.bind(null, citySlug)}
        saveRecommendationsAction={saveCityRecommendationsAction.bind(null, citySlug)}
      />
    </DashboardShell>
  );
}
