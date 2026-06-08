import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";
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

const premiumInquiryHref =
  "mailto:contact@homeinthe.city?subject=Property%20inquiry%20in%20Brazil";
const premiumOwnerHref =
  "mailto:contact@homeinthe.city?subject=List%20my%20property%20in%20Brazil";

const portalHighlights = [
  "Monthly stays",
  "Property sales",
  "Relocation assistance",
  "Interpreter services",
  "Local hosts",
  "On-the-ground support",
];

const trustReasons = [
  {
    title: "Personally verified properties",
    text: "The goal is not volume. Home in the City focuses on trusted places we can explain, visit or evaluate with local context.",
  },
  {
    title: "Local knowledge in Brazil",
    text: "Neighborhoods, building culture, utilities, contracts and daily logistics matter as much as the property itself.",
  },
  {
    title: "English, Portuguese and Dutch support",
    text: "Clear multilingual communication helps foreign buyers, tenants and owners avoid confusion during important decisions.",
  },
  {
    title: "Real people behind every listing",
    text: "You are not passed into a faceless portal. A local contact helps with questions, visits, interpretation and next steps.",
  },
  {
    title: "Relocation and interpreter services",
    text: "Property search can connect with meetings, document appointments, neighborhood orientation and arrival support.",
  },
  {
    title: "Transparent communication",
    text: "Expect practical answers about what is known, what needs checking and what should be handled locally before commitment.",
  },
];

const monthlyStayPoints = [
  "Reliable internet for video calls and remote work",
  "Furnished, move-in ready homes",
  "Flexible stays for several months",
  "Local support before and during arrival",
  "Safe, practical and trusted neighborhoods",
  "Options for executives, researchers and long-stay travelers",
];

const buyerFaqs = [
  {
    question: "Can foreigners buy property in Brazil?",
    answer:
      "Yes. Foreigners can generally buy urban property in Brazil. The process usually requires tax registration, identity documents, due diligence and local legal guidance.",
  },
  {
    question: "Do I need residency to buy property in Brazil?",
    answer:
      "Residency is usually not required for urban property purchases. Some rural, border or special areas can have restrictions, so each case should be checked before making an offer.",
  },
  {
    question: "How does the buying process work?",
    answer:
      "A typical purchase includes property selection, visits, document checks, negotiation, contract review, payment planning and registration with the local property registry.",
  },
  {
    question: "Can Home in the City assist during visits?",
    answer:
      "Yes. We can help international buyers view properties, understand neighborhoods, ask practical questions and coordinate with sellers, agents or owners.",
  },
  {
    question: "Can language support be provided?",
    answer:
      "Yes. Interpreter support can be arranged in English, Portuguese and Dutch for visits, meetings, calls and negotiations.",
  },
];

const answerFaqs = [
  {
    question: "What are the best places in Brazil for digital nomads?",
    answer:
      "Popular options include Florianópolis and Garopaba for beach life, Porto Alegre for Southern Brazil access and practical city living, São Paulo for business, and Rio de Janeiro for culture and visibility.",
  },
  {
    question: "Can I rent a furnished apartment in Brazil for several months?",
    answer:
      "Yes. Home in the City is especially interested in furnished apartments and homes that work for monthly rentals, remote workers, executives and long-stay international visitors.",
  },
  {
    question: "How do international buyers view properties in Brazil?",
    answer:
      "International buyers can combine a curated shortlist with guided property visits, local orientation and interpreter support so each viewing is easier to evaluate.",
  },
  {
    question: "Can Home in the City help during property visits and negotiations?",
    answer:
      "Yes. We can help with local coordination, interpretation, practical questions, visit planning and communication with owners, agents or service providers.",
  },
  {
    question: "Can Home in the City provide interpreter support?",
    answer:
      "Yes. Interpreter services are available for real estate visits, relocation appointments, business meetings and conversations in English, Portuguese and Dutch.",
  },
];

const expansionLocations = [
  "Porto Alegre apartments",
  "Garopaba beach houses",
  "Florianópolis properties",
  "Rio de Janeiro properties",
  "São Paulo properties",
  "Foreign-owned properties across Brazil",
];

const fallbackShowcase = [
  {
    title: "Monthly city stays in Porto Alegre",
    location: "Porto Alegre, Southern Brazil",
    type: "Furnished apartments",
    image: "/porto-alegre-desktop-background.jpg",
    text: "Move-in ready apartments for remote workers, visiting executives, researchers and long-stay travelers who need local confidence from day one.",
    href: "/real-estate/porto-alegre",
  },
  {
    title: "Beach houses for slower living",
    location: "Garopaba and Florianópolis",
    type: "Beach houses Brazil",
    image: "/porto-alegre-river.jpg",
    text: "Curated coastal homes for buyers, seasonal residents and digital nomads looking for space, nature and reliable support in Brazil.",
    href: premiumInquiryHref,
  },
  {
    title: "Unique homes for international buyers",
    location: "Brazil-wide opportunities",
    type: "Property for sale in Brazil",
    image: "/og-armijn3.jpg",
    text: "A careful approach to homes for sale in Brazil, with local visits, multilingual communication and practical guidance before commitment.",
    href: premiumInquiryHref,
  },
];

function PremiumButton({
  href,
  children,
  variant = "dark",
}: {
  href: string;
  children: ReactNode;
  variant?: "dark" | "light" | "outline" | "heroOutline";
}) {
  const className =
    variant === "light"
      ? "inline-flex min-h-12 items-center justify-center bg-white px-5 py-3 text-sm font-semibold text-[#16332c] transition hover:bg-stone-100"
      : variant === "heroOutline"
      ? "inline-flex min-h-12 items-center justify-center border border-white px-5 py-3 text-sm font-semibold text-white transition hover:bg-white hover:text-[#16332c]"
      : variant === "outline"
      ? "inline-flex min-h-12 items-center justify-center border border-[#16332c] px-5 py-3 text-sm font-semibold text-[#16332c] transition hover:bg-[#16332c] hover:text-white"
      : "inline-flex min-h-12 items-center justify-center bg-[#16332c] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#23483f]";

  if (href.startsWith("mailto:")) {
    return (
      <a href={href} className={className}>
        {children}
      </a>
    );
  }

  return (
    <Link href={href} className={className}>
      {children}
    </Link>
  );
}

function PremiumShowcaseCard({
  title,
  location,
  type,
  image,
  text,
  href,
}: {
  title: string;
  location: string;
  type: string;
  image: string;
  text: string;
  href: string;
}) {
  const content = (
    <>
      <div className="relative aspect-[4/3] overflow-hidden bg-stone-200">
        <Image
          src={image}
          alt={`${title} in ${location}`}
          fill
          className="object-cover transition duration-500 group-hover:scale-105"
          sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
        />
      </div>
      <div className="p-5 sm:p-6">
        <div className="flex flex-wrap gap-2 text-xs uppercase tracking-widest text-[#9a6b3f]">
          <span>{location}</span>
          <span>{type}</span>
        </div>
        <h3 className="mt-4 text-2xl font-semibold leading-tight text-[#17202a]">
          {title}
        </h3>
        <p className="mt-3 text-sm leading-7 text-stone-600">{text}</p>
        <span className="mt-5 inline-flex border-b border-[#16332c] pb-1 text-sm font-semibold text-[#16332c]">
          Inquire
        </span>
      </div>
    </>
  );

  if (href.startsWith("mailto:")) {
    return (
      <a href={href} className="group block bg-white shadow-sm shadow-stone-300/30">
        {content}
      </a>
    );
  }

  return (
    <Link href={href} className="group block bg-white shadow-sm shadow-stone-300/30">
      {content}
    </Link>
  );
}

function listingStory(listing: PropertyListing, lang: Lang) {
  return (
    localizedListingText(listing, "shortDescription", lang) ||
    localizedListingText(listing, "longDescription", lang) ||
    "A curated property in Brazil selected for international visitors who want local context, clear communication and a more confident stay or purchase."
  );
}

function PremiumRealEstatePortal({
  listings,
}: {
  listings: PropertyListing[];
}) {
  const showcasedListings = listings
    .filter((listing) => listing.status !== "hidden")
    .slice(0, 6);
  const showcase =
    showcasedListings.length > 0
      ? showcasedListings.map((listing) => {
          const citySlug = citySlugForListing(listing);
          const listingSlug = listing.slug?.current;
          return {
            title:
              localizedListingText(listing, "title", "en") ||
              "Curated property in Brazil",
            location: [listing.neighborhood, listingCityName(listing, "en")]
              .filter(Boolean)
              .join(", "),
            type:
              listing.listingType === "sale"
                ? "Property for sale in Brazil"
                : listing.listingType === "rent"
                ? "Monthly rental Brazil"
                : "International property Brazil",
            image:
              listing.mainImage?.asset?.url ||
              "/porto-alegre-desktop-background.jpg",
            text: listingStory(listing, "en"),
            href: listingSlug
              ? listingUrl("en", citySlug, listingSlug)
              : cityPath("en", citySlug),
          };
        })
      : fallbackShowcase;

  return (
    <main className="bg-[#f8f7f2] text-[#17202a]">
      <section className="relative min-h-screen min-h-[92svh] overflow-hidden bg-[#17202a] text-white">
        <Image
          src="/porto-alegre-river.jpg"
          alt="Brazil waterfront city view for international property stays and relocation"
          fill
          priority
          className="object-cover opacity-75"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-black/45" />
        <div className="relative z-10 flex min-h-screen min-h-[92svh] items-end px-5 pt-32 pb-8 sm:px-8 lg:px-14">
          <div className="mx-auto grid w-full max-w-7xl gap-10 lg:grid-cols-[minmax(0,1fr)_22rem] lg:items-end">
            <div>
              <p className="text-xs uppercase tracking-[0.28em] text-stone-200">
                Curated real estate Brazil
              </p>
              <h1 className="mt-5 max-w-4xl text-5xl font-semibold leading-[1.02] sm:text-7xl lg:text-8xl">
                Find Your Place in Brazil
              </h1>
              <p className="mt-6 max-w-2xl text-lg leading-8 text-stone-100 sm:text-xl">
                Monthly stays, unique homes and trusted local support for
                international visitors, digital nomads, expats and property
                buyers.
              </p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <PremiumButton href="#featured" variant="light">
                  View Properties
                </PremiumButton>
                <PremiumButton href="#owners" variant="heroOutline">
                  List Your Property
                </PremiumButton>
              </div>
            </div>
            <div className="border border-white/20 bg-white/10 p-5 backdrop-blur-sm">
              <p className="text-sm uppercase tracking-widest text-stone-200">
                International property support
              </p>
              <div className="mt-5 grid grid-cols-2 gap-3 text-sm text-white">
                {portalHighlights.map((item) => (
                  <span key={item} className="border border-white/15 px-3 py-3">
                    {item}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section
        aria-labelledby="featured-properties"
        id="featured"
        className="px-5 py-16 sm:px-8 lg:px-14 lg:py-24"
      >
        <div className="mx-auto max-w-7xl">
          <div className="max-w-3xl">
            <p className="text-xs uppercase tracking-[0.24em] text-[#9a6b3f]">
              Featured properties
            </p>
            <h2
              id="featured-properties"
              className="mt-4 text-4xl font-semibold leading-tight sm:text-5xl"
            >
              Curated stays, homes and investment opportunities
            </h2>
            <p className="mt-5 text-lg leading-8 text-stone-600">
              This is a carefully selected property collection for monthly
              rentals Brazil, beach houses Brazil, furnished apartments Brazil
              and homes for sale in Brazil. Each listing is supported by local
              knowledge and human communication.
            </p>
          </div>

          <div className="mt-10 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {showcase.map((item) => (
              <PremiumShowcaseCard key={`${item.title}-${item.location}`} {...item} />
            ))}
          </div>
        </div>
      </section>

      <section className="bg-white px-5 py-16 sm:px-8 lg:px-14 lg:py-24">
        <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
          <div>
            <p className="text-xs uppercase tracking-[0.24em] text-[#9a6b3f]">
              Why Home in the City
            </p>
            <h2 className="mt-4 text-4xl font-semibold leading-tight sm:text-5xl">
              A trusted local guide, not a listings machine
            </h2>
            <p className="mt-5 text-lg leading-8 text-stone-600">
              Home in the City helps international visitors discover trusted
              places to stay, unique homes to buy and local support throughout
              Brazil. We bridge property search with relocation Brazil,
              interpreter services and real people on the ground.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <PremiumButton href="/interpreter-porto-alegre" variant="outline">
                Interpreter Services
              </PremiumButton>
              <PremiumButton href="/hosts/armijn">Meet Your Host</PremiumButton>
            </div>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            {trustReasons.map((reason) => (
              <article key={reason.title} className="border border-stone-200 bg-[#f8f7f2] p-5">
                <h3 className="text-lg font-semibold">{reason.title}</h3>
                <p className="mt-3 text-sm leading-7 text-stone-600">
                  {reason.text}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="px-5 py-16 sm:px-8 lg:px-14 lg:py-24">
        <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
          <div className="relative min-h-[24rem] overflow-hidden bg-stone-200">
            <Image
              src="/porto-alegre-desktop-background.jpg"
              alt="Furnished apartment lifestyle and local support for monthly rentals in Brazil"
              fill
              className="object-cover"
              sizes="(min-width: 1024px) 50vw, 100vw"
            />
          </div>
          <div>
            <p className="text-xs uppercase tracking-[0.24em] text-[#9a6b3f]">
              Monthly stays
            </p>
            <h2 className="mt-4 text-4xl font-semibold leading-tight sm:text-5xl">
              Built for digital nomads, remote workers and long stays
            </h2>
            <p className="mt-5 text-lg leading-8 text-stone-600">
              Monthly rentals Brazil should be more than a key handoff. We look
              for expat housing Brazil that works for real life: furnished
              apartments, reliable internet, practical neighborhoods and support
              when something needs explaining.
            </p>
            <div className="mt-8 grid gap-3 sm:grid-cols-2">
              {monthlyStayPoints.map((point) => (
                <p key={point} className="border-l-2 border-[#9a6b3f] bg-white px-4 py-3 text-sm leading-6">
                  {point}
                </p>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="bg-[#16332c] px-5 py-16 text-white sm:px-8 lg:px-14 lg:py-24">
        <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[0.8fr_1.2fr]">
          <div>
            <p className="text-xs uppercase tracking-[0.24em] text-[#d7b46a]">
              Buying property in Brazil
            </p>
            <h2 className="mt-4 text-4xl font-semibold leading-tight sm:text-5xl">
              Clear answers for foreign buyers
            </h2>
            <p className="mt-5 text-lg leading-8 text-stone-200">
              Brazil property investment can be rewarding, but international
              buyers need careful local guidance. These are the first questions
              most people ask before they buy property in Brazil.
            </p>
          </div>
          <div className="grid gap-4">
            {buyerFaqs.map((faq) => (
              <article key={faq.question} className="border border-white/15 bg-white/10 p-5">
                <h3 className="text-xl font-semibold">{faq.question}</h3>
                <p className="mt-3 leading-7 text-stone-200">{faq.answer}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section
        id="owners"
        className="bg-white px-5 py-16 sm:px-8 lg:px-14 lg:py-24"
      >
        <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[1fr_1fr] lg:items-center">
          <div>
            <p className="text-xs uppercase tracking-[0.24em] text-[#9a6b3f]">
              Property owners
            </p>
            <h2 className="mt-4 text-4xl font-semibold leading-tight sm:text-5xl">
              Own Property in Brazil?
            </h2>
            <p className="mt-5 text-lg leading-8 text-stone-600">
              We help property owners reach an international audience through
              curated listings, multilingual communication and local support.
            </p>
            <p className="mt-5 leading-8 text-stone-600">
              This is designed for foreign owners, expats, Brazilians living
              abroad, investors and owners of unique homes who want their
              property presented with care to international visitors and buyers.
            </p>
            <div className="mt-8">
              <PremiumButton href={premiumOwnerHref}>List Your Property</PremiumButton>
            </div>
          </div>
          <div className="border border-stone-200 bg-[#f8f7f2] p-6 sm:p-8">
            <h3 className="text-2xl font-semibold">
              A bridge for international property Brazil
            </h3>
            <div className="mt-6 grid gap-3">
              {[
                "Curated presentation instead of mass-market advertising",
                "Multilingual communication with qualified leads",
                "Local support for visits, access and practical questions",
                "A natural fit for monthly rentals, unique homes and sales",
              ].map((item) => (
                <p key={item} className="border-b border-stone-200 pb-3 text-sm leading-6 text-stone-600">
                  {item}
                </p>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="px-5 py-16 sm:px-8 lg:px-14 lg:py-24">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr]">
            <div>
              <p className="text-xs uppercase tracking-[0.24em] text-[#9a6b3f]">
                Questions international visitors ask
              </p>
              <h2 className="mt-4 text-4xl font-semibold leading-tight sm:text-5xl">
                Practical answers before you arrive
              </h2>
              <p className="mt-5 text-lg leading-8 text-stone-600">
                Direct answers help digital nomads, remote workers, foreign
                buyers and property owners understand how Home in the City can
                support housing, relocation and property visits in Brazil.
              </p>
            </div>
            <div className="grid gap-4">
              {answerFaqs.map((faq) => (
                <article key={faq.question} className="border border-stone-200 bg-white p-5">
                  <h3 className="text-xl font-semibold">{faq.question}</h3>
                  <p className="mt-3 leading-7 text-stone-600">{faq.answer}</p>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="bg-[#17202a] px-5 py-16 text-white sm:px-8 lg:px-14 lg:py-24">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-10 lg:grid-cols-[1fr_1fr] lg:items-end">
            <div>
              <p className="text-xs uppercase tracking-[0.24em] text-[#d7b46a]">
                Brazil-wide expansion
              </p>
              <h2 className="mt-4 text-4xl font-semibold leading-tight sm:text-5xl">
                Built to grow beyond one city
              </h2>
              <p className="mt-5 text-lg leading-8 text-stone-200">
                The collection can expand from Porto Alegre and Southern Brazil
                to beach houses, city apartments, furnished apartments Brazil
                and foreign-owned homes across the country.
              </p>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              {expansionLocations.map((location) => (
                <span key={location} className="border border-white/15 px-4 py-4 text-sm">
                  {location}
                </span>
              ))}
            </div>
          </div>

          <div className="mt-12 grid gap-4 border-t border-white/15 pt-8 md:grid-cols-4">
            <Link href="/real-estate/porto-alegre" className="text-sm text-stone-200 underline underline-offset-4">
              Porto Alegre properties
            </Link>
            <Link href="/brazil/porto-alegre" className="text-sm text-stone-200 underline underline-offset-4">
              Porto Alegre local guide
            </Link>
            <Link href="/interpreter-porto-alegre" className="text-sm text-stone-200 underline underline-offset-4">
              Interpreter services
            </Link>
            <a href={premiumInquiryHref} className="text-sm text-stone-200 underline underline-offset-4">
              Contact Home in the City
            </a>
          </div>
        </div>
      </section>
    </main>
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

  if (lang === "en") {
    return <PremiumRealEstatePortal listings={listings} />;
  }

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
