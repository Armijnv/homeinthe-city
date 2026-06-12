"use client";

import { client } from "@/sanity/lib/client";
import { cityQuery } from "@/sanity/lib/queries";
import {
  cityGuideName,
  cityGuidePath,
  isPortoAlegreGuide,
  localizedCityGuideList,
  localizedCityGuideText,
  providerProfilePath,
  type CityGuideContent,
  type CityGuideLang as Lang,
  type CityGuideMapPlace as MapPlace,
  type CityGuideProvider,
  type CityGuideSidebarCard as SidebarCard,
} from "@/app/lib/cityGuides";
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

type WeatherData = {
  temperature_2m: number;
};

type ServiceCard = {
  title: string;
  text: string;
  button: string;
  href: string;
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

/* ======================================================
   PORTO ALEGRE CITY GUIDE CONTENT
====================================================== */

const cityGuideContent = {
  en: {
    title: "Porto Alegre: Your Local Guide in Southern Brazil",
    intro:
      "Discover restaurants, business locations, cultural venues, walks, practical information and trusted local contacts for your stay in Porto Alegre.",
    hostLine:
      "Hosted by Armijn van Dijk, your local contact for business visits, interpretation, housing and practical support in the city.",
    serviceCards: [
      {
        title: "Business interpreter in Porto Alegre",
        text: "Language support for meetings, company visits and local business conversations.",
        button: "Interpreter services",
        href: "/interpreter-porto-alegre",
      },
      {
        title: "Document translation",
        text: "Written translation support for documents, business communication and local projects.",
        button: "Translation services",
        href: "/translation-services",
      },
      {
        title: "Apartments and real estate",
        text: "Furnished stays, rentals and buying guidance for short or longer stays in Porto Alegre.",
        button: "Real estate",
        href: "/real-estate/porto-alegre",
      },
      {
        title: "Local business support",
        text: "Practical help with local planning, restaurants, transport, contacts and meeting days.",
        button: "Meet your host",
        href: "/hosts/armijn",
      },
    ],
  },
  pt: {
    title: "Porto Alegre: Seu Guia Local no Sul do Brasil",
    intro:
      "Descubra restaurantes, locais para negócios, espaços culturais, caminhadas, informações práticas e contatos locais confiáveis para sua estadia em Porto Alegre.",
    hostLine:
      "Com curadoria de Armijn van Dijk, seu contato local para visitas de negócios, interpretação, hospedagem e apoio prático na cidade.",
    serviceCards: [
      {
        title: "Intérprete de negócios em Porto Alegre",
        text: "Apoio no idioma para reuniões, visitas a empresas e conversas de negócios locais.",
        button: "Serviços de intérprete",
        href: "/pt/interprete-porto-alegre",
      },
      {
        title: "Tradução de documentos",
        text: "Apoio em tradução escrita para documentos, comunicação empresarial e projetos locais.",
        button: "Serviços de tradução",
        href: "/pt/servicos-de-traducao",
      },
      {
        title: "Apartamentos e imóveis",
        text: "Estadias mobiliadas, aluguel e orientação de compra para visitas curtas ou mais longas.",
        button: "Imóveis",
        href: "/pt/imoveis/porto-alegre",
      },
      {
        title: "Apoio empresarial local",
        text: "Ajuda prática com planejamento local, restaurantes, transporte, contatos e dias de reunião.",
        button: "Conheça seu anfitrião",
        href: "/pt/hosts/armijn",
      },
    ],
  },
  nl: {
    title: "Porto Alegre: Uw Lokale Gids in Zuid-Brazilië",
    intro:
      "Ontdek restaurants, zakelijke locaties, culturele plekken, wandelroutes, praktische informatie en betrouwbare lokale contacten voor uw verblijf in Porto Alegre.",
    hostLine:
      "Samengesteld door Armijn van Dijk, uw lokale contact voor zakelijke bezoeken, tolken, verblijf en praktische ondersteuning in de stad.",
    serviceCards: [
      {
        title: "Business tolk in Porto Alegre",
        text: "Taalondersteuning voor meetings, bedrijfsbezoeken en lokale zakelijke gesprekken.",
        button: "Tolkdiensten",
        href: "/nl/tolk-porto-alegre",
      },
      {
        title: "Documentvertaling",
        text: "Schriftelijke vertaalhulp voor documenten, zakelijke communicatie en lokale projecten.",
        button: "Vertaaldiensten",
        href: "/nl/vertaaldiensten",
      },
      {
        title: "Appartementen en vastgoed",
        text: "Gemeubileerde verblijven, huur en koophulp voor korte of langere verblijven in Porto Alegre.",
        button: "Vastgoed",
        href: "/nl/vastgoed/porto-alegre",
      },
      {
        title: "Lokale zakelijke hulp",
        text: "Praktische hulp met lokale planning, restaurants, vervoer, contacten en meetingdagen.",
        button: "Ontmoet uw host",
        href: "/nl/hosts/armijn",
      },
    ],
  },
};

const fallbackGuideCopy = {
  en: {
    intro: (cityName: string) =>
      `A Home in the City guide for ${cityName} is being prepared with local context, practical support and curated places.`,
    hostLine:
      "Local recommendations and support options will appear here as the guide grows.",
    placesTitle: "Local picks coming soon",
    placesText:
      "Restaurants, cafés, cultural places and practical city tips will be added from the Sanity City document.",
    realEstateTitle: (cityName: string) => `${cityName} real estate`,
    realEstateText:
      "See available property listings while the city guide is being expanded.",
    realEstateButton: "View properties",
    supportTitle: "Local support",
    supportText:
      "Contact Home in the City for practical questions while this guide is being completed.",
    supportButton: "Contact",
  },
  pt: {
    intro: (cityName: string) =>
      `Um guia da Home in the City para ${cityName} está sendo preparado com contexto local, apoio prático e lugares selecionados.`,
    hostLine:
      "Recomendações locais e opções de apoio aparecerão aqui conforme o guia crescer.",
    placesTitle: "Indicações locais em breve",
    placesText:
      "Restaurantes, cafés, espaços culturais e dicas práticas serão adicionados pelo documento de Cidade no Sanity.",
    realEstateTitle: (cityName: string) => `Imóveis em ${cityName}`,
    realEstateText:
      "Veja anúncios disponíveis enquanto o guia da cidade está sendo expandido.",
    realEstateButton: "Ver imóveis",
    supportTitle: "Apoio local",
    supportText:
      "Entre em contato com a Home in the City para dúvidas práticas enquanto este guia é concluído.",
    supportButton: "Contato",
  },
  nl: {
    intro: (cityName: string) =>
      `Een Home in the City-gids voor ${cityName} wordt voorbereid met lokale context, praktische hulp en geselecteerde plekken.`,
    hostLine:
      "Lokale aanbevelingen en hulpopties verschijnen hier naarmate de gids groeit.",
    placesTitle: "Lokale tips binnenkort",
    placesText:
      "Restaurants, cafés, culturele plekken en praktische stadstips worden toegevoegd vanuit het Sanity City-document.",
    realEstateTitle: (cityName: string) => `Vastgoed in ${cityName}`,
    realEstateText:
      "Bekijk beschikbaar woningaanbod terwijl de stadsgids wordt uitgebreid.",
    realEstateButton: "Bekijk woningen",
    supportTitle: "Lokale hulp",
    supportText:
      "Neem contact op met Home in the City voor praktische vragen terwijl deze gids wordt afgerond.",
    supportButton: "Contact",
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

function Weather({ citySlug }: { citySlug: string }) {
  const [data, setData] = useState<WeatherData | null>(null);

  useEffect(() => {
    if (!isPortoAlegreGuide(citySlug)) return;

    fetch(
      "https://api.open-meteo.com/v1/forecast?latitude=-30.03&longitude=-51.23&current=temperature_2m,weather_code"
    )
      .then((res) => res.json())
      .then((json) => setData(json.current));
  }, [citySlug]);

  if (!isPortoAlegreGuide(citySlug)) return null;

  if (!data) return <p className="text-stone-500">Loading weather...</p>;

  return (
    <p className="font-medium text-stone-700">
      {Math.round(data.temperature_2m)}°C
    </p>
  );
}

function localizedField<T extends "title" | "text" | "button" | "href">(
  card: SidebarCard,
  field: T,
  lang: Lang,
) {
  const localized = card[`${field}_${lang}`];
  const english = card[`${field}_en`];

  return localized || english || "";
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

  if (includeRealEstate) {
    cards.push({
      title: copy.realEstateTitle(cityName),
      text: copy.realEstateText,
      button: copy.realEstateButton,
      href: `${realEstatePrefix}/${citySlug}`,
    });
  }

  cards.push(
    {
      title: copy.supportTitle,
      text: copy.supportText,
      button: copy.supportButton,
      href: "mailto:contact@homeinthe.city",
    },
  );

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
    photoUrl: provider.mainPhoto?.asset?.url || "/me.png",
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

const mapCategoryPresets = [
  {
    id: "restaurant",
    labels: { en: "Restaurant", pt: "Restaurante", nl: "Restaurant" },
    aliases: ["restaurant", "restaurants", "restaurante", "restaurantes"],
  },
  {
    id: "cafe",
    labels: { en: "Café", pt: "Café", nl: "Café" },
    aliases: ["cafe", "cafes", "café", "cafés", "coffee"],
  },
  {
    id: "bakery",
    labels: { en: "Bakery", pt: "Padaria", nl: "Bakkerij" },
    aliases: ["bakery", "bakeries", "padaria", "padarias", "bakkerij", "bakkerijen"],
  },
  {
    id: "beach",
    labels: { en: "Beach", pt: "Praia", nl: "Strand" },
    aliases: ["beach", "beaches", "praia", "praias", "strand", "stranden"],
  },
  {
    id: "surfShop",
    labels: { en: "Surf Shop", pt: "Loja de Surf", nl: "Surfwinkel" },
    aliases: ["surf shop", "surf shops", "surfshop", "loja de surf", "surfwinkel"],
  },
  {
    id: "surfboardRepair",
    labels: {
      en: "Surfboard Repair",
      pt: "Conserto de Pranchas",
      nl: "Surfplank Reparatie",
    },
    aliases: [
      "surfboard repair",
      "surfboard repairs",
      "board repair",
      "conserto de pranchas",
      "surfplank reparatie",
    ],
  },
  {
    id: "organicMarket",
    labels: {
      en: "Organic Market",
      pt: "Feira Orgânica",
      nl: "Biologische Markt",
    },
    aliases: [
      "organic market",
      "organic markets",
      "organic fair",
      "organicfair",
      "feira organica",
      "feira orgânica",
      "biologische markt",
      "biologische markten",
    ],
  },
  {
    id: "coworking",
    labels: { en: "Coworking", pt: "Coworking", nl: "Coworking" },
    aliases: ["coworking", "coworking space", "coworking spaces"],
  },
  {
    id: "walk",
    labels: { en: "Walk", pt: "Caminhada", nl: "Wandeling" },
    aliases: ["walk", "walks", "caminhada", "caminhadas", "wandeling", "wandelingen"],
  },
  {
    id: "museum",
    labels: { en: "Museum", pt: "Museu", nl: "Museum" },
    aliases: ["museum", "museums", "museu", "museus", "musea"],
  },
  {
    id: "liveMusic",
    labels: { en: "Live Music", pt: "Música ao Vivo", nl: "Live Muziek" },
    aliases: ["live music", "livemusic", "music", "musica ao vivo", "música ao vivo", "live muziek"],
  },
  {
    id: "businessService",
    labels: {
      en: "Business Service",
      pt: "Serviço Empresarial",
      nl: "Zakelijke Dienst",
    },
    aliases: [
      "business",
      "business service",
      "business services",
      "servico empresarial",
      "serviço empresarial",
      "zakelijke dienst",
      "zakelijke diensten",
    ],
  },
  {
    id: "yogaSchool",
    labels: { en: "Yoga School", pt: "Escola de Yoga", nl: "Yogaschool" },
    aliases: ["yoga", "yoga school", "yoga schools", "escola de yoga", "yogaschool"],
  },
] as const;

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

function normalizeCategoryAlias(value?: string) {
  return (value || "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/([a-z])([A-Z])/g, "$1 $2")
    .replace(/[^a-zA-Z0-9]+/g, " ")
    .trim()
    .toLowerCase();
}

function slugifyCategory(value: string) {
  return (
    normalizeCategoryAlias(value).replace(/\s+/g, "-") ||
    "other"
  );
}

function customCategoryLabel(place: MapPlace, lang: Lang) {
  return (
    place[`categoryLabel_${lang}`] ||
    place.categoryLabel_en ||
    place.category ||
    "Other"
  );
}

function mapCategoryForPlace(place: MapPlace, lang: Lang) {
  const preset = place.categoryPreset;
  const rawCategory = place.category;

  if (preset && preset !== "custom") {
    const selectedPreset = mapCategoryPresets.find((category) => category.id === preset);

    if (selectedPreset) {
      return {
        id: selectedPreset.id,
        label: selectedPreset.labels[lang],
      };
    }
  }

  const normalizedRaw = normalizeCategoryAlias(rawCategory);
  const matchedPreset = mapCategoryPresets.find(
    (category) =>
      normalizeCategoryAlias(category.id) === normalizedRaw ||
      category.aliases.some((alias) => normalizeCategoryAlias(alias) === normalizedRaw),
  );

  if (matchedPreset && preset !== "custom") {
    return {
      id: matchedPreset.id,
      label: matchedPreset.labels[lang],
    };
  }

  const label = customCategoryLabel(place, lang);

  return {
    id: `custom-${slugifyCategory(place.categoryLabel_en || rawCategory || label)}`,
    label,
  };
}

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

function cityMapEntriesFromPlaces(places: MapPlace[], lang: Lang): CityMapEntry[] {
  return places.flatMap((place, index) => {
    const coordinates = normalizedCoordinates(place.latitude, place.longitude);

    if (!coordinates) return [];

    const category = mapCategoryForPlace(place, lang);

    return [
      {
        id: `place-${category.id}-${place.name}-${index}`,
        sourceType: "place",
        categoryId: category.id,
        categoryLabel: category.label,
        title: place.name,
        subtitle: place.neighborhood,
        detail: place[`detail_${lang}`] || place.detail_en,
        description: place[`description_${lang}`] || place.description_en,
        latitude: coordinates.latitude,
        longitude: coordinates.longitude,
        googleMaps: place.googleMaps,
        website: place.website,
        favorite: place.favorite,
        image: place.image?.asset?.url
          ? {
              url: place.image.asset.url,
              alt: place.name,
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

export default function CityPage({
  lang,
  citySlug,
  initialCity = null,
  initialPropertyListings = [],
}: {
  lang: Lang;
  citySlug: string;
  initialCity?: CityGuideContent | null;
  initialPropertyListings?: PropertyListing[];
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
      weatherTitle: "Weather today",
      cta: "Talk to me",
      profile: "Profile",
      hostCardTitle: "Local host",
      fallbackTitle: "City guide coming soon",
    },
    pt: {
      helpTitle: "Precisa de ajuda na cidade?",
      weatherTitle: "Clima hoje",
      cta: "Fale comigo",
      profile: "Perfil",
      hostCardTitle: "Anfitriao local",
      fallbackTitle: "Guia da cidade em breve",
    },
    nl: {
      helpTitle: "Hulp nodig in de stad?",
      weatherTitle: "Weer vandaag",
      cta: "Stuur me een bericht",
      profile: "Profiel",
      hostCardTitle: "Lokale host",
      fallbackTitle: "Stadsgids binnenkort",
    },
  };

  const t = labels[lang];
  const cityName = cityGuideName(city, lang, citySlug);
  const isPortoAlegre = isPortoAlegreGuide(citySlug);
  const fallbackCopy = fallbackGuideCopy[lang];
  const headline = localizedCityGuideText(city, "headline", lang);
  const intro = localizedCityGuideText(city, "intro", lang);
  const introBlocks = localizedCityGuideList(city, "introBlocks", lang);
  const places: MapPlace[] = city?.mapPlaces || [];
  const mapEntries = [
    ...cityMapEntriesFromPlaces(places, lang),
    ...cityMapEntriesFromListings({ listings: propertyListings, lang, citySlug }),
  ];
  const guide = isPortoAlegre ? cityGuideContent[lang] : null;
  const title = guide?.title || headline || `${cityName}: ${t.fallbackTitle}`;
  const introText = guide?.intro || intro || fallbackCopy.intro(cityName);
  const hostLine = guide?.hostLine || fallbackCopy.hostLine;
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
  const sidebarCards: SidebarCard[] = (city?.sidebarCards || []).filter(
    (card) => !isExactDuplicateSidebarCard(card, lang, serviceHrefs)
  );

  return (
    <div className="relative z-10 min-h-screen overflow-hidden bg-stone-50 px-6 pt-28 pb-14 md:bg-transparent">
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-white/10 via-transparent to-white/20" />

      <div className="relative mx-auto grid max-w-6xl grid-cols-1 gap-8 md:grid-cols-3">
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

        <div className="space-y-8 md:col-span-2">
          <div className="flex gap-3 text-xl">
            <a href={cityGuidePath("en", citySlug)}>🇬🇧</a>
            <a href={cityGuidePath("pt", citySlug)}>🇧🇷</a>
            <a href={cityGuidePath("nl", citySlug)}>🇳🇱</a>
          </div>

          <div className="rounded-3xl bg-white/97 p-8 shadow-2xl shadow-black/15 backdrop-blur-md">
            <h1 className="mb-6 text-4xl font-normal tracking-tight text-black md:text-6xl">
              {title}
            </h1>

            <p className="max-w-2xl font-medium leading-relaxed text-stone-700">
              {introText}
            </p>

            <p className="mt-4 max-w-2xl leading-relaxed text-stone-700">
              {hostLine}
            </p>

            <div className="mt-6 space-y-4">
              {introBlocks.map((block: string, index: number) => (
                <p
                  key={index}
                  className="max-w-2xl leading-relaxed text-stone-700"
                >
                  {block}
                </p>
              ))}
            </div>
          </div>

          {mapEntries.length ? (
            <CityMap
              entries={mapEntries}
              lang={lang}
              cityName={cityName}
              cityCenter={{ latitude: city?.latitude, longitude: city?.longitude }}
            />
          ) : (
            <div className="rounded-3xl bg-white/97 p-6 shadow-lg shadow-black/10 backdrop-blur-sm">
              <h2 className="mb-3 text-2xl text-stone-800">
                {fallbackCopy.placesTitle}
              </h2>
              <p className="leading-relaxed text-stone-600">
                {fallbackCopy.placesText}
              </p>
            </div>
          )}

          <div className="rounded-2xl bg-white/97 p-6 shadow-lg shadow-black/10 backdrop-blur-sm">
            <h2 className="mb-2 text-xl font-medium text-black">{t.helpTitle}</h2>

            <a
              href={primaryHostAction?.href || "mailto:contact@homeinthe.city"}
              target={primaryHostAction?.external ? "_blank" : undefined}
              rel={primaryHostAction?.external ? "noreferrer" : undefined}
              className="inline-block rounded-full bg-[#1a1f2e] px-5 py-3 text-sm text-white hover:bg-stone-800"
            >
              {localizedCityGuideText(city, "cta", lang) || t.cta}
            </a>
          </div>
        </div>

        <div className="space-y-6 pt-24 md:pt-36 lg:pt-0">
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

              <p className="mb-5 text-sm leading-relaxed text-stone-700">
                {card.text}
              </p>

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

          {sidebarCards.map((card, index) => (
            localizedField(card, "title", lang) ? (
              <div
                key={`${getLocalizedHref(card, lang)}-${index}`}
                className="rounded-2xl bg-white/97 p-6 shadow-xl shadow-black/10 backdrop-blur-md"
              >
                <h3 className="mb-3 text-lg font-medium text-black">
                  {localizedField(card, "title", lang)}
                </h3>

                <p className="mb-5 text-sm leading-relaxed text-stone-700">
                  {localizedField(card, "text", lang)}
                </p>

                <a
                  href={localizedField(card, "href", lang)}
                  className="inline-block rounded-full bg-[#1a1f2e] px-5 py-3 text-sm text-white hover:bg-stone-800"
                >
                  {localizedField(card, "button", lang)}
                </a>
              </div>
            ) : null
          ))}

          {isPortoAlegre ? (
            <div className="rounded-2xl bg-white/97 p-6 shadow-xl shadow-black/10 backdrop-blur-md">
              <h3 className="mb-2 text-lg font-medium text-black">{t.weatherTitle}</h3>
              <Weather citySlug={citySlug} />
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
