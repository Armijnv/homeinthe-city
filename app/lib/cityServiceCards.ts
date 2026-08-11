import type {
  CityGuideLang,
  CityGuideSidebarCard,
} from "@/app/lib/cityGuides";
import type {
  CityPageExperienceImage,
  LivingServicePresentations,
} from "@/app/lib/cityPageExperience";
import {
  cityInterpreterPath,
  interpreterCityForSlug,
  interpreterRoute,
} from "@/app/lib/interpreterPages";

export type AutomaticCityServiceCard = {
  kind: "interpreter" | "real-estate";
  title: string;
  text?: string;
  button: string;
  href: string;
  image?: CityPageExperienceImage;
};

export const automaticRealEstateListingStatuses = [
  "available",
  "reserved",
] as const;

const automaticRealEstateListingStatusSet = new Set<string>(
  automaticRealEstateListingStatuses,
);

type ListingStatusValue = string | null | undefined;

export function qualifiesForAutomaticRealEstateCard(
  listing: ListingStatusValue | { status?: ListingStatusValue },
) {
  const status = typeof listing === "string" ? listing : listing?.status;
  return Boolean(status && automaticRealEstateListingStatusSet.has(status));
}

export function qualifyingAutomaticRealEstateListingCount(
  listings: Array<ListingStatusValue | { status?: ListingStatusValue }>,
) {
  return listings.filter(qualifiesForAutomaticRealEstateCard).length;
}

export function hasAutomaticRealEstateService(
  listings: Array<ListingStatusValue | { status?: ListingStatusValue }>,
) {
  return qualifyingAutomaticRealEstateListingCount(listings) > 0;
}

const realEstateCopy = {
  en: {
    title: (cityName: string) => `${cityName} real estate`,
    button: "View properties",
    pathPrefix: "/real-estate",
  },
  pt: {
    title: (cityName: string) => `Imóveis em ${cityName}`,
    button: "Ver imóveis",
    pathPrefix: "/pt/imoveis",
  },
  nl: {
    title: (cityName: string) => `Vastgoed in ${cityName}`,
    button: "Bekijk woningen",
    pathPrefix: "/nl/vastgoed",
  },
} satisfies Record<
  CityGuideLang,
  {
    title: (cityName: string) => string;
    button: string;
    pathPrefix: string;
  }
>;

export function automaticCityServiceCards({
  lang,
  citySlug,
  cityName,
  includeRealEstate,
  presentation,
}: {
  lang: CityGuideLang;
  citySlug: string;
  cityName: string;
  includeRealEstate: boolean;
  presentation?: LivingServicePresentations;
}): AutomaticCityServiceCard[] {
  const cards: AutomaticCityServiceCard[] = [];
  const interpreterCity = interpreterCityForSlug(citySlug);
  const interpreterHref = cityInterpreterPath(citySlug, lang);
  const interpreterContent = interpreterCity?.content[lang];

  if (interpreterHref && interpreterContent) {
    const custom = presentation?.interpreter?.[lang];
    cards.push({
      kind: "interpreter",
      title: custom?.title?.trim() || interpreterContent.title,
      text: custom?.description?.trim() || interpreterContent.serviceIntro,
      button: custom?.buttonLabel?.trim() || (
        lang === "pt"
          ? "Serviços de intérprete"
          : lang === "nl"
            ? "Tolkdiensten"
            : "Interpreter services"
      ),
      href: interpreterHref,
      image: presentation?.interpreter?.image,
    });
  }

  if (includeRealEstate) {
    const copy = realEstateCopy[lang];
    const custom = presentation?.realEstate?.[lang];
    cards.push({
      kind: "real-estate",
      title: custom?.title?.trim() || copy.title(cityName),
      text: custom?.description?.trim() || undefined,
      button: custom?.buttonLabel?.trim() || copy.button,
      href: `${copy.pathPrefix}/${citySlug}`,
      image: presentation?.realEstate?.image,
    });
  }

  return cards;
}

function normalizeHref(href?: string) {
  return href?.replace(/\/$/, "") || "";
}

export function sidebarCardAutomaticServiceOverlap({
  card,
  lang,
  citySlug,
  automaticCards,
}: {
  card: CityGuideSidebarCard;
  lang: CityGuideLang;
  citySlug: string;
  automaticCards: AutomaticCityServiceCard[];
}) {
  const href = normalizeHref(card[`href_${lang}`]);
  if (!href) return null;

  const exactAutomaticLink = automaticCards.some(
    (automaticCard) => normalizeHref(automaticCard.href) === href,
  );
  if (exactAutomaticLink) return "automatic-service-link" as const;

  const hasCityInterpreter = Boolean(cityInterpreterPath(citySlug, lang));
  return hasCityInterpreter && interpreterRoute(href)
    ? ("interpreter-service-route" as const)
    : null;
}
