import type { Metadata } from "next";
import {
  BackToDashboard,
  DashboardCard,
  DashboardShell,
  type DashboardCardProps,
} from "@/app/dashboard/dashboard-ui";
import { cityGuidePath } from "@/app/lib/cityGuides";
import { cityName, requireCityHost } from "@/app/lib/dashboard";

type PageProps = {
  params: Promise<{
    citySlug: string;
  }>;
};

export const metadata: Metadata = {
  title: "City Dashboard",
};

export default async function CityDashboardPage({ params }: PageProps) {
  const { citySlug } = await params;
  const { city } = await requireCityHost(citySlug);
  const name = cityName(city);
  const cards: DashboardCardProps[] = [
    {
      title: "City content",
      text: "Future tools for headline, intro text, sidebar content, and publication readiness.",
      status: "Coming next",
    },
    {
      title: "Recommendations",
      text: "Future tools for managing restaurants, services, attractions, and local recommendations.",
      status: "Coming next",
    },
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
      intro="A city-specific dashboard. Map place management is available now; content and recommendations tools can be added next."
    >
      <BackToDashboard />
      <div className="grid gap-5 md:grid-cols-2">
        {cards.map((card) => (
          <DashboardCard key={card.title} {...card} />
        ))}
      </div>
    </DashboardShell>
  );
}
