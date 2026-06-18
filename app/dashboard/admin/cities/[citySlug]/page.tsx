import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { updateCityStatusAction } from "@/app/dashboard/admin/cities/actions";
import {
  BackToDashboard,
  DashboardCard,
  DashboardShell,
  Pill,
  TableLink,
  type DashboardCardProps,
} from "@/app/dashboard/dashboard-ui";
import { cityGuidePath, providerProfilePath } from "@/app/lib/cityGuides";
import { cityName, requireAdmin, type DashboardCity } from "@/app/lib/dashboard";
import { client } from "@/sanity/lib/client";

type PageProps = {
  params: Promise<{
    citySlug: string;
  }>;
  searchParams: Promise<{
    error?: string;
    saved?: string;
  }>;
};

type AdminCityDetail = DashboardCity & {
  latitude?: number;
  longitude?: number;
  mapPlaceCount?: number;
  sidebarCardCount?: number;
  propertyListingCount?: number;
  recommendationCount?: number;
  primaryHost?: {
    name?: string;
    slug?: {
      current?: string;
    };
    status?: string;
    primaryRole?: string;
  } | null;
};

const publicListingStatuses = ["available", "reserved", "sold", "rented"];

const adminCityDetailQuery = `
  *[_type == "city" && slug.current == $citySlug][0]{
    _id,
    name_en,
    name_pt,
    name_nl,
    slug,
    guideStatus,
    country,
    latitude,
    longitude,
    "mapPlaceCount": count(mapPlaces),
    "sidebarCardCount": count(sidebarCards),
    "recommendationCount": count(recommendations),
    "propertyListingCount": count(*[
      _type == "propertyListing" &&
      status in $publicStatuses &&
      (
        city._ref == ^._id ||
        cityName in [^.name_en, ^.name_pt, ^.name_nl, ^.slug.current]
      )
    ]),
    primaryHost->{
      name,
      slug,
      status,
      primaryRole
    }
  }
`;

export const metadata: Metadata = {
  title: "Admin City Detail",
};

function coordinateText(city: AdminCityDetail) {
  const hasCoordinates =
    typeof city.latitude === "number" && typeof city.longitude === "number";

  return hasCoordinates ? `${city.latitude}, ${city.longitude}` : "Missing";
}

export default async function AdminCityDetailPage({ params, searchParams }: PageProps) {
  const [{ citySlug }, { error, saved }] = await Promise.all([
    params,
    searchParams,
  ]);
  await requireAdmin(`/dashboard/admin/cities/${citySlug}`);
  const city = await client.fetch<AdminCityDetail | null>(adminCityDetailQuery, {
    citySlug,
    publicStatuses: publicListingStatuses,
  });

  if (!city) {
    notFound();
  }

  const name = cityName(city);
  const hostSlug = city.primaryHost?.slug?.current;
  const cards: DashboardCardProps[] = [
    {
      title: "City dashboard editors",
      text: "Edit city guide content, sidebar cards, and recommendations with the same permissions as city hosts.",
      href: `/dashboard/cities/${citySlug}`,
      action: "Open editors",
      status: "Admin",
    },
    {
      title: "Map management",
      text: "Review map places, categories, coordinates, and property listing coordinate readiness for this city.",
      href: `/dashboard/admin/cities/${citySlug}/map`,
      action: "Open map management",
      status: "Admin",
    },
    {
      title: "Public city page",
      text: `Open the current public guide page for ${name}.`,
      href: cityGuidePath("en", citySlug),
      action: "View public page",
      status: city.guideStatus || "live",
    },
    {
      title: "Sanity fallback",
      text: "Open Studio if this city needs edits before dashboard editing tools exist.",
      href: "/studio/structure/city",
      action: "Open Studio cities",
      status: "Studio",
    },
  ];

  return (
    <DashboardShell
      eyebrow="Admin city"
      title={name}
      intro="A read-only city workspace foundation for future content, sidebar, map, coordinate, and property management tools."
    >
      <BackToDashboard />

      {error ? (
        <p className="mb-6 rounded-xl border border-red-300/40 bg-red-950/30 p-4 text-sm text-red-100">
          {error}
        </p>
      ) : null}
      {saved === "status" ? (
        <p className="mb-6 rounded-xl border border-emerald-300/30 bg-emerald-950/20 p-4 text-sm text-emerald-100">
          City visibility updated.
        </p>
      ) : null}

      <section className="mb-8 rounded-2xl border border-white/10 bg-white/10 p-6">
        <div className="mb-5 flex flex-wrap gap-2">
          <Pill>{city.country || "Brazil"}</Pill>
          <Pill>{city.guideStatus || "live"}</Pill>
          <Pill>{city.slug?.current || "No slug"}</Pill>
        </div>

        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          <div>
            <p className="text-xs uppercase tracking-widest text-stone-400">
              Primary host
            </p>
            <p className="mt-2 text-lg text-white">
              {city.primaryHost?.name || "Missing"}
            </p>
            {hostSlug ? (
              <p className="mt-2 text-sm">
                <TableLink href={providerProfilePath("en", hostSlug)}>
                  Public provider profile
                </TableLink>
              </p>
            ) : null}
          </div>
          <div>
            <p className="text-xs uppercase tracking-widest text-stone-400">
              City coordinates
            </p>
            <p className="mt-2 text-lg text-white">{coordinateText(city)}</p>
          </div>
          <div>
            <p className="text-xs uppercase tracking-widest text-stone-400">
              Content counts
            </p>
            <p className="mt-2 text-lg text-white">
              {city.mapPlaceCount || 0} map places
            </p>
            <p className="text-sm text-stone-300">
              {city.sidebarCardCount || 0} sidebar cards
            </p>
            <p className="text-sm text-stone-300">
              {city.recommendationCount || 0} recommendations
            </p>
            <p className="text-sm text-stone-300">
              {city.propertyListingCount || 0} property listings
            </p>
          </div>
        </div>

        <form
          action={updateCityStatusAction}
          className="mt-6 flex flex-col gap-3 border-t border-white/10 pt-6 sm:flex-row sm:items-end"
        >
          <input type="hidden" name="cityId" value={city._id} />
          <input type="hidden" name="citySlug" value={citySlug} />
          <label className="flex-1">
            <span className="mb-2 block text-xs uppercase tracking-widest text-stone-400">
              Marketing visibility
            </span>
            <select
              name="guideStatus"
              defaultValue={city.guideStatus || "live"}
              className="w-full rounded-lg border border-white/15 bg-[#1a1f2e] px-4 py-3 text-sm text-white"
            >
              <option value="hidden">Hidden — nowhere public</option>
              <option value="comingSoon">Coming soon — marketing only</option>
              <option value="live">Active — guide available when complete</option>
            </select>
          </label>
          <button
            type="submit"
            className="rounded-lg bg-[#d6a85a] px-5 py-3 text-sm font-medium text-[#1a1f2e] transition hover:bg-white"
          >
            Save visibility
          </button>
        </form>
      </section>

      <div className="grid gap-5 md:grid-cols-2">
        {cards.map((card) => (
          <DashboardCard key={card.title} {...card} />
        ))}
      </div>
    </DashboardShell>
  );
}
