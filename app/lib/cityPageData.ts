import type { PropertyListing } from "@/app/components/PropertyListingPage";
import type { CityGuideContent } from "@/app/lib/cityGuides";
import { client } from "@/sanity/lib/client";
import { cityMapPropertyListingsQuery, cityQuery } from "@/sanity/lib/queries";

export function cityMapCityNames(
  city: CityGuideContent | null | undefined,
  citySlug: string,
) {
  return Array.from(
    new Set(
      [
        citySlug,
        city?.name_en,
        city?.name_pt,
        city?.name_nl,
        city?.slug?.current,
      ].filter((value): value is string => Boolean(value)),
    ),
  );
}

export async function getCityPageData(citySlug: string) {
  const city = await client.fetch<CityGuideContent | null>(cityQuery, {
    slug: citySlug,
  });

  const propertyListings = city
    ? await client.fetch<PropertyListing[]>(cityMapPropertyListingsQuery, {
        citySlug,
        cityNames: cityMapCityNames(city, citySlug),
      })
    : [];

  return { city, propertyListings };
}
