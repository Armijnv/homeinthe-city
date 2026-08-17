import GlobeComponent from "./Globe";
import ActiveCities from "./ActiveCities";
import Link from "next/link";
import {
  cityGuideGlobeCities,
  cityGuideIsPublic,
  cityGuideName,
  cityGuidePath,
  discoverableCityGuides,
  providerProfilePath,
  publishedCityGuides,
  type CityGuideContent,
} from "@/app/lib/cityGuides";

type Lang = "en" | "pt" | "nl";

/* ======================================================
   HOMEPAGE CONTENT
====================================================== */

const content = {
  en: {
    eyebrow: "Porto Alegre is live · Aracaju and João Pessoa coming soon",
    title: "Home in the City",
    subtitle: "Global Connections, Local Expertise",
    intro:
      "Your local guide, wherever business takes you. Connect with trusted local hosts, interpreters, translators and city experts who help you navigate business, relocation, meetings and everyday life in unfamiliar places.",
    primaryCta: "Explore Porto Alegre",
    primaryHref: "/brazil/porto-alegre",
    interpreterCta: "Interpreter services in Porto Alegre",
    interpreterHref: "/interpreter/porto-alegre",
    cityCta: "Meet your Porto Alegre host",
    cityHref: "/providers/armijn",
    liveCity: "First active city: Porto Alegre",
    nextCity: "Aracaju and João Pessoa coming soon",
    servicesTitle: "Start with Porto Alegre",
    services: [
      {
        title: "Explore Porto Alegre",
        text: "The first active Home in the City destination for local support, business visits and city guidance.",
        href: "/brazil/porto-alegre",
      },
      {
        title: "Meet your Porto Alegre host",
        text: "A trusted local connection for practical help before, during and after your visit.",
        href: "/providers/armijn",
      },
      {
        title: "Interpreter services in Porto Alegre",
        text: "Business meetings, factory visits and local conversations with clear language support.",
        href: "/interpreter/porto-alegre",
      },
      {
        title: "Translation services",
        text: "Written translation support for documents, business communication and local projects.",
        href: "/translation-services",
      },
      {
        title: "Apartments & real estate",
        text: "Furnished stays, rentals and buying support when a visit turns into a longer chapter.",
        href: "/real-estate/porto-alegre",
      },
    ],
  },

  pt: {
    eyebrow: "Porto Alegre ativa · Aracaju e João Pessoa em breve",
    title: "Home in the City",
    subtitle: "Conexões Globais, Experiência Local",
    intro:
      "Seu guia local, onde quer que os negócios levem você. Conecte-se com anfitriões locais, intérpretes, tradutores e especialistas da cidade para navegar negócios, mudança, reuniões e a vida cotidiana em lugares desconhecidos.",
    primaryCta: "Explorar Porto Alegre",
    primaryHref: "/pt/brasil/porto-alegre",
    interpreterCta: "Intérprete em Porto Alegre",
    interpreterHref: "/pt/interprete/porto-alegre",
    cityCta: "Conheça seu anfitrião local",
    cityHref: "/pt/profissionais/armijn",
    liveCity: "Primeira cidade ativa: Porto Alegre",
    nextCity: "Aracaju e João Pessoa em breve",
    servicesTitle: "Comece por Porto Alegre",
    services: [
      {
        title: "Explorar Porto Alegre",
        text: "O primeiro destino ativo da Home in the City para apoio local, visitas de negócios e orientação na cidade.",
        href: "/pt/brasil/porto-alegre",
      },
      {
        title: "Conheça seu anfitrião local",
        text: "Uma conexão local confiável para ajuda prática antes, durante e depois da visita.",
        href: "/pt/profissionais/armijn",
      },
      {
        title: "Intérprete em Porto Alegre",
        text: "Reuniões de negócios, visitas a empresas e conversas locais com apoio claro no idioma.",
        href: "/pt/interprete/porto-alegre",
      },
      {
        title: "Serviços de tradução",
        text: "Apoio em tradução escrita para documentos, comunicação empresarial e projetos locais.",
        href: "/pt/servicos-de-traducao",
      },
      {
        title: "Apartamentos e imóveis",
        text: "Estadias mobiliadas, aluguel e apoio de compra quando a visita vira uma fase mais longa.",
        href: "/pt/imoveis/porto-alegre",
      },
    ],
  },

  nl: {
    eyebrow: "Porto Alegre is live · Aracaju en João Pessoa binnenkort",
    title: "Home in the City",
    subtitle: "Wereldwijde Connecties, Lokale Expertise",
    intro:
      "Je lokale gids, waar je zakenreis je ook brengt. Vind vertrouwde lokale hosts, tolken, vertalers en stadsexperts die helpen met zaken, verhuizen, meetings en het dagelijks leven op onbekende plekken.",
    primaryCta: "Ontdek Porto Alegre",
    primaryHref: "/nl/brazilie/porto-alegre",
    interpreterCta: "Tolkdiensten in Porto Alegre",
    interpreterHref: "/nl/tolk/porto-alegre",
    cityCta: "Ontmoet je Porto Alegre host",
    cityHref: "/nl/professionals/armijn",
    liveCity: "Eerste actieve stad: Porto Alegre",
    nextCity: "Aracaju en João Pessoa binnenkort",
    servicesTitle: "Begin met Porto Alegre",
    services: [
      {
        title: "Ontdek Porto Alegre",
        text: "De eerste actieve Home in the City-bestemming voor lokale hulp, zakelijke bezoeken en stadskennis.",
        href: "/nl/brazilie/porto-alegre",
      },
      {
        title: "Ontmoet je Porto Alegre host",
        text: "Een vertrouwde lokale verbinding voor praktische hulp voor, tijdens en na je bezoek.",
        href: "/nl/professionals/armijn",
      },
      {
        title: "Tolkdiensten in Porto Alegre",
        text: "Zakelijke meetings, bedrijfsbezoeken en lokale gesprekken met heldere taalhulp.",
        href: "/nl/tolk/porto-alegre",
      },
      {
        title: "Vertaaldiensten",
        text: "Schriftelijke vertaalhulp voor documenten, zakelijke communicatie en lokale projecten.",
        href: "/nl/vertaaldiensten",
      },
      {
        title: "Appartementen en vastgoed",
        text: "Gemeubileerde verblijven, huur en koophulp wanneer een bezoek langer wordt.",
        href: "/nl/vastgoed/porto-alegre",
      },
    ],
  },
};

const cityDiscoveryContent = {
  en: {
    title: "Browse City Guides",
    available: "Available now",
    comingSoon: "Coming soon",
    primaryCta: (cityName: string) => `Explore ${cityName}`,
    hostCta: (cityName: string) => `Meet your ${cityName} host`,
    liveSummary: (cities: string) => `Available now: ${cities}`,
    nextSummary: (cities: string) => `Coming soon: ${cities}`,
    cityText: (cityName: string) =>
      `Local guidance, trusted contacts and practical support for ${cityName}.`,
    empty: "City guides will appear here as they are published.",
    open: "Open guide",
  },
  pt: {
    title: "Guias por Cidade",
    available: "Disponível agora",
    comingSoon: "Em breve",
    primaryCta: (cityName: string) => `Explorar ${cityName}`,
    hostCta: (cityName: string) => `Conheça seu anfitrião em ${cityName}`,
    liveSummary: (cities: string) => `Disponível agora: ${cities}`,
    nextSummary: (cities: string) => `Em breve: ${cities}`,
    cityText: (cityName: string) =>
      `Orientação local, contatos confiáveis e apoio prático em ${cityName}.`,
    empty: "Guias de cidade aparecerão aqui conforme forem publicados.",
    open: "Abrir guia",
  },
  nl: {
    title: "Stadsgidsen",
    available: "Nu beschikbaar",
    comingSoon: "Binnenkort",
    primaryCta: (cityName: string) => `Ontdek ${cityName}`,
    hostCta: (cityName: string) => `Ontmoet je ${cityName} host`,
    liveSummary: (cities: string) => `Nu beschikbaar: ${cities}`,
    nextSummary: (cities: string) => `Binnenkort: ${cities}`,
    cityText: (cityName: string) =>
      `Lokale gids, vertrouwde contacten en praktische hulp in ${cityName}.`,
    empty: "Stadsgidsen verschijnen hier zodra ze gepubliceerd zijn.",
    open: "Open gids",
  },
};

const localeByLang: Record<Lang, string> = {
  en: "en",
  pt: "pt-BR",
  nl: "nl-NL",
};

function formatCityNames(cities: CityGuideContent[], lang: Lang) {
  const names = cities
    .map((city) => {
      const citySlug = city.slug?.current;
      return citySlug ? cityGuideName(city, lang, citySlug) : "";
    })
    .filter(Boolean);

  if (!names.length) return "";

  return new Intl.ListFormat(localeByLang[lang], {
    style: "long",
    type: "conjunction",
  }).format(names);
}

/* ======================================================
   HOMEPAGE TEMPLATE
====================================================== */

export default function HomePage({
  lang,
  cityGuides = [],
}: {
  lang: Lang;
  cityGuides?: CityGuideContent[];
}) {
  const t = content[lang];
  const cityT = cityDiscoveryContent[lang];
  const visibleCities = discoverableCityGuides(cityGuides);
  const publicCities = publishedCityGuides(visibleCities);
  const globeCities = cityGuideGlobeCities(visibleCities, lang);
  const liveCities = publicCities;
  const comingSoonCities = visibleCities.filter(
    (city) => !cityGuideIsPublic(city),
  );
  const primaryCity = liveCities[0] || null;
  const primaryCitySlug = primaryCity?.slug?.current;
  const primaryCityName = primaryCitySlug
    ? cityGuideName(primaryCity, lang, primaryCitySlug)
    : "";
  const primaryHostSlug = primaryCity?.primaryHost?.slug?.current;
  const liveSummary = formatCityNames(liveCities, lang);
  const comingSoonSummary = formatCityNames(comingSoonCities, lang);
  const eyebrow = [liveSummary && cityT.liveSummary(liveSummary), comingSoonSummary && cityT.nextSummary(comingSoonSummary)]
    .filter(Boolean)
    .join(" · ");

  return (
    <div className="min-h-screen overflow-hidden bg-[#1a1f2e]">
      <section className="relative flex min-h-screen flex-col overflow-hidden bg-[#1a1f2e] px-6 pt-24 pb-12 text-white md:px-10 lg:flex-row lg:items-center lg:justify-between lg:px-20 lg:pt-36">
        {/* ======================================================
           FULLSCREEN / RESPONSIVE GLOBE
           Mobile gives the globe its own interaction area; desktop
           keeps the original cinematic, layered composition.
        ====================================================== */}
        <div className="pointer-events-auto relative z-10 mx-auto mt-4 flex h-[505px] w-full items-center justify-center scale-[0.72] opacity-95 [&_canvas]:touch-none sm:h-[575px] sm:scale-[0.82] md:h-[630px] md:scale-[0.9] lg:absolute lg:left-[28%] lg:top-[56%] lg:mx-0 lg:mt-0 lg:block lg:h-auto lg:w-auto lg:-translate-x-1/2 lg:-translate-y-1/2 lg:scale-100 lg:[&_canvas]:touch-auto xl:scale-110">
          <GlobeComponent cities={globeCities} />
        </div>

        {/* ======================================================
           MOBILE HERO TEXT
        ====================================================== */}
        <div className="relative z-20 -order-1 max-w-xl text-left lg:hidden">
          <p className="mb-3 max-w-[20rem] text-[11px] uppercase tracking-[0.22em] text-stone-400 sm:max-w-none sm:text-sm">
            {eyebrow || t.eyebrow}
          </p>

          <h1 className="mb-3 text-4xl font-light leading-tight text-white sm:text-5xl md:text-6xl">
            {t.title}
          </h1>

          <p className="mb-5 max-w-lg text-xl font-light leading-snug text-stone-100 sm:text-2xl">
            {t.subtitle}
          </p>

          <Link
            href={primaryCitySlug ? cityGuidePath(lang, primaryCitySlug) : t.primaryHref}
            className="inline-flex rounded-full bg-white px-6 py-3 text-sm text-stone-900 transition-colors hover:bg-stone-200 focus:outline-none focus:ring-2 focus:ring-white/60"
          >
            {primaryCityName ? cityT.primaryCta(primaryCityName) : t.primaryCta}
          </Link>
        </div>

        <p className="relative z-20 max-w-lg text-base leading-relaxed text-stone-300 sm:text-lg lg:hidden">
          {t.intro}
        </p>

        {/* ======================================================
           DESKTOP HERO TEXT — intentionally unchanged
        ====================================================== */}
        <div className="relative z-20 hidden max-w-xl pt-2 text-left lg:ml-auto lg:mr-0 lg:block lg:w-1/2 lg:pt-0">
          <p className="mb-4 max-w-[20rem] text-[11px] uppercase tracking-[0.22em] text-stone-400 sm:max-w-none sm:text-sm lg:tracking-[0.25em]">
            {eyebrow || t.eyebrow}
          </p>

          <h1 className="mb-5 text-4xl font-light leading-tight text-white drop-shadow-[0_3px_14px_rgba(0,0,0,0.75)] sm:text-5xl md:text-6xl lg:text-7xl lg:drop-shadow-none">
            {t.title}
          </h1>

          <p className="mb-4 max-w-lg text-xl font-light leading-snug text-stone-100 drop-shadow-[0_2px_8px_rgba(0,0,0,0.85)] sm:text-2xl lg:drop-shadow-none">
            {t.subtitle}
          </p>

          <p className="mb-7 max-w-lg text-base leading-relaxed text-stone-300 drop-shadow-[0_2px_8px_rgba(0,0,0,0.85)] sm:text-lg lg:drop-shadow-none">
            {t.intro}
          </p>

          <div className="flex flex-wrap gap-3">
            <Link
              href={primaryCitySlug ? cityGuidePath(lang, primaryCitySlug) : t.primaryHref}
              className="inline-flex rounded-full bg-white px-6 py-3 text-sm text-stone-900 transition-colors hover:bg-stone-200 focus:outline-none focus:ring-2 focus:ring-white/60"
            >
              {primaryCityName ? cityT.primaryCta(primaryCityName) : t.primaryCta}
            </Link>
            <Link
              href={t.interpreterHref}
              className="inline-flex rounded-full border border-white/30 bg-white/10 px-6 py-3 text-sm text-white backdrop-blur-sm transition-colors hover:border-white/60 hover:bg-white/15 focus:outline-none focus:ring-2 focus:ring-white/60"
            >
              {t.interpreterCta}
            </Link>
            <Link
              href={primaryHostSlug ? providerProfilePath(lang, primaryHostSlug) : t.cityHref}
              className="inline-flex rounded-full border border-white/15 px-6 py-3 text-sm text-stone-200 transition-colors hover:border-white/45 hover:text-white focus:outline-none focus:ring-2 focus:ring-white/60"
            >
              {primaryCityName && primaryHostSlug
                ? cityT.hostCta(primaryCityName)
                : t.cityCta}
            </Link>
          </div>

          <div className="mt-5 flex flex-wrap gap-2 text-xs text-stone-300">
            <span className="rounded-full border border-white/20 bg-white/10 px-3 py-1.5 backdrop-blur-sm">
              {liveSummary ? cityT.liveSummary(liveSummary) : t.liveCity}
            </span>
            {(comingSoonSummary || !visibleCities.length) && (
              <span className="rounded-full border border-white/15 bg-black/10 px-3 py-1.5 backdrop-blur-sm">
                {comingSoonSummary ? cityT.nextSummary(comingSoonSummary) : t.nextCity}
              </span>
            )}
          </div>
        </div>
      </section>

      <ActiveCities lang={lang} cityGuides={cityGuides} />

      <section className="relative z-20 bg-[#f5f1ea] px-6 py-14 text-[#1a1f2e] md:px-10 lg:px-20">
        <div className="mx-auto max-w-6xl">
          <div className="mb-14">
            <h2 className="mb-8 text-2xl font-light sm:text-3xl">
              {cityT.title}
            </h2>

            {visibleCities.length ? (
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {visibleCities.map((city) => {
                  const citySlug = city.slug?.current;
                  if (!citySlug) return null;

                  const cityName = cityGuideName(city, lang, citySlug);
                  const isPublic = cityGuideIsPublic(city);

                  const cardContent = (
                    <>
                      <div className="mb-4 flex items-start justify-between gap-4">
                        <h3 className="text-lg font-medium text-[#1a1f2e]">
                          {cityName}
                        </h3>
                        <span className="rounded-full border border-stone-200 px-3 py-1 text-[11px] uppercase tracking-[0.16em] text-stone-500">
                          {isPublic ? cityT.available : cityT.comingSoon}
                        </span>
                      </div>
                      <p className="mb-5 text-sm leading-relaxed text-stone-600">
                        {cityT.cityText(cityName)}
                      </p>
                      <span className="text-sm font-medium text-[#1a1f2e] group-hover:underline">
                        {isPublic ? cityT.open : cityT.comingSoon}
                      </span>
                    </>
                  );

                  return isPublic ? (
                    <Link
                      key={citySlug}
                      href={cityGuidePath(lang, citySlug)}
                      className="group rounded-lg border border-stone-200 bg-white/70 p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-stone-300 hover:bg-white focus:outline-none focus:ring-2 focus:ring-[#b99455]"
                    >
                      {cardContent}
                    </Link>
                  ) : (
                    <article
                      key={citySlug}
                      className="rounded-lg border border-stone-200 bg-white/70 p-5 shadow-sm"
                    >
                      {cardContent}
                    </article>
                  );
                })}
              </div>
            ) : (
              <p className="text-sm leading-relaxed text-stone-600">
                {cityT.empty}
              </p>
            )}
          </div>

          <h2 className="mb-8 text-2xl font-light sm:text-3xl">
            {t.servicesTitle}
          </h2>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
            {t.services.map((service) => (
              <Link
                key={service.href}
                href={service.href}
                className="group rounded-lg border border-stone-200 bg-white/65 p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-stone-300 hover:bg-white focus:outline-none focus:ring-2 focus:ring-[#b99455]"
              >
                <h3 className="mb-3 text-base font-medium text-[#1a1f2e]">
                  {service.title}
                </h3>
                <p className="text-sm leading-relaxed text-stone-600">
                  {service.text}
                </p>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
