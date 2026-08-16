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

type PremiumFaq = {
  question: string;
  answer: string;
};

type PremiumCardContent = {
  title: string;
  location: string;
  type: string;
  image: string;
  text: string;
  hrefKind: "portoAlegreListings" | "inquiry";
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
    browseByCity: "Browse by City",
    browseByCityText:
      "Start with the places where Home in the City already has published property opportunities.",
    featuredProperties: "Featured Properties",
    featuredPropertiesText:
      "Published homes from the Home in the City collection, updated directly from Sanity.",
    cityCountSingular: "1 property",
    cityCountPlural: "{count} properties",
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
    browseByCity: "Buscar por Cidade",
    browseByCityText:
      "Comece pelos lugares onde a Home in the City já tem oportunidades de imóveis publicadas.",
    featuredProperties: "Imóveis em Destaque",
    featuredPropertiesText:
      "Imóveis publicados da coleção Home in the City, atualizados diretamente pelo Sanity.",
    cityCountSingular: "1 imóvel",
    cityCountPlural: "{count} imóveis",
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
    browseByCity: "Zoek per Stad",
    browseByCityText:
      "Begin met de plaatsen waar Home in the City al gepubliceerde vastgoedkansen heeft.",
    featuredProperties: "Uitgelichte Woningen",
    featuredPropertiesText:
      "Gepubliceerd woningaanbod uit de Home in the City-collectie, direct bijgewerkt vanuit Sanity.",
    cityCountSingular: "1 woning",
    cityCountPlural: "{count} woningen",
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

export function listingCitySlug(listing: PropertyListing) {
  if (listing.city?.slug?.current) return listing.city.slug.current;
  if (!listing.cityName) return "porto-alegre";

  return slugifyCityName(listing.cityName);
}

function slugifyCityName(cityName: string) {
  return cityName
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

type ListingCitySummary = {
  slug: string;
  name: string;
  listingCount: number;
  neighborhoods: string[];
};

function citySummariesFromListings(
  listings: PropertyListing[],
  lang: Lang,
): ListingCitySummary[] {
  const cities = new Map<string, ListingCitySummary>();

  listings.forEach((listing) => {
    const slug = listingCitySlug(listing);
    const name = listingCityName(listing, lang) || slug;
    const existing = cities.get(slug);

    if (existing) {
      existing.listingCount += 1;
      if (
        listing.neighborhood &&
        !existing.neighborhoods.includes(listing.neighborhood)
      ) {
        existing.neighborhoods.push(listing.neighborhood);
      }
      return;
    }

    cities.set(slug, {
      slug,
      name,
      listingCount: 1,
      neighborhoods: listing.neighborhood ? [listing.neighborhood] : [],
    });
  });

  return Array.from(cities.values()).sort((a, b) =>
    a.name.localeCompare(b.name, undefined, { sensitivity: "base" }),
  );
}

export function realEstateCityConfigFromListings(
  lang: Lang,
  citySlug: string,
  listings: PropertyListing[],
): CityConfig {
  const dynamicCity = citySummariesFromListings(listings, lang).find(
    (city) => city.slug === citySlug,
  );

  if (!dynamicCity) return realEstateCityConfig(lang, citySlug);

  const t = labels[lang];

  return {
    slug: dynamicCity.slug,
    title: dynamicCity.name,
    intro: t.browseByCityText,
    typeFocus:
      dynamicCity.listingCount === 1
        ? t.cityCountSingular
        : t.cityCountPlural.replace("{count}", String(dynamicCity.listingCount)),
  };
}

function CityCard({
  city,
  lang,
}: {
  city: ListingCitySummary;
  lang: Lang;
}) {
  const t = labels[lang];
  const count =
    city.listingCount === 1
      ? t.cityCountSingular
      : t.cityCountPlural.replace("{count}", String(city.listingCount));

  return (
    <Link
      href={cityPath(lang, city.slug)}
      className="group flex min-h-56 flex-col justify-between bg-white p-5 shadow-lg shadow-stone-300/20 transition hover:-translate-y-1 hover:shadow-xl hover:shadow-stone-300/30 sm:p-6"
    >
      <div>
        <p className="text-xs uppercase tracking-[0.22em] text-[#9a6b3f]">
          {count}
        </p>
        <h3 className="mt-4 text-2xl font-semibold text-[#17202a]">
          {city.name}
        </h3>
        {city.neighborhoods.length ? (
          <p className="mt-3 text-sm leading-6 text-stone-600">
            {city.neighborhoods.slice(0, 3).join(", ")}
          </p>
        ) : null}
      </div>
      <span className="mt-6 inline-flex border-b border-[#17202a] pb-1 text-sm font-semibold text-[#17202a]">
        {t.viewCity}
      </span>
    </Link>
  );
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
  if (listing.status === "hidden" || listing.status === "archived") return "";
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
  const citySlug = listingCitySlug(listing);
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

function premiumInquiryHref(lang: Lang) {
  const subjects = {
    en: "Property inquiry in Brazil",
    pt: "Consulta sobre imóvel no Brasil",
    nl: "Vraag over vastgoed in Brazilië",
  };

  return `mailto:properties@homeinthe.city?subject=${encodeURIComponent(subjects[lang])}`;
}

function premiumOwnerHref(lang: Lang) {
  const subjects = {
    en: "List my property in Brazil",
    pt: "Anunciar meu imóvel no Brasil",
    nl: "Mijn woning in Brazilië aanbieden",
  };

  return `mailto:properties@homeinthe.city?subject=${encodeURIComponent(subjects[lang])}`;
}

const premiumPaths = {
  en: {
    portoAlegreListings: "/real-estate/porto-alegre",
    portoAlegreGuide: "/brazil/porto-alegre",
    interpreter: "/interpreter/porto-alegre",
    host: "/providers/armijn",
  },
  pt: {
    portoAlegreListings: "/pt/imoveis/porto-alegre",
    portoAlegreGuide: "/pt/brasil/porto-alegre",
    interpreter: "/pt/interprete/porto-alegre",
    host: "/pt/profissionais/armijn",
  },
  nl: {
    portoAlegreListings: "/nl/vastgoed/porto-alegre",
    portoAlegreGuide: "/nl/brazilie/porto-alegre",
    interpreter: "/nl/tolk/porto-alegre",
    host: "/nl/professionals/armijn",
  },
};

const premiumContent = {
  en: {
    heroEyebrow: "Curated property platform for international life in Brazil",
    heroTitle: "Find Your Place in Brazil",
    heroText:
      "Monthly stays, curated homes and trusted local support for digital nomads, foreign buyers, expats and property owners in Brazil.",
    viewCta: "View Available Properties",
    listCta: "List Your Property",
    notMass: "Not a mass portal",
    heroCardTitle: "Curated properties, local guidance and multilingual support.",
    availableSingular:
      "1 verified property opportunity is currently available, with more curated homes being added across Brazil.",
    availablePlural:
      "{count} verified property opportunities are currently available, with more curated homes being added across Brazil.",
    noAvailable:
      "The platform is open for curated monthly rentals, homes for sale and foreign-owned properties across Brazil.",
    portalHighlights: [
      "Monthly stays",
      "Curated homes",
      "Foreign buyers",
      "Property owners",
      "Relocation assistance",
      "Interpreter services",
    ],
    monthlyEyebrow: "Featured Monthly Stays",
    monthlyTitle: "Furnished homes for staying, working and settling in",
    monthlyText:
      "Monthly rentals Brazil should feel calm before you arrive. These curated stay concepts are for digital nomads, remote workers, executives, researchers and long-stay visitors who need practical comfort and local support.",
    monthlyCards: [
      {
        title: "Furnished city apartment in Porto Alegre",
        location: "Porto Alegre",
        type: "Featured Monthly Stay",
        image: "/porto-alegre-desktop-background.jpg",
        text: "A calm, move-in ready city base for remote workers, executives and researchers who want reliable daily life with local support nearby.",
        hrefKind: "portoAlegreListings",
      },
      {
        title: "Coastal work-from-Brazil stay",
        location: "Florianópolis",
        type: "Digital Nomad Rental",
        image: "/porto-alegre-river.jpg",
        text: "A furnished coastal stay concept for digital nomads who want beach access, practical comfort and a trusted local bridge in Brazil.",
        hrefKind: "inquiry",
      },
    ],
    saleEyebrow: "Unique Homes for Sale",
    saleTitle: "Beach houses, coastal homes and properties worth understanding",
    saleText:
      "Property for sale in Brazil can be difficult to evaluate from abroad. Home in the City presents homes through lifestyle, location, local context and guided next steps.",
    saleCards: [
      {
        title: "Beach house in Garopaba",
        location: "Garopaba",
        type: "Unique Home for Sale",
        image: "/og-armijn3.jpg",
        text: "An aspirational beach-house opportunity for buyers seeking a slower rhythm, natural surroundings and a guided purchase experience.",
        hrefKind: "inquiry",
      },
      {
        title: "Coastal property in Florianópolis",
        location: "Florianópolis",
        type: "Brazil Property Investment",
        image: "/porto-alegre-river.jpg",
        text: "A curated coastal property concept for international buyers, investors and future residents comparing lifestyle and long-term value.",
        hrefKind: "inquiry",
      },
    ],
    nomadEyebrow: "For Digital Nomads",
    nomadTitle: "Work from Brazil without starting from zero",
    nomadText:
      "Digital nomad rentals Brazil need more than an attractive photo. We look for furnished apartments Brazil with reliable internet, practical neighborhoods, move-in readiness and human help when local systems are unfamiliar.",
    monthlyStayPoints: [
      "Reliable internet for video calls and remote work",
      "Furnished, move-in ready homes",
      "Flexible stays for several months",
      "Local support before and during arrival",
      "Safe, practical and trusted neighborhoods",
      "Options for executives, researchers and long-stay travelers",
    ],
    buyerEyebrow: "For International Buyers",
    buyerTitle: "Buy property in Brazil with local eyes beside you",
    buyerText:
      "International buyers often need context more than another search result. We help with property visits, neighborhood orientation, interpreter support and practical communication with owners, sellers or agents.",
    buyerFaqs: [
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
    ],
    ownersEyebrow: "For property owners",
    ownersTitle: "Own Property in Brazil?",
    ownersText:
      "We help property owners reach an international audience through curated listings, multilingual communication and local support.",
    ownersSubtext:
      "This is designed for foreign owners, expats, Brazilians living abroad, investors and owners of unique homes who want their property presented with care to international visitors and buyers.",
    howItWorksCta: "How It Works",
    ownerAudienceTitle: "Who this is for",
    ownerAudiences: [
      "Foreign owners",
      "Expats",
      "Brazilians living abroad",
      "Investors",
      "Owners of unique homes",
      "Owners of furnished monthly rentals",
    ],
    ownerPathway: [
      "Curated listing presentation for international visitors",
      "English, Portuguese and Dutch communication",
      "Local support for viewings, access and practical questions",
      "A better fit for distinctive homes than mass-market portals",
    ],
    helpEyebrow: "How Home in the City Helps",
    helpTitle: "Property search with a real local bridge",
    helpText:
      "We combine curated property discovery with local hosts, interpreter services, relocation Brazil support and transparent communication for people who are not yet fluent in the country.",
    interpreterCta: "Interpreter Services",
    hostCta: "Host Profiles",
    howWeHelp: [
      {
        title: "Curate",
        text: "We focus on properties with a clear story: monthly stays, beach houses, city apartments, unique homes and investment opportunities.",
      },
      {
        title: "Translate",
        text: "We help bridge English, Portuguese and Dutch communication before, during and after property visits.",
      },
      {
        title: "Guide",
        text: "Local hosts can explain neighborhoods, daily logistics, meetings, visits and relocation questions in Brazil.",
      },
      {
        title: "Support",
        text: "Interpreter services and on-the-ground assistance help international clients move from interest to confident next steps.",
      },
    ],
    practicalEyebrow: "Practical answers",
    practicalTitle: "Questions before you stay, buy or list",
    answerFaqs: [
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
    ],
    readyEyebrow: "Ready to begin",
    readyTitle: "Find, buy, stay or list with local support in Brazil",
    readyText:
      "Whether you need monthly rentals Brazil, homes for sale in Brazil or help presenting a property to international clients, Home in the City is built to be a trusted bridge.",
    expansionLocations: [
      "Porto Alegre apartments",
      "Garopaba beach houses",
      "Florianópolis properties",
      "Rio de Janeiro properties",
      "São Paulo properties",
      "Foreign-owned properties across Brazil",
    ],
    footerLinks: {
      listings: "Porto Alegre properties",
      guide: "Porto Alegre local guide",
      interpreter: "Interpreter services",
      contact: "Contact Home in the City",
    },
    inquire: "Inquire",
  },
  pt: {
    heroEyebrow: "Plataforma curada de imóveis para vida internacional no Brasil",
    heroTitle: "Encontre Seu Lugar no Brasil",
    heroText:
      "Estadias mensais, casas selecionadas e apoio local confiável para nômades digitais, compradores estrangeiros, expatriados e proprietários no Brasil.",
    viewCta: "Ver Imóveis Disponíveis",
    listCta: "Anuncie Seu Imóvel",
    notMass: "Não é um portal de massa",
    heroCardTitle: "Imóveis selecionados, orientação local e suporte multilíngue.",
    availableSingular:
      "1 oportunidade de imóvel verificada está disponível, com mais casas selecionadas sendo adicionadas no Brasil.",
    availablePlural:
      "{count} oportunidades de imóveis verificadas estão disponíveis, com mais casas selecionadas sendo adicionadas no Brasil.",
    noAvailable:
      "A plataforma está aberta para aluguéis mensais selecionados, casas à venda e imóveis de proprietários estrangeiros em todo o Brasil.",
    portalHighlights: [
      "Estadias mensais",
      "Casas selecionadas",
      "Compradores estrangeiros",
      "Proprietários",
      "Apoio de relocação",
      "Serviços de intérprete",
    ],
    monthlyEyebrow: "Estadias Mensais em Destaque",
    monthlyTitle: "Imóveis mobiliados para ficar, trabalhar e se adaptar",
    monthlyText:
      "Aluguéis mensais no Brasil devem trazer tranquilidade antes da chegada. Estes conceitos de estadia são para nômades digitais, trabalhadores remotos, executivos, pesquisadores e visitantes de longa permanência que precisam de conforto prático e apoio local.",
    monthlyCards: [
      {
        title: "Apartamento mobiliado em Porto Alegre",
        location: "Porto Alegre",
        type: "Estadia mensal em destaque",
        image: "/porto-alegre-desktop-background.jpg",
        text: "Uma base urbana calma e pronta para morar, ideal para trabalhadores remotos, executivos e pesquisadores que querem uma rotina confiável com apoio local por perto.",
        hrefKind: "portoAlegreListings",
      },
      {
        title: "Estadia litorânea para trabalhar do Brasil",
        location: "Florianópolis",
        type: "Aluguel para nômades digitais",
        image: "/porto-alegre-river.jpg",
        text: "Um conceito de estadia mobiliada no litoral para nômades digitais que buscam praia, conforto prático e uma ponte local confiável no Brasil.",
        hrefKind: "inquiry",
      },
    ],
    saleEyebrow: "Casas Únicas à Venda",
    saleTitle: "Casas de praia, imóveis no litoral e oportunidades que merecem contexto",
    saleText:
      "Comprar imóvel no Brasil à distância pode ser difícil de avaliar. A Home in the City apresenta imóveis com estilo de vida, localização, contexto local e próximos passos orientados.",
    saleCards: [
      {
        title: "Casa de praia em Garopaba",
        location: "Garopaba",
        type: "Casa única à venda",
        image: "/og-armijn3.jpg",
        text: "Uma oportunidade aspiracional para compradores que procuram um ritmo mais tranquilo, natureza e uma experiência de compra acompanhada.",
        hrefKind: "inquiry",
      },
      {
        title: "Imóvel no litoral de Florianópolis",
        location: "Florianópolis",
        type: "Investimento imobiliário no Brasil",
        image: "/porto-alegre-river.jpg",
        text: "Um conceito de imóvel litorâneo selecionado para compradores internacionais, investidores e futuros moradores compararem estilo de vida e valor de longo prazo.",
        hrefKind: "inquiry",
      },
    ],
    nomadEyebrow: "Para Nômades Digitais",
    nomadTitle: "Trabalhe do Brasil sem começar do zero",
    nomadText:
      "Aluguéis para nômades digitais no Brasil precisam de mais do que uma boa foto. Buscamos apartamentos mobiliados com internet confiável, bairros práticos, chegada simples e ajuda humana quando os sistemas locais são desconhecidos.",
    monthlyStayPoints: [
      "Internet confiável para videochamadas e trabalho remoto",
      "Imóveis mobiliados e prontos para morar",
      "Estadias flexíveis por vários meses",
      "Apoio local antes e durante a chegada",
      "Bairros seguros, práticos e confiáveis",
      "Opções para executivos, pesquisadores e viajantes de longa permanência",
    ],
    buyerEyebrow: "Para Compradores Internacionais",
    buyerTitle: "Compre imóvel no Brasil com olhos locais ao seu lado",
    buyerText:
      "Compradores internacionais muitas vezes precisam de contexto, não apenas outro resultado de busca. Ajudamos com visitas, orientação sobre bairros, apoio de intérprete e comunicação prática com proprietários, vendedores ou corretores.",
    buyerFaqs: [
      {
        question: "Estrangeiros podem comprar imóvel no Brasil?",
        answer:
          "Sim. Estrangeiros geralmente podem comprar imóveis urbanos no Brasil. O processo costuma exigir CPF, documentos de identificação, análise de documentação e orientação jurídica local.",
      },
      {
        question: "Preciso ter residência no Brasil para comprar?",
        answer:
          "Residência normalmente não é necessária para comprar imóveis urbanos. Áreas rurais, de fronteira ou especiais podem ter restrições, por isso cada caso deve ser verificado antes de uma oferta.",
      },
      {
        question: "Como funciona o processo de compra?",
        answer:
          "Uma compra típica inclui seleção do imóvel, visitas, verificação de documentos, negociação, revisão contratual, planejamento de pagamento e registro no cartório de imóveis.",
      },
      {
        question: "A Home in the City pode ajudar durante visitas?",
        answer:
          "Sim. Podemos ajudar compradores internacionais a visitar imóveis, entender bairros, fazer perguntas práticas e coordenar comunicação com vendedores, corretores ou proprietários.",
      },
      {
        question: "É possível ter apoio de idioma?",
        answer:
          "Sim. Apoio de intérprete pode ser organizado em inglês, português e holandês para visitas, reuniões, chamadas e negociações.",
      },
    ],
    ownersEyebrow: "Para proprietários",
    ownersTitle: "Tem Imóvel no Brasil?",
    ownersText:
      "Ajudamos proprietários a alcançar um público internacional com anúncios selecionados, comunicação multilíngue e apoio local.",
    ownersSubtext:
      "Esta página foi pensada para proprietários estrangeiros, expatriados, brasileiros morando fora, investidores e donos de imóveis únicos que querem apresentar seu imóvel com cuidado para visitantes e compradores internacionais.",
    howItWorksCta: "Como Funciona",
    ownerAudienceTitle: "Para quem é",
    ownerAudiences: [
      "Proprietários estrangeiros",
      "Expatriados",
      "Brasileiros morando fora",
      "Investidores",
      "Donos de casas únicas",
      "Proprietários de imóveis mobiliados para aluguel mensal",
    ],
    ownerPathway: [
      "Apresentação curada para visitantes internacionais",
      "Comunicação em inglês, português e holandês",
      "Apoio local para visitas, acesso e perguntas práticas",
      "Mais adequado para imóveis diferenciados do que portais de massa",
    ],
    helpEyebrow: "Como a Home in the City Ajuda",
    helpTitle: "Busca de imóveis com uma ponte local real",
    helpText:
      "Combinamos descoberta curada de imóveis com anfitriões locais, serviços de intérprete, apoio de relocação no Brasil e comunicação transparente para quem ainda não domina o país.",
    interpreterCta: "Serviços de Intérprete",
    hostCta: "Perfis de Anfitriões",
    howWeHelp: [
      {
        title: "Selecionar",
        text: "Focamos em imóveis com uma história clara: estadias mensais, casas de praia, apartamentos urbanos, casas únicas e oportunidades de investimento.",
      },
      {
        title: "Traduzir",
        text: "Ajudamos a conectar comunicação em inglês, português e holandês antes, durante e depois das visitas.",
      },
      {
        title: "Orientar",
        text: "Anfitriões locais podem explicar bairros, logística diária, reuniões, visitas e questões de relocação no Brasil.",
      },
      {
        title: "Apoiar",
        text: "Serviços de intérprete e apoio em campo ajudam clientes internacionais a avançar do interesse para próximos passos com confiança.",
      },
    ],
    practicalEyebrow: "Respostas práticas",
    practicalTitle: "Perguntas antes de ficar, comprar ou anunciar",
    answerFaqs: [
      {
        question: "Quais são os melhores lugares no Brasil para nômades digitais?",
        answer:
          "Opções populares incluem Florianópolis e Garopaba para vida de praia, Porto Alegre para acesso ao Sul e vida urbana prática, São Paulo para negócios e Rio de Janeiro para cultura e visibilidade.",
      },
      {
        question: "Posso alugar um apartamento mobiliado no Brasil por vários meses?",
        answer:
          "Sim. A Home in the City tem foco especial em apartamentos e casas mobiliadas que funcionam para aluguéis mensais, trabalhadores remotos, executivos e visitantes internacionais de longa permanência.",
      },
      {
        question: "Como compradores internacionais visitam imóveis no Brasil?",
        answer:
          "Compradores internacionais podem combinar uma seleção curada com visitas guiadas, orientação local e apoio de intérprete para avaliar cada imóvel com mais segurança.",
      },
      {
        question: "A Home in the City ajuda em visitas e negociações?",
        answer:
          "Sim. Podemos ajudar com coordenação local, interpretação, perguntas práticas, planejamento de visitas e comunicação com proprietários, corretores ou prestadores de serviço.",
      },
      {
        question: "A Home in the City oferece apoio de intérprete?",
        answer:
          "Sim. Serviços de intérprete estão disponíveis para visitas a imóveis, compromissos de relocação, reuniões e conversas em inglês, português e holandês.",
      },
    ],
    readyEyebrow: "Pronto para começar",
    readyTitle: "Encontre, compre, fique ou anuncie com apoio local no Brasil",
    readyText:
      "Se você precisa de aluguéis mensais no Brasil, casas à venda no Brasil ou ajuda para apresentar um imóvel a clientes internacionais, a Home in the City foi criada para ser uma ponte confiável.",
    expansionLocations: [
      "Apartamentos em Porto Alegre",
      "Casas de praia em Garopaba",
      "Imóveis em Florianópolis",
      "Imóveis no Rio de Janeiro",
      "Imóveis em São Paulo",
      "Imóveis de proprietários estrangeiros no Brasil",
    ],
    footerLinks: {
      listings: "Imóveis em Porto Alegre",
      guide: "Guia local de Porto Alegre",
      interpreter: "Serviços de intérprete",
      contact: "Contato Home in the City",
    },
    inquire: "Consultar",
  },
  nl: {
    heroEyebrow: "Geselecteerd vastgoedplatform voor internationaal leven in Brazilië",
    heroTitle: "Vind Uw Plek in Brazilië",
    heroText:
      "Maandelijkse verblijven, geselecteerde woningen en betrouwbare lokale ondersteuning voor digital nomads, buitenlandse kopers, expats en vastgoedeigenaren in Brazilië.",
    viewCta: "Bekijk Beschikbare Woningen",
    listCta: "Bied Uw Woning Aan",
    notMass: "Geen massaportaal",
    heroCardTitle: "Geselecteerde woningen, lokale begeleiding en meertalige ondersteuning.",
    availableSingular:
      "Er is 1 geverifieerde vastgoedkans beschikbaar, met meer geselecteerde woningen in Brazilië in voorbereiding.",
    availablePlural:
      "Er zijn {count} geverifieerde vastgoedkansen beschikbaar, met meer geselecteerde woningen in Brazilië in voorbereiding.",
    noAvailable:
      "Het platform staat open voor geselecteerde maandhuur, woningen te koop en buitenlands bezit in heel Brazilië.",
    portalHighlights: [
      "Maandverblijven",
      "Geselecteerde woningen",
      "Buitenlandse kopers",
      "Eigenaren",
      "Verhuisbegeleiding",
      "Tolkdiensten",
    ],
    monthlyEyebrow: "Uitgelichte Maandverblijven",
    monthlyTitle: "Gemeubileerde woningen om te verblijven, werken en landen",
    monthlyText:
      "Maandhuur in Brazilië moet al vóór aankomst rust geven. Deze verblijfconcepten zijn voor digital nomads, remote workers, executives, onderzoekers en long-stay bezoekers die praktisch comfort en lokale ondersteuning nodig hebben.",
    monthlyCards: [
      {
        title: "Gemeubileerd stadsappartement in Porto Alegre",
        location: "Porto Alegre",
        type: "Uitgelicht maandverblijf",
        image: "/porto-alegre-desktop-background.jpg",
        text: "Een rustige, instapklare stadsbasis voor remote workers, executives en onderzoekers die betrouwbaar dagelijks leven willen met lokale hulp dichtbij.",
        hrefKind: "portoAlegreListings",
      },
      {
        title: "Kustverblijf om vanuit Brazilië te werken",
        location: "Florianópolis",
        type: "Digital nomad huur",
        image: "/porto-alegre-river.jpg",
        text: "Een gemeubileerd verblijfconcept aan de kust voor digital nomads die strand, praktisch comfort en een betrouwbare lokale brug in Brazilië zoeken.",
        hrefKind: "inquiry",
      },
    ],
    saleEyebrow: "Unieke Woningen te Koop",
    saleTitle: "Strandhuizen, kustwoningen en vastgoed dat context verdient",
    saleText:
      "Vastgoed te koop in Brazilië is vanuit het buitenland lastig te beoordelen. Home in the City presenteert woningen via levensstijl, locatie, lokale context en begeleide vervolgstappen.",
    saleCards: [
      {
        title: "Strandhuis in Garopaba",
        location: "Garopaba",
        type: "Unieke woning te koop",
        image: "/og-armijn3.jpg",
        text: "Een inspirerende strandhuis-kans voor kopers die een rustiger ritme, natuur en een begeleide aankoopervaring zoeken.",
        hrefKind: "inquiry",
      },
      {
        title: "Kustwoning in Florianópolis",
        location: "Florianópolis",
        type: "Vastgoedinvestering Brazilië",
        image: "/porto-alegre-river.jpg",
        text: "Een geselecteerd kustwoningconcept voor internationale kopers, investeerders en toekomstige bewoners die levensstijl en langetermijnwaarde vergelijken.",
        hrefKind: "inquiry",
      },
    ],
    nomadEyebrow: "Voor Digital Nomads",
    nomadTitle: "Werk vanuit Brazilië zonder vanaf nul te beginnen",
    nomadText:
      "Digital nomad huur in Brazilië vraagt meer dan een mooie foto. We zoeken gemeubileerde appartementen met betrouwbaar internet, praktische buurten, makkelijke aankomst en menselijke hulp wanneer lokale systemen onbekend zijn.",
    monthlyStayPoints: [
      "Betrouwbaar internet voor videogesprekken en remote work",
      "Gemeubileerde, instapklare woningen",
      "Flexibele verblijven voor meerdere maanden",
      "Lokale ondersteuning voor en tijdens aankomst",
      "Veilige, praktische en vertrouwde buurten",
      "Opties voor executives, onderzoekers en long-stay reizigers",
    ],
    buyerEyebrow: "Voor Internationale Kopers",
    buyerTitle: "Koop vastgoed in Brazilië met lokale ogen naast u",
    buyerText:
      "Internationale kopers hebben vaak meer context nodig dan nog een zoekresultaat. We helpen met bezichtigingen, buurtoriëntatie, tolkhulp en praktische communicatie met eigenaren, verkopers of makelaars.",
    buyerFaqs: [
      {
        question: "Kunnen buitenlanders vastgoed kopen in Brazilië?",
        answer:
          "Ja. Buitenlanders kunnen meestal stedelijk vastgoed in Brazilië kopen. Het proces vraagt doorgaans belastingregistratie, identiteitsdocumenten, due diligence en lokale juridische begeleiding.",
      },
      {
        question: "Heb ik verblijfsrecht nodig om te kopen?",
        answer:
          "Voor stedelijk vastgoed is verblijfsrecht meestal niet nodig. Voor landelijke, grens- of speciale gebieden kunnen beperkingen gelden, dus elk geval moet vooraf worden gecontroleerd.",
      },
      {
        question: "Hoe werkt het aankoopproces?",
        answer:
          "Een typische aankoop bestaat uit selectie, bezichtigingen, documentencontrole, onderhandeling, contractcontrole, betalingsplanning en registratie bij het lokale vastgoedregister.",
      },
      {
        question: "Kan Home in the City helpen tijdens bezichtigingen?",
        answer:
          "Ja. We kunnen internationale kopers helpen met bezichtigingen, buurtcontext, praktische vragen en communicatie met verkopers, makelaars of eigenaren.",
      },
      {
        question: "Is taalondersteuning beschikbaar?",
        answer:
          "Ja. Tolkhulp kan worden geregeld in Engels, Portugees en Nederlands voor bezichtigingen, vergaderingen, gesprekken en onderhandelingen.",
      },
    ],
    ownersEyebrow: "Voor eigenaren",
    ownersTitle: "Heeft U Vastgoed in Brazilië?",
    ownersText:
      "We helpen eigenaren een internationaal publiek te bereiken via geselecteerde listings, meertalige communicatie en lokale ondersteuning.",
    ownersSubtext:
      "Dit is bedoeld voor buitenlandse eigenaren, expats, Brazilianen in het buitenland, investeerders en eigenaren van unieke woningen die hun vastgoed zorgvuldig willen presenteren aan internationale bezoekers en kopers.",
    howItWorksCta: "Hoe Het Werkt",
    ownerAudienceTitle: "Voor wie dit is",
    ownerAudiences: [
      "Buitenlandse eigenaren",
      "Expats",
      "Brazilianen in het buitenland",
      "Investeerders",
      "Eigenaren van unieke woningen",
      "Eigenaren van gemeubileerde maandhuurwoningen",
    ],
    ownerPathway: [
      "Geselecteerde presentatie voor internationale bezoekers",
      "Communicatie in Engels, Portugees en Nederlands",
      "Lokale ondersteuning voor bezichtigingen, toegang en praktische vragen",
      "Beter passend voor bijzondere woningen dan massaportalen",
    ],
    helpEyebrow: "Hoe Home in the City Helpt",
    helpTitle: "Vastgoed zoeken met een echte lokale brug",
    helpText:
      "We combineren geselecteerde vastgoedontdekking met lokale hosts, tolkdiensten, verhuisbegeleiding in Brazilië en transparante communicatie voor mensen die het land nog niet door en door kennen.",
    interpreterCta: "Tolkdiensten",
    hostCta: "Hostprofielen",
    howWeHelp: [
      {
        title: "Selecteren",
        text: "We richten ons op woningen met een duidelijk verhaal: maandverblijven, strandhuizen, stadsappartementen, unieke woningen en investeringskansen.",
      },
      {
        title: "Vertalen",
        text: "We helpen de communicatie in Engels, Portugees en Nederlands vóór, tijdens en na bezichtigingen te overbruggen.",
      },
      {
        title: "Begeleiden",
        text: "Lokale hosts kunnen buurten, dagelijkse logistiek, afspraken, bezoeken en verhuisvragen in Brazilië uitleggen.",
      },
      {
        title: "Ondersteunen",
        text: "Tolkdiensten en hulp ter plaatse helpen internationale cliënten van interesse naar zelfverzekerde vervolgstappen.",
      },
    ],
    practicalEyebrow: "Praktische antwoorden",
    practicalTitle: "Vragen voordat u verblijft, koopt of aanbiedt",
    answerFaqs: [
      {
        question: "Wat zijn de beste plekken in Brazilië voor digital nomads?",
        answer:
          "Populaire opties zijn Florianópolis en Garopaba voor strand, Porto Alegre voor toegang tot Zuid-Brazilië en praktisch stadsleven, São Paulo voor zaken en Rio de Janeiro voor cultuur en zichtbaarheid.",
      },
      {
        question: "Kan ik een gemeubileerd appartement in Brazilië voor meerdere maanden huren?",
        answer:
          "Ja. Home in the City richt zich vooral op gemeubileerde appartementen en woningen die werken voor maandhuur, remote workers, executives en internationale long-stay bezoekers.",
      },
      {
        question: "Hoe bekijken internationale kopers vastgoed in Brazilië?",
        answer:
          "Internationale kopers kunnen een geselecteerde shortlist combineren met begeleide bezichtigingen, lokale oriëntatie en tolkhulp zodat elke woning beter te beoordelen is.",
      },
      {
        question: "Kan Home in the City helpen bij bezichtigingen en onderhandelingen?",
        answer:
          "Ja. We kunnen helpen met lokale coördinatie, interpretatie, praktische vragen, bezoekplanning en communicatie met eigenaren, makelaars of dienstverleners.",
      },
      {
        question: "Kan Home in the City tolkhulp bieden?",
        answer:
          "Ja. Tolkdiensten zijn beschikbaar voor vastgoedbezoeken, verhuisafspraken, vergaderingen en gesprekken in Engels, Portugees en Nederlands.",
      },
    ],
    readyEyebrow: "Klaar om te beginnen",
    readyTitle: "Vind, koop, verblijf of bied aan met lokale steun in Brazilië",
    readyText:
      "Of u nu maandhuur in Brazilië zoekt, woningen te koop in Brazilië bekijkt of hulp wilt om vastgoed aan internationale cliënten te presenteren, Home in the City is gebouwd als betrouwbare brug.",
    expansionLocations: [
      "Appartementen in Porto Alegre",
      "Strandhuizen in Garopaba",
      "Vastgoed in Florianópolis",
      "Vastgoed in Rio de Janeiro",
      "Vastgoed in São Paulo",
      "Buitenlands bezit in heel Brazilië",
    ],
    footerLinks: {
      listings: "Vastgoed in Porto Alegre",
      guide: "Lokale gids Porto Alegre",
      interpreter: "Tolkdiensten",
      contact: "Contact Home in the City",
    },
    inquire: "Informeer",
  },
} satisfies Record<Lang, {
  heroEyebrow: string;
  heroTitle: string;
  heroText: string;
  viewCta: string;
  listCta: string;
  notMass: string;
  heroCardTitle: string;
  availableSingular: string;
  availablePlural: string;
  noAvailable: string;
  portalHighlights: string[];
  monthlyEyebrow: string;
  monthlyTitle: string;
  monthlyText: string;
  monthlyCards: PremiumCardContent[];
  saleEyebrow: string;
  saleTitle: string;
  saleText: string;
  saleCards: PremiumCardContent[];
  nomadEyebrow: string;
  nomadTitle: string;
  nomadText: string;
  monthlyStayPoints: string[];
  buyerEyebrow: string;
  buyerTitle: string;
  buyerText: string;
  buyerFaqs: PremiumFaq[];
  ownersEyebrow: string;
  ownersTitle: string;
  ownersText: string;
  ownersSubtext: string;
  howItWorksCta: string;
  ownerAudienceTitle: string;
  ownerAudiences: string[];
  ownerPathway: string[];
  helpEyebrow: string;
  helpTitle: string;
  helpText: string;
  interpreterCta: string;
  hostCta: string;
  howWeHelp: { title: string; text: string }[];
  practicalEyebrow: string;
  practicalTitle: string;
  answerFaqs: PremiumFaq[];
  readyEyebrow: string;
  readyTitle: string;
  readyText: string;
  expansionLocations: string[];
  footerLinks: {
    listings: string;
    guide: string;
    interpreter: string;
    contact: string;
  };
  inquire: string;
}>;

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
  ctaLabel,
}: {
  title: string;
  location: string;
  type: string;
  image: string;
  text: string;
  href: string;
  ctaLabel: string;
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
          {ctaLabel}
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

function PremiumRealEstatePortal({
  lang,
  listings,
}: {
  lang: Lang;
  listings: PropertyListing[];
}) {
  const content = premiumContent[lang];
  const paths = premiumPaths[lang];
  const inquiryHref = premiumInquiryHref(lang);
  const ownerHref = premiumOwnerHref(lang);
  const cities = citySummariesFromListings(listings, lang);
  const availableListingCount = listings.filter(
    (listing) => !["hidden", "archived"].includes(listing.status || ""),
  ).length;
  const availabilityText =
    availableListingCount === 0
      ? content.noAvailable
      : availableListingCount === 1
      ? content.availableSingular
      : content.availablePlural.replace("{count}", String(availableListingCount));

  function cardHref(card: PremiumCardContent) {
    return card.hrefKind === "portoAlegreListings"
      ? paths.portoAlegreListings
      : inquiryHref;
  }

  return (
    <main className="bg-[#f6f1e8] text-[#17202a]">
      <section className="relative min-h-screen overflow-hidden bg-[#17202a] text-white">
        <Image
          src="/porto-alegre-desktop-background.jpg"
          alt="Premium apartment interior and city lifestyle in Brazil"
          fill
          priority
          className="object-cover opacity-70"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/55 via-black/40 to-[#17202a]/95" />
        <div className="relative z-10 flex min-h-screen items-end px-5 pt-32 pb-8 sm:px-8 lg:px-14">
          <div className="mx-auto grid w-full max-w-7xl gap-8 lg:grid-cols-[minmax(0,1fr)_26rem] lg:items-end">
            <div className="pb-2">
              <p className="text-xs uppercase tracking-[0.28em] text-stone-200">
                {content.heroEyebrow}
              </p>
              <h1 className="mt-5 max-w-4xl text-5xl font-semibold leading-[1.02] sm:text-7xl lg:text-8xl">
                {content.heroTitle}
              </h1>
              <p className="mt-6 max-w-2xl text-lg leading-8 text-stone-100 sm:text-xl">
                {content.heroText}
              </p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <PremiumButton href="#featured-properties" variant="light">
                  {content.viewCta}
                </PremiumButton>
                <PremiumButton href="#owners" variant="heroOutline">
                  {content.listCta}
                </PremiumButton>
              </div>
            </div>
            <div className="bg-white p-5 text-[#17202a] shadow-2xl shadow-black/20 sm:p-6">
              <p className="text-xs uppercase tracking-[0.22em] text-[#9a6b3f]">
                {content.notMass}
              </p>
              <h2 className="mt-3 text-2xl font-semibold leading-tight">
                {content.heroCardTitle}
              </h2>
              <div className="mt-5 grid grid-cols-2 gap-2 text-sm">
                {content.portalHighlights.map((item) => (
                  <span key={item} className="bg-[#f6f1e8] px-3 py-3">
                    {item}
                  </span>
                ))}
              </div>
              <div className="mt-6 border-t border-stone-200 pt-5">
                <p className="text-sm leading-6 text-stone-600">
                  {availabilityText}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section
        id="browse-by-city"
        aria-labelledby="browse-by-city-title"
        className="px-5 py-16 sm:px-8 lg:px-14 lg:py-24"
      >
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-8 lg:grid-cols-[0.85fr_1.15fr] lg:items-end">
            <div>
              <p className="text-xs uppercase tracking-[0.24em] text-[#9a6b3f]">
                {labels[lang].cities}
              </p>
              <h2
                id="browse-by-city-title"
                className="mt-4 text-4xl font-semibold leading-tight sm:text-5xl"
              >
                {labels[lang].browseByCity}
              </h2>
            </div>
            <p className="text-lg leading-8 text-stone-600">
              {labels[lang].browseByCityText}
            </p>
          </div>

          {cities.length ? (
            <div className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
              {cities.map((city) => (
                <CityCard key={city.slug} city={city} lang={lang} />
              ))}
            </div>
          ) : (
            <p className="mt-8 bg-white p-6 text-stone-600 shadow-lg shadow-stone-300/20">
              {labels[lang].empty}
            </p>
          )}
        </div>
      </section>

      <section
        id="featured-properties"
        aria-labelledby="featured-properties-title"
        className="bg-white px-5 py-16 sm:px-8 lg:px-14 lg:py-24"
      >
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-8 lg:grid-cols-[0.85fr_1.15fr] lg:items-end">
            <div>
              <p className="text-xs uppercase tracking-[0.24em] text-[#9a6b3f]">
                {labels[lang].listings}
              </p>
              <h2
                id="featured-properties-title"
                className="mt-4 text-4xl font-semibold leading-tight sm:text-5xl"
              >
                {labels[lang].featuredProperties}
              </h2>
            </div>
            <p className="text-lg leading-8 text-stone-600">
              {labels[lang].featuredPropertiesText}
            </p>
          </div>

          {listings.length ? (
            <div className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
              {listings.map((listing) => (
                <PropertyCard
                  key={listing.slug?.current || localizedListingText(listing, "title", lang)}
                  listing={listing}
                  lang={lang}
                />
              ))}
            </div>
          ) : (
            <p className="mt-8 bg-[#f6f1e8] p-6 text-stone-600 shadow-lg shadow-stone-300/20">
              {labels[lang].empty}
            </p>
          )}
        </div>
      </section>

      <section
        id="monthly-stays"
        aria-labelledby="featured-monthly-stays"
        className="px-5 py-16 sm:px-8 lg:px-14 lg:py-24"
      >
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-8 lg:grid-cols-[0.85fr_1.15fr] lg:items-end">
            <div>
              <p className="text-xs uppercase tracking-[0.24em] text-[#9a6b3f]">
                {content.monthlyEyebrow}
              </p>
              <h2
                id="featured-monthly-stays"
                className="mt-4 text-4xl font-semibold leading-tight sm:text-5xl"
              >
                {content.monthlyTitle}
              </h2>
            </div>
            <p className="text-lg leading-8 text-stone-600">
              {content.monthlyText}
            </p>
          </div>

          <div className="mt-10 grid gap-5 md:grid-cols-2">
            {content.monthlyCards.map((item) => (
              <PremiumShowcaseCard
                key={`${item.title}-${item.location}`}
                {...item}
                href={cardHref(item)}
                ctaLabel={content.inquire}
              />
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[#17202a] px-5 py-16 text-white sm:px-8 lg:px-14 lg:py-24">
        <div className="mx-auto max-w-7xl">
          <div className="max-w-3xl">
            <p className="text-xs uppercase tracking-[0.24em] text-[#9a6b3f]">
              {content.saleEyebrow}
            </p>
            <h2 className="mt-4 text-4xl font-semibold leading-tight sm:text-5xl">
              {content.saleTitle}
            </h2>
            <p className="mt-5 text-lg leading-8 text-stone-200">
              {content.saleText}
            </p>
          </div>
          <div className="mt-10 grid gap-5 md:grid-cols-2">
            {content.saleCards.map((item) => (
              <PremiumShowcaseCard
                key={`${item.title}-${item.location}`}
                {...item}
                href={cardHref(item)}
                ctaLabel={content.inquire}
              />
            ))}
          </div>
        </div>
      </section>

      <section className="bg-white px-5 py-16 sm:px-8 lg:px-14 lg:py-24">
        <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[1fr_1fr] lg:items-center">
          <div>
            <p className="text-xs uppercase tracking-[0.24em] text-[#9a6b3f]">
              {content.nomadEyebrow}
            </p>
            <h2 className="mt-4 text-4xl font-semibold leading-tight sm:text-5xl">
              {content.nomadTitle}
            </h2>
            <p className="mt-5 text-lg leading-8 text-stone-600">
              {content.nomadText}
            </p>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
              {content.monthlyStayPoints.map((point) => (
                <p key={point} className="border-l-2 border-[#9a6b3f] bg-[#f6f1e8] px-4 py-4 text-sm leading-6">
                  {point}
                </p>
              ))}
          </div>
        </div>
      </section>

      <section className="px-5 py-16 sm:px-8 lg:px-14 lg:py-24">
        <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[0.8fr_1.2fr]">
          <div>
            <p className="text-xs uppercase tracking-[0.24em] text-[#d7b46a]">
              {content.buyerEyebrow}
            </p>
            <h2 className="mt-4 text-4xl font-semibold leading-tight sm:text-5xl">
              {content.buyerTitle}
            </h2>
            <p className="mt-5 text-lg leading-8 text-stone-600">
              {content.buyerText}
            </p>
          </div>
          <div className="grid gap-4">
            {content.buyerFaqs.map((faq) => (
              <article key={faq.question} className="border border-stone-200 bg-white p-5">
                <h3 className="text-xl font-semibold">{faq.question}</h3>
                <p className="mt-3 leading-7 text-stone-600">{faq.answer}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section
        id="owners"
        className="bg-[#16332c] px-5 py-16 text-white sm:px-8 lg:px-14 lg:py-24"
      >
        <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
          <div>
            <p className="text-xs uppercase tracking-[0.24em] text-[#d7b46a]">
              {content.ownersEyebrow}
            </p>
            <h2 className="mt-4 text-4xl font-semibold leading-tight sm:text-5xl">
              {content.ownersTitle}
            </h2>
            <p className="mt-5 text-lg leading-8 text-stone-200">
              {content.ownersText}
            </p>
            <p className="mt-5 leading-8 text-stone-200">
              {content.ownersSubtext}
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <PremiumButton href={ownerHref} variant="light">
                {content.listCta}
              </PremiumButton>
              <PremiumButton href="#how-we-help" variant="heroOutline">
                {content.howItWorksCta}
              </PremiumButton>
            </div>
          </div>
          <div className="bg-white p-6 text-[#17202a] sm:p-8">
            <h3 className="text-2xl font-semibold">{content.ownerAudienceTitle}</h3>
            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              {content.ownerAudiences.map((item) => (
                <p key={item} className="bg-[#f6f1e8] px-4 py-4 text-sm leading-6">
                  {item}
                </p>
              ))}
            </div>
            <div className="mt-6 border-t border-stone-200 pt-6">
              {content.ownerPathway.map((item) => (
                <p key={item} className="border-b border-stone-200 py-3 text-sm leading-6 text-stone-600">
                  {item}
                </p>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section
        id="how-we-help"
        className="bg-white px-5 py-16 sm:px-8 lg:px-14 lg:py-24"
      >
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:items-start">
            <div>
              <p className="text-xs uppercase tracking-[0.24em] text-[#9a6b3f]">
                {content.helpEyebrow}
              </p>
              <h2 className="mt-4 text-4xl font-semibold leading-tight sm:text-5xl">
                {content.helpTitle}
              </h2>
              <p className="mt-5 text-lg leading-8 text-stone-600">
                {content.helpText}
              </p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <PremiumButton href={paths.interpreter} variant="outline">
                  {content.interpreterCta}
                </PremiumButton>
                <PremiumButton href={paths.host}>{content.hostCta}</PremiumButton>
              </div>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              {content.howWeHelp.map((item) => (
                <article key={item.title} className="border border-stone-200 bg-[#f6f1e8] p-5">
                  <h3 className="text-xl font-semibold">{item.title}</h3>
                  <p className="mt-3 leading-7 text-stone-600">{item.text}</p>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="px-5 py-16 sm:px-8 lg:px-14 lg:py-24">
        <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[0.8fr_1.2fr]">
          <div>
            <p className="text-xs uppercase tracking-[0.24em] text-[#9a6b3f]">
              {content.practicalEyebrow}
            </p>
            <h2 className="mt-4 text-4xl font-semibold leading-tight sm:text-5xl">
              {content.practicalTitle}
            </h2>
          </div>
          <div className="grid gap-4">
            {content.answerFaqs.map((faq) => (
              <article key={faq.question} className="border border-stone-200 bg-white p-5">
                <h3 className="text-xl font-semibold">{faq.question}</h3>
                <p className="mt-3 leading-7 text-stone-600">{faq.answer}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[#17202a] px-5 py-16 text-white sm:px-8 lg:px-14 lg:py-24">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-10 lg:grid-cols-[1fr_1fr] lg:items-center">
            <div>
              <p className="text-xs uppercase tracking-[0.24em] text-[#d7b46a]">
                {content.readyEyebrow}
              </p>
              <h2 className="mt-4 text-4xl font-semibold leading-tight sm:text-5xl">
                {content.readyTitle}
              </h2>
              <p className="mt-5 text-lg leading-8 text-stone-200">
                {content.readyText}
              </p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <PremiumButton href="#featured-properties" variant="light">
                  {content.viewCta}
                </PremiumButton>
                <PremiumButton href={ownerHref} variant="heroOutline">
                  {content.listCta}
                </PremiumButton>
              </div>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              {content.expansionLocations.map((location) => (
                <span key={location} className="border border-white/15 px-4 py-4 text-sm">
                  {location}
                </span>
              ))}
            </div>
          </div>

          <div className="mt-12 grid gap-4 border-t border-white/15 pt-8 md:grid-cols-4">
            <Link href={paths.portoAlegreListings} className="text-sm text-stone-200 underline underline-offset-4">
              {content.footerLinks.listings}
            </Link>
            <Link href={paths.portoAlegreGuide} className="text-sm text-stone-200 underline underline-offset-4">
              {content.footerLinks.guide}
            </Link>
            <Link href={paths.interpreter} className="text-sm text-stone-200 underline underline-offset-4">
              {content.footerLinks.interpreter}
            </Link>
            <a href={inquiryHref} className="text-sm text-stone-200 underline underline-offset-4">
              {content.footerLinks.contact}
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
}: {
  lang: Lang;
  listings: PropertyListing[];
  realtor: RealtorProfile | null;
}) {
  return <PremiumRealEstatePortal lang={lang} listings={listings} />;
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
