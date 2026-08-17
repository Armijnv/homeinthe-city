import Link from "next/link";
import {
  cityGuideIsPublic,
  cityGuideName,
  cityGuidePath,
  publishedCityGuides,
  type CityGuideContent,
  type CityGuideLang,
} from "@/app/lib/cityGuides";
import { cityInterpreterPath } from "@/app/lib/cityInterpreterCoverage";

const content: Record<
  CityGuideLang,
  {
    title: string;
    intro: string;
    cityCta: string;
    interpreterCta: string;
  }
> = {
  en: {
    title: "Active Cities in Brazil",
    intro: "Explore Home in the City destinations that are currently live.",
    cityCta: "Explore City",
    interpreterCta: "Interpreter Services",
  },
  pt: {
    title: "Cidades Ativas no Brasil",
    intro: "Explore os destinos da Home in the City que estão ativos agora.",
    cityCta: "Explorar Cidade",
    interpreterCta: "Serviços de Intérprete",
  },
  nl: {
    title: "Actieve Steden in Brazilië",
    intro: "Ontdek de Home in the City-bestemmingen die nu actief zijn.",
    cityCta: "Ontdek de Stad",
    interpreterCta: "Tolkdiensten",
  },
};

function citySummary(city: CityGuideContent, lang: CityGuideLang) {
  return city[`headline_${lang}`] || city[`headline_en`] || "";
}

export default function ActiveCities({
  lang,
  cityGuides,
}: {
  lang: CityGuideLang;
  cityGuides: CityGuideContent[];
}) {
  const t = content[lang];
  const cities = publishedCityGuides(cityGuides).filter(cityGuideIsPublic);

  if (!cities.length) return null;

  return (
    <section
      aria-labelledby="active-cities-title"
      className="relative z-20 bg-[#f5f1ea] px-6 py-14 text-[#1a1f2e] md:px-10 lg:px-20 lg:py-20"
    >
      <div className="mx-auto max-w-6xl">
        <div className="max-w-3xl">
          <h2 id="active-cities-title" className="text-2xl font-light sm:text-3xl">
            {t.title}
          </h2>
          <p className="mt-5 text-base leading-relaxed text-stone-700 sm:text-lg">
            {t.intro}
          </p>
        </div>

        <div className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {cities.map((city) => {
            const slug = city.slug?.current;
            if (!slug) return null;
            const name = cityGuideName(city, lang, slug);
            const summary = citySummary(city, lang);

            return (
              <article
                key={slug}
                className="flex min-w-0 flex-col rounded-2xl border border-stone-200 bg-white p-5 shadow-sm sm:p-6"
              >
                <h3 className="text-xl font-medium text-[#1a1f2e]">{name}</h3>
                {summary ? (
                  <p className="mt-4 flex-1 text-sm leading-relaxed text-stone-600">
                    {summary}
                  </p>
                ) : (
                  <div className="flex-1" />
                )}

                <div className="mt-7 grid gap-3 sm:grid-cols-2 md:grid-cols-1 xl:grid-cols-2">
                  <Link
                    href={cityGuidePath(lang, slug)}
                    className="inline-flex min-h-12 items-center justify-center rounded-full bg-[#1a1f2e] px-5 py-3 text-center text-sm font-medium text-white transition hover:bg-stone-800 focus:outline-none focus:ring-2 focus:ring-[#b99455] focus:ring-offset-2"
                  >
                    {t.cityCta}
                  </Link>
                  {city.hasInterpreterCoverage ? (
                    <Link
                      href={cityInterpreterPath(slug, lang)}
                      className="inline-flex min-h-12 items-center justify-center rounded-full border border-stone-300 px-5 py-3 text-center text-sm font-medium text-[#1a1f2e] transition hover:bg-stone-100 focus:outline-none focus:ring-2 focus:ring-[#b99455] focus:ring-offset-2"
                    >
                      {t.interpreterCta}
                    </Link>
                  ) : null}
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
