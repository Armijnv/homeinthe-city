import Image from "next/image";
import Link from "next/link";

export type Lang = "en" | "pt" | "nl";

type LocalizedField =
  | "title"
  | "headline"
  | "shortDescription"
  | "longDescription"
  | "seoTitle"
  | "seoDescription";

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
  status?: "available" | "reserved" | "sold" | "rented" | "hidden";
  city?: {
    name_en?: string;
    name_pt?: string;
    name_nl?: string;
    slug?: {
      current?: string;
    };
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
  shortDescription_en?: string;
  shortDescription_pt?: string;
  shortDescription_nl?: string;
  longDescription_en?: string;
  longDescription_pt?: string;
  longDescription_nl?: string;
  features_en?: string[];
  features_pt?: string[];
  features_nl?: string[];
  mainImage?: ListingImage;
  gallery?: ListingImage[];
  mapCoordinates?: {
    lat?: number;
    lng?: number;
  };
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
    description: "Residence",
    features: "Features",
    location: "Neighborhood",
    realtor: "Realtor",
    verified: "Verified",
    whatsapp: "Contact on WhatsApp",
    email: "Email",
    condo: "Condo",
    tax: "Tax",
    furnished: "Furnished",
    floor: "Floor",
    addressHidden: "Address shared after contact",
    mapHint: "Approximate map location",
    bedrooms: "Bedrooms",
    bathrooms: "Bathrooms",
    area: "Area",
    parking: "Parking",
    noRealtor: "A verified realtor will be assigned to this listing soon.",
  },
  pt: {
    fallbackTitle: "Imóvel indisponível",
    fallbackText: "Este anúncio não está público ou não foi encontrado.",
    eyebrow: "Imóveis Home in the City",
    overview: "Resumo",
    gallery: "Galeria",
    description: "Residência",
    features: "Destaques",
    location: "Bairro",
    realtor: "Corretor",
    verified: "Verificado",
    whatsapp: "Contato pelo WhatsApp",
    email: "Email",
    condo: "Condomínio",
    tax: "IPTU",
    furnished: "Mobiliado",
    floor: "Andar",
    addressHidden: "Endereço compartilhado após contato",
    mapHint: "Localização aproximada no mapa",
    bedrooms: "Quartos",
    bathrooms: "Banheiros",
    area: "Área",
    parking: "Vagas",
    noRealtor: "Um corretor verificado será vinculado a este anúncio em breve.",
  },
  nl: {
    fallbackTitle: "Woning niet beschikbaar",
    fallbackText: "Deze woning staat niet openbaar of kon niet worden gevonden.",
    eyebrow: "Home in the City Vastgoed",
    overview: "Overzicht",
    gallery: "Galerij",
    description: "Woning",
    features: "Kenmerken",
    location: "Buurt",
    realtor: "Makelaar",
    verified: "Geverifieerd",
    whatsapp: "Contact via WhatsApp",
    email: "Email",
    condo: "Servicekosten",
    tax: "Belasting",
    furnished: "Gemeubileerd",
    floor: "Verdieping",
    addressHidden: "Adres gedeeld na contact",
    mapHint: "Geschatte kaartlocatie",
    bedrooms: "Slaapkamers",
    bathrooms: "Badkamers",
    area: "Oppervlak",
    parking: "Parkeren",
    noRealtor: "Binnenkort wordt een geverifieerde makelaar aan deze woning gekoppeld.",
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

export function localizedListingFeatures(
  listing: PropertyListing,
  lang: Lang,
): string[] {
  const values = listing as Record<string, unknown>;
  const localized = values[`features_${lang}`];
  const english = listing.features_en;

  if (Array.isArray(localized) && localized.length) {
    return localized.filter((feature): feature is string => typeof feature === "string");
  }
  return english || [];
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
          addressRegion: "RS",
          addressCountry: "BR",
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
  const cityName = listingCityName(listing, lang);
  const imageUrl =
    listing.mainImage?.asset?.url || "/porto-alegre-desktop-background.jpg";
  const gallery = (listing.gallery || []).filter((image) => image.asset?.url);
  const price = formatPrice(listing, lang);
  const whatsapp =
    listing.contact?.whatsapp || listing.linkedRealtor?.contactOptions?.whatsapp;
  const email = listing.contact?.email || listing.linkedRealtor?.contactOptions?.email;
  const realtorSlug = listing.linkedRealtor?.slug?.current;
  const realtorHref = realtorSlug ? `${profilePaths[lang]}/${realtorSlug}` : "";
  const mapLink = mapsUrl(listing);

  const stats = [
    { label: t.bedrooms, value: statValue(listing.bedrooms) },
    { label: t.bathrooms, value: statValue(listing.bathrooms) },
    { label: t.area, value: statValue(listing.areaM2, " m²") },
    { label: t.parking, value: statValue(listing.parkingSpaces) },
  ];

  return (
    <main className="min-h-screen bg-[#f7f3ec] text-[#17202a]">
      <section className="relative min-h-[88vh] overflow-hidden bg-[#111419] text-white">
        <Image
          src={imageUrl}
          alt={listing.mainImage?.alt || title}
          fill
          priority
          className="object-cover"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-black/15" />
        <div className="relative z-10 flex min-h-[88vh] flex-col justify-end px-5 pb-10 pt-28 sm:px-8 lg:px-14">
          <div className="max-w-5xl">
            <p className="text-sm uppercase text-stone-200">{t.eyebrow}</p>
            <div className="mt-5 flex flex-wrap gap-3 text-sm">
              {listing.listingType ? (
                <span className="rounded-full border border-white/35 px-4 py-2 text-white">
                  {listingTypeLabels[lang][listing.listingType]}
                </span>
              ) : null}
              {listing.status ? (
                <span className="rounded-full bg-white px-4 py-2 text-[#17202a]">
                  {statusLabels[lang][listing.status] || listing.status}
                </span>
              ) : null}
            </div>
            <h1 className="mt-6 max-w-4xl text-4xl font-semibold leading-tight sm:text-6xl">
              {title}
            </h1>
            <div className="mt-6 flex flex-col gap-4 text-lg text-stone-100 sm:flex-row sm:items-end sm:justify-between">
              <p className="max-w-2xl">{shortDescription}</p>
              {price ? (
                <p className="text-3xl font-semibold sm:text-right">{price}</p>
              ) : null}
            </div>
          </div>
        </div>
      </section>

      <section className="border-b border-[#d8cdbd] bg-white px-5 py-5 sm:px-8 lg:px-14">
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
          <div>
            <p className="text-sm uppercase text-stone-500">{t.overview}</p>
            <div className="mt-5 grid gap-3 text-sm text-stone-700 sm:grid-cols-3">
              {listing.monthlyCondoFee ? (
                <p>
                  <span className="font-semibold text-[#17202a]">{t.condo}: </span>
                  {formatFee(listing.monthlyCondoFee, listing.currency, lang)}
                </p>
              ) : null}
              {listing.propertyTax ? (
                <p>
                  <span className="font-semibold text-[#17202a]">{t.tax}: </span>
                  {formatFee(listing.propertyTax, listing.currency, lang)}
                </p>
              ) : null}
              {typeof listing.floor === "number" ? (
                <p>
                  <span className="font-semibold text-[#17202a]">{t.floor}: </span>
                  {listing.floor}
                </p>
              ) : null}
              {listing.furnished ? (
                <p className="font-semibold text-[#17202a]">{t.furnished}</p>
              ) : null}
            </div>

            {gallery.length ? (
              <div className="mt-12">
                <h2 className="text-2xl font-semibold">{t.gallery}</h2>
                <div className="mt-5 grid gap-3 sm:grid-cols-2">
                  {gallery.slice(0, 6).map((image, index) => (
                    <div
                      key={`${image.asset?.url}-${index}`}
                      className="relative aspect-[4/3] overflow-hidden bg-stone-200"
                    >
                      <Image
                        src={image.asset?.url || ""}
                        alt={image.alt || title}
                        fill
                        className="object-cover"
                        sizes="(min-width: 768px) 50vw, 100vw"
                      />
                    </div>
                  ))}
                </div>
              </div>
            ) : null}

            <div className="mt-12">
              <h2 className="text-2xl font-semibold">{t.description}</h2>
              <div className="mt-5 space-y-5 text-lg leading-8 text-stone-700">
                {(longDescription || shortDescription)
                  .split("\n")
                  .filter(Boolean)
                  .map((paragraph) => (
                    <p key={paragraph}>{paragraph}</p>
                  ))}
              </div>
            </div>

            {features.length ? (
              <div className="mt-12">
                <h2 className="text-2xl font-semibold">{t.features}</h2>
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
              </div>
            ) : null}

            <div className="mt-12">
              <h2 className="text-2xl font-semibold">{t.location}</h2>
              <div className="mt-5 bg-[#ebe3d6] p-6">
                <p className="text-lg font-semibold">
                  {[listing.neighborhood, cityName].filter(Boolean).join(", ")}
                </p>
                <p className="mt-2 text-stone-700">{displayedAddress(listing, lang)}</p>
                {mapLink ? (
                  <Link
                    href={mapLink}
                    className="mt-5 inline-flex border border-[#17202a] px-5 py-3 text-sm font-semibold"
                    target="_blank"
                    rel="noreferrer"
                  >
                    {t.mapHint}
                  </Link>
                ) : null}
              </div>
            </div>
          </div>

          <aside className="lg:sticky lg:top-28 lg:self-start">
            <div className="bg-[#17202a] p-6 text-white shadow-2xl shadow-stone-400/20">
              <p className="text-sm uppercase text-stone-300">{t.realtor}</p>
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
                      <h2 className="text-xl font-semibold">
                        {listing.linkedRealtor.name}
                      </h2>
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

              <div className="mt-7 flex flex-col gap-3">
                {whatsapp ? (
                  <Link
                    href={whatsapp}
                    className="bg-[#d7b46a] px-5 py-4 text-center font-semibold text-[#17202a]"
                    target="_blank"
                    rel="noreferrer"
                  >
                    {t.whatsapp}
                  </Link>
                ) : null}
                {email ? (
                  <Link
                    href={`mailto:${email}`}
                    className="border border-white/25 px-5 py-4 text-center font-semibold"
                  >
                    {t.email}
                  </Link>
                ) : null}
              </div>
            </div>
          </aside>
        </div>
      </section>
    </main>
  );
}
