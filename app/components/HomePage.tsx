import GlobeComponent from "./Globe";
import Link from "next/link";

type Lang = "en" | "pt" | "nl";

/* ======================================================
   HOMEPAGE CONTENT
====================================================== */

const content = {
  en: {
    eyebrow: "Your local guide · Wherever business takes you",
    titleLine1: "Home in the City",
    titleLine2: "Business Interpreter in Porto Alegre",
    intro:
      "English, Portuguese and Dutch interpreter for meetings, factory visits, negotiations and business travel in southern Brazil.",
    simpleIntro:
      "Local help in Porto Alegre for international business visitors: interpreting, city guidance, restaurants and practical support.",
    cta: "Explore Porto Alegre →",
    href: "/brazil/porto-alegre",
  },

  pt: {
    eyebrow: "Seu apoio local · Onde os negócios levarem você",
    titleLine1: "Home in the City",
    titleLine2: "Intérprete de Negócios em Porto Alegre",
    intro:
      "Interpretação em inglês, português e holandês para reuniões, visitas a empresas, negociações e viagens de negócios no sul do Brasil.",
    simpleIntro:
      "Apoio local em Porto Alegre para visitantes internacionais: interpretação, orientação na cidade, restaurantes e ajuda prática.",
    cta: "Explorar Porto Alegre →",
    href: "/pt/brasil/porto-alegre",
  },

  nl: {
    eyebrow: "Je lokale gids · Waar je zakenreis je ook brengt",
    titleLine1: "Home in the City",
    titleLine2: "Business Tolk in Porto Alegre",
    intro:
      "Engels, Portugees en Nederlands voor vergaderingen, fabrieksbezoeken, onderhandelingen en zakenreizen in Zuid-Brazilië.",
    simpleIntro:
      "Lokale hulp in Porto Alegre voor internationale zakenbezoekers: tolken, stadsgids, restaurants en praktische ondersteuning.",
    cta: "Ontdek Porto Alegre →",
    href: "/nl/brazilie/porto-alegre",
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
            {t.titleLine1}
            <br />
            <span className="text-stone-300 text-2xl sm:text-3xl md:text-4xl lg:text-5xl">
              {t.titleLine2}
            </span>
          </h1>

          <p className="mb-7 max-w-lg text-base leading-relaxed text-stone-300 drop-shadow-[0_2px_8px_rgba(0,0,0,0.85)] sm:text-lg lg:drop-shadow-none">
            {t.intro}
          </p>

          <Link
            href={t.href}
            className="inline-block rounded-full bg-white px-7 py-4 text-sm text-stone-900 transition-colors hover:bg-stone-200"
          >
            {t.cta}
          </Link>
        </div>
      </section>
    </div>
  );
}
