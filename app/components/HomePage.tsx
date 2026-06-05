import GlobeComponent from "./Globe";
import Link from "next/link";

type Lang = "en" | "pt" | "nl";

/* ======================================================
   HOMEPAGE CONTENT
====================================================== */

const content = {
  en: {
    eyebrow: "Business interpreter in Porto Alegre",
    title: "Home in the City",
    subtitle: "Business Interpreter in Porto Alegre",
    intro:
      "English, Portuguese and Dutch interpreting for business meetings, factory visits, negotiations and practical local support in southern Brazil. Translation, furnished apartments and real estate guidance are available as secondary support when your visit needs more than language.",
    primaryCta: "Book an interpreter",
    primaryHref: "/interpreter-porto-alegre",
    interpreterCta: "Interpreter service details",
    interpreterHref: "/interpreter-porto-alegre",
    cityCta: "Explore local support",
    cityHref: "/brazil/porto-alegre",
    liveCity: "Porto Alegre business support",
    nextCity: "Housing and translation available",
    servicesTitle: "Interpreter-first local support",
    services: [
      {
        title: "Business Interpreter in Porto Alegre",
        text: "Meetings, factory visits and negotiations with calm English, Portuguese and Dutch support.",
        href: "/interpreter-porto-alegre",
      },
      {
        title: "Local Business Support",
        text: "Practical help with schedules, local context, introductions and smoother days on the ground.",
        href: "/brazil/porto-alegre",
      },
      {
        title: "Translation Services",
        text: "Written English, Portuguese and Dutch translation when documents matter too.",
        href: "/translation-services",
      },
      {
        title: "Furnished Apartments",
        text: "Comfortable stays for business visitors, newcomers and longer projects.",
        href: "/real-estate/porto-alegre",
      },
      {
        title: "Real Estate",
        text: "Buying, renting and settling in with trusted local guidance after the visit grows bigger.",
        href: "/real-estate",
      },
    ],
  },

  pt: {
    eyebrow: "Intérprete de negócios em Porto Alegre",
    title: "Home in the City",
    subtitle: "Intérprete de negócios em Porto Alegre",
    intro:
      "Interpretação em inglês, português e holandês para reuniões, visitas a empresas, negociações e apoio local prático no sul do Brasil. Tradução, apartamentos mobiliados e ajuda com imóveis continuam disponíveis como apoio secundário.",
    primaryCta: "Contratar intérprete",
    primaryHref: "/pt/interprete-porto-alegre",
    interpreterCta: "Detalhes do serviço",
    interpreterHref: "/pt/interprete-porto-alegre",
    cityCta: "Apoio local em Porto Alegre",
    cityHref: "/pt/brasil/porto-alegre",
    liveCity: "Apoio empresarial em Porto Alegre",
    nextCity: "Moradia e tradução disponíveis",
    servicesTitle: "Apoio local com foco em interpretação",
    services: [
      {
        title: "Intérprete de negócios em Porto Alegre",
        text: "Reuniões, visitas técnicas e negociações com apoio em português, inglês e holandês.",
        href: "/pt/interprete-porto-alegre",
      },
      {
        title: "Apoio empresarial local",
        text: "Ajuda prática com agenda, contexto local, contatos e dias mais tranquilos na cidade.",
        href: "/pt/brasil/porto-alegre",
      },
      {
        title: "Serviços de tradução",
        text: "Traduções escritas em português, inglês e holandês quando os documentos também importam.",
        href: "/pt/servicos-de-traducao",
      },
      {
        title: "Apartamentos mobiliados",
        text: "Estadias confortáveis para visitantes de negócios, recém-chegados e projetos longos.",
        href: "/pt/imoveis/porto-alegre",
      },
      {
        title: "Imóveis",
        text: "Compra, aluguel e chegada à cidade quando a visita vira algo maior.",
        href: "/pt/imoveis",
      },
    ],
  },

  nl: {
    eyebrow: "Business tolk in Porto Alegre",
    title: "Home in the City",
    subtitle: "Business tolk in Porto Alegre",
    intro:
      "Engels, Portugees en Nederlands tolken voor meetings, bedrijfsbezoeken, onderhandelingen en praktische lokale ondersteuning in Zuid-Brazilië. Vertaling, gemeubileerde appartementen en vastgoedhulp blijven beschikbaar als aanvullende ondersteuning.",
    primaryCta: "Boek een tolk",
    primaryHref: "/nl/tolk-porto-alegre",
    interpreterCta: "Details van de tolkdienst",
    interpreterHref: "/nl/tolk-porto-alegre",
    cityCta: "Lokale hulp in Porto Alegre",
    cityHref: "/nl/brazilie/porto-alegre",
    liveCity: "Zakelijke hulp in Porto Alegre",
    nextCity: "Wonen en vertaling beschikbaar",
    servicesTitle: "Lokale hulp met tolken voorop",
    services: [
      {
        title: "Business tolk in Porto Alegre",
        text: "Meetings, bedrijfsbezoeken en onderhandelingen met rustige taalhulp.",
        href: "/nl/tolk-porto-alegre",
      },
      {
        title: "Lokale zakelijke hulp",
        text: "Praktische hulp met planning, lokale context, contacten en soepelere dagen ter plaatse.",
        href: "/nl/brazilie/porto-alegre",
      },
      {
        title: "Vertaaldiensten",
        text: "Schriftelijke vertalingen in Nederlands, Engels en Portugees wanneer documenten ook tellen.",
        href: "/nl/vertaaldiensten",
      },
      {
        title: "Gemeubileerde appartementen",
        text: "Comfortabele verblijven voor zakelijke bezoekers, nieuwkomers en langere projecten.",
        href: "/nl/vastgoed/porto-alegre",
      },
      {
        title: "Vastgoed",
        text: "Kopen, huren en landen in de stad wanneer het bezoek groter wordt.",
        href: "/nl/vastgoed",
      },
    ],
  },
};

/* ======================================================
   HOMEPAGE TEMPLATE
====================================================== */

export default function HomePage({ lang }: { lang: Lang }) {
  const t = content[lang];

  return (
    <div className="min-h-screen overflow-hidden bg-[#1a1f2e]">
      <section className="relative min-h-screen overflow-hidden bg-[#1a1f2e] px-6 pt-28 pb-12 text-white md:px-10 lg:flex lg:items-center lg:justify-between lg:px-20 lg:pt-36">
        {/* ======================================================
           FULLSCREEN / RESPONSIVE GLOBE
           Mobile + tablet return to the old Trusted Hosts feeling:
           a large cinematic globe behind floating text.
        ====================================================== */}
        <div className="pointer-events-auto absolute left-1/2 top-[58%] z-10 -translate-x-1/2 -translate-y-1/2 scale-[0.76] opacity-95 sm:top-[56%] sm:scale-[0.86] md:top-[54%] md:scale-100 lg:left-[28%] lg:top-[56%] lg:scale-100 xl:scale-110">
          <GlobeComponent />
        </div>

        {/* ======================================================
           HERO TEXT
        ====================================================== */}
        <div className="relative z-20 max-w-xl pt-2 text-left lg:ml-auto lg:mr-0 lg:w-1/2 lg:pt-0">
          <p className="mb-4 max-w-[20rem] text-[11px] uppercase tracking-[0.22em] text-stone-400 sm:max-w-none sm:text-sm lg:tracking-[0.25em]">
            {t.eyebrow}
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
              href={t.primaryHref}
              className="inline-flex rounded-full bg-white px-6 py-3 text-sm text-stone-900 transition-colors hover:bg-stone-200 focus:outline-none focus:ring-2 focus:ring-white/60"
            >
              {t.primaryCta}
            </Link>
            <Link
              href={t.interpreterHref}
              className="inline-flex rounded-full border border-white/30 bg-white/10 px-6 py-3 text-sm text-white backdrop-blur-sm transition-colors hover:border-white/60 hover:bg-white/15 focus:outline-none focus:ring-2 focus:ring-white/60"
            >
              {t.interpreterCta}
            </Link>
            <Link
              href={t.cityHref}
              className="inline-flex rounded-full border border-white/15 px-6 py-3 text-sm text-stone-200 transition-colors hover:border-white/45 hover:text-white focus:outline-none focus:ring-2 focus:ring-white/60"
            >
              {t.cityCta}
            </Link>
          </div>

          <div className="mt-5 flex flex-wrap gap-2 text-xs text-stone-300">
            <span className="rounded-full border border-white/20 bg-white/10 px-3 py-1.5 backdrop-blur-sm">
              {t.liveCity}
            </span>
            <span className="rounded-full border border-white/15 bg-black/10 px-3 py-1.5 backdrop-blur-sm">
              {t.nextCity}
            </span>
          </div>
        </div>
      </section>

      <section className="relative z-20 bg-[#f5f1ea] px-6 py-14 text-[#1a1f2e] md:px-10 lg:px-20">
        <div className="mx-auto max-w-6xl">
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
