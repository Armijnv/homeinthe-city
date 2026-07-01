import type { PropertyListing } from "@/app/components/PropertyListingPage";
import type { CityGuideContent } from "@/app/lib/cityGuides";
import { getCityLiveInfo } from "@/app/lib/cityLiveInfo";
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

  if (!city) return { city, propertyListings: [], liveInfo: null };

  const [propertyListings, liveInfo] = await Promise.all([
    client.fetch<PropertyListing[]>(cityMapPropertyListingsQuery, {
      citySlug,
      cityNames: cityMapCityNames(city, citySlug),
    }),
    getCityLiveInfo({
      latitude: city.latitude,
      longitude: city.longitude,
    }),
  ]);

  return { city, propertyListings, liveInfo };
}
