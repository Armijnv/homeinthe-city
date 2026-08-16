import type {
  CityGuideLang,
  CityGuideSidebarCard,
} from "@/app/lib/cityGuides";
import type {
  CityPageExperienceImage,
  LivingServicePresentations,
} from "@/app/lib/cityPageExperience";
import { interpreterRoute } from "@/app/lib/interpreterPages";
import { cityInterpreterPath } from "@/app/lib/cityInterpreterCoverage";

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
  hasInterpreterCoverage,
  includeRealEstate,
  presentation,
}: {
  lang: CityGuideLang;
  citySlug: string;
  cityName: string;
  hasInterpreterCoverage: boolean;
  includeRealEstate: boolean;
  presentation?: LivingServicePresentations;
}): AutomaticCityServiceCard[] {
  const cards: AutomaticCityServiceCard[] = [];
  const interpreterHref = cityInterpreterPath(citySlug, lang);

  if (hasInterpreterCoverage) {
    const custom = presentation?.interpreter?.[lang];
    cards.push({
      kind: "interpreter",
      title: custom?.title?.trim() ||
        lang === "pt"
          ? `Serviços de intérprete em ${cityName}`
          : lang === "nl"
            ? `Tolkdiensten in ${cityName}`
            : `Interpreter services in ${cityName}`,
      text: custom?.description?.trim(),
      button: custom?.buttonLabel?.trim() ||
        lang === "pt"
          ? "Serviços de intérprete"
          : lang === "nl"
            ? "Tolkdiensten"
            : "Interpreter services",
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

  const hasCityInterpreter = automaticCards.some(
    (card) => card.kind === "interpreter",
  );
  const cityInterpreterHref = normalizeHref(cityInterpreterPath(citySlug, lang));
  return hasCityInterpreter &&
    (href === cityInterpreterHref || Boolean(interpreterRoute(href)))
    ? ("interpreter-service-route" as const)
    : null;
}
