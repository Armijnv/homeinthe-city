import GlobeComponent from "./Globe";
import Link from "next/link";

type Lang = "en" | "pt" | "nl";

/* ======================================================
   HOMEPAGE CONTENT
====================================================== */

const content = {
  en: {
    eyebrow: "Your local guide · Wherever business takes you",
    titleLine1: "Feel at home.",
    titleLine2: "In any city.",
    intro:
      "Local hosts, trusted stays, restaurant guides and cultural agendas — for international business visitors who want more than a hotel room.",
    cta: "Explore Porto Alegre →",
    href: "/brazil/porto-alegre",
  },

  pt: {
    eyebrow: "Seu apoio local · Onde os negócios levarem você",
    titleLine1: "Sinta-se em casa.",
    titleLine2: "Em qualquer cidade.",
    intro:
      "Anfitriões locais, apoio de confiança, dicas de restaurantes e agenda cultural — para visitantes internacionais que querem mais do que um hotel.",
    cta: "Explorar Porto Alegre →",
    href: "/pt/brasil/porto-alegre",
  },

  nl: {
    eyebrow: "Je lokale gids · Waar je zakenreis je ook brengt",
    titleLine1: "Voel je thuis.",
    titleLine2: "In elke stad.",
    intro:
      "Lokale hosts, vertrouwde ondersteuning, restauranttips en culturele agenda’s — voor internationale zakenbezoekers die meer willen dan alleen een hotel.",
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
    <div className="min-h-screen bg-[#1a1f2e]">
      <section className="relative min-h-screen overflow-hidden bg-[#1a1f2e] px-6 pt-28 pb-12 md:px-10 lg:flex lg:items-center lg:justify-between lg:px-20 lg:pt-36">

        {/* ======================================================
            GLOBE
        ====================================================== */}

        <div className="absolute left-1/2 top-[55%] z-10 -translate-x-1/2 -translate-y-1/2 scale-[0.55] opacity-90 md:top-[52%] md:scale-[0.82] lg:left-[28%] lg:top-[56%] lg:scale-100 xl:scale-110">
          <GlobeComponent />
        </div>

        {/* ======================================================
            HERO TEXT
        ====================================================== */}

        <div className="relative z-20 mx-auto max-w-xl text-center lg:ml-auto lg:mr-0 lg:w-1/2 lg:text-left">
          <p className="mb-4 text-xs uppercase tracking-[0.25em] text-stone-400 sm:text-sm">
            {t.eyebrow}
          </p>

          <h1 className="mb-5 text-4xl font-light leading-tight text-white sm:text-5xl md:text-6xl lg:text-7xl">
            {t.titleLine1}
            <br />
            <span className="text-stone-300">{t.titleLine2}</span>
          </h1>

          <p className="mx-auto mb-7 max-w-lg text-base leading-relaxed text-stone-300 drop-shadow-[0_2px_8px_rgba(0,0,0,0.85)] sm:text-lg lg:mx-0 lg:drop-shadow-none">
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
