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
import { JsonLdScript } from "@/app/lib/structuredData";
import type { CityLiveInfo } from "@/app/lib/cityLiveInfo";
import {
  cityInterpreterPath,
  interpreterCityForSlug,
  interpreterRoute,
} from "@/app/lib/interpreterPages";
import CityLiveInfoWidget from "@/app/components/CityLiveInfoWidget";
import CityExperienceLayout from "@/app/components/CityExperienceLayout";
import type { PropertyListing } from "@/app/components/PropertyListingPage";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
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

type ServiceCard = {
  title: string;
  text?: string;
  button: string;
  href: string;
};

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

const fallbackGuideCopy = {
  en: {
    recommendationGuidesTitle: "Guides from local hosts",
    recommendationGuidesIntro: (cityName: string) =>
      `Curated ${cityName} guides with local context and practical advice from people who know the city.`,
    readRecommendation: "Read Recommendation",
    relatedPlaces: "Places mentioned in this guide",
    relatedHost: "Local contributor",
    relatedCity: "Related city guide",
    legacyRecommendationsTitle: "Earlier local picks",
    recommendationLink: "Open link",
    recommendationPick: "Home in the City pick",
    realEstateTitle: (cityName: string) => `${cityName} real estate`,
    realEstateButton: "View properties",
  },
  pt: {
    recommendationGuidesTitle: "Guias dos anfitriões locais",
    recommendationGuidesIntro: (cityName: string) =>
      `Guias selecionados de ${cityName}, com contexto local e conselhos práticos de quem conhece a cidade.`,
    readRecommendation: "Ler Recomendação",
    relatedPlaces: "Lugares mencionados neste guia",
    relatedHost: "Colaborador local",
    relatedCity: "Guia de cidade relacionado",
    legacyRecommendationsTitle: "Indicações locais anteriores",
    recommendationLink: "Abrir link",
    recommendationPick: "Indicação Home in the City",
    realEstateTitle: (cityName: string) => `Imóveis em ${cityName}`,
    realEstateButton: "Ver imóveis",
  },
  nl: {
    recommendationGuidesTitle: "Gidsen van lokale hosts",
    recommendationGuidesIntro: (cityName: string) =>
      `Samengestelde gidsen voor ${cityName}, met lokale context en praktisch advies van mensen die de stad kennen.`,
    readRecommendation: "Lees Aanbeveling",
    relatedPlaces: "Plaatsen genoemd in deze gids",
    relatedHost: "Lokale bijdrager",
    relatedCity: "Gerelateerde stadsgids",
    legacyRecommendationsTitle: "Eerdere lokale tips",
    recommendationLink: "Open link",
    recommendationPick: "Home in the City tip",
    realEstateTitle: (cityName: string) => `Vastgoed in ${cityName}`,
    realEstateButton: "Bekijk woningen",
  },
};

function normalizeHref(href?: string) {
  return href?.replace(/\/$/, "") || "";
}

function getLocalizedHref(card: SidebarCard, lang: Lang) {
  return normalizeHref(card[`href_${lang}`]);
}

function isExactDuplicateSidebarCard(
  card: SidebarCard,
  lang: Lang,
  serviceHrefs: Set<string>,
) {
  const href = getLocalizedHref(card, lang);
  return Boolean(href && serviceHrefs.has(href));
}

function localizedField<T extends "title" | "text" | "button" | "href">(
  card: SidebarCard,
  field: T,
  lang: Lang,
) {
  const localized = card[`${field}_${lang}`];
  const english = card[`${field}_en`];

  return (localized || english || "").trim();
}

function fallbackServiceCards({
  lang,
  citySlug,
  cityName,
  includeRealEstate,
}: {
  lang: Lang;
  citySlug: string;
  cityName: string;
  includeRealEstate: boolean;
}): ServiceCard[] {
  const copy = fallbackGuideCopy[lang];
  const realEstatePrefix =
    lang === "pt" ? "/pt/imoveis" : lang === "nl" ? "/nl/vastgoed" : "/real-estate";

  const cards: ServiceCard[] = [];
  const interpreterCity = interpreterCityForSlug(citySlug);
  const interpreterHref = cityInterpreterPath(citySlug, lang);
  const interpreterContent = interpreterCity?.content[lang];

  if (interpreterHref && interpreterContent) {
    cards.push({
      title: interpreterContent.title,
      text: interpreterContent.serviceIntro,
      button:
        lang === "pt"
          ? "Serviços de intérprete"
          : lang === "nl"
            ? "Tolkdiensten"
            : "Interpreter services",
      href: interpreterHref,
    });
  }

  if (includeRealEstate) {
    cards.push({
      title: copy.realEstateTitle(cityName),
      button: copy.realEstateButton,
      href: `${realEstatePrefix}/${citySlug}`,
    });
  }

  return cards;
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
}: {
  recommendations: CityGuideRecommendationGuide[];
  places: MapPlace[];
  lang: Lang;
  cityName: string;
  copy: (typeof fallbackGuideCopy)[Lang];
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
            className="overflow-hidden rounded-2xl border border-stone-200 bg-stone-50"
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
                  <summary className="inline-flex min-h-11 cursor-pointer list-none items-center rounded-full bg-[#1a1f2e] px-5 py-2.5 text-sm font-medium text-white transition hover:bg-stone-800 [&::-webkit-details-marker]:hidden">
                    {copy.readRecommendation}
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
  const serviceCards = fallbackServiceCards({
    lang,
    citySlug,
    cityName,
    includeRealEstate: propertyListings.length > 0,
  });
  const selectedHost = city?.primaryHost
    ? providerDisplayHost({ provider: city.primaryHost, lang })
    : null;
  const displayHost = selectedHost || (isPortoAlegre ? portoAlegreFallbackHost(lang) : null);
  const primaryHostAction = displayHost?.actions[0];
  const serviceHrefs = new Set(serviceCards.map((card) => normalizeHref(card.href)));
  const hasCityInterpreter = Boolean(cityInterpreterPath(citySlug, lang));
  const sidebarCards: SidebarCard[] = (city?.sidebarCards || []).filter(
    (card) =>
      !isExactDuplicateSidebarCard(card, lang, serviceHrefs) &&
      !(hasCityInterpreter && interpreterRoute(getLocalizedHref(card, lang))),
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
    const hasLivingContent = Boolean(
      experienceCopy.livingIntroduction ||
        experienceCopy.livingBody ||
        serviceCards.length ||
        sidebarCards.length,
    );
    const hasExploreContent = Boolean(
      experienceCopy.exploreIntroduction ||
        mapEntries.length ||
        recommendationGuides.length,
    );
    const hasFavoritesContent = Boolean(
      experienceCopy.favoritesIntroduction ||
        recommendationGroups.length ||
        favoritePlaces.length,
    );
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
      },
      {
        id: "living-working",
        title: experienceCopy.livingTitle || tabLabels.living,
        intro: hasLivingContent ? experienceCopy.livingIntroduction : undefined,
        content: (
          <div className="space-y-6">
            {experienceCopy.livingBody ? (
              <div className="max-w-4xl">
                <RecommendationGuideBody content={experienceCopy.livingBody} />
              </div>
            ) : null}

            {serviceCards.length || sidebarCards.length ? (
              <div className="grid gap-5 md:grid-cols-2">
                {serviceCards.map((card) => (
                  <article
                    key={card.href}
                    className="rounded-2xl border border-stone-200 bg-stone-50 p-6"
                  >
                    <h3 className="text-xl font-medium text-stone-950">
                      {card.title}
                    </h3>
                    {card.text ? (
                      <p className="mt-3 text-sm leading-6 text-stone-700">
                        {card.text}
                      </p>
                    ) : null}
                    {card.href.startsWith("mailto:") ? (
                      <a
                        href={card.href}
                        className="mt-5 inline-flex min-h-11 items-center rounded-full bg-[#1a1f2e] px-5 py-2.5 text-sm text-white hover:bg-stone-800"
                      >
                        {card.button}
                      </a>
                    ) : (
                      <Link
                        href={card.href}
                        className="mt-5 inline-flex min-h-11 items-center rounded-full bg-[#1a1f2e] px-5 py-2.5 text-sm text-white hover:bg-stone-800"
                      >
                        {card.button}
                      </Link>
                    )}
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
                      className="rounded-2xl border border-stone-200 bg-stone-50 p-6"
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
              </div>
            ) : null}
          </div>
        ),
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

            {recommendationGuides.length ? (
              <div className="border-t border-stone-200 pt-8">
                <h3 className="text-2xl font-medium text-stone-950">
                  {fallbackCopy.recommendationGuidesTitle}
                </h3>
                <p className="mt-3 max-w-3xl leading-7 text-stone-600">
                  {fallbackCopy.recommendationGuidesIntro(cityName)}
                </p>
                <div className="mt-6">
                  <ExperienceRecommendationGuides
                    recommendations={recommendationGuides}
                    places={places}
                    lang={lang}
                    cityName={cityName}
                    copy={fallbackCopy}
                  />
                </div>
              </div>
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
      },
      {
        id: "from-host",
        title: tabLabels.host,
        intro: experienceCopy.fromHostIntroduction,
        content: displayHost ? (
          <div className="rounded-2xl border border-stone-200 bg-stone-50 p-5">
            <div>
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
          </div>
        ) : null,
      },
    ];

    const hero = (
      <header className="overflow-hidden rounded-2xl bg-[#1a1f2e] p-5 text-white shadow-xl shadow-black/15 md:rounded-3xl md:p-8">
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
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

          {displayHost ? (
            <div className="shrink-0 text-center">
              <div className="relative mx-auto h-16 w-16 overflow-hidden rounded-full bg-stone-700 md:h-24 md:w-24">
                <Image
                  src={displayHost.photoUrl}
                  alt={displayHost.photoAlt}
                  fill
                  sizes="(max-width: 768px) 64px, 96px"
                  className="object-cover ring-2 ring-white/80"
                />
              </div>
              <p className="mt-2 hidden max-w-28 text-sm font-medium md:block">
                {displayHost.name}
              </p>
              <p className="hidden text-xs text-white/65 md:block">{displayHost.role}</p>
            </div>
          ) : null}
        </div>

        <div className="mt-5 border-t border-white/15 pt-4 md:mt-6 md:pt-5">
          <CityLiveInfoWidget info={initialLiveInfo} lang={lang} />
        </div>
      </header>
    );

    return (
      <div className="relative z-10 min-h-screen overflow-x-clip bg-stone-50 px-3 pb-14 pt-24 md:bg-transparent md:px-6 md:pt-28">
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
