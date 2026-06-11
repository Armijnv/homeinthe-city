import type { Metadata } from "next";
import { notFound } from "next/navigation";
import {
  BackToDashboard,
  DashboardCard,
  DashboardShell,
  type DashboardCardProps,
} from "@/app/dashboard/dashboard-ui";
import { cityName, getDashboardContext, type DashboardCity } from "@/app/lib/dashboard";
import { client } from "@/sanity/lib/client";

const allCitiesForHostsQuery = `
  *[_type == "city"]|order(name_en asc){
    _id,
    name_en,
    name_pt,
    name_nl,
    slug,
    guideStatus,
    country
  }
`;

export const metadata: Metadata = {
  title: "City Host Dashboard",
};

export default async function CityHostCitiesPage() {
  const context = await getDashboardContext("/dashboard/cities");

  if (!context.isAdmin && !context.isCityHost) {
    notFound();
  }

  const cities = context.isAdmin
    ? await client.fetch<DashboardCity[]>(allCitiesForHostsQuery)
    : context.provider?.cities || [];
  const cards: DashboardCardProps[] = cities
    .filter((city) => city.slug?.current)
    .map((city) => {
      const slug = city.slug?.current || "";

      return {
        title: cityName(city),
        text: "Open the future city-host workspace for city content, recommendations, map places, and coordinate cleanup.",
        href: `/dashboard/cities/${slug}`,
        action: "Open city dashboard",
        status: city.guideStatus || "live",
      };
    });

  return (
    <DashboardShell
      eyebrow="City host"
      title="Assigned cities"
      intro={
        context.isAdmin
          ? "Admin view of every city dashboard foundation."
          : "City dashboards are available only for cities assigned to your provider profile."
      }
    >
      <BackToDashboard />
      <div className="grid gap-5 md:grid-cols-2">
        {cards.map((card) => (
          <DashboardCard key={card.href} {...card} />
        ))}
      </div>
    </DashboardShell>
  );
}
