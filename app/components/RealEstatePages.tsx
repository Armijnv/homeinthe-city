import Image from "next/image";
import Link from "next/link";
import {
  listingCityName,
  listingPathPrefixes,
  listingUrl,
  localizedListingText,
  type Lang,
  type PropertyListing,
} from "@/app/components/PropertyListingPage";

type RealtorProfile = {
  name?: string;
  slug?: {
    current?: string;
  };
  headline_en?: string;
  headline_pt?: string;
  headline_nl?: string;
  mainPhoto?: {
    alt?: string;
    asset?: {
      url?: string;
    };
  };
};

type CityConfig = {
  slug: string;
  title: string;
  intro: string;
  typeFocus: string;
};

const profilePrefixes: Record<Lang, string> = {
  en: "/providers",
  pt: "/pt/profissionais",
  nl: "/nl/professionals",
};

const providerListPaths: Record<Lang, string> = {
  en: "/providers",
  pt: "/pt/profissionais",
  nl: "/nl/professionals",
};

const labels = {
  en: {
    eyebrow: "Home in the City Real Estate",
    overviewTitle: "Real estate support for buying, selling and renting in Brazil",
    overviewIntro:
      "Explore curated property listings and connect with verified local support for renting, buying, selling and relocating with confidence.",
    cities: "City real estate pages",
    listings: "Property listings",
    allListings: "All listings",
    realtor: "Realtor profile",
    realtorFallback: "Realtor profile coming soon",
    realtorFallbackText:
      "The real estate category is ready. A verified realtor profile will appear here once published.",
    viewProfile: "View profile",
    viewCity: "View city",
    viewListing: "View property",
    empty: "No public listings are available here yet.",
    rent: "Rent",
    sale: "Sale",
    available: "Available",
    reserved: "Reserved",
    sold: "Sold",
    rented: "Rented",
    bedrooms: "bed",
    bathrooms: "bath",
    parking: "parking",
    area: "m²",
    portoAlegre: {
      slug: "porto-alegre",
      title: "Porto Alegre Real Estate",
      intro:
        "Rental and sale listings in Porto Alegre, with local context for neighborhoods, lifestyle and practical relocation needs.",
      typeFocus: "Rentals and sales",
    },
    florianopolis: {
      slug: "florianopolis",
      title: "Florianópolis Real Estate",
      intro:
        "Property listings for Florianópolis, from city apartments to coastal homes for buyers and long-stay renters.",
      typeFocus: "Sales and rentals",
    },
  },
  pt: {
    eyebrow: "Imóveis Home in the City",
    overviewTitle: "Apoio imobiliário para comprar, vender e alugar no Brasil",
    overviewIntro:
      "Veja anúncios selecionados e conecte-se com apoio local verificado para aluguel, compra, venda e mudança com mais segurança.",
    cities: "Páginas imobiliárias por cidade",
    listings: "Anúncios de imóveis",
    allListings: "Todos os anúncios",
    realtor: "Perfil do corretor",
    realtorFallback: "Perfil de corretor em breve",
    realtorFallbackText:
      "A categoria de imóveis está pronta. Um perfil de corretor verificado aparecerá aqui quando for publicado.",
    viewProfile: "Ver perfil",
    viewCity: "Ver cidade",
    viewListing: "Ver imóvel",
    empty: "Ainda não há anúncios públicos aqui.",
    rent: "Aluguel",
    sale: "Venda",
    available: "Disponível",
    reserved: "Reservado",
    sold: "Vendido",
    rented: "Alugado",
    bedrooms: "quartos",
    bathrooms: "banheiros",
    parking: "vagas",
    area: "m²",
    portoAlegre: {
      slug: "porto-alegre",
      title: "Imóveis em Porto Alegre",
      intro:
        "Anúncios de aluguel e venda em Porto Alegre, com contexto local sobre bairros, estilo de vida e necessidades práticas de mudança.",
      typeFocus: "Aluguéis e vendas",
    },
    florianopolis: {
      slug: "florianopolis",
      title: "Imóveis em Florianópolis",
      intro:
        "Anúncios em Florianópolis, de apartamentos urbanos a casas próximas ao litoral para compra ou estadias longas.",
      typeFocus: "Vendas e aluguéis",
    },
  },
  nl: {
    eyebrow: "Home in the City Vastgoed",
    overviewTitle: "Vastgoedhulp voor kopen, verkopen en huren in Brazilië",
    overviewIntro:
      "Bekijk geselecteerd woningaanbod en vind lokale ondersteuning bij huren, kopen, verkopen en verhuizen.",
    cities: "Vastgoedpagina's per stad",
    listings: "Woningaanbod",
    allListings: "Alle woningen",
    realtor: "Makelaarsprofiel",
    realtorFallback: "Makelaarsprofiel binnenkort",
    realtorFallbackText:
      "De vastgoedcategorie is klaar. Een geverifieerd makelaarsprofiel verschijnt hier zodra het is gepubliceerd.",
    viewProfile: "Bekijk profiel",
    viewCity: "Bekijk stad",
    viewListing: "Bekijk woning",
    empty: "Er zijn hier nog geen openbare woningen beschikbaar.",
    rent: "Huur",
    sale: "Koop",
    available: "Beschikbaar",
    reserved: "Gereserveerd",
    sold: "Verkocht",
    rented: "Verhuurd",
    bedrooms: "slaapkamers",
    bathrooms: "badkamers",
    parking: "parkeren",
    area: "m²",
    portoAlegre: {
      slug: "porto-alegre",
      title: "Vastgoed in Porto Alegre",
      intro:
        "Huur- en koopaanbod in Porto Alegre, met lokale context over wijken, levensstijl en praktische verhuisvragen.",
      typeFocus: "Huur en koop",
    },
    florianopolis: {
      slug: "florianopolis",
      title: "Vastgoed in Florianópolis",
      intro:
        "Woningaanbod in Florianópolis, van stadsappartementen tot huizen bij de kust voor kopers en lang verblijf.",
      typeFocus: "Koop en huur",
    },
  },
};

function cityPath(lang: Lang, citySlug: string) {
  return `${listingPathPrefixes[lang]}/${citySlug}`;
}

function citySlugForListing(listing: PropertyListing) {
  if (listing.city?.slug?.current) return listing.city.slug.current;
  if (!listing.cityName) return "porto-alegre";

  return listing.cityName
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function formatPrice(listing: PropertyListing, lang: Lang) {
  if (typeof listing.price !== "number") return "";

  return new Intl.NumberFormat(
    lang === "pt" ? "pt-BR" : lang === "nl" ? "nl-NL" : "en-US",
    {
      style: "currency",
      currency: listing.currency || "BRL",
      maximumFractionDigits: 0,
    },
  ).format(listing.price);
}

function listingTypeLabel(listing: PropertyListing, lang: Lang) {
  if (listing.listingType === "rent") return labels[lang].rent;
  if (listing.listingType === "sale") return labels[lang].sale;
  return "";
}

function statusLabel(listing: PropertyListing, lang: Lang) {
  if (!listing.status) return "";
  if (listing.status === "hidden") return "";
  return labels[lang][listing.status] || listing.status;
}

function PropertyCard({
  listing,
  lang,
}: {
  listing: PropertyListing;
  lang: Lang;
}) {
  const t = labels[lang];
  const listingSlug = listing.slug?.current;
  const citySlug = citySlugForListing(listing);
  const href = listingSlug ? listingUrl(lang, citySlug, listingSlug) : cityPath(lang, citySlug);
  const title = localizedListingText(listing, "title", lang) || "Property listing";
  const cityName = listingCityName(listing, lang);
  const price = formatPrice(listing, lang);
  const imageUrl =
    listing.mainImage?.asset?.url || "/porto-alegre-desktop-background.jpg";

  return (
    <article className="overflow-hidden bg-white shadow-lg shadow-stone-300/20">
      <Link href={href} className="block">
        <div className="relative aspect-[4/3] bg-stone-200">
          <Image
            src={imageUrl}
            alt={listing.mainImage?.alt || title}
            fill
            className="object-cover"
            sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
          />
        </div>
      </Link>

      <div className="p-5">
        <div className="mb-3 flex flex-wrap gap-2 text-xs uppercase tracking-widest text-stone-500">
          {listingTypeLabel(listing, lang) ? <span>{listingTypeLabel(listing, lang)}</span> : null}
          {statusLabel(listing, lang) ? <span>{statusLabel(listing, lang)}</span> : null}
        </div>

        <h3 className="text-xl font-semibold text-[#17202a]">
          <Link href={href}>{title}</Link>
        </h3>

        <p className="mt-2 text-sm text-stone-500">
          {[listing.neighborhood, cityName].filter(Boolean).join(", ")}
        </p>

        {price ? <p className="mt-4 text-2xl font-semibold text-[#17202a]">{price}</p> : null}

        <div className="mt-4 flex flex-wrap gap-3 text-sm text-stone-600">
          {typeof listing.bedrooms === "number" ? (
            <span>
              {listing.bedrooms} {t.bedrooms}
            </span>
          ) : null}
          {typeof listing.bathrooms === "number" ? (
            <span>
              {listing.bathrooms} {t.bathrooms}
            </span>
          ) : null}
          {typeof listing.parkingSpaces === "number" ? (
            <span>
              {listing.parkingSpaces} {t.parking}
            </span>
          ) : null}
          {typeof listing.areaM2 === "number" ? (
            <span>
              {listing.areaM2} {t.area}
            </span>
          ) : null}
        </div>

        <Link
          href={href}
          className="mt-5 inline-flex border border-[#17202a] px-4 py-2 text-sm font-semibold text-[#17202a]"
        >
          {t.viewListing}
        </Link>
      </div>
    </article>
  );
}

function RealtorCard({
  lang,
  realtor,
}: {
  lang: Lang;
  realtor: RealtorProfile | null;
}) {
  const t = labels[lang];
  const realtorSlug = realtor?.slug?.current;
  const href = realtorSlug
    ? `${profilePrefixes[lang]}/${realtorSlug}`
    : providerListPaths[lang];
  const headline = realtor
    ? localizedListingText(realtor, "headline", lang) || realtor.name
    : t.realtorFallbackText;

  return (
    <div className="bg-[#17202a] p-6 text-white">
      <p className="text-sm uppercase tracking-widest text-stone-300">{t.realtor}</p>
      <div className="mt-5 flex items-center gap-4">
        <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-full bg-stone-700">
          {realtor?.mainPhoto?.asset?.url ? (
            <Image
              src={realtor.mainPhoto.asset.url}
              alt={realtor.mainPhoto.alt || realtor.name || t.realtor}
              fill
              className="object-cover"
              sizes="64px"
            />
          ) : null}
        </div>
        <div>
          <h2 className="text-xl font-semibold">{realtor?.name || t.realtorFallback}</h2>
          <p className="mt-1 text-sm text-stone-300">{headline}</p>
        </div>
      </div>

      <Link
        href={href}
        className="mt-6 inline-flex bg-[#d7b46a] px-5 py-3 text-sm font-semibold text-[#17202a]"
      >
        {t.viewProfile}
      </Link>
    </div>
  );
}

export function RealEstateOverviewPage({
  lang,
  listings,
  realtor,
}: {
  lang: Lang;
  listings: PropertyListing[];
  realtor: RealtorProfile | null;
}) {
  const t = labels[lang];
  const cities: CityConfig[] = [t.portoAlegre, t.florianopolis];

  return (
    <main className="min-h-screen bg-[#f7f3ec] px-5 pt-32 pb-16 text-[#17202a] sm:px-8 lg:px-14">
      <div className="mx-auto max-w-6xl">
        <p className="text-sm uppercase tracking-widest text-stone-500">{t.eyebrow}</p>
        <div className="mt-5 grid gap-10 lg:grid-cols-[1fr_360px] lg:items-start">
          <div>
            <h1 className="max-w-4xl text-4xl font-semibold leading-tight sm:text-6xl">
              {t.overviewTitle}
            </h1>
            <p className="mt-6 max-w-3xl text-lg leading-8 text-stone-700">
              {t.overviewIntro}
            </p>
          </div>
          <RealtorCard lang={lang} realtor={realtor} />
        </div>

        <section className="mt-14">
          <h2 className="text-2xl font-semibold">{t.cities}</h2>
          <div className="mt-5 grid gap-4 md:grid-cols-2">
            {cities.map((city) => (
              <Link
                key={city.slug}
                href={cityPath(lang, city.slug)}
                className="bg-white p-6 shadow-lg shadow-stone-300/20 transition hover:-translate-y-0.5"
              >
                <p className="text-sm uppercase tracking-widest text-stone-500">
                  {city.typeFocus}
                </p>
                <h3 className="mt-3 text-2xl font-semibold">{city.title}</h3>
                <p className="mt-3 text-stone-600">{city.intro}</p>
                <span className="mt-5 inline-flex border border-[#17202a] px-4 py-2 text-sm font-semibold">
                  {t.viewCity}
                </span>
              </Link>
            ))}
          </div>
        </section>

        <section className="mt-14">
          <h2 className="text-2xl font-semibold">{t.listings}</h2>
          {listings.length ? (
            <div className="mt-5 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
              {listings.map((listing) => (
                <PropertyCard
                  key={listing.slug?.current || localizedListingText(listing, "title", lang)}
                  listing={listing}
                  lang={lang}
                />
              ))}
            </div>
          ) : (
            <p className="mt-5 bg-white p-6 text-stone-600 shadow-lg shadow-stone-300/20">
              {t.empty}
            </p>
          )}
        </section>
      </div>
    </main>
  );
}

export function RealEstateCityPage({
  lang,
  city,
  listings,
}: {
  lang: Lang;
  city: CityConfig;
  listings: PropertyListing[];
}) {
  const t = labels[lang];

  return (
    <main className="min-h-screen bg-[#f7f3ec] px-5 pt-32 pb-16 text-[#17202a] sm:px-8 lg:px-14">
      <div className="mx-auto max-w-6xl">
        <p className="text-sm uppercase tracking-widest text-stone-500">{t.eyebrow}</p>
        <h1 className="mt-5 max-w-4xl text-4xl font-semibold leading-tight sm:text-6xl">
          {city.title}
        </h1>
        <p className="mt-6 max-w-3xl text-lg leading-8 text-stone-700">
          {city.intro}
        </p>

        <section className="mt-12">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-sm uppercase tracking-widest text-stone-500">
                {city.typeFocus}
              </p>
              <h2 className="mt-2 text-2xl font-semibold">{t.listings}</h2>
            </div>
            <Link
              href={listingPathPrefixes[lang]}
              className="inline-flex border border-[#17202a] px-4 py-2 text-sm font-semibold"
            >
              {t.allListings}
            </Link>
          </div>

          {listings.length ? (
            <div className="mt-5 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
              {listings.map((listing) => (
                <PropertyCard
                  key={listing.slug?.current || localizedListingText(listing, "title", lang)}
                  listing={listing}
                  lang={lang}
                />
              ))}
            </div>
          ) : (
            <p className="mt-5 bg-white p-6 text-stone-600 shadow-lg shadow-stone-300/20">
              {t.empty}
            </p>
          )}
        </section>
      </div>
    </main>
  );
}

export function realEstateCityConfig(lang: Lang, citySlug: string) {
  const t = labels[lang];
  return citySlug === "florianopolis" ? t.florianopolis : t.portoAlegre;
}
