import Link from "next/link";
import ProviderProfileCard, { type ProviderListItem } from "@/app/components/ProviderProfileCard";
import {
  cityInterpreterName,
  cityInterpreterPath,
  isPrimaryInterpreter,
  type CityInterpreterCoverage,
} from "@/app/lib/cityInterpreterCoverage";
import { homeInTheCityWhatsApp, type InterpreterCmsPage, type InterpreterLanguage } from "@/app/lib/interpreterPages";

const labels = {
  en: { eyebrow: "Interpreter services", interpreters: "Available interpreters", primary: "Primary city host", languages: "Languages", allCities: "All interpreter services in Brazil", contact: "Message Home in the City" },
  pt: { eyebrow: "Serviços de intérprete", interpreters: "Intérpretes disponíveis", primary: "Anfitrião principal da cidade", languages: "Idiomas", allCities: "Todos os serviços de intérprete no Brasil", contact: "Falar com a Home in the City" },
  nl: { eyebrow: "Tolkdiensten", interpreters: "Beschikbare tolken", primary: "Primaire stadshost", languages: "Talen", allCities: "Alle tolkdiensten in Brazilië", contact: "Bericht Home in the City" },
} as const;

function value(page: InterpreterCmsPage | null | undefined, field: "eyebrow" | "title" | "intro" | "ctaTitle" | "ctaText" | "button", lang: InterpreterLanguage) {
  return page?.[`${field}_${lang}`];
}

export default function CityInterpreterPage({ city, lang, page }: { city: CityInterpreterCoverage; lang: InterpreterLanguage; page?: InterpreterCmsPage | null }) {
  const t = labels[lang];
  const cityName = cityInterpreterName(city, lang);
  const interpreters = city.interpreters || [];
  const heading = value(page, "title", lang) || `${t.eyebrow} in ${cityName}`;
  const intro = value(page, "intro", lang);
  const ctaTitle = value(page, "ctaTitle", lang);
  const ctaText = value(page, "ctaText", lang);
  const ctaButton = value(page, "button", lang) || t.contact;

  return (
    <main className="min-h-screen bg-stone-50 px-4 pb-16 pt-28 sm:px-6 sm:pb-20 sm:pt-32">
      <div className="mx-auto max-w-5xl">
        <section className="mb-10 max-w-3xl">
          <p className="mb-3 text-xs uppercase tracking-[0.22em] text-stone-500">{value(page, "eyebrow", lang) || t.eyebrow}</p>
          <h1 className="mb-5 text-4xl font-light leading-tight text-stone-900 sm:text-5xl">{heading}</h1>
          {intro ? <p className="text-base leading-7 text-stone-600 sm:text-lg">{intro}</p> : null}
        </section>

        <section className="mb-12">
          <h2 className="mb-6 text-3xl font-light text-stone-900">{t.interpreters}</h2>
          <div className="grid gap-5 md:grid-cols-2">
            {interpreters.map((provider) => (
              <ProviderProfileCard
                key={provider._id}
                provider={provider as ProviderListItem}
                lang={lang}
                appearance="light"
                cityInterpreterHref={city.slug?.current ? cityInterpreterPath(city.slug.current, lang) : undefined}
                cityInterpreterLabel={isPrimaryInterpreter(city, provider) ? t.primary : undefined}
              />
            ))}
          </div>
        </section>

        {page?.sections?.length ? (
          <section className="mb-12 space-y-4">
            {page.sections.map((section) => {
              const title = section[`title_${lang}`];
              const text = section[`text_${lang}`];
              return title || text ? <article key={section._key} className="rounded-2xl bg-white p-6 shadow-sm">{title ? <h2 className="mb-3 text-2xl font-light text-stone-900">{title}</h2> : null}{text ? <p className="whitespace-pre-line leading-7 text-stone-600">{text}</p> : null}</article> : null;
            })}
          </section>
        ) : null}

        {page?.pricingItems?.length ? (
          <section className="mb-12 rounded-2xl bg-white p-6 shadow-sm">
            <h2 className="mb-5 text-2xl font-light text-stone-900">{page[`pricingTitle_${lang}`] || "Pricing"}</h2>
            <div className="space-y-3">{page.pricingItems.map((item) => <div key={item._key} className="flex flex-col gap-1 border-b border-stone-100 pb-3 last:border-0"><span className="font-medium text-stone-800">{item[`label_${lang}`]}</span><span className="text-stone-600">{item[`detail_${lang}`]}</span></div>)}</div>
          </section>
        ) : null}

        <section className="mb-12 rounded-3xl bg-[#1a1f2e] p-6 text-white sm:p-8">
          {ctaTitle ? <h2 className="mb-3 text-3xl font-light">{ctaTitle}</h2> : null}
          {ctaText ? <p className="mb-5 max-w-2xl leading-7 text-stone-300">{ctaText}</p> : null}
          <a href={homeInTheCityWhatsApp} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-12 items-center rounded-full bg-white px-5 py-3 text-sm font-medium text-stone-900">{ctaButton}</a>
        </section>

        <Link href={lang === "pt" ? "/pt/interpretes-brasil" : lang === "nl" ? "/nl/tolken-brazilie" : "/interpreters-brazil"} className="text-sm text-stone-600 underline">{t.allCities}</Link>
      </div>
    </main>
  );
}
