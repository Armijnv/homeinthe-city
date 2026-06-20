"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import {
  cityGuideEnabledLanguages,
  cityGuideIsPublic,
  cityGuideLanguageEnabled,
  cityGuideName,
  cityGuidePath,
  cityGuideStatus,
  type CityGuideContent,
  type CityGuideLang,
} from "@/app/lib/cityGuides";
import {
  spokenLanguageCodes,
  type ProviderLanguageNavigationItem,
} from "@/app/lib/providerLanguages";
import {
  interpreterPathForCity,
  interpreterRoute,
} from "@/app/lib/interpreterPages";

type MenuLink = {
  label: string;
  href: string;
  external?: boolean;
  disabled?: boolean;
};

type MenuSection = {
  title: string;
  links: MenuLink[];
};

function MenuContent({
  mobile = false,
  menuSections,
  englishPath,
  portuguesePath,
  dutchPath,
  availableLanguages,
  featuredInterpreter,
  providerLogin,
}: {
  mobile?: boolean;
  menuSections: MenuSection[];
  englishPath: string;
  portuguesePath: string;
  dutchPath: string;
  availableLanguages: CityGuideLang[];
  featuredInterpreter: MenuLink;
  providerLogin: MenuLink;
}) {
  return (
    <nav
      className={
        mobile
          ? "absolute right-0 mt-6 flex max-h-[calc(100vh-7rem)] w-[min(20rem,calc(100vw-3rem))] flex-col gap-5 overflow-y-auto rounded-2xl bg-[#1a1f2e] p-5 text-white shadow-2xl"
          : "absolute right-0 mt-5 w-[min(48rem,calc(100vw-4rem))] rounded-2xl border border-white/10 bg-[#1a1f2e] p-6 text-white shadow-2xl"
      }
    >
      {mobile ? (
        <div className="flex gap-3 border-b border-white/10 pb-4 text-xl">
          {availableLanguages.includes("en") ? (
            <Link href={englishPath} aria-label="English">🇬🇧</Link>
          ) : null}
          {availableLanguages.includes("pt") ? (
            <Link href={portuguesePath} aria-label="Portuguese">🇧🇷</Link>
          ) : null}
          {availableLanguages.includes("nl") ? (
            <Link href={dutchPath} aria-label="Dutch">🇳🇱</Link>
          ) : null}
        </div>
      ) : null}

      {mobile ? (
        <div className="grid gap-3">
          <Link
            href={featuredInterpreter.href}
            className="rounded-lg border border-[#d7b46a]/50 bg-[#d7b46a]/10 px-4 py-3 text-sm font-medium text-white"
          >
            {featuredInterpreter.label}
          </Link>
          <Link
            href={providerLogin.href}
            className="rounded-lg bg-[#d7b46a] px-4 py-3 text-sm font-medium text-[#1a1f2e] transition hover:bg-[#efcf88]"
          >
            {providerLogin.label}
          </Link>
        </div>
      ) : null}

      <div
        className={
          mobile ? "grid gap-5" : "grid gap-6 md:grid-cols-2 lg:grid-cols-4"
        }
      >
        {menuSections.map((section) => (
          <section key={section.title}>
            <h2 className="mb-3 text-xs uppercase tracking-widest text-white/40">
              {section.title}
            </h2>

            <div className="flex flex-col gap-3 text-sm text-white/75">
              {section.links.map((link) =>
                link.disabled ? (
                  <span key={link.label} className="text-white/45">
                    {link.label}
                  </span>
                ) : link.external ? (
                  <a
                    key={link.label}
                    href={link.href}
                    target={link.href.startsWith("http") ? "_blank" : undefined}
                    rel={link.href.startsWith("http") ? "noopener noreferrer" : undefined}
                    className="hover:text-white"
                  >
                    {link.label}
                  </a>
                ) : (
                  <Link key={link.label} href={link.href} className="hover:text-white">
                    {link.label}
                  </Link>
                ),
              )}
            </div>
          </section>
        ))}
      </div>
    </nav>
  );
}

export default function Header({
  cityGuides = [],
  providerLanguages = [],
}: {
  cityGuides?: CityGuideContent[];
  providerLanguages?: ProviderLanguageNavigationItem[];
}) {
  const pathname = usePathname();
  const providerSlug =
    pathname.match(/^\/providers\/([^/]+)/)?.[1] ||
    pathname.match(/^\/pt\/profissionais\/([^/]+)/)?.[1] ||
    pathname.match(/^\/nl\/professionals\/([^/]+)/)?.[1];
  const hostSlug =
    pathname.match(/^\/hosts\/([^/]+)/)?.[1] ||
    pathname.match(/^\/pt\/hosts\/([^/]+)/)?.[1] ||
    pathname.match(/^\/nl\/hosts\/([^/]+)/)?.[1];
  const profileSlug = providerSlug || hostSlug;
  const isProviderListPath =
    pathname === "/providers" ||
    pathname === "/pt/profissionais" ||
    pathname === "/nl/professionals";
  const isTranslationServicesPath =
    pathname === "/translation-services" ||
    pathname === "/pt/servicos-de-traducao" ||
    pathname === "/nl/vertaaldiensten";
  const realEstateMatch =
    pathname.match(/^\/real-estate(?:\/([^/]+)(?:\/([^/]+))?)?$/) ||
    pathname.match(/^\/pt\/imoveis(?:\/([^/]+)(?:\/([^/]+))?)?$/) ||
    pathname.match(/^\/nl\/vastgoed(?:\/([^/]+)(?:\/([^/]+))?)?$/);
  const realEstateCitySlug = realEstateMatch?.[1];
  const realEstateListingSlug = realEstateMatch?.[2];

  const lang: CityGuideLang = pathname.startsWith("/pt")
    ? "pt"
    : pathname.startsWith("/nl")
    ? "nl"
    : "en";
  const currentInterpreterRoute = interpreterRoute(pathname);

  const labels = {
    en: {
      menu: "Menu",
      interpreter: "Interpreter",
      translators: "Translators",
      host: "Your Host",
      realEstate: "Real Estate",
      services: "Services",
      explore: "Explore Porto Alegre",
      exploreCity: (cityName: string) => `Explore ${cityName}`,
      cityGuides: "City Guides",
      propertyListings: "Property Listings",
      about: "About",
      restaurants: "Restaurants",
      cafes: "Cafés",
      parks: "Parks & Walks",
      culture: "Culture & Events",
      markets: "Markets",
      portoAlegreRentals: "Porto Alegre Rentals",
      florianopolisSales: "Florianópolis Sales",
      allListings: "All Listings",
      aboutHome: "About Home in the City",
      email: "Email",
      contact: "WhatsApp",
      tagline: "Your local guide · Wherever business takes you",
      providerLogin: "Provider Login",
      comingSoon: "Coming soon",
    },
    pt: {
      menu: "Menu",
      interpreter: "Intérprete",
      translators: "Tradutores",
      host: "Seu anfitrião",
      realEstate: "Imóveis",
      services: "Serviços",
      explore: "Explore Porto Alegre",
      exploreCity: (cityName: string) => `Explore ${cityName}`,
      cityGuides: "Guias por Cidade",
      propertyListings: "Anúncios de imóveis",
      about: "Sobre",
      restaurants: "Restaurantes",
      cafes: "Cafés",
      parks: "Parques e caminhadas",
      culture: "Cultura e eventos",
      markets: "Mercados",
      portoAlegreRentals: "Aluguéis em Porto Alegre",
      florianopolisSales: "Vendas em Florianópolis",
      allListings: "Todos os anúncios",
      aboutHome: "Sobre a Home in the City",
      email: "Email",
      contact: "WhatsApp",
      tagline: "Seu apoio local · Onde os negócios levarem você",
      providerLogin: "Login de prestador",
      comingSoon: "Em breve",
    },
    nl: {
      menu: "Menu",
      interpreter: "Tolk",
      translators: "Vertalers",
      host: "Uw host",
      realEstate: "Vastgoed",
      services: "Diensten",
      explore: "Ontdek Porto Alegre",
      exploreCity: (cityName: string) => `Ontdek ${cityName}`,
      cityGuides: "Stadsgidsen",
      propertyListings: "Woningaanbod",
      about: "Over",
      restaurants: "Restaurants",
      cafes: "Cafés",
      parks: "Parken en wandelingen",
      culture: "Cultuur en events",
      markets: "Markten",
      portoAlegreRentals: "Huurwoningen Porto Alegre",
      florianopolisSales: "Koopwoningen Florianópolis",
      allListings: "Alle woningen",
      aboutHome: "Over Home in the City",
      email: "Email",
      contact: "WhatsApp",
      tagline: "Je lokale gids · Waar je zakenreis je ook brengt",
      providerLogin: "Provider Login",
      comingSoon: "Binnenkort",
    },
  };

  const t = labels[lang];

  const homePath = lang === "pt" ? "/pt" : lang === "nl" ? "/nl" : "/";

  function localizedRealEstatePath(prefix: string) {
    return [prefix, realEstateCitySlug, realEstateListingSlug]
      .filter(Boolean)
      .join("/");
  }

  const englishPath =
    providerSlug
      ? `/providers/${providerSlug}`
      : isProviderListPath
      ? "/providers"
      : isTranslationServicesPath
      ? "/translation-services"
      : realEstateMatch
      ? localizedRealEstatePath("/real-estate")
      : currentInterpreterRoute?.city.paths.en
      ? currentInterpreterRoute.city.paths.en
      : pathname.includes("/pt/hosts/")
      ? pathname.replace("/pt/hosts", "/hosts")
      : pathname.includes("/nl/hosts/")
      ? pathname.replace("/nl/hosts", "/hosts")
      : pathname.includes("/pt/brasil/")
      ? pathname.replace("/pt/brasil", "/brazil")
      : pathname.includes("/nl/brazilie/")
      ? pathname.replace("/nl/brazilie", "/brazil")
      : pathname === "/pt" || pathname === "/nl"
      ? "/"
      : pathname;

  const portuguesePath =
    providerSlug
      ? `/pt/profissionais/${providerSlug}`
      : isProviderListPath
      ? "/pt/profissionais"
      : isTranslationServicesPath
      ? "/pt/servicos-de-traducao"
      : realEstateMatch
      ? localizedRealEstatePath("/pt/imoveis")
      : currentInterpreterRoute?.city.paths.pt
      ? currentInterpreterRoute.city.paths.pt
      : pathname.includes("/nl/hosts/")
      ? pathname.replace("/nl/hosts", "/pt/hosts")
      : pathname.includes("/hosts/")
      ? `/pt${pathname}`
      : pathname.includes("/nl/brazilie/")
      ? pathname.replace("/nl/brazilie", "/pt/brasil")
      : pathname.includes("/brazil/")
      ? `/pt${pathname.replace("/brazil", "/brasil")}`
      : pathname === "/"
      ? "/pt"
      : pathname === "/nl"
      ? "/pt"
      : pathname;

  const dutchPath =
    providerSlug
      ? `/nl/professionals/${providerSlug}`
      : isProviderListPath
      ? "/nl/professionals"
      : isTranslationServicesPath
      ? "/nl/vertaaldiensten"
      : realEstateMatch
      ? localizedRealEstatePath("/nl/vastgoed")
      : currentInterpreterRoute?.city.paths.nl
      ? currentInterpreterRoute.city.paths.nl
      : pathname.includes("/pt/hosts/")
      ? pathname.replace("/pt/hosts", "/nl/hosts")
      : pathname.includes("/hosts/")
      ? `/nl${pathname}`
      : pathname.includes("/pt/brasil/")
      ? pathname.replace("/pt/brasil", "/nl/brazilie")
      : pathname.includes("/brazil/")
      ? `/nl${pathname.replace("/brazil", "/brazilie")}`
      : pathname === "/"
      ? "/nl"
      : pathname === "/pt"
      ? "/nl"
      : pathname;

  const portoAlegrePath = pathname.startsWith("/pt")
    ? "/pt/brasil/porto-alegre"
    : pathname.startsWith("/nl")
    ? "/nl/brazilie/porto-alegre"
    : "/brazil/porto-alegre";
  const cityGuideSlug =
    pathname.match(/^\/brazil\/([^/]+)/)?.[1] ||
    pathname.match(/^\/pt\/brasil\/([^/]+)/)?.[1] ||
    pathname.match(/^\/nl\/brazilie\/([^/]+)/)?.[1];
  const currentCityGuide = cityGuides.find(
    (city) => city.slug?.current === cityGuideSlug,
  );
  const currentCityGuideName = cityGuideSlug
    ? cityGuideName(currentCityGuide, lang, cityGuideSlug)
    : "";
  const currentProviderLanguages = providerLanguages.find(
    (provider) => provider.slug === profileSlug,
  )?.languages;
  const availableLanguages = currentInterpreterRoute
    ? currentInterpreterRoute.city.languages
    : cityGuideSlug
    ? cityGuideIsPublic(currentCityGuide)
      ? cityGuideEnabledLanguages(currentCityGuide)
      : []
    : profileSlug
    ? spokenLanguageCodes(currentProviderLanguages).filter(
        (language): language is CityGuideLang =>
          language === "en" || language === "pt" || language === "nl",
      )
    : (["en", "pt", "nl"] as CityGuideLang[]);
  const exploreCityPath = cityGuideSlug
    ? cityGuidePath(lang, cityGuideSlug)
    : portoAlegrePath;
  const exploreTitle = currentCityGuideName
    ? t.exploreCity(currentCityGuideName)
    : t.explore;

  const hostPath = pathname.startsWith("/pt")
    ? "/pt/hosts/armijn"
    : pathname.startsWith("/nl")
    ? "/nl/hosts/armijn"
    : "/hosts/armijn";

  const interpreterPath =
    currentInterpreterRoute?.city.paths[lang] ||
    interpreterPathForCity(cityGuideSlug, lang);

  const translatorsPath = pathname.startsWith("/pt")
    ? "/pt/servicos-de-traducao"
    : pathname.startsWith("/nl")
    ? "/nl/vertaaldiensten"
    : "/translation-services";

  const realEstatePath = pathname.startsWith("/pt")
    ? "/pt/imoveis"
    : pathname.startsWith("/nl")
    ? "/nl/vastgoed"
    : "/real-estate";
  const portoAlegreRealEstatePath = `${realEstatePath}/porto-alegre`;
  const florianopolisRealEstatePath = `${realEstatePath}/florianopolis`;
  const aboutPath = homePath;
  const cityGuideLinks = cityGuides.flatMap((city) => {
    const citySlug = city.slug?.current;

    if (!citySlug || cityGuideStatus(city) === "hidden") return [];

    const label = cityGuideName(city, lang, citySlug);

    if (!cityGuideIsPublic(city)) {
      return [
        {
          label: `${label} — ${t.comingSoon}`,
          href: "",
          disabled: true,
        },
      ];
    }

    if (
      !cityGuideLanguageEnabled(city, citySlug, lang)
    ) {
      return [];
    }

    return [
      {
        label,
        href: cityGuidePath(lang, citySlug),
      },
    ];
  });

  const menuSections = [
    {
      title: t.services,
      links: [
        { label: t.interpreter, href: interpreterPath },
        { label: t.translators, href: translatorsPath },
        { label: t.host, href: hostPath },
        { label: t.realEstate, href: realEstatePath },
      ],
    },
    {
      title: exploreTitle,
      links: [
        { label: t.restaurants, href: exploreCityPath },
        { label: t.cafes, href: exploreCityPath },
        { label: t.parks, href: exploreCityPath },
        { label: t.culture, href: exploreCityPath },
        { label: t.markets, href: exploreCityPath },
      ],
    },
    ...(cityGuideLinks.length
      ? [
          {
            title: t.cityGuides,
            links: cityGuideLinks,
          },
        ]
      : []),
    {
      title: t.propertyListings,
      links: [
        { label: t.portoAlegreRentals, href: portoAlegreRealEstatePath },
        { label: t.florianopolisSales, href: florianopolisRealEstatePath },
        { label: t.allListings, href: realEstatePath },
      ],
    },
    {
      title: t.about,
      links: [
        { label: t.aboutHome, href: aboutPath },
        { label: t.email, href: "mailto:contact@homeinthe.city", external: true },
        {
          label: t.contact,
          href: "https://wa.me/+5551997783369",
          external: true,
        },
      ],
    },
  ];
  const featuredInterpreter = {
    label: t.interpreter,
    href: interpreterPath,
  };
  const providerLogin = {
    label: t.providerLogin,
    href: "/dashboard",
  };

  function closeMenuOnLinkClick(event: React.MouseEvent<HTMLDetailsElement>) {
    const target = event.target as HTMLElement;

    if (target.closest("a")) {
      event.currentTarget.removeAttribute("open");
    }
  }

  return (
    <header className="fixed left-0 right-0 top-0 z-50 bg-[#1a1f2e] px-6 py-4 md:px-8">
      <div className="flex items-center justify-between">
        <Link href={homePath} className="flex items-center gap-3">
          <Image
            src="/logo.png"
            alt="Home in the City logo"
            width={64}
            height={64}
            priority
          />

          <div className="flex flex-col">
            <span className="text-lg font-medium tracking-tight text-white">
              home in the city
            </span>

            <span className="hidden text-[10px] uppercase tracking-widest text-white/50 xl:block">
              {t.tagline}
            </span>
          </div>
        </Link>

        <div className="hidden items-center gap-5 xl:flex">
          <Link
            href={interpreterPath}
            className="text-sm font-medium text-white/85 transition hover:text-white"
          >
            {t.interpreter}
          </Link>

          <Link
            href={providerLogin.href}
            className="rounded-full bg-[#d7b46a] px-5 py-2 text-sm font-medium text-[#1a1f2e] transition hover:bg-[#efcf88]"
          >
            {providerLogin.label}
          </Link>

          <details className="relative" onClick={closeMenuOnLinkClick}>
            <summary className="cursor-pointer list-none rounded-full border border-white/15 px-5 py-2 text-sm text-white/80 transition hover:border-white/35 hover:text-white [&::-webkit-details-marker]:hidden">
              {t.menu}
            </summary>

            <MenuContent
              menuSections={menuSections}
              englishPath={englishPath}
              portuguesePath={portuguesePath}
              dutchPath={dutchPath}
              availableLanguages={availableLanguages}
              featuredInterpreter={featuredInterpreter}
              providerLogin={providerLogin}
            />
          </details>

          <div className="ml-2 flex items-center gap-2 text-lg">
            {availableLanguages.includes("en") ? (
              <Link href={englishPath} aria-label="English">🇬🇧</Link>
            ) : null}
            {availableLanguages.includes("pt") ? (
              <Link href={portuguesePath} aria-label="Portuguese">🇧🇷</Link>
            ) : null}
            {availableLanguages.includes("nl") ? (
              <Link href={dutchPath} aria-label="Dutch">🇳🇱</Link>
            ) : null}
          </div>
        </div>

        <details
          className="relative xl:hidden"
          onClick={closeMenuOnLinkClick}
        >
          <summary className="flex cursor-pointer list-none flex-col gap-1 [&::-webkit-details-marker]:hidden">
            <span className="h-[2px] w-6 bg-white"></span>
            <span className="h-[2px] w-6 bg-white"></span>
            <span className="h-[2px] w-6 bg-white"></span>
          </summary>

          <MenuContent
            mobile
            menuSections={menuSections}
            englishPath={englishPath}
            portuguesePath={portuguesePath}
            dutchPath={dutchPath}
            availableLanguages={availableLanguages}
            featuredInterpreter={featuredInterpreter}
            providerLogin={providerLogin}
          />
        </details>
      </div>
    </header>
  );
}
