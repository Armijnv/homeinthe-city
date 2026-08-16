"use client";

import { client } from "@/sanity/lib/client";
import { cityQuery } from "@/sanity/lib/queries";
import {
  cityGuideName,
  cityGuideEnabledLanguages,
  cityGuidePath,
  isPortoAlegreGuide,
  localizedCityGuideList,
  localizedCityGuideText,
  providerProfilePath,
  type CityGuideContent,
  type CityGuideLang as Lang,
  type CityGuideMapPlace as MapPlace,
  type CityGuideProvider,
  type CityGuideRecommendation,
  type CityGuideRecommendationGuide,
  type CityGuideSidebarCard as SidebarCard,
} from "@/app/lib/cityGuides";
import { mapCategoryForPlace } from "@/app/lib/mapCategories";
import { portoAlegreExperienceLocale } from "@/app/lib/cityPageExperience";
import {
  localizedRecommendationGuideText,
  mapPlaceAnchorId,
  recommendationCategoryLabel,
} from "@/app/lib/recommendationGuides";
import {
  localizedInformationCardField,
  type CityInformationCard,
  type CityInformationCardSection,
} from "@/app/lib/cityInformationCards";
import { JsonLdScript } from "@/app/lib/structuredData";
import type { CityLiveInfo } from "@/app/lib/cityLiveInfo";
import {
  automaticCityServiceCards,
  hasAutomaticRealEstateService,
  sidebarCardAutomaticServiceOverlap,
} from "@/app/lib/cityServiceCards";
import CityLiveInfoWidget from "@/app/components/CityLiveInfoWidget";
import CityExperienceLayout from "@/app/components/CityExperienceLayout";
import type { PropertyListing } from "@/app/components/PropertyListingPage";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";

const CityMap = dynamic(
  () => import("@/app/components/CityMap").then((mod) => mod.default),
  {
    ssr: false,
    loading: () => (
      <div className="rounded-3xl bg-white p-6">
        <div className="h-[500px] rounded-2xl bg-stone-100" />
      </div>
    ),
  }
);

type CityMapEntry = import("@/app/components/CityMap").CityMapEntry;

type RecommendationGroup = {
  id: string;
  label: string;
  items: CityGuideRecommendation[];
};

type HostAction = {
  label: string;
  href: string;
  external?: boolean;
};

type DisplayHost = {
  name: string;
  role: string;
  photoUrl: string;
  photoAlt: string;
  profileHref?: string;
  actions: HostAction[];
};

function HostPhotoActions({
  host,
  profileLabel,
}: {
  host: DisplayHost;
  profileLabel: string;
}) {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const actionRefs = useRef<Array<HTMLAnchorElement | null>>([]);
  const contactActions = host.actions.filter((action) =>
    ["WhatsApp", "Email"].includes(action.label),
  );
  const actions = [
    ...(host.profileHref
      ? [{ label: profileLabel, href: host.profileHref, external: false }]
      : []),
    ...contactActions,
  ];
  const hasActions = actions.length > 0;

  useEffect(() => {
    if (!open) return;

    const focusTimer = window.requestAnimationFrame(() => {
      actionRefs.current[0]?.focus();
    });

    function handlePointerDown(event: PointerEvent) {
      if (
        event.target instanceof Node &&
        !containerRef.current?.contains(event.target)
      ) {
        setOpen(false);
      }
    }

    function handleKeyDown(event: globalThis.KeyboardEvent) {
      if (event.key === "Escape") {
        setOpen(false);
        buttonRef.current?.focus();
      }
    }

    document.addEventListener("pointerdown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      window.cancelAnimationFrame(focusTimer);
      document.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [open]);

  const photo = (
    <div className="relative h-16 w-16 overflow-hidden rounded-full bg-stone-700 ring-2 ring-white/80 md:h-20 md:w-20">
      <Image
        src={host.photoUrl}
        alt={host.photoAlt}
        fill
        priority
        sizes="(max-width: 768px) 64px, 80px"
        className="object-cover"
      />
    </div>
  );

  if (!hasActions) {
    return <div className="flex min-h-24 items-center justify-center">{photo}</div>;
  }

  return (
    <div
      ref={containerRef}
      className="relative h-32 w-full min-w-0 md:h-36 md:w-56"
    >
      <button
        ref={buttonRef}
        type="button"
        aria-label={`Open contact options for ${host.name}`}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-controls="porto-host-photo-actions"
        onClick={() => setOpen((current) => !current)}
        className="absolute left-3 top-1/2 z-20 -translate-y-1/2 rounded-full focus:outline-none focus:ring-2 focus:ring-[#d6a85a] focus:ring-offset-2 focus:ring-offset-[#1a1f2e] md:left-auto md:right-3"
      >
        {photo}
      </button>

      {open ? (
        <div
          id="porto-host-photo-actions"
          role="menu"
          aria-label={`Contact ${host.name}`}
          className="contents"
        >
          {actions.map((action, index) => {
            const positionClass = [
              "left-24 top-0 md:left-auto md:right-24",
              "left-28 top-11 md:left-auto md:right-28",
              "bottom-0 left-24 md:left-auto md:right-24",
            ][index];
            const className = `absolute z-30 inline-flex min-h-11 max-w-[calc(100%-7rem)] items-center rounded-full border border-stone-200 bg-white px-3.5 py-2 text-sm font-medium text-stone-900 shadow-xl shadow-black/20 transition hover:bg-stone-100 focus:outline-none focus:ring-2 focus:ring-[#d6a85a] ${positionClass}`;

            return action.href.startsWith("/") ? (
              <Link
                key={action.href}
                ref={(element) => {
                  actionRefs.current[index] = element;
                }}
                href={action.href}
                role="menuitem"
                onClick={() => setOpen(false)}
                className={className}
              >
                {action.label}
              </Link>
            ) : (
              <a
                key={action.href}
                ref={(element) => {
                  actionRefs.current[index] = element;
                }}
                href={action.href}
                role="menuitem"
                target={action.external ? "_blank" : undefined}
                rel={action.external ? "noreferrer" : undefined}
                onClick={() => setOpen(false)}
                className={className}
              >
                {action.label}
              </a>
            );
          })}
        </div>
      ) : null}
    </div>
  );
}

const fallbackGuideCopy = {
  en: {
    recommendationGuidesTitle: "Guides from local hosts",
    recommendationGuidesIntro: (cityName: string) =>
      `Curated ${cityName} guides with local context and practical advice from people who know the city.`,
    readRecommendation: "Read Recommendation",
    hostStoriesTitle: "Host stories",
    readStory: "Read story",
    relatedPlaces: "Places mentioned in this guide",
    relatedHost: "Local contributor",
    relatedCity: "Related city guide",
    legacyRecommendationsTitle: "Earlier local picks",
    recommendationLink: "Open link",
    recommendationPick: "Home in the City pick",
  },
  pt: {
    recommendationGuidesTitle: "Guias dos anfitriões locais",
    recommendationGuidesIntro: (cityName: string) =>
      `Guias selecionados de ${cityName}, com contexto local e conselhos práticos de quem conhece a cidade.`,
    readRecommendation: "Ler Recomendação",
    hostStoriesTitle: "Histórias do anfitrião",
    readStory: "Ler história",
    relatedPlaces: "Lugares mencionados neste guia",
    relatedHost: "Colaborador local",
    relatedCity: "Guia de cidade relacionado",
    legacyRecommendationsTitle: "Indicações locais anteriores",
    recommendationLink: "Abrir link",
    recommendationPick: "Indicação Home in the City",
  },
  nl: {
    recommendationGuidesTitle: "Gidsen van lokale hosts",
    recommendationGuidesIntro: (cityName: string) =>
      `Samengestelde gidsen voor ${cityName}, met lokale context en praktisch advies van mensen die de stad kennen.`,
    readRecommendation: "Lees Aanbeveling",
    hostStoriesTitle: "Verhalen van uw host",
    readStory: "Lees verhaal",
    relatedPlaces: "Plaatsen genoemd in deze gids",
    relatedHost: "Lokale bijdrager",
    relatedCity: "Gerelateerde stadsgids",
    legacyRecommendationsTitle: "Eerdere lokale tips",
    recommendationLink: "Open link",
    recommendationPick: "Home in the City tip",
  },
};

function localizedField<T extends "title" | "text" | "button" | "href">(
  card: SidebarCard,
  field: T,
  lang: Lang,
) {
  const localized = card[`${field}_${lang}`];
  const english = card[`${field}_en`];

  return (localized || english || "").trim();
}

const roleLabels: Record<Lang, Record<string, string>> = {
  en: {
    host: "Local host",
    interpreter: "Interpreter",
    translator: "Translator",
    guide: "Guide",
    specialist: "City specialist",
    realtor: "Real estate agent",
  },
  pt: {
    host: "Anfitriao local",
    interpreter: "Interprete",
    translator: "Tradutor",
    guide: "Guia",
    specialist: "Especialista local",
    realtor: "Corretor de imóveis",
  },
  nl: {
    host: "Lokale host",
    interpreter: "Tolk",
    translator: "Vertaler",
    guide: "Gids",
    specialist: "Stadsspecialist",
    realtor: "Makelaar",
  },
};

function roleLabel(lang: Lang, role?: string) {
  if (!role) return roleLabels[lang].host;

  return roleLabels[lang][role] || role;
}

function whatsappHref(value?: string) {
  if (!value) return "";
  if (value.startsWith("http")) return value;

  const digits = value.replace(/\D/g, "");
  return digits ? `https://wa.me/${digits}` : "";
}

function websiteHref(value?: string) {
  if (!value) return "";
  return value.startsWith("http") ? value : `https://${value}`;
}

function hostActions(provider: CityGuideProvider): HostAction[] {
  const contact = provider.contactOptions;
  const actions: HostAction[] = [];
  const whatsapp = whatsappHref(contact?.whatsapp);
  const email = contact?.email;
  const website = websiteHref(contact?.website);

  if (whatsapp) {
    actions.push({ label: "WhatsApp", href: whatsapp, external: true });
  }

  if (email) {
    actions.push({ label: "Email", href: `mailto:${email}` });
  }

  if (website) {
    actions.push({ label: "Website", href: website, external: true });
  }

  return actions;
}

function providerDisplayHost({
  provider,
  lang,
}: {
  provider: CityGuideProvider;
  lang: Lang;
}): DisplayHost | null {
  if (!provider.name) return null;

  const providerSlug = provider.slug?.current;

  return {
    name: provider.name,
    role: roleLabel(lang, provider.primaryRole || provider.roles?.[0]),
    photoUrl:
      provider.mainPhoto?.asset?.url || "/profile-placeholder.svg",
    photoAlt: provider.mainPhoto?.alt || provider.name,
    profileHref: providerSlug ? providerProfilePath(lang, providerSlug) : undefined,
    actions: hostActions(provider),
  };
}

function portoAlegreFallbackHost(lang: Lang): DisplayHost {
  return {
    name: "Armijn van Dijk",
    role: roleLabel(lang, "host"),
    photoUrl: "/me.png",
    photoAlt: "Armijn van Dijk",
    profileHref: providerProfilePath(lang, "armijn"),
    actions: [
      {
        label: "WhatsApp",
        href: "https://wa.me/5551997783369",
        external: true,
      },
      { label: "Email", href: "mailto:contact@homeinthe.city" },
    ],
  };
}

const propertyMapLabels = {
  en: {
    rentCategory: "Property for Rent",
    saleCategory: "Property for Sale",
    rentBadge: "For rent",
    saleBadge: "For sale",
    viewProperty: "View property",
    bedrooms: "bed",
    bathrooms: "bath",
    parking: "parking",
  },
  pt: {
    rentCategory: "Aluguel",
    saleCategory: "Imóvel à Venda",
    rentBadge: "Para alugar",
    saleBadge: "À venda",
    viewProperty: "Ver imóvel",
    bedrooms: "quartos",
    bathrooms: "banheiros",
    parking: "vagas",
  },
  nl: {
    rentCategory: "Huurwoning",
    saleCategory: "Koopwoning",
    rentBadge: "Te huur",
    saleBadge: "Te koop",
    viewProperty: "Bekijk woning",
    bedrooms: "slaapkamers",
    bathrooms: "badkamers",
    parking: "parkeren",
  },
};

const localeByLang: Record<Lang, string> = {
  en: "en-US",
  pt: "pt-BR",
  nl: "nl-NL",
};

function localizedListingText(
  listing: PropertyListing,
  field: "title" | "shortDescription",
  lang: Lang,
) {
  const values = listing as Record<string, unknown>;
  const localized = values[`${field}_${lang}`];
  const english = values[`${field}_en`];

  if (typeof localized === "string" && localized.trim()) return localized;
  if (typeof english === "string" && english.trim()) return english;

  return "";
}

function listingUrl(lang: Lang, citySlug: string, listingSlug: string) {
  const prefix =
    lang === "pt" ? "/pt/imoveis" : lang === "nl" ? "/nl/vastgoed" : "/real-estate";
  return `${prefix}/${citySlug}/${listingSlug}`;
}

function normalizedCoordinates(latitude?: number, longitude?: number) {
  const valid =
    typeof latitude === "number" &&
    Number.isFinite(latitude) &&
    latitude >= -90 &&
    latitude <= 90 &&
    typeof longitude === "number" &&
    Number.isFinite(longitude) &&
    longitude >= -180 &&
    longitude <= 180;

  return valid ? { latitude, longitude } : null;
}

function formatListingPrice(listing: PropertyListing, lang: Lang) {
  if (typeof listing.price !== "number") return "";

  return new Intl.NumberFormat(localeByLang[lang], {
    style: "currency",
    currency: listing.currency || "BRL",
    maximumFractionDigits: 0,
  }).format(listing.price);
}

function listingDetail(listing: PropertyListing, lang: Lang) {
  const t = propertyMapLabels[lang];
  const details = [
    formatListingPrice(listing, lang),
    typeof listing.bedrooms === "number" ? `${listing.bedrooms} ${t.bedrooms}` : "",
    typeof listing.bathrooms === "number" ? `${listing.bathrooms} ${t.bathrooms}` : "",
    typeof listing.parkingSpaces === "number"
      ? `${listing.parkingSpaces} ${t.parking}`
      : "",
    typeof listing.areaM2 === "number" ? `${listing.areaM2} m²` : "",
  ].filter(Boolean);

  return details.join(" · ");
}

function localizedMapPlaceText(
  place: MapPlace,
  field: "name" | "detail" | "description",
  lang: Lang,
) {
  const values = place as Record<string, unknown>;
  const localized = values[`${field}_${lang}`];
  const english = values[`${field}_en`];
  const legacy = field === "name" ? place.name : "";

  if (typeof localized === "string" && localized.trim()) return localized;
  if (typeof english === "string" && english.trim()) return english;
  if (legacy.trim()) return legacy;

  return "";
}

function localizedRecommendationText(
  recommendation: CityGuideRecommendation,
  field: "name" | "detail" | "description",
  lang: Lang,
) {
  const values = recommendation as Record<string, unknown>;
  const localized = values[`${field}_${lang}`];
  const english = values[`${field}_en`];
  const legacy = field === "name" ? recommendation.name : "";

  if (typeof localized === "string" && localized.trim()) return localized;
  if (typeof english === "string" && english.trim()) return english;
  if (legacy?.trim()) return legacy;

  return "";
}

function groupedRecommendations(
  recommendations: CityGuideRecommendation[],
  lang: Lang,
): RecommendationGroup[] {
  return recommendations.reduce<RecommendationGroup[]>((groups, recommendation) => {
    const title = localizedRecommendationText(recommendation, "name", lang);

    if (!title) return groups;

    const category = mapCategoryForPlace(recommendation, lang);
    const existing = groups.find((group) => group.id === category.id);

    if (existing) {
      existing.items.push(recommendation);
    } else {
      groups.push({
        id: category.id,
        label: category.label,
        items: [recommendation],
      });
    }

    return groups;
  }, []);
}

function RecommendationGuideBody({ content }: { content: string }) {
  const blocks = content
    .split(/\n\s*\n/)
    .map((block) => block.trim())
    .filter(Boolean);

  return blocks.map((block, index) => {
    const lines = block.split(/\r?\n/).map((line) => line.trim());
    const isList = lines.length > 0 && lines.every((line) => line.startsWith("- "));

    if (isList) {
      return (
        <ul key={index} className="list-disc space-y-2 pl-5 text-stone-700">
          {lines.map((line) => (
            <li key={line}>{line.slice(2).trim()}</li>
          ))}
        </ul>
      );
    }

    return (
      <p key={index} className="whitespace-pre-line leading-7 text-stone-700">
        {block}
      </p>
    );
  });
}

function recommendationGuideJsonLd({
  recommendations,
  lang,
  cityName,
  citySlug,
}: {
  recommendations: CityGuideRecommendationGuide[];
  lang: Lang;
  cityName: string;
  citySlug: string;
}) {
  const url = `https://homeinthe.city${cityGuidePath(lang, citySlug)}`;
  const items = recommendations.flatMap((recommendation, index) => {
    const values = recommendation as Record<string, unknown>;
    const title = localizedRecommendationGuideText(values, "title", lang);
    if (!title) return [];

    return [
      {
        "@type": "ListItem",
        position: index + 1,
        item: {
          "@type": "Article",
          headline: title,
          description: localizedRecommendationGuideText(
            values,
            "introduction",
            lang,
          ),
          articleBody: localizedRecommendationGuideText(values, "content", lang),
          about: [
            { "@type": "City", name: cityName },
            recommendationCategoryLabel(recommendation, lang),
          ],
          author: recommendation.relatedProvider?.name
            ? { "@type": "Person", name: recommendation.relatedProvider.name }
            : { "@type": "Organization", name: "Home in the City" },
          image: recommendation.featuredImage?.asset?.url,
          isPartOf: url,
        },
      },
    ];
  });

  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: `${cityName} local recommendation guides`,
    itemListElement: items,
  };
}

function cityMapEntriesFromPlaces(places: MapPlace[], lang: Lang): CityMapEntry[] {
  return places.flatMap((place, index) => {
    const coordinates = normalizedCoordinates(place.latitude, place.longitude);

    if (!coordinates) return [];

    const category = mapCategoryForPlace(place, lang);
    const title = localizedMapPlaceText(place, "name", lang);
    const detail = localizedMapPlaceText(place, "detail", lang);
    const description =
      localizedMapPlaceText(place, "description", lang) || detail;

    return [
      {
        id: place._key
          ? mapPlaceAnchorId(place._key)
          : `place-${category.id}-${title || place.name}-${index}`,
        sourceType: "place",
        categoryId: category.id,
        categoryLabel: category.label,
        title: title || place.name,
        subtitle: place.neighborhood,
        detail,
        description,
        latitude: coordinates.latitude,
        longitude: coordinates.longitude,
        googleMaps: place.googleMaps,
        website: place.website,
        favorite: place.favorite,
        image: place.image?.asset?.url
          ? {
              url: place.image.asset.url,
              alt: place.image.alt || title || place.name,
            }
          : undefined,
        videoUrl: place.video?.asset?.url,
      },
    ];
  });
}

function cityMapEntriesFromListings({
  listings,
  lang,
  citySlug,
}: {
  listings: PropertyListing[];
  lang: Lang;
  citySlug: string;
}): CityMapEntry[] {
  const t = propertyMapLabels[lang];

  return listings.flatMap((listing) => {
    const coordinates = normalizedCoordinates(
      listing.mapCoordinates?.lat,
      listing.mapCoordinates?.lng,
    );
    const listingSlug = listing.slug?.current;

    if (!listingSlug || !coordinates) return [];

    const listingCitySlug = listing.city?.slug?.current || citySlug;
    const isSale = listing.listingType === "sale";
    const categoryId = isSale ? "property-sale" : "property-rent";

    return [
      {
        id: `property-${listingSlug}`,
        sourceType: "property",
        categoryId,
        categoryLabel: isSale ? t.saleCategory : t.rentCategory,
        title: localizedListingText(listing, "title", lang) || listingSlug,
        subtitle: listing.neighborhood,
        detail: listingDetail(listing, lang),
        description: localizedListingText(listing, "shortDescription", lang),
        latitude: coordinates.latitude,
        longitude: coordinates.longitude,
        href: listingUrl(lang, listingCitySlug, listingSlug),
        actionLabel: t.viewProperty,
        badge: isSale ? t.saleBadge : t.rentBadge,
        image: listing.mainImage?.asset?.url
          ? {
              url: listing.mainImage.asset.url,
              alt: listing.mainImage.alt || localizedListingText(listing, "title", lang),
            }
          : undefined,
      },
    ];
  });
}

function ExperienceRecommendationGuides({
  recommendations,
  places,
  lang,
  cityName,
  copy,
  presentation = "guide",
}: {
  recommendations: CityGuideRecommendationGuide[];
  places: MapPlace[];
  lang: Lang;
  cityName: string;
  copy: (typeof fallbackGuideCopy)[Lang];
  presentation?: "guide" | "host-story";
}) {
  if (!recommendations.length) return null;

  return (
    <div className="space-y-5">
      {recommendations.map((recommendation, index) => {
        const values = recommendation as Record<string, unknown>;
        const title = localizedRecommendationGuideText(values, "title", lang);
        if (!title) return null;

        const introduction = localizedRecommendationGuideText(
          values,
          "introduction",
          lang,
        );
        const content = localizedRecommendationGuideText(values, "content", lang);
        const relatedPlaces = places.filter(
          (place) =>
            place._key &&
            recommendation.relatedMapPlaceKeys?.includes(place._key),
        );
        const relatedProviderSlug = recommendation.relatedProvider?.slug?.current;
        const relatedCitySlug = recommendation.relatedCity?.slug?.current;
        const relatedCityName = relatedCitySlug
          ? cityGuideName(recommendation.relatedCity, lang, relatedCitySlug)
          : "";

        return (
          <article
            key={recommendation._key || `${title}-${index}`}
            className="min-w-0 overflow-hidden rounded-2xl border border-stone-200 bg-stone-50 shadow-sm shadow-stone-900/5"
          >
            {recommendation.featuredImage?.asset?.url ? (
              <div className="relative aspect-[16/8] w-full bg-stone-200">
                <Image
                  src={recommendation.featuredImage.asset.url}
                  alt={recommendation.featuredImage.alt || `${title}, ${cityName}`}
                  fill
                  sizes="(max-width: 768px) 100vw, 1080px"
                  className="object-cover"
                />
              </div>
            ) : null}

            <div className="p-5 sm:p-6">
              <p className="text-xs font-medium uppercase tracking-[0.16em] text-[#9b6b22]">
                {recommendationCategoryLabel(recommendation, lang)}
              </p>
              <h3 className="mt-2 text-xl font-medium text-stone-950 sm:text-2xl">
                {title}
              </h3>

              {introduction ? (
                <p className="mt-3 max-w-3xl leading-7 text-stone-700">
                  {introduction}
                </p>
              ) : null}

              {content ? (
                <details className="group mt-5 border-t border-stone-200 pt-4">
                  <summary className="inline-flex min-h-11 cursor-pointer list-none items-center rounded-full bg-[#1a1f2e] px-5 py-2.5 text-sm font-medium text-white transition hover:bg-stone-800 focus:outline-none focus:ring-2 focus:ring-[#b99455] focus:ring-offset-2 [&::-webkit-details-marker]:hidden">
                    {presentation === "host-story"
                      ? copy.readStory
                      : copy.readRecommendation}
                  </summary>
                  <div className="mt-6 space-y-5">
                    <RecommendationGuideBody content={content} />

                    {relatedPlaces.length ? (
                      <aside className="rounded-xl border border-stone-200 bg-white p-4">
                        <h4 className="font-medium text-stone-900">
                          {copy.relatedPlaces}
                        </h4>
                        <ul className="mt-3 grid gap-2 sm:grid-cols-2">
                          {relatedPlaces.map((place) => (
                            <li key={place._key}>
                              {presentation === "host-story" ? (
                                <span className="inline-flex min-h-11 items-center rounded-full border border-stone-300 bg-stone-50 px-4 py-2 text-sm font-medium text-stone-800">
                                  {localizedMapPlaceText(place, "name", lang)}
                                </span>
                              ) : (
                                <a
                                  href={`#${mapPlaceAnchorId(place._key || "")}`}
                                  className="inline-flex min-h-11 items-center rounded-full border border-stone-300 bg-stone-50 px-4 py-2 text-sm font-medium text-stone-800 transition hover:border-stone-400 hover:bg-stone-100 focus:outline-none focus:ring-2 focus:ring-[#b99455]"
                                >
                                  {localizedMapPlaceText(place, "name", lang)}
                                </a>
                              )}
                            </li>
                          ))}
                        </ul>
                      </aside>
                    ) : null}

                    {relatedProviderSlug || relatedCitySlug ? (
                      <div className="flex flex-wrap gap-3 border-t border-stone-200 pt-5 text-sm">
                        {relatedProviderSlug ? (
                          <Link
                            href={providerProfilePath(lang, relatedProviderSlug)}
                            className="rounded-full border border-stone-300 px-4 py-2 text-stone-800 hover:bg-white"
                          >
                            {copy.relatedHost}: {recommendation.relatedProvider?.name}
                          </Link>
                        ) : null}
                        {relatedCitySlug ? (
                          <Link
                            href={cityGuidePath(lang, relatedCitySlug)}
                            className="rounded-full border border-stone-300 px-4 py-2 text-stone-800 hover:bg-white"
                          >
                            {copy.relatedCity}: {relatedCityName}
                          </Link>
                        ) : null}
                      </div>
                    ) : null}
                  </div>
                </details>
              ) : null}
            </div>
          </article>
        );
      })}
    </div>
  );
}

function SupportingInformationCards({
  cards,
  lang,
}: {
  cards: CityInformationCard[];
  lang: Lang;
}) {
  return cards.map((card, index) => {
    const title = localizedInformationCardField(card, "title", lang);
    const text = localizedInformationCardField(card, "text", lang);
    const button = localizedInformationCardField(card, "button", lang);
    const href = localizedInformationCardField(card, "href", lang);
    const imageUrl = card.image?.asset?.url;
    if (!title && !text && !imageUrl) return null;

    return (
      <article
        key={card._key || `${card.section}-${index}`}
        className="min-w-0 overflow-hidden rounded-2xl bg-white shadow-xl shadow-black/10"
      >
        {imageUrl ? (
          <div className="relative aspect-[16/8] w-full bg-stone-200">
            <Image
              src={imageUrl}
              alt={card.image?.alt || title}
              fill
              sizes="(max-width: 1023px) 100vw, 360px"
              className="object-cover"
            />
          </div>
        ) : null}
        <div className="p-5">
          {title ? (
            <h3 className="text-xl font-medium text-stone-950">{title}</h3>
          ) : null}
          {text ? (
            <p className={`${title ? "mt-3" : ""} text-sm leading-6 text-stone-700`}>
              {text}
            </p>
          ) : null}
          {href && button ? (
            <a
              href={href}
              className="mt-5 inline-flex min-h-11 max-w-full items-center rounded-full bg-[#1a1f2e] px-5 py-2.5 text-sm text-white hover:bg-stone-800"
            >
              {button}
            </a>
          ) : null}
        </div>
      </article>
    );
  });
}

function ExperienceRecommendations({
  groups,
  favoritePlaces,
  lang,
  copy,
}: {
  groups: RecommendationGroup[];
  favoritePlaces: MapPlace[];
  lang: Lang;
  copy: (typeof fallbackGuideCopy)[Lang];
}) {
  if (!groups.length && !favoritePlaces.length) return null;

  return (
    <div className="space-y-7">
      {groups.map((group) => (
        <div
          key={group.id}
          className="border-t border-stone-200 pt-5 first:border-t-0 first:pt-0"
        >
          <h3 className="mb-4 text-lg font-medium text-stone-900">
            {group.label}
          </h3>

          <div className="grid gap-4 sm:grid-cols-2">
            {group.items.map((recommendation, index) => {
              const title = localizedRecommendationText(
                recommendation,
                "name",
                lang,
              );
              const detail = localizedRecommendationText(
                recommendation,
                "detail",
                lang,
              );
              const description = localizedRecommendationText(
                recommendation,
                "description",
                lang,
              );

              return (
                <details
                  key={`${group.id}-${title}-${index}`}
                  className="group rounded-2xl border border-stone-200 bg-stone-50 open:bg-white"
                >
                  <summary className="cursor-pointer list-none p-4 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-[#b99455] [&::-webkit-details-marker]:hidden">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        {recommendation.favorite ? (
                          <p className="mb-1 text-xs uppercase tracking-widest text-[#9b6b22]">
                            {copy.recommendationPick}
                          </p>
                        ) : null}
                        <h4 className="text-base font-medium text-stone-950">{title}</h4>
                        {recommendation.neighborhood ? (
                          <p className="mt-1 text-sm text-stone-500">
                            {recommendation.neighborhood}
                          </p>
                        ) : null}
                        {detail ? (
                          <p className="mt-2 text-sm leading-6 text-stone-700">{detail}</p>
                        ) : null}
                      </div>
                      <span aria-hidden="true" className="mt-1 text-stone-500 transition group-open:rotate-45">
                        +
                      </span>
                    </div>
                  </summary>
                  {description && description !== detail ? (
                    <p className="border-t border-stone-200 px-4 pt-4 text-sm leading-6 text-stone-600">
                      {description}
                    </p>
                  ) : null}
                  {recommendation.website ? (
                    <div className="px-4 pb-4 pt-3">
                      <a
                        href={recommendation.website}
                        target={recommendation.website.startsWith("http") ? "_blank" : undefined}
                        rel={recommendation.website.startsWith("http") ? "noreferrer" : undefined}
                        className="inline-flex min-h-11 items-center rounded-full bg-[#1a1f2e] px-4 py-2 text-sm text-white hover:bg-stone-800"
                      >
                        {copy.recommendationLink}
                      </a>
                    </div>
                  ) : null}
                </details>
              );
            })}
          </div>
        </div>
      ))}

      {!groups.length && favoritePlaces.length ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {favoritePlaces.map((place, index) => {
            const title = localizedMapPlaceText(place, "name", lang);
            const detail = localizedMapPlaceText(place, "detail", lang);
            const description = localizedMapPlaceText(place, "description", lang);

            return (
              <details
                key={place._key || `${title}-${index}`}
                className="group rounded-2xl border border-stone-200 bg-stone-50 open:bg-white"
              >
                <summary className="cursor-pointer list-none p-4 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-[#b99455] [&::-webkit-details-marker]:hidden">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="mb-1 text-xs uppercase tracking-widest text-[#9b6b22]">
                        {copy.recommendationPick}
                      </p>
                      <h3 className="text-base font-medium text-stone-950">{title}</h3>
                      {place.neighborhood ? (
                        <p className="mt-1 text-sm text-stone-500">{place.neighborhood}</p>
                      ) : null}
                      {detail ? (
                        <p className="mt-2 text-sm leading-6 text-stone-700">{detail}</p>
                      ) : null}
                    </div>
                    <span aria-hidden="true" className="mt-1 text-stone-500 transition group-open:rotate-45">
                      +
                    </span>
                  </div>
                </summary>
                {description && description !== detail ? (
                  <p className="border-t border-stone-200 px-4 py-4 text-sm leading-6 text-stone-600">
                    {description}
                  </p>
                ) : null}
              </details>
            );
          })}
        </div>
      ) : null}
    </div>
  );
}

export default function CityPage({
  lang,
  citySlug,
  initialCity = null,
  initialPropertyListings = [],
  initialLiveInfo = null,
}: {
  lang: Lang;
  citySlug: string;
  initialCity?: CityGuideContent | null;
  initialPropertyListings?: PropertyListing[];
  initialLiveInfo?: CityLiveInfo | null;
}) {
  const [city, setCity] = useState<CityGuideContent | null>(initialCity);
  const [propertyListings, setPropertyListings] = useState<PropertyListing[]>(
    initialPropertyListings,
  );
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (initialCity?.slug?.current === citySlug) {
      return;
    }

    client.fetch<CityGuideContent | null>(cityQuery, { slug: citySlug }).then((nextCity) => {
      setCity(nextCity);
      setPropertyListings([]);
    });
  }, [citySlug, initialCity, initialPropertyListings]);

  const labels = {
    en: {
      helpTitle: "Need help in the city?",
      cta: "Talk to me",
      profile: "Profile",
      hostCardTitle: "Local host",
      discoverTitle: "What would you like to discover?",
    },
    pt: {
      helpTitle: "Precisa de ajuda na cidade?",
      cta: "Fale comigo",
      profile: "Perfil",
      hostCardTitle: "Anfitriao local",
      discoverTitle: "O que você gostaria de descobrir?",
    },
    nl: {
      helpTitle: "Hulp nodig in de stad?",
      cta: "Stuur me een bericht",
      profile: "Profiel",
      hostCardTitle: "Lokale host",
      discoverTitle: "Wat wilt u ontdekken?",
    },
  };

  const t = labels[lang];
  const cityName = cityGuideName(city, lang, citySlug);
  const isPortoAlegre = isPortoAlegreGuide(citySlug);
  const fallbackCopy = fallbackGuideCopy[lang];
  const headline = localizedCityGuideText(city, "headline", lang);
  const intro = localizedCityGuideText(city, "intro", lang);
  const introBlocks = localizedCityGuideList(city, "introBlocks", lang)
    .map((block) => block.trim())
    .filter(Boolean);
  const places: MapPlace[] = city?.mapPlaces || [];
  const recommendationGuides = (city?.recommendationGuides || []).filter((recommendation) =>
    Boolean(localizedRecommendationGuideText(recommendation as Record<string, unknown>, "title", lang)),
  );
  const recommendationGroups = groupedRecommendations(city?.recommendations || [], lang);
  const mapEntries = [
    ...cityMapEntriesFromPlaces(places, lang),
    ...cityMapEntriesFromListings({ listings: propertyListings, lang, citySlug }),
  ];
  const title = headline || localizedCityGuideText(city, "name", lang);
  const introText = intro;
  const hostLine = "";
  const includeAutomaticRealEstate = isPortoAlegre
    ? hasAutomaticRealEstateService(propertyListings)
    : propertyListings.length > 0;
  const serviceCards = automaticCityServiceCards({
    lang,
    citySlug,
    cityName,
    hasInterpreterCoverage: city?.hasInterpreterCoverage === true,
    includeRealEstate: includeAutomaticRealEstate,
    presentation: city?.cityPageExperience?.livingServices,
  });
  const selectedHost = city?.primaryHost
    ? providerDisplayHost({ provider: city.primaryHost, lang })
    : null;
  const displayHost = selectedHost || (isPortoAlegre ? portoAlegreFallbackHost(lang) : null);
  const primaryHostAction = displayHost?.actions[0];
  const sidebarCards: SidebarCard[] = (city?.sidebarCards || []).filter(
    (card) =>
      !sidebarCardAutomaticServiceOverlap({
        card,
        lang,
        citySlug,
        automaticCards: serviceCards,
      }),
  );

  if (isPortoAlegre) {
    const experienceCopy = portoAlegreExperienceLocale(
      city?.cityPageExperience,
      lang,
    );
    const tabLabels = {
      en: {
        about: "About the City",
        living: "Living & Working",
        explore: "Explore the City",
        host: "From Your Host",
      },
      pt: {
        about: "Sobre a Cidade",
        living: "Viver e Trabalhar",
        explore: "Explore a Cidade",
        host: "Do Seu Anfitrião",
      },
      nl: {
        about: "Over de Stad",
        living: "Wonen & Werken",
        explore: "Ontdek de Stad",
        host: "Van Uw Host",
      },
    }[lang];
    const navigationItems = [
      {
        id: "about-city",
        title: tabLabels.about,
      },
      {
        id: "living-working",
        title: tabLabels.living,
      },
      {
        id: "explore-city",
        title: tabLabels.explore,
      },
      {
        id: "from-host",
        title: tabLabels.host,
      },
    ];
    const favoritePlaces = places.filter((place) => place.favorite);
    const informationCardsFor = (section: CityInformationCardSection) =>
      (city?.informationCards || []).filter(
        (card) =>
          card.section === section &&
          Boolean(
            localizedInformationCardField(card, "title", lang) ||
              localizedInformationCardField(card, "text", lang) ||
              card.image?.asset?.url,
          ),
      );
    const aboutInformationCards = informationCardsFor("about");
    const exploreInformationCards = informationCardsFor("explore");
    const fromHostInformationCards = informationCardsFor("fromHost");
    const hasLivingContent = Boolean(
      experienceCopy.livingIntroduction ||
        experienceCopy.livingBody ||
        serviceCards.length ||
        sidebarCards.length,
    );
    const hasExploreContent = Boolean(
      experienceCopy.exploreIntroduction ||
        mapEntries.length,
    );
    const hasFavoritesContent = Boolean(
      experienceCopy.favoritesIntroduction ||
        recommendationGroups.length ||
        favoritePlaces.length,
    );
    const hostProfileCard = displayHost ? (
      <div className="rounded-2xl bg-white p-5 shadow-xl shadow-black/10">
        <h3 className="text-2xl font-medium text-stone-950">
          {displayHost.name}
        </h3>
        <p className="mt-1 text-stone-600">{displayHost.role}</p>
        <div className="mt-6 flex flex-wrap gap-3">
          {displayHost.profileHref ? (
            <Link
              href={displayHost.profileHref}
              className="inline-flex min-h-11 items-center rounded-full border border-stone-300 px-5 py-2.5 text-sm text-stone-800 hover:bg-stone-50"
            >
              {t.profile}
            </Link>
          ) : null}

          {displayHost.actions.map((action, index) => (
            <a
              key={action.href}
              href={action.href}
              target={action.external ? "_blank" : undefined}
              rel={action.external ? "noreferrer" : undefined}
              className="inline-flex min-h-11 items-center rounded-full bg-[#1a1f2e] px-5 py-2.5 text-sm text-white hover:bg-stone-800"
            >
              {index === 0
                ? localizedCityGuideText(city, "cta", lang) || t.cta
                : action.label}
            </a>
          ))}
        </div>
      </div>
    ) : null;
    const sections = [
      {
        id: "about-city",
        title: experienceCopy.aboutTitle || tabLabels.about,
        intro: intro || undefined,
        content: introBlocks.length ? (
          <div className="max-w-4xl">
            <RecommendationGuideBody content={introBlocks.join("\n\n")} />
          </div>
        ) : null,
        supportingContent: aboutInformationCards.length ? (
          <SupportingInformationCards cards={aboutInformationCards} lang={lang} />
        ) : null,
      },
      {
        id: "living-working",
        title: experienceCopy.livingTitle || tabLabels.living,
        intro: hasLivingContent ? experienceCopy.livingIntroduction : undefined,
        content: experienceCopy.livingBody ? (
          <RecommendationGuideBody content={experienceCopy.livingBody} />
        ) : null,
        supportingContent:
          serviceCards.length || sidebarCards.length ? (
            <>
              {serviceCards.map((card) => (
                <article
                  key={card.href}
                  className="min-w-0 overflow-hidden rounded-2xl bg-white shadow-xl shadow-black/10"
                >
                  {card.image?.asset?.url ? (
                    <div className="relative h-32 w-full bg-stone-200 md:h-36">
                      <Image
                        src={card.image.asset.url}
                        alt={card.image.alt || card.title}
                        fill
                        sizes="(max-width: 1023px) 100vw, 360px"
                        className="object-cover"
                      />
                    </div>
                  ) : null}
                  <div className="p-5">
                    <h3 className="text-xl font-medium text-stone-950">
                      {card.title}
                    </h3>
                    {card.text ? (
                      <p className="mt-3 text-sm leading-6 text-stone-700">
                        {card.text}
                      </p>
                    ) : null}
                    <Link
                      href={card.href}
                      className="mt-5 inline-flex min-h-11 items-center rounded-full bg-[#1a1f2e] px-5 py-2.5 text-sm text-white hover:bg-stone-800"
                    >
                      {card.button}
                    </Link>
                  </div>
                </article>
              ))}

              {sidebarCards.map((card, index) => {
                const cardTitle = localizedField(card, "title", lang);
                const cardText = localizedField(card, "text", lang);
                const cardHref = localizedField(card, "href", lang);
                const cardButton = localizedField(card, "button", lang);

                return cardTitle ? (
                  <article
                    key={`${cardHref}-${index}`}
                    className="min-w-0 rounded-2xl bg-white p-5 shadow-xl shadow-black/10"
                  >
                    <h3 className="text-xl font-medium text-stone-950">
                      {cardTitle}
                    </h3>
                    {cardText ? (
                      <p className="mt-3 text-sm leading-6 text-stone-700">
                        {cardText}
                      </p>
                    ) : null}
                    {cardHref && cardButton ? (
                      <a
                        href={cardHref}
                        className="mt-5 inline-flex min-h-11 items-center rounded-full bg-[#1a1f2e] px-5 py-2.5 text-sm text-white hover:bg-stone-800"
                      >
                        {cardButton}
                      </a>
                    ) : null}
                  </article>
                ) : null;
              })}
            </>
          ) : null,
      },
      {
        id: "explore-city",
        title: experienceCopy.exploreTitle || tabLabels.explore,
        intro: hasExploreContent ? experienceCopy.exploreIntroduction : undefined,
        content: (
          <div className="space-y-8">
            {mapEntries.length ? (
              <CityMap
                entries={mapEntries}
                lang={lang}
                cityName={cityName}
                cityCenter={{
                  latitude: city?.latitude,
                  longitude: city?.longitude,
                }}
                edgeToEdgeMobile
              />
            ) : null}

            {hasFavoritesContent ? (
              <div className="border-t border-stone-200 pt-8">
                {experienceCopy.favoritesTitle ? (
                  <h3 className="text-2xl font-medium text-stone-950">
                    {experienceCopy.favoritesTitle}
                  </h3>
                ) : null}
                {experienceCopy.favoritesIntroduction ? (
                  <p className="mt-3 max-w-3xl leading-7 text-stone-600">
                    {experienceCopy.favoritesIntroduction}
                  </p>
                ) : null}
                <div className="mt-5">
                  <ExperienceRecommendations
                    groups={recommendationGroups}
                    favoritePlaces={favoritePlaces}
                    lang={lang}
                    copy={fallbackCopy}
                  />
                </div>
              </div>
            ) : null}
          </div>
        ),
        supportingContent: exploreInformationCards.length ? (
          <SupportingInformationCards cards={exploreInformationCards} lang={lang} />
        ) : null,
        supportingLayout: "below" as const,
      },
      {
        id: "from-host",
        title: tabLabels.host,
        intro: experienceCopy.fromHostIntroduction,
        content: recommendationGuides.length ? (
          <div className="min-w-0">
            <h3 className="text-2xl font-medium text-stone-950">
              {fallbackCopy.hostStoriesTitle}
            </h3>
            <div className="mt-5">
              <ExperienceRecommendationGuides
                recommendations={recommendationGuides}
                places={places}
                lang={lang}
                cityName={cityName}
                copy={fallbackCopy}
                presentation="host-story"
              />
            </div>
          </div>
        ) : null,
        supportingContent:
          hostProfileCard || fromHostInformationCards.length ? (
            <>
              {hostProfileCard}
              <SupportingInformationCards
                cards={fromHostInformationCards}
                lang={lang}
              />
            </>
          ) : null,
      },
    ];

    const cityPageBackgroundMode =
      city?.cityPageBackgroundMode ||
      (city?.heroImage?.asset?.url ? "custom" : "default");
    const cityPageBackground =
      cityPageBackgroundMode === "none"
        ? null
        : cityPageBackgroundMode === "custom"
          ? city?.heroImage?.asset?.url || null
          : "/porto-alegre-desktop-background.jpg";
    const hero = (
      <header className="overflow-hidden rounded-2xl bg-[#1a1f2e] p-5 text-white shadow-xl shadow-black/15 md:rounded-3xl md:p-7">
        <div className="grid min-w-0 gap-5 lg:grid-cols-[minmax(0,1.15fr)_minmax(28rem,0.95fr)] lg:items-center lg:gap-7">
          <div className="min-w-0 md:py-2">
            <div className="flex gap-3 text-xl" aria-label="City guide languages">
              {cityGuideEnabledLanguages(city).map((language) => (
                <a
                  key={language}
                  href={cityGuidePath(language, citySlug)}
                  aria-label={
                    language === "en"
                      ? "English"
                      : language === "pt"
                        ? "Portuguese"
                        : "Dutch"
                  }
                  aria-current={language === lang ? "page" : undefined}
                  className="rounded-sm focus:outline-none focus:ring-2 focus:ring-[#d6a85a]"
                >
                  {language === "en" ? "🇬🇧" : language === "pt" ? "🇧🇷" : "🇳🇱"}
                </a>
              ))}
            </div>

            <h1 className="mt-4 text-3xl font-normal tracking-tight md:text-5xl">
              {cityName}
            </h1>
            {headline ? (
              <p className="mt-3 max-w-2xl text-sm font-medium leading-6 text-white/85 md:text-lg md:leading-7">
                {headline}
              </p>
            ) : null}
          </div>

          <div className="min-w-0 border-t border-white/15 pt-5 lg:border-l lg:border-t-0 lg:pl-7 lg:pt-0">
            <div className={`grid min-w-0 gap-4 ${displayHost ? "sm:grid-cols-[minmax(13rem,0.9fr)_minmax(0,1.1fr)] sm:items-center" : ""}`}>
              {displayHost ? (
                <div className="min-w-0">
                  <HostPhotoActions host={displayHost} profileLabel={t.profile} />
                  <div className="-mt-1 text-center md:mt-0">
                    <p className="truncate text-sm font-medium">{displayHost.name}</p>
                    <p className="truncate text-xs text-white/65">{displayHost.role}</p>
                  </div>
                </div>
              ) : null}
              <CityLiveInfoWidget info={initialLiveInfo} lang={lang} compact />
            </div>
          </div>
        </div>
      </header>
    );

    return (
      <div
        className={`relative z-10 min-h-screen overflow-x-clip px-3 pb-14 pt-24 md:px-6 md:pt-28 ${
          cityPageBackgroundMode === "none" ? "bg-[#1a1f2e]" : "bg-stone-100"
        }`}
      >
        {recommendationGuides.length ? (
          <JsonLdScript
            data={recommendationGuideJsonLd({
              recommendations: recommendationGuides,
              lang,
              cityName,
              citySlug,
            })}
          />
        ) : null}
        {cityPageBackground ? (
          <div className="pointer-events-none fixed inset-0 z-0 hidden md:block">
            <Image
              src={cityPageBackground}
              alt=""
              aria-hidden="true"
              fill
              priority
              sizes="(min-width: 768px) 100vw, 1px"
              className="object-cover"
            />
            <div className="absolute inset-0 bg-white/25" />
          </div>
        ) : null}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-white/10 via-transparent to-white/20" />

        <CityExperienceLayout
          hero={hero}
          navigationItems={navigationItems}
          sections={sections}
        />
      </div>
    );
  }

  return (
    <div className="relative z-10 min-h-screen overflow-hidden bg-stone-50 px-6 pt-28 pb-14 md:bg-transparent">
      {recommendationGuides.length ? (
        <JsonLdScript
          data={recommendationGuideJsonLd({
            recommendations: recommendationGuides,
            lang,
            cityName,
            citySlug,
          })}
        />
      ) : null}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-white/10 via-transparent to-white/20" />

      <div className="relative mx-auto grid max-w-6xl grid-cols-1 gap-5 md:grid-cols-3 md:gap-8">
        {displayHost ? (
          <div className="fixed right-4 top-24 z-[70] group md:right-8 lg:top-24">
            <div
              className="relative h-20 w-20 cursor-pointer md:h-24 md:w-24 lg:h-28 lg:w-28"
              onClick={() => setOpen(!open)}
            >
              <Image
                src={displayHost.photoUrl}
                alt={displayHost.photoAlt}
                fill
                sizes="(max-width: 768px) 80px, (max-width: 1024px) 96px, 112px"
                className="rounded-full border-4 border-white object-cover shadow-xl"
              />
            </div>

            {open && (
              <>
                {displayHost.profileHref ? (
                  <a
                    href={displayHost.profileHref}
                    className="absolute right-28 top-2 rounded-full bg-white px-4 py-2 text-sm font-medium text-stone-900 shadow-xl hover:bg-stone-100 md:right-28 lg:right-32"
                  >
                    {t.profile}
                  </a>
                ) : null}

                {displayHost.actions.slice(0, 2).map((action, index) => (
                  <a
                    key={action.href}
                    href={action.href}
                    target={action.external ? "_blank" : undefined}
                    rel={action.external ? "noreferrer" : undefined}
                    className={
                      index === 0
                        ? "absolute right-32 top-16 rounded-full bg-white px-4 py-2 text-sm font-medium text-stone-900 shadow-xl hover:bg-stone-100 md:right-32 lg:right-36 lg:top-20"
                        : "absolute right-20 top-[7.5rem] rounded-full bg-white px-4 py-2 text-sm font-medium text-stone-900 shadow-xl hover:bg-stone-100 md:right-20 lg:right-24 lg:top-36"
                    }
                  >
                    {action.label}
                  </a>
                ))}
              </>
            )}
          </div>
        ) : null}

        <div className="space-y-4 md:col-span-2 md:space-y-8">
          <div className="max-w-[calc(100%-5.75rem)] md:hidden">
            <CityLiveInfoWidget info={initialLiveInfo} lang={lang} />
          </div>

          <div className="flex gap-3 text-xl" aria-label="City guide languages">
            {cityGuideEnabledLanguages(city).map((language) => (
              <a
                key={language}
                href={cityGuidePath(language, citySlug)}
                aria-label={
                  language === "en"
                    ? "English"
                    : language === "pt"
                      ? "Portuguese"
                      : "Dutch"
                }
                aria-current={language === lang ? "page" : undefined}
              >
                {language === "en" ? "🇬🇧" : language === "pt" ? "🇧🇷" : "🇳🇱"}
              </a>
            ))}
          </div>

          {title || introText || hostLine || introBlocks.length ? (
            <div className="rounded-3xl bg-white/97 p-8 shadow-2xl shadow-black/15 backdrop-blur-md">
              {title ? <h1 className="mb-6 text-4xl font-normal tracking-tight text-black md:text-6xl">{title}</h1> : null}
              {introText ? <p className="max-w-2xl font-medium leading-relaxed text-stone-700">{introText}</p> : null}
              {hostLine ? <p className="mt-4 max-w-2xl leading-relaxed text-stone-700">{hostLine}</p> : null}
              {introBlocks.length ? <div className="mt-6 space-y-4">{introBlocks.map((block: string, index: number) => <p key={index} className="max-w-2xl leading-relaxed text-stone-700">{block}</p>)}</div> : null}
            </div>
          ) : null}

          {mapEntries.length ? <CityMap entries={mapEntries} lang={lang} cityName={cityName} cityCenter={{ latitude: city?.latitude, longitude: city?.longitude }} /> : null}

          {recommendationGuides.length ? (
            <section
              aria-labelledby="recommendation-guides-title"
              className="rounded-3xl bg-white/97 p-6 shadow-lg shadow-black/10 backdrop-blur-sm"
            >
              <h2
                id="recommendation-guides-title"
                className="text-2xl text-stone-800"
              >
                {fallbackCopy.recommendationGuidesTitle}
              </h2>
              <p className="mt-3 max-w-2xl leading-7 text-stone-600">
                {fallbackCopy.recommendationGuidesIntro(cityName)}
              </p>

              <div className="mt-6 space-y-5">
                {recommendationGuides.map((recommendation, index) => {
                  const values = recommendation as Record<string, unknown>;
                  const title = localizedRecommendationGuideText(values, "title", lang);
                  if (!title) return null;

                  const introduction = localizedRecommendationGuideText(
                    values,
                    "introduction",
                    lang,
                  );
                  const content = localizedRecommendationGuideText(values, "content", lang);
                  const relatedPlaces = places.filter(
                    (place) =>
                      place._key &&
                      recommendation.relatedMapPlaceKeys?.includes(place._key),
                  );
                  const relatedProviderSlug =
                    recommendation.relatedProvider?.slug?.current;
                  const relatedCitySlug = recommendation.relatedCity?.slug?.current;
                  const relatedCityName = relatedCitySlug
                    ? cityGuideName(recommendation.relatedCity, lang, relatedCitySlug)
                    : "";

                  return (
                    <article
                      key={recommendation._key || `${title}-${index}`}
                      className="overflow-hidden rounded-2xl border border-stone-200 bg-stone-50"
                    >
                      {recommendation.featuredImage?.asset?.url ? (
                        <div className="relative aspect-[16/8] w-full bg-stone-200">
                          <Image
                            src={recommendation.featuredImage.asset.url}
                            alt={recommendation.featuredImage.alt || `${title}, ${cityName}`}
                            fill
                            sizes="(max-width: 768px) 100vw, 720px"
                            className="object-cover"
                          />
                        </div>
                      ) : null}

                      <div className="p-5 sm:p-6">
                        <p className="text-xs font-medium uppercase tracking-[0.16em] text-[#9b6b22]">
                          {recommendationCategoryLabel(recommendation, lang)}
                        </p>
                        <h3 className="mt-2 text-xl font-medium text-stone-950 sm:text-2xl">
                          {title}
                        </h3>
                        {introduction ? (
                          <p className="mt-3 max-w-3xl leading-7 text-stone-700">
                            {introduction}
                          </p>
                        ) : null}

                        {content ? (
                          <details className="group mt-5 border-t border-stone-200 pt-4">
                            <summary className="inline-flex min-h-11 cursor-pointer list-none items-center rounded-full bg-[#1a1f2e] px-5 py-2.5 text-sm font-medium text-white transition hover:bg-stone-800 [&::-webkit-details-marker]:hidden">
                              {fallbackCopy.readRecommendation}
                            </summary>
                            <div className="mt-6 space-y-5">
                              <RecommendationGuideBody content={content} />

                              {relatedPlaces.length ? (
                                <aside className="rounded-xl border border-stone-200 bg-white p-4">
                                  <h4 className="font-medium text-stone-900">
                                    {fallbackCopy.relatedPlaces}
                                  </h4>
                                  <ul className="mt-3 grid gap-2 sm:grid-cols-2">
                                    {relatedPlaces.map((place) => (
                                      <li key={place._key}>
                                        <a
                                          href={`#${mapPlaceAnchorId(place._key || "")}`}
                                          className="inline-flex min-h-11 items-center rounded-full border border-stone-300 bg-stone-50 px-4 py-2 text-sm font-medium text-stone-800 transition hover:border-stone-400 hover:bg-stone-100 focus:outline-none focus:ring-2 focus:ring-[#b99455]"
                                        >
                                          {localizedMapPlaceText(place, "name", lang)}
                                        </a>
                                      </li>
                                    ))}
                                  </ul>
                                </aside>
                              ) : null}

                              {(relatedProviderSlug || relatedCitySlug) ? (
                                <div className="flex flex-wrap gap-3 border-t border-stone-200 pt-5 text-sm">
                                  {relatedProviderSlug ? (
                                    <Link
                                      href={providerProfilePath(lang, relatedProviderSlug)}
                                      className="rounded-full border border-stone-300 px-4 py-2 text-stone-800 hover:bg-white"
                                    >
                                      {fallbackCopy.relatedHost}: {recommendation.relatedProvider?.name}
                                    </Link>
                                  ) : null}
                                  {relatedCitySlug ? (
                                    <Link
                                      href={cityGuidePath(lang, relatedCitySlug)}
                                      className="rounded-full border border-stone-300 px-4 py-2 text-stone-800 hover:bg-white"
                                    >
                                      {fallbackCopy.relatedCity}: {relatedCityName}
                                    </Link>
                                  ) : null}
                                </div>
                              ) : null}
                            </div>
                          </details>
                        ) : null}
                      </div>
                    </article>
                  );
                })}
              </div>
            </section>
          ) : null}

          {recommendationGroups.length ? (
            <section className="rounded-3xl bg-white/97 p-6 shadow-lg shadow-black/10 backdrop-blur-sm">
              <h2 className="mb-5 text-2xl text-stone-800">
                {fallbackCopy.legacyRecommendationsTitle}
              </h2>

              <div className="space-y-7">
                {recommendationGroups.map((group) => (
                  <div
                    key={group.id}
                    className="border-t border-stone-200 pt-5 first:border-t-0 first:pt-0"
                  >
                    <h3 className="mb-4 text-lg font-medium text-stone-900">
                      {group.label}
                    </h3>

                    <div className="grid gap-4 sm:grid-cols-2">
                      {group.items.map((recommendation, index) => {
                        const title = localizedRecommendationText(
                          recommendation,
                          "name",
                          lang,
                        );
                        const detail = localizedRecommendationText(
                          recommendation,
                          "detail",
                          lang,
                        );
                        const description = localizedRecommendationText(
                          recommendation,
                          "description",
                          lang,
                        );

                        return (
                          <article
                            key={`${group.id}-${title}-${index}`}
                            className="border-t border-stone-200 pt-4 first:border-t-0 first:pt-0 sm:border-t-0 sm:pt-0"
                          >
                            {recommendation.favorite ? (
                              <p className="mb-2 text-xs uppercase tracking-widest text-[#9b6b22]">
                                {fallbackCopy.recommendationPick}
                              </p>
                            ) : null}

                            <h4 className="text-base font-medium text-stone-950">
                              {title}
                            </h4>

                            {recommendation.neighborhood ? (
                              <p className="mt-1 text-sm text-stone-500">
                                {recommendation.neighborhood}
                              </p>
                            ) : null}

                            {detail ? (
                              <p className="mt-3 text-sm leading-6 text-stone-700">
                                {detail}
                              </p>
                            ) : null}

                            {description && description !== detail ? (
                              <p className="mt-3 text-sm leading-6 text-stone-600">
                                {description}
                              </p>
                            ) : null}

                            {recommendation.website ? (
                              <a
                                href={recommendation.website}
                                target={
                                  recommendation.website.startsWith("http")
                                    ? "_blank"
                                    : undefined
                                }
                                rel={
                                  recommendation.website.startsWith("http")
                                    ? "noreferrer"
                                    : undefined
                                }
                                className="mt-4 inline-block rounded-full bg-[#1a1f2e] px-4 py-2 text-sm text-white hover:bg-stone-800"
                              >
                                {fallbackCopy.recommendationLink}
                              </a>
                            ) : null}
                          </article>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          ) : null}

          {primaryHostAction ? <div className="rounded-2xl bg-white/97 p-6 shadow-lg shadow-black/10 backdrop-blur-sm">
            <h2 className="mb-2 text-xl font-medium text-black">{t.helpTitle}</h2>

            <a
              href={primaryHostAction.href}
              target={primaryHostAction.external ? "_blank" : undefined}
              rel={primaryHostAction.external ? "noreferrer" : undefined}
              className="inline-block rounded-full bg-[#1a1f2e] px-5 py-3 text-sm text-white hover:bg-stone-800"
            >
              {localizedCityGuideText(city, "cta", lang) || t.cta}
            </a>
          </div> : null}
        </div>

        <div className="space-y-6 pt-24 md:pt-36 lg:pt-0">
          <div className="hidden md:block">
            <CityLiveInfoWidget info={initialLiveInfo} lang={lang} />
          </div>

          {displayHost ? (
            <div className="rounded-2xl bg-white/97 p-6 shadow-xl shadow-black/10 backdrop-blur-md">
              <h3 className="mb-4 text-lg font-medium text-black">
                {t.hostCardTitle}
              </h3>

              <div className="flex items-center gap-4">
                <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-full bg-stone-200">
                  <Image
                    src={displayHost.photoUrl}
                    alt={displayHost.photoAlt}
                    fill
                    sizes="64px"
                    className="object-cover"
                  />
                </div>

                <div>
                  <p className="font-medium text-stone-900">{displayHost.name}</p>
                  <p className="text-sm text-stone-600">{displayHost.role}</p>
                </div>
              </div>

              <div className="mt-5 flex flex-wrap gap-2">
                {displayHost.profileHref ? (
                  <Link
                    href={displayHost.profileHref}
                    className="inline-block rounded-full border border-stone-200 px-4 py-2 text-sm text-stone-800 hover:bg-stone-100"
                  >
                    {t.profile}
                  </Link>
                ) : null}

                {displayHost.actions.map((action) => (
                  <a
                    key={action.href}
                    href={action.href}
                    target={action.external ? "_blank" : undefined}
                    rel={action.external ? "noreferrer" : undefined}
                    className="inline-block rounded-full bg-[#1a1f2e] px-4 py-2 text-sm text-white hover:bg-stone-800"
                  >
                    {action.label}
                  </a>
                ))}
              </div>
            </div>
          ) : null}

          {/* ======================================================
             SECONDARY SERVICE ENTRY POINTS
          ====================================================== */}

          {serviceCards.map((card) => (
            <div
              key={card.href}
              className="rounded-2xl bg-white/97 p-6 shadow-xl shadow-black/10 backdrop-blur-md"
            >
              <h3 className="mb-3 text-lg font-medium text-black">
                {card.title}
              </h3>

              {card.text ? <p className="mb-5 text-sm leading-relaxed text-stone-700">{card.text}</p> : null}

              {card.href.startsWith("mailto:") ? (
                <a
                  href={card.href}
                  className="inline-block rounded-full bg-[#1a1f2e] px-5 py-3 text-sm text-white hover:bg-stone-800"
                >
                  {card.button}
                </a>
              ) : (
                <Link
                  href={card.href}
                  className="inline-block rounded-full bg-[#1a1f2e] px-5 py-3 text-sm text-white hover:bg-stone-800"
                >
                  {card.button}
                </Link>
              )}
            </div>
          ))}

          {/* ======================================================
             SANITY CITY CARDS
          ====================================================== */}

          {sidebarCards.map((card, index) => {
            const cardTitle = localizedField(card, "title", lang);
            const cardText = localizedField(card, "text", lang);
            const cardHref = localizedField(card, "href", lang);
            const cardButton = localizedField(card, "button", lang);

            return cardTitle ? (
              <div
                key={`${cardHref}-${index}`}
                className="rounded-2xl bg-white/97 p-6 shadow-xl shadow-black/10 backdrop-blur-md"
              >
                <h3 className={`${cardText || (cardHref && cardButton) ? "mb-3" : ""} text-lg font-medium text-black`}>{cardTitle}</h3>

                {cardText ? <p className={`${cardHref && cardButton ? "mb-5" : ""} text-sm leading-relaxed text-stone-700`}>{cardText}</p> : null}

                {cardHref && cardButton ? <a href={cardHref} className="inline-block rounded-full bg-[#1a1f2e] px-5 py-3 text-sm text-white hover:bg-stone-800">{cardButton}</a> : null}
              </div>
            ) : null
          })}

        </div>
      </div>
    </div>
  );
}
