import GlobeComponent from "./Globe";
import Link from "next/link";

type Lang = "en" | "pt" | "nl";

/* ======================================================
   HOMEPAGE CONTENT
====================================================== */

const content = {
  en: {
    eyebrow: "Porto Alegre is live · Florianópolis coming soon",
    title: "Home in the City",
    subtitle: "A trusted local connection when you are far from home.",
    intro:
      "Whether you need an interpreter, a translator, a furnished apartment, real estate help, or simply practical advice from someone who knows the city, Home in the City helps you arrive with confidence.",
    primaryCta: "Find local support",
    primaryHref: "/providers",
    interpreterCta: "Business interpreter in Porto Alegre",
    interpreterHref: "/interpreter-porto-alegre",
    cityCta: "Explore Porto Alegre",
    cityHref: "/brazil/porto-alegre",
    liveCity: "Porto Alegre is live",
    nextCity: "Florianópolis coming soon",
    servicesTitle: "What can we help you with?",
    services: [
      {
        title: "Business Interpreting",
        text: "Meetings, visits and negotiations with calm language support.",
        href: "/interpreter-porto-alegre",
      },
      {
        title: "Translation Services",
        text: "English, Portuguese and Dutch translation by a verified local professional.",
        href: "/translation-services",
      },
      {
        title: "Furnished Apartments",
        text: "Comfortable city stays for newcomers, visitors and longer projects.",
        href: "/real-estate/porto-alegre",
      },
      {
        title: "Real Estate",
        text: "Buying, renting and settling in with trusted local guidance.",
        href: "/real-estate",
      },
      {
        title: "Local Recommendations",
        text: "Practical city knowledge for easier days on the ground.",
        href: "/brazil/porto-alegre",
      },
    ],
  },

  pt: {
    eyebrow: "Porto Alegre está ativa · Florianópolis em breve",
    title: "Home in the City",
    subtitle: "Uma conexão local de confiança quando você está longe de casa.",
    intro:
      "Se você precisa de intérprete, tradutor, apartamento mobiliado, ajuda com imóveis ou orientação prática de alguém que conhece a cidade, a Home in the City ajuda você a chegar com confiança.",
    primaryCta: "Encontrar apoio local",
    primaryHref: "/pt/profissionais",
    interpreterCta: "Intérprete de negócios em Porto Alegre",
    interpreterHref: "/pt/interprete-porto-alegre",
    cityCta: "Explorar Porto Alegre",
    cityHref: "/pt/brasil/porto-alegre",
    liveCity: "Porto Alegre está ativa",
    nextCity: "Florianópolis em breve",
    servicesTitle: "Como podemos ajudar?",
    services: [
      {
        title: "Interpretação de negócios",
        text: "Reuniões, visitas e negociações com apoio linguístico tranquilo.",
        href: "/pt/interprete-porto-alegre",
      },
      {
        title: "Serviços de tradução",
        text: "Traduções em inglês, português e holandês com profissional verificada.",
        href: "/pt/servicos-de-traducao",
      },
      {
        title: "Apartamentos mobiliados",
        text: "Estadias confortáveis para recém-chegados, visitantes e projetos longos.",
        href: "/pt/imoveis/porto-alegre",
      },
      {
        title: "Imóveis",
        text: "Compra, aluguel e chegada à cidade com orientação local confiável.",
        href: "/pt/imoveis",
      },
      {
        title: "Recomendações locais",
        text: "Conhecimento prático da cidade para dias mais simples no destino.",
        href: "/pt/brasil/porto-alegre",
      },
    ],
  },

  nl: {
    eyebrow: "Porto Alegre is live · Florianópolis binnenkort",
    title: "Home in the City",
    subtitle: "Een vertrouwde lokale verbinding wanneer je ver van huis bent.",
    intro:
      "Of je nu een tolk, vertaler, gemeubileerd appartement, hulp met vastgoed of praktisch advies van iemand ter plaatse nodig hebt: Home in the City helpt je met vertrouwen aan te komen.",
    primaryCta: "Vind lokale hulp",
    primaryHref: "/nl/professionals",
    interpreterCta: "Business tolk in Porto Alegre",
    interpreterHref: "/nl/tolk-porto-alegre",
    cityCta: "Ontdek Porto Alegre",
    cityHref: "/nl/brazilie/porto-alegre",
    liveCity: "Porto Alegre is live",
    nextCity: "Florianópolis binnenkort",
    servicesTitle: "Waarmee kunnen we helpen?",
    services: [
      {
        title: "Zakelijk tolken",
        text: "Vergaderingen, bezoeken en onderhandelingen met rustige taalhulp.",
        href: "/nl/tolk-porto-alegre",
      },
      {
        title: "Vertaaldiensten",
        text: "Engels, Portugees en Nederlands via een geverifieerde professional.",
        href: "/nl/vertaaldiensten",
      },
      {
        title: "Gemeubileerde appartementen",
        text: "Comfortabele verblijven voor nieuwkomers, bezoekers en langere projecten.",
        href: "/nl/vastgoed/porto-alegre",
      },
      {
        title: "Vastgoed",
        text: "Kopen, huren en landen in de stad met betrouwbare lokale begeleiding.",
        href: "/nl/vastgoed",
      },
      {
        title: "Lokale aanbevelingen",
        text: "Praktische stadskennis voor soepelere dagen ter plaatse.",
        href: "/nl/brazilie/porto-alegre",
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
