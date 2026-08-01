import Image from "next/image";
import Link from "next/link";
import PropertyListingMedia, {
  type PropertyMediaImage,
} from "@/app/components/PropertyListingMedia";

export type Lang = "en" | "pt" | "nl";

type LocalizedField =
  | "title"
  | "headline"
  | "shortDescription"
  | "longDescription"
  | "neighborhoodDescription"
  | "seoTitle"
  | "seoDescription";

type LocalizedListField = "features" | "nearbyHighlights";

type ListingImage = {
  alt?: string;
  asset?: {
    url?: string;
  };
};

export type PropertyListing = {
  title_en?: string;
  title_pt?: string;
  title_nl?: string;
  slug?: {
    current?: string;
  };
  listingType?: "rent" | "sale";
  status?: "available" | "reserved" | "sold" | "rented" | "hidden" | "archived";
  city?: {
    name_en?: string;
    name_pt?: string;
    name_nl?: string;
    slug?: {
      current?: string;
    };
    country?: string | null;
  };
  cityName?: string;
  neighborhood?: string;
  addressVisibility?: "hidden" | "neighborhood" | "full";
  address?: string;
  price?: number;
  currency?: string;
  monthlyCondoFee?: number;
  propertyTax?: number;
  bedrooms?: number;
  bathrooms?: number;
  parkingSpaces?: number;
  areaM2?: number;
  floor?: number;
  furnished?: boolean;
  minimumStay?: string;
  maximumGuests?: number;
  utilitiesIncluded?: boolean;
  internetIncluded?: boolean;
  cleaningIncluded?: boolean;
  availableFrom?: string;
  petsAllowed?: boolean;
  financingPossible?: boolean;
  occupancyStatus?: "vacant" | "occupied";
  yearBuilt?: number;
  shortDescription_en?: string;
  shortDescription_pt?: string;
  shortDescription_nl?: string;
  longDescription_en?: string;
  longDescription_pt?: string;
  longDescription_nl?: string;
  features_en?: string[];
  features_pt?: string[];
  features_nl?: string[];
  buildingAmenities?: string[];
  apartmentAmenities?: string[];
  parkingAmenities?: string[];
  lifestyleAmenities?: string[];
  neighborhoodDescription_en?: string;
  neighborhoodDescription_pt?: string;
  neighborhoodDescription_nl?: string;
  nearbyHighlights_en?: string[];
  nearbyHighlights_pt?: string[];
  nearbyHighlights_nl?: string[];
  mainImage?: ListingImage;
  gallery?: ListingImage[];
  mapCoordinates?: {
    lat?: number;
    lng?: number;
  };
  videoUrl?: string;
  linkedRealtor?: {
    name?: string;
    slug?: {
      current?: string;
    };
    primaryRole?: string;
    headline_en?: string;
    headline_pt?: string;
    headline_nl?: string;
    contactOptions?: {
      email?: string;
      phone?: string;
      whatsapp?: string;
      website?: string;
      preferredContact?: string;
    };
    mainPhoto?: ListingImage;
    verificationStatus?: string;
  };
  contact?: {
    whatsapp?: string;
    email?: string;
  };
  seoTitle_en?: string;
  seoTitle_pt?: string;
  seoTitle_nl?: string;
  seoDescription_en?: string;
  seoDescription_pt?: string;
  seoDescription_nl?: string;
};

const labels = {
  en: {
    fallbackTitle: "Property unavailable",
    fallbackText: "This property listing is not public or could not be found.",
    eyebrow: "Home in the City Real Estate",
    overview: "Overview",
    gallery: "Gallery",
    openGallery: "View all photos",
    close: "Close",
    previous: "Previous image",
    next: "Next image",
    description: "Residence",
    features: "Highlights",
    amenities: "Amenities",
    details: "Property details",
    location: "Location",
    nearby: "Nearby",
    videoTour: "Video tour",
    realtor: "Realtor",
    verified: "Verified",
    whatsapp: "WhatsApp",
    email: "Email",
    requestViewing: "Request viewing",
    condo: "Condo",
    tax: "Tax",
    furnished: "Furnished",
    notFurnished: "Unfurnished",
    floor: "Floor",
    minimumStay: "Minimum stay",
    maximumGuests: "Maximum guests",
    utilitiesIncluded: "Utilities included",
    internetIncluded: "Internet included",
    cleaningIncluded: "Cleaning included",
    availableFrom: "Available from",
    petsAllowed: "Pets allowed",
    financingPossible: "Financing possible",
    occupancyStatus: "Occupancy",
    vacant: "Vacant",
    occupied: "Occupied",
    yearBuilt: "Year built",
    addressHidden: "Address shared after contact",
    mapHint: "Open approximate location",
    bedrooms: "Bedrooms",
    bathrooms: "Bathrooms",
    area: "Area",
    parking: "Parking",
    noRealtor: "A verified realtor will be assigned to this listing soon.",
    building: "Building",
    apartment: "Apartment",
    parkingGroup: "Parking",
    lifestyle: "Lifestyle",
  },
  pt: {
    fallbackTitle: "Imóvel indisponível",
    fallbackText: "Este anúncio não está público ou não foi encontrado.",
    eyebrow: "Imóveis Home in the City",
    overview: "Resumo",
    gallery: "Galeria",
    openGallery: "Ver todas as fotos",
    close: "Fechar",
    previous: "Imagem anterior",
    next: "Próxima imagem",
    description: "Residência",
    features: "Destaques",
    amenities: "Comodidades",
    details: "Detalhes do imóvel",
    location: "Localização",
    nearby: "Por perto",
    videoTour: "Tour em vídeo",
    realtor: "Corretor",
    verified: "Verificado",
    whatsapp: "WhatsApp",
    email: "Email",
    requestViewing: "Agendar visita",
    condo: "Condomínio",
    tax: "IPTU",
    furnished: "Mobiliado",
    notFurnished: "Sem mobília",
    floor: "Andar",
    minimumStay: "Estadia mínima",
    maximumGuests: "Máximo de hóspedes",
    utilitiesIncluded: "Contas incluídas",
    internetIncluded: "Internet incluída",
    cleaningIncluded: "Limpeza incluída",
    availableFrom: "Disponível a partir de",
    petsAllowed: "Aceita pets",
    financingPossible: "Financiamento possível",
    occupancyStatus: "Ocupação",
    vacant: "Vago",
    occupied: "Ocupado",
    yearBuilt: "Ano de construção",
    addressHidden: "Endereço compartilhado após contato",
    mapHint: "Abrir localização aproximada",
    bedrooms: "Quartos",
    bathrooms: "Banheiros",
    area: "Área",
    parking: "Vagas",
    noRealtor: "Um corretor verificado será vinculado a este anúncio em breve.",
    building: "Prédio",
    apartment: "Apartamento",
    parkingGroup: "Estacionamento",
    lifestyle: "Estilo de vida",
  },
  nl: {
    fallbackTitle: "Woning niet beschikbaar",
    fallbackText: "Deze woning staat niet openbaar of kon niet worden gevonden.",
    eyebrow: "Home in the City Vastgoed",
    overview: "Overzicht",
    gallery: "Galerij",
    openGallery: "Bekijk alle foto's",
    close: "Sluiten",
    previous: "Vorige afbeelding",
    next: "Volgende afbeelding",
    description: "Woning",
    features: "Highlights",
    amenities: "Voorzieningen",
    details: "Woningdetails",
    location: "Locatie",
    nearby: "In de buurt",
    videoTour: "Videotour",
    realtor: "Makelaar",
    verified: "Geverifieerd",
    whatsapp: "WhatsApp",
    email: "Email",
    requestViewing: "Bezichtiging aanvragen",
    condo: "Servicekosten",
    tax: "Belasting",
    furnished: "Gemeubileerd",
    notFurnished: "Ongemeubileerd",
    floor: "Verdieping",
    minimumStay: "Minimaal verblijf",
    maximumGuests: "Maximaal aantal gasten",
    utilitiesIncluded: "Nutsvoorzieningen inbegrepen",
    internetIncluded: "Internet inbegrepen",
    cleaningIncluded: "Schoonmaak inbegrepen",
    availableFrom: "Beschikbaar vanaf",
    petsAllowed: "Huisdieren toegestaan",
    financingPossible: "Financiering mogelijk",
    occupancyStatus: "Bewoning",
    vacant: "Vrij",
    occupied: "Bewoond",
    yearBuilt: "Bouwjaar",
    addressHidden: "Adres gedeeld na contact",
    mapHint: "Open geschatte locatie",
    bedrooms: "Slaapkamers",
    bathrooms: "Badkamers",
    area: "Oppervlak",
    parking: "Parkeren",
    noRealtor: "Binnenkort wordt een geverifieerde makelaar aan deze woning gekoppeld.",
    building: "Gebouw",
    apartment: "Appartement",
    parkingGroup: "Parkeren",
    lifestyle: "Lifestyle",
  },
};

const listingTypeLabels: Record<Lang, Record<string, string>> = {
  en: { rent: "For rent", sale: "For sale" },
  pt: { rent: "Para alugar", sale: "À venda" },
  nl: { rent: "Te huur", sale: "Te koop" },
};

const statusLabels: Record<Lang, Record<string, string>> = {
  en: {
    available: "Available",
    reserved: "Reserved",
    sold: "Sold",
    rented: "Rented",
  },
  pt: {
    available: "Disponível",
    reserved: "Reservado",
    sold: "Vendido",
    rented: "Alugado",
  },
  nl: {
    available: "Beschikbaar",
    reserved: "Gereserveerd",
    sold: "Verkocht",
    rented: "Verhuurd",
  },
};

const amenityLabels: Record<Lang, Record<string, string>> = {
  en: {
    elevator: "Elevator",
    security24h: "24h security",
    concierge: "Concierge",
    gym: "Gym",
    pool: "Pool",
    partyRoom: "Party room",
    coworkingSpace: "Coworking space",
    airConditioning: "Air conditioning",
    highSpeedInternet: "High-speed internet",
    balcony: "Balcony",
    bbq: "BBQ / churrasqueira",
    washer: "Washer",
    dryer: "Dryer",
    dishwasher: "Dishwasher",
    homeOffice: "Home office",
    smartTv: "Smart TV",
    fullyEquippedKitchen: "Fully equipped kitchen",
    parkingSpace: "Parking space",
    coveredParking: "Covered parking",
    visitorParking: "Visitor parking",
    parkView: "Park view",
    cityView: "City view",
    petFriendly: "Pet friendly",
    familyFriendly: "Family friendly",
    quietStreet: "Quiet street",
    walkableNeighborhood: "Walkable neighborhood",
  },
  pt: {
    elevator: "Elevador",
    security24h: "Segurança 24h",
    concierge: "Portaria",
    gym: "Academia",
    pool: "Piscina",
    partyRoom: "Salão de festas",
    coworkingSpace: "Coworking",
    airConditioning: "Ar-condicionado",
    highSpeedInternet: "Internet de alta velocidade",
    balcony: "Sacada",
    bbq: "Churrasqueira",
    washer: "Máquina de lavar",
    dryer: "Secadora",
    dishwasher: "Lava-louças",
    homeOffice: "Home office",
    smartTv: "Smart TV",
    fullyEquippedKitchen: "Cozinha completa",
    parkingSpace: "Vaga de garagem",
    coveredParking: "Garagem coberta",
    visitorParking: "Estacionamento para visitantes",
    parkView: "Vista para parque",
    cityView: "Vista da cidade",
    petFriendly: "Aceita pets",
    familyFriendly: "Ideal para famílias",
    quietStreet: "Rua tranquila",
    walkableNeighborhood: "Bairro caminhável",
  },
  nl: {
    elevator: "Lift",
    security24h: "24-uurs beveiliging",
    concierge: "Conciërge",
    gym: "Fitnessruimte",
    pool: "Zwembad",
    partyRoom: "Feestruimte",
    coworkingSpace: "Coworkingruimte",
    airConditioning: "Airconditioning",
    highSpeedInternet: "Snel internet",
    balcony: "Balkon",
    bbq: "BBQ / churrasqueira",
    washer: "Wasmachine",
    dryer: "Droger",
    dishwasher: "Vaatwasser",
    homeOffice: "Thuiswerkplek",
    smartTv: "Smart TV",
    fullyEquippedKitchen: "Volledig uitgeruste keuken",
    parkingSpace: "Parkeerplaats",
    coveredParking: "Overdekt parkeren",
    visitorParking: "Bezoekersparkeren",
    parkView: "Uitzicht op park",
    cityView: "Uitzicht op stad",
    petFriendly: "Huisdiervriendelijk",
    familyFriendly: "Gezinsvriendelijk",
    quietStreet: "Rustige straat",
    walkableNeighborhood: "Loopbare buurt",
  },
};

const profilePaths: Record<Lang, string> = {
  en: "/providers",
  pt: "/pt/profissionais",
  nl: "/nl/professionals",
};

const localeByLang: Record<Lang, string> = {
  en: "en-US",
  pt: "pt-BR",
  nl: "nl-NL",
};

export const listingPathPrefixes: Record<Lang, string> = {
  en: "/real-estate",
  pt: "/pt/imoveis",
  nl: "/nl/vastgoed",
};

export function localizedListingText(
  listing:
    | PropertyListing
    | NonNullable<PropertyListing["city"]>
    | NonNullable<PropertyListing["linkedRealtor"]>,
  field: LocalizedField | "name",
  lang: Lang,
) {
  const values = listing as Record<string, unknown>;
  const localized = values[`${field}_${lang}`];
  const english = values[`${field}_en`];

  if (typeof localized === "string" && localized.trim()) return localized;
  if (typeof english === "string" && english.trim()) return english;

  return "";
}

function localizedListingList(
  listing: PropertyListing,
  field: LocalizedListField,
  lang: Lang,
): string[] {
  const values = listing as Record<string, unknown>;
  const localized = values[`${field}_${lang}`];
  const english = values[`${field}_en`];

  if (Array.isArray(localized) && localized.length) {
    return localized.filter((item): item is string => typeof item === "string");
  }

  if (Array.isArray(english)) {
    return english.filter((item): item is string => typeof item === "string");
  }

  return [];
}

export function localizedListingFeatures(listing: PropertyListing, lang: Lang) {
  return localizedListingList(listing, "features", lang);
}

export function listingCityName(listing: PropertyListing, lang: Lang) {
  if (listing.city) {
    const name = localizedListingText(listing.city, "name", lang);
    if (name) return name;
  }

  return listing.cityName || "";
}

export function listingUrl(lang: Lang, citySlug: string, listingSlug: string) {
  return `${listingPathPrefixes[lang]}/${citySlug}/${listingSlug}`;
}

function formatPrice(listing: PropertyListing, lang: Lang) {
  if (typeof listing.price !== "number") return "";

  return new Intl.NumberFormat(localeByLang[lang], {
    style: "currency",
    currency: listing.currency || "BRL",
    maximumFractionDigits: 0,
  }).format(listing.price);
}

function formatFee(value: number | undefined, currency: string | undefined, lang: Lang) {
  if (typeof value !== "number") return "";

  return new Intl.NumberFormat(localeByLang[lang], {
    style: "currency",
    currency: currency || "BRL",
    maximumFractionDigits: 0,
  }).format(value);
}

function formatDate(value: string | undefined, lang: Lang) {
  if (!value) return "";

  return new Intl.DateTimeFormat(localeByLang[lang], {
    dateStyle: "medium",
  }).format(new Date(value));
}

function statValue(value: number | undefined, suffix = "") {
  if (typeof value !== "number") return "-";
  return `${value}${suffix}`;
}

function displayedAddress(listing: PropertyListing, lang: Lang) {
  if (listing.addressVisibility === "full" && listing.address) return listing.address;
  if (listing.neighborhood) return listing.neighborhood;
  return labels[lang].addressHidden;
}

function mapsUrl(listing: PropertyListing) {
  const { lat, lng } = listing.mapCoordinates || {};
  if (typeof lat !== "number" || typeof lng !== "number") return "";
  return `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`;
}

function videoEmbedUrl(videoUrl?: string) {
  if (!videoUrl) return "";

  try {
    const url = new URL(videoUrl);
    const host = url.hostname.replace(/^www\./, "");

    if (host === "youtu.be") {
      const id = url.pathname.split("/").filter(Boolean)[0];
      return id ? `https://www.youtube.com/embed/${id}` : "";
    }

    if (host.includes("youtube.com")) {
      const id = url.searchParams.get("v") || url.pathname.split("/").pop();
      return id ? `https://www.youtube.com/embed/${id}` : "";
    }

    if (host.includes("vimeo.com")) {
      const id = url.pathname.split("/").filter(Boolean).pop();
      return id ? `https://player.vimeo.com/video/${id}` : "";
    }

    return videoUrl;
  } catch {
    return "";
  }
}

function galleryImages(listing: PropertyListing, title: string): PropertyMediaImage[] {
  const seen = new Set<string>();
  const images = [listing.mainImage, ...(listing.gallery || [])].flatMap((image) => {
    const url = image?.asset?.url;

    if (!url || seen.has(url)) return [];

    seen.add(url);

    return [{
      url,
      alt: image?.alt || title,
    }];
  });

  if (images.length) return images;

  return [
    {
      url: "/porto-alegre-desktop-background.jpg",
      alt: title,
    },
  ];
}

function amenityGroups(listing: PropertyListing, lang: Lang) {
  const t = labels[lang];
  const groups = [
    { title: t.building, values: listing.buildingAmenities || [] },
    { title: t.apartment, values: listing.apartmentAmenities || [] },
    { title: t.parkingGroup, values: listing.parkingAmenities || [] },
    { title: t.lifestyle, values: listing.lifestyleAmenities || [] },
  ];

  return groups
    .map((group) => ({
      title: group.title,
      values: group.values
        .map((value) => amenityLabels[lang][value] || value)
        .filter(Boolean),
    }))
    .filter((group) => group.values.length > 0);
}

function selectedAmenityNames(listing: PropertyListing) {
  return [
    ...(listing.buildingAmenities || []),
    ...(listing.apartmentAmenities || []),
    ...(listing.parkingAmenities || []),
    ...(listing.lifestyleAmenities || []),
  ].map((value) => amenityLabels.en[value] || value);
}

function detailRows(listing: PropertyListing, lang: Lang) {
  const t = labels[lang];
  const shared = [
    { label: t.floor, value: statValue(listing.floor) },
    {
      label: t.condo,
      value: formatFee(listing.monthlyCondoFee, listing.currency, lang),
    },
    {
      label: t.tax,
      value: formatFee(listing.propertyTax, listing.currency, lang),
    },
  ];

  const rental =
    listing.listingType === "rent"
      ? [
          {
            label: t.furnished,
            value: listing.furnished ? t.furnished : listing.furnished === false ? t.notFurnished : "",
          },
          { label: t.minimumStay, value: listing.minimumStay },
          {
            label: t.maximumGuests,
            value:
              typeof listing.maximumGuests === "number"
                ? String(listing.maximumGuests)
                : "",
          },
          {
            label: t.availableFrom,
            value: formatDate(listing.availableFrom, lang),
          },
          { label: t.utilitiesIncluded, value: listing.utilitiesIncluded ? t.utilitiesIncluded : "" },
          { label: t.internetIncluded, value: listing.internetIncluded ? t.internetIncluded : "" },
          { label: t.cleaningIncluded, value: listing.cleaningIncluded ? t.cleaningIncluded : "" },
          { label: t.petsAllowed, value: listing.petsAllowed ? t.petsAllowed : "" },
        ]
      : [];

  const sale =
    listing.listingType === "sale"
      ? [
          {
            label: t.financingPossible,
            value: listing.financingPossible ? t.financingPossible : "",
          },
          {
            label: t.occupancyStatus,
            value: listing.occupancyStatus ? t[listing.occupancyStatus] : "",
          },
          {
            label: t.yearBuilt,
            value: typeof listing.yearBuilt === "number" ? String(listing.yearBuilt) : "",
          },
        ]
      : [];

  return [...shared, ...rental, ...sale].filter((row) => row.value && row.value !== "-");
}

function contactHref(type: "whatsapp" | "email", value?: string) {
  if (!value) return "";
  return type === "email" ? `mailto:${value}` : value;
}

export function buildPropertyStructuredData({
  listing,
  lang,
  citySlug,
  listingSlug,
}: {
  listing: PropertyListing;
  lang: Lang;
  citySlug: string;
  listingSlug: string;
}) {
  const title = localizedListingText(listing, "title", lang);
  const description =
    localizedListingText(listing, "seoDescription", lang) ||
    localizedListingText(listing, "shortDescription", lang);
  const pageUrl = `https://homeinthe.city${listingUrl(lang, citySlug, listingSlug)}`;
  const cityName = listingCityName(listing, lang);
  const image = listing.mainImage?.asset?.url;
  const realtor = listing.linkedRealtor;
  const realtorSlug = realtor?.slug?.current;
  const amenities = selectedAmenityNames(listing);

  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Residence",
        "@id": `${pageUrl}#residence`,
        name: title,
        description,
        image,
        address: {
          "@type": "PostalAddress",
          addressLocality: cityName,
          addressCountry: listing.city?.country || undefined,
          streetAddress:
            listing.addressVisibility === "full" ? listing.address : undefined,
        },
        floorSize:
          typeof listing.areaM2 === "number"
            ? {
                "@type": "QuantitativeValue",
                value: listing.areaM2,
                unitCode: "MTK",
              }
            : undefined,
        numberOfBedrooms: listing.bedrooms,
        numberOfBathroomsTotal: listing.bathrooms,
        amenityFeature: amenities.map((name) => ({
          "@type": "LocationFeatureSpecification",
          name,
          value: true,
        })),
        geo:
          typeof listing.mapCoordinates?.lat === "number" &&
          typeof listing.mapCoordinates?.lng === "number"
            ? {
                "@type": "GeoCoordinates",
                latitude: listing.mapCoordinates.lat,
                longitude: listing.mapCoordinates.lng,
              }
            : undefined,
      },
      {
        "@type": "Offer",
        "@id": `${pageUrl}#offer`,
        url: pageUrl,
        price: listing.price,
        priceCurrency: listing.currency || "BRL",
        availability:
          listing.status === "available"
            ? "https://schema.org/InStock"
            : "https://schema.org/SoldOut",
        itemOffered: {
          "@id": `${pageUrl}#residence`,
        },
      },
      realtor
        ? {
            "@type": "RealEstateAgent",
            "@id": `${pageUrl}#agent`,
            name: realtor.name,
            url: realtorSlug
              ? `https://homeinthe.city${profilePaths[lang]}/${realtorSlug}`
              : undefined,
            image: realtor.mainPhoto?.asset?.url,
            email: listing.contact?.email || realtor.contactOptions?.email,
            telephone: realtor.contactOptions?.phone,
          }
        : undefined,
    ].filter(Boolean),
  };
}

export default function PropertyListingPage({
  lang,
  listing,
}: {
  lang: Lang;
  listing: PropertyListing | null;
}) {
  const t = labels[lang];

  if (!listing) {
    return (
      <main className="min-h-screen bg-[#111419] px-6 pt-32 text-white">
        <div className="mx-auto max-w-3xl">
          <p className="mb-4 text-sm uppercase text-stone-400">{t.eyebrow}</p>
          <h1 className="text-4xl font-semibold">{t.fallbackTitle}</h1>
          <p className="mt-5 text-lg text-stone-300">{t.fallbackText}</p>
        </div>
      </main>
    );
  }

  const title = localizedListingText(listing, "title", lang) || t.fallbackTitle;
  const shortDescription = localizedListingText(listing, "shortDescription", lang);
  const longDescription = localizedListingText(listing, "longDescription", lang);
  const features = localizedListingFeatures(listing, lang);
  const neighborhoodDescription = localizedListingText(
    listing,
    "neighborhoodDescription",
    lang,
  );
  const nearbyHighlights = localizedListingList(listing, "nearbyHighlights", lang);
  const cityName = listingCityName(listing, lang);
  const price = formatPrice(listing, lang);
  const whatsapp =
    listing.contact?.whatsapp || listing.linkedRealtor?.contactOptions?.whatsapp;
  const email = listing.contact?.email || listing.linkedRealtor?.contactOptions?.email;
  const whatsappHref = contactHref("whatsapp", whatsapp);
  const emailHref = contactHref("email", email);
  const requestViewingHref = whatsappHref || emailHref;
  const realtorSlug = listing.linkedRealtor?.slug?.current;
  const realtorHref = realtorSlug ? `${profilePaths[lang]}/${realtorSlug}` : "";
  const mapLink = mapsUrl(listing);
  const mediaImages = galleryImages(listing, title);
  const amenitySections = amenityGroups(listing, lang);
  const details = detailRows(listing, lang);
  const embedUrl = videoEmbedUrl(listing.videoUrl);
  const stats = [
    { label: t.bedrooms, value: statValue(listing.bedrooms) },
    { label: t.bathrooms, value: statValue(listing.bathrooms) },
    { label: t.area, value: statValue(listing.areaM2, " m²") },
    { label: t.parking, value: statValue(listing.parkingSpaces) },
  ];
  const badges = [
    listing.listingType
      ? { label: listingTypeLabels[lang][listing.listingType] }
      : undefined,
    listing.status
      ? { label: statusLabels[lang][listing.status] || listing.status, tone: "solid" as const }
      : undefined,
  ].filter((badge): badge is { label: string; tone?: "solid" } => Boolean(badge));

  return (
    <main className="min-h-screen bg-[#f7f3ec] pb-24 text-[#17202a] lg:pb-0">
      <PropertyListingMedia
        images={mediaImages}
        title={title}
        eyebrow={t.eyebrow}
        badges={badges}
        shortDescription={shortDescription}
        price={price}
        galleryLabel={t.gallery}
        openGalleryLabel={t.openGallery}
        closeLabel={t.close}
        previousLabel={t.previous}
        nextLabel={t.next}
      />

      <section className="border-y border-[#d8cdbd] bg-white px-5 py-5 sm:px-8 lg:px-14">
        <div className="mx-auto grid max-w-6xl grid-cols-2 gap-3 sm:grid-cols-4">
          {stats.map((stat) => (
            <div key={stat.label} className="py-3">
              <p className="text-2xl font-semibold">{stat.value}</p>
              <p className="mt-1 text-sm text-stone-500">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="px-5 py-12 sm:px-8 lg:px-14">
        <div className="mx-auto grid max-w-6xl gap-10 lg:grid-cols-[1fr_360px]">
          <div className="space-y-14">
            <section>
              <p className="text-sm uppercase tracking-widest text-stone-500">
                {t.overview}
              </p>
              <h2 className="mt-3 text-3xl font-semibold">{t.description}</h2>
              <div className="mt-5 space-y-5 text-lg leading-8 text-stone-700">
                {(longDescription || shortDescription)
                  .split("\n")
                  .filter(Boolean)
                  .map((paragraph) => (
                    <p key={paragraph}>{paragraph}</p>
                  ))}
              </div>
            </section>

            {features.length ? (
              <section>
                <h2 className="text-3xl font-semibold">{t.features}</h2>
                <div className="mt-5 grid gap-3 sm:grid-cols-2">
                  {features.map((feature) => (
                    <div
                      key={feature}
                      className="border-t border-[#d8cdbd] py-4 text-stone-700"
                    >
                      {feature}
                    </div>
                  ))}
                </div>
              </section>
            ) : null}

            {details.length ? (
              <section>
                <h2 className="text-3xl font-semibold">{t.details}</h2>
                <div className="mt-5 grid gap-3 sm:grid-cols-2">
                  {details.map((detail) => (
                    <div key={detail.label} className="bg-white p-5 shadow-sm">
                      <p className="text-sm text-stone-500">{detail.label}</p>
                      <p className="mt-2 font-semibold">{detail.value}</p>
                    </div>
                  ))}
                </div>
              </section>
            ) : null}

            {amenitySections.length ? (
              <section>
                <h2 className="text-3xl font-semibold">{t.amenities}</h2>
                <div className="mt-5 grid gap-5 md:grid-cols-2">
                  {amenitySections.map((group) => (
                    <div key={group.title} className="bg-white p-6 shadow-sm">
                      <h3 className="text-lg font-semibold">{group.title}</h3>
                      <div className="mt-4 grid gap-3">
                        {group.values.map((amenity) => (
                          <p key={amenity} className="flex items-center gap-3 text-stone-700">
                            <span className="flex h-6 w-6 items-center justify-center rounded-full border border-[#d7b46a] text-xs text-[#806323]">
                              ✓
                            </span>
                            {amenity}
                          </p>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            ) : null}

            {embedUrl ? (
              <section>
                <h2 className="text-3xl font-semibold">{t.videoTour}</h2>
                <div className="mt-5 overflow-hidden bg-black">
                  {embedUrl.includes("youtube.com/embed") ||
                  embedUrl.includes("player.vimeo.com") ? (
                    <iframe
                      src={embedUrl}
                      title={`${title} ${t.videoTour}`}
                      className="aspect-video w-full"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  ) : (
                    <video src={embedUrl} controls className="aspect-video w-full bg-black" />
                  )}
                </div>
              </section>
            ) : null}

            <section>
              <h2 className="text-3xl font-semibold">{t.location}</h2>
              <div className="mt-5 bg-[#ebe3d6] p-6 sm:p-8">
                <p className="text-2xl font-semibold">
                  {[listing.neighborhood, cityName].filter(Boolean).join(", ")}
                </p>
                <p className="mt-2 text-stone-700">{displayedAddress(listing, lang)}</p>
                {neighborhoodDescription ? (
                  <p className="mt-5 max-w-3xl text-lg leading-8 text-stone-700">
                    {neighborhoodDescription}
                  </p>
                ) : null}
                {nearbyHighlights.length ? (
                  <div className="mt-6">
                    <p className="text-sm uppercase tracking-widest text-stone-500">
                      {t.nearby}
                    </p>
                    <div className="mt-3 flex flex-wrap gap-2">
                      {nearbyHighlights.map((highlight) => (
                        <span key={highlight} className="bg-white px-4 py-2 text-sm">
                          {highlight}
                        </span>
                      ))}
                    </div>
                  </div>
                ) : null}
                {mapLink ? (
                  <Link
                    href={mapLink}
                    className="mt-6 inline-flex border border-[#17202a] px-5 py-3 text-sm font-semibold"
                    target="_blank"
                    rel="noreferrer"
                  >
                    {t.mapHint}
                  </Link>
                ) : null}
              </div>
            </section>
          </div>

          <aside className="hidden lg:block lg:sticky lg:top-28 lg:self-start">
            <InquiryCard
              listing={listing}
              lang={lang}
              price={price}
              whatsappHref={whatsappHref}
              emailHref={emailHref}
              requestViewingHref={requestViewingHref}
              realtorHref={realtorHref}
            />
          </aside>
        </div>
      </section>

      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-stone-200 bg-white/95 px-4 py-3 shadow-2xl backdrop-blur lg:hidden">
        <div className="mx-auto flex max-w-3xl items-center justify-between gap-3">
          <div>
            {price ? <p className="font-semibold">{price}</p> : null}
            <p className="text-xs text-stone-500">
              {listing.listingType ? listingTypeLabels[lang][listing.listingType] : ""}
            </p>
          </div>
          {requestViewingHref ? (
            <Link
              href={requestViewingHref}
              target={requestViewingHref.startsWith("http") ? "_blank" : undefined}
              rel={requestViewingHref.startsWith("http") ? "noreferrer" : undefined}
              className="bg-[#17202a] px-4 py-3 text-sm font-semibold text-white"
            >
              {t.requestViewing}
            </Link>
          ) : null}
        </div>
      </div>
    </main>
  );
}

function InquiryCard({
  listing,
  lang,
  price,
  whatsappHref,
  emailHref,
  requestViewingHref,
  realtorHref,
}: {
  listing: PropertyListing;
  lang: Lang;
  price: string;
  whatsappHref: string;
  emailHref: string;
  requestViewingHref: string;
  realtorHref: string;
}) {
  const t = labels[lang];

  return (
    <div className="bg-[#17202a] p-6 text-white shadow-2xl shadow-stone-400/20">
      {price ? <p className="text-3xl font-semibold">{price}</p> : null}
      <div className="mt-4 flex flex-wrap gap-2 text-sm">
        {listing.listingType ? (
          <span className="rounded-full border border-white/20 px-3 py-1">
            {listingTypeLabels[lang][listing.listingType]}
          </span>
        ) : null}
        {listing.status ? (
          <span className="rounded-full bg-white px-3 py-1 text-[#17202a]">
            {statusLabels[lang][listing.status] || listing.status}
          </span>
        ) : null}
      </div>

      <div className="mt-7 border-t border-white/10 pt-6">
        <p className="text-sm uppercase tracking-widest text-stone-300">{t.realtor}</p>
        {listing.linkedRealtor ? (
          <div className="mt-5">
            <div className="flex items-center gap-4">
              <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-full bg-stone-700">
                {listing.linkedRealtor.mainPhoto?.asset?.url ? (
                  <Image
                    src={listing.linkedRealtor.mainPhoto.asset.url}
                    alt={
                      listing.linkedRealtor.mainPhoto.alt ||
                      listing.linkedRealtor.name ||
                      t.realtor
                    }
                    fill
                    className="object-cover"
                    sizes="64px"
                  />
                ) : null}
              </div>
              <div>
                <h2 className="text-xl font-semibold">{listing.linkedRealtor.name}</h2>
                {listing.linkedRealtor.verificationStatus === "verified" ? (
                  <p className="mt-1 text-sm text-emerald-200">{t.verified}</p>
                ) : null}
              </div>
            </div>
            {realtorHref ? (
              <Link
                href={realtorHref}
                className="mt-5 inline-flex text-sm text-stone-200 underline underline-offset-4"
              >
                {localizedListingText(listing.linkedRealtor, "headline", lang) ||
                  listing.linkedRealtor.name}
              </Link>
            ) : null}
          </div>
        ) : (
          <p className="mt-5 text-stone-300">{t.noRealtor}</p>
        )}
      </div>

      <div className="mt-7 flex flex-col gap-3">
        {requestViewingHref ? (
          <Link
            href={requestViewingHref}
            className="bg-[#d7b46a] px-5 py-4 text-center font-semibold text-[#17202a]"
            target={requestViewingHref.startsWith("http") ? "_blank" : undefined}
            rel={requestViewingHref.startsWith("http") ? "noreferrer" : undefined}
          >
            {t.requestViewing}
          </Link>
        ) : null}
        {whatsappHref ? (
          <Link
            href={whatsappHref}
            className="border border-white/25 px-5 py-4 text-center font-semibold"
            target="_blank"
            rel="noreferrer"
          >
            {t.whatsapp}
          </Link>
        ) : null}
        {emailHref ? (
          <Link
            href={emailHref}
            className="border border-white/25 px-5 py-4 text-center font-semibold"
          >
            {t.email}
          </Link>
        ) : null}
      </div>
    </div>
  );
}
