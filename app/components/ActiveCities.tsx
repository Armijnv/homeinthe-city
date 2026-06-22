import Link from "next/link";
import { cityGuidePath, type CityGuideLang } from "@/app/lib/cityGuides";
import {
  interpreterPathForCity,
  type InterpreterCitySlug,
} from "@/app/lib/interpreterPages";

type ActiveCity = {
  slug: InterpreterCitySlug;
  name: string;
  services: Record<CityGuideLang, string[]>;
};

const activeCities: ActiveCity[] = [
  {
    slug: "porto-alegre",
    name: "Porto Alegre",
    services: {
      en: [
        "Local host and interpreter",
        "English, Portuguese and Dutch support",
        "City guide",
        "Real estate support",
      ],
      pt: [
        "Anfitrião local e intérprete",
        "Atendimento em inglês, português e holandês",
        "Guia da cidade",
        "Apoio imobiliário",
      ],
      nl: [
        "Lokale host en tolk",
        "Ondersteuning in het Engels, Portugees en Nederlands",
        "Stadsgids",
        "Vastgoedondersteuning",
      ],
    },
  },
  {
    slug: "florianopolis",
    name: "Florianópolis",
    services: {
      en: [
        "Local host and interpreter",
        "English and Portuguese support",
        "City guide",
        "Local business, relocation and property visits",
      ],
      pt: [
        "Anfitrião local e intérprete",
        "Atendimento em inglês e português",
        "Guia da cidade",
        "Negócios locais, mudança e visitas a imóveis",
      ],
      nl: [
        "Lokale host en tolk",
        "Ondersteuning in het Engels en Portugees",
        "Stadsgids",
        "Lokale zaken, verhuizing en vastgoedbezoeken",
      ],
    },
  },
  {
    slug: "sao-paulo",
    name: "São Paulo",
    services: {
      en: [
        "Local host and interpreter",
        "English and Portuguese support",
        "City guide",
        "Corporate meetings, suppliers, trade fairs and business travel",
      ],
      pt: [
        "Anfitrião local e intérprete",
        "Atendimento em inglês e português",
        "Guia da cidade",
        "Reuniões corporativas, fornecedores, feiras e viagens de negócios",
      ],
      nl: [
        "Lokale host en tolk",
        "Ondersteuning in het Engels en Portugees",
        "Stadsgids",
        "Zakelijke meetings, leveranciers, vakbeurzen en zakenreizen",
      ],
    },
  },
];

const activeCitiesContent: Record<
  CityGuideLang,
  {
    title: string;
    intro: string;
    details: string;
    centralContact: string;
    cityCta: string;
    interpreterCta: string;
  }
> = {
  en: {
    title: "Active Cities in Brazil",
    intro:
      "Home in the City operates in Porto Alegre, Florianópolis and São Paulo as a growing local support network in Brazil.",
    details:
      "Services include city guides, interpreter services in Brazil, local hosts and real estate support where available.",
    centralContact:
      "All inquiries are handled centrally by Home in the City, which coordinates the right local support for each visit.",
    cityCta: "Explore City",
    interpreterCta: "Interpreter Services",
  },
  pt: {
    title: "Cidades Ativas no Brasil",
    intro:
      "A Home in the City atua em Porto Alegre, Florianópolis e São Paulo como uma rede crescente de apoio local no Brasil.",
    details:
      "Os serviços incluem guias de cidades no Brasil, intérpretes, anfitriões locais e apoio imobiliário onde disponível.",
    centralContact:
      "Todas as solicitações são atendidas centralmente pela Home in the City, que coordena o apoio local adequado para cada visita.",
    cityCta: "Explorar Cidade",
    interpreterCta: "Serviços de Intérprete",
  },
  nl: {
    title: "Actieve Steden in Brazilië",
    intro:
      "Home in the City is actief in Porto Alegre, Florianópolis en São Paulo als een groeiend lokaal ondersteuningsnetwerk in Brazilië.",
    details:
      "De diensten omvatten stadsgidsen in Brazilië, tolkdiensten, lokale hosts en vastgoedondersteuning waar beschikbaar.",
    centralContact:
      "Alle aanvragen worden centraal behandeld door Home in the City, dat voor elk bezoek de juiste lokale ondersteuning coördineert.",
    cityCta: "Ontdek de Stad",
    interpreterCta: "Tolkdiensten",
  },
};

export default function ActiveCities({ lang }: { lang: CityGuideLang }) {
  const content = activeCitiesContent[lang];

  return (
    <section
      aria-labelledby="active-cities-title"
      className="relative z-20 bg-[#f5f1ea] px-6 py-14 text-[#1a1f2e] md:px-10 lg:px-20 lg:py-20"
    >
      <div className="mx-auto max-w-6xl">
        <div className="max-w-3xl">
          <h2
            id="active-cities-title"
            className="text-2xl font-light sm:text-3xl"
          >
            {content.title}
          </h2>
          <p className="mt-5 text-base leading-relaxed text-stone-700 sm:text-lg">
            {content.intro}
          </p>
          <p className="mt-2 text-sm leading-relaxed text-stone-600 sm:text-base">
            {content.details}
          </p>
        </div>

        <div className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {activeCities.map((city) => (
            <article
              key={city.slug}
              className="flex min-w-0 flex-col rounded-2xl border border-stone-200 bg-white p-5 shadow-sm sm:p-6"
            >
              <h3 className="text-xl font-medium text-[#1a1f2e]">
                {city.name}
              </h3>

              <ul className="mt-5 flex-1 space-y-3 text-sm leading-relaxed text-stone-600">
                {city.services[lang].map((service) => (
                  <li key={service} className="flex gap-3">
                    <span aria-hidden="true" className="text-[#b99455]">
                      •
                    </span>
                    <span>{service}</span>
                  </li>
                ))}
              </ul>

              <div className="mt-7 grid gap-3 sm:grid-cols-2 md:grid-cols-1 xl:grid-cols-2">
                <Link
                  href={cityGuidePath(lang, city.slug)}
                  className="inline-flex min-h-12 items-center justify-center rounded-full bg-[#1a1f2e] px-5 py-3 text-center text-sm font-medium text-white transition hover:bg-stone-800 focus:outline-none focus:ring-2 focus:ring-[#b99455] focus:ring-offset-2"
                >
                  {content.cityCta}
                </Link>
                <Link
                  href={interpreterPathForCity(city.slug, lang)}
                  className="inline-flex min-h-12 items-center justify-center rounded-full border border-stone-300 px-5 py-3 text-center text-sm font-medium text-[#1a1f2e] transition hover:bg-stone-100 focus:outline-none focus:ring-2 focus:ring-[#b99455] focus:ring-offset-2"
                >
                  {content.interpreterCta}
                </Link>
              </div>
            </article>
          ))}
        </div>

        <p className="mt-7 max-w-3xl text-sm leading-relaxed text-stone-600">
          {content.centralContact}
        </p>
      </div>
    </section>
  );
}
