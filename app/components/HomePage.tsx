import GlobeComponent from "./Globe";
import Link from "next/link";

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
    interpreterHref: "/interpreter-porto-alegre",
    cityCta: "Meet your Porto Alegre host",
    cityHref: "/hosts/armijn",
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
        href: "/hosts/armijn",
      },
      {
        title: "Interpreter services in Porto Alegre",
        text: "Business meetings, factory visits and local conversations with clear language support.",
        href: "/interpreter-porto-alegre",
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
    interpreterHref: "/pt/interprete-porto-alegre",
    cityCta: "Conheça seu anfitrião local",
    cityHref: "/pt/hosts/armijn",
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
        href: "/pt/hosts/armijn",
      },
      {
        title: "Intérprete em Porto Alegre",
        text: "Reuniões de negócios, visitas a empresas e conversas locais com apoio claro no idioma.",
        href: "/pt/interprete-porto-alegre",
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
    interpreterHref: "/nl/tolk-porto-alegre",
    cityCta: "Ontmoet je Porto Alegre host",
    cityHref: "/nl/hosts/armijn",
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
        href: "/nl/hosts/armijn",
      },
      {
        title: "Tolkdiensten in Porto Alegre",
        text: "Zakelijke meetings, bedrijfsbezoeken en lokale gesprekken met heldere taalhulp.",
        href: "/nl/tolk-porto-alegre",
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
