import Link from "next/link";
import ProviderProfileCard, { type ProviderListItem } from "@/app/components/ProviderProfileCard";
import {
  cityInterpreterName,
  cityInterpreterPath,
  isPrimaryInterpreter,
  type CityInterpreterCoverage,
} from "@/app/lib/cityInterpreterCoverage";
import {
  homeInTheCityWhatsApp,
  type InterpreterCmsPage,
  type InterpreterLanguage,
  type InterpreterPageContent,
} from "@/app/lib/interpreterPages";

const labels = {
  en: { eyebrow: "Interpreter services", interpreters: "Available interpreters", primary: "Primary city host", languages: "Languages", allCities: "All interpreter services in Brazil", contact: "Message Home in the City" },
  pt: { eyebrow: "Serviços de intérprete", interpreters: "Intérpretes disponíveis", primary: "Anfitrião principal da cidade", languages: "Idiomas", allCities: "Todos os serviços de intérprete no Brasil", contact: "Falar com a Home in the City" },
  nl: { eyebrow: "Tolkdiensten", interpreters: "Beschikbare tolken", primary: "Primaire stadshost", languages: "Talen", allCities: "Alle tolkdiensten in Brazilië", contact: "Bericht Home in the City" },
} as const;

function value(page: InterpreterCmsPage | null | undefined, field: "eyebrow" | "title" | "intro" | "ctaTitle" | "ctaText" | "button", lang: InterpreterLanguage) {
  return page?.[`${field}_${lang}`];
}

export default function CityInterpreterPage({
  city,
  lang,
  page,
  fallback,
}: {
  city: CityInterpreterCoverage;
  lang: InterpreterLanguage;
  page?: InterpreterCmsPage | null;
  fallback?: InterpreterPageContent;
}) {
  const t = labels[lang];
  const cityName = cityInterpreterName(city, lang);
  const interpreters = city.interpreters || [];
  const heading = value(page, "title", lang) || fallback?.title || `${t.eyebrow} in ${cityName}`;
  const intro = value(page, "intro", lang) || fallback?.intro;
  const ctaTitle = value(page, "ctaTitle", lang) || fallback?.ctaTitle;
  const ctaText = value(page, "ctaText", lang) || fallback?.ctaText;
  const ctaButton = value(page, "button", lang) || fallback?.ctaButton || t.contact;
  const editorialSections = (page?.sections || [])
    .map((section) => ({
      key: section._key,
      title: section[`title_${lang}`],
      text: section[`text_${lang}`],
    }))
    .filter((section) => section.title || section.text);
  const hasPricing = Boolean(page?.pricingItems?.length);
  const hasCta = Boolean(ctaTitle || ctaText);

  return (
    <main className="min-h-screen bg-stone-50 px-4 pb-16 pt-28 sm:px-6 sm:pb-20 sm:pt-32">
      <div className="mx-auto max-w-6xl">
        <section className="mb-10 max-w-3xl">
          <p className="mb-3 text-xs uppercase tracking-[0.22em] text-stone-500">{value(page, "eyebrow", lang) || t.eyebrow}</p>
          <h1 className="mb-5 text-4xl font-light leading-tight text-stone-900 sm:text-5xl">{heading}</h1>
          {intro ? <p className="text-base leading-7 text-stone-600 sm:text-lg">{intro}</p> : null}
        </section>

        <div className="grid gap-8 lg:grid-cols-[minmax(0,1.7fr)_minmax(18rem,0.8fr)] lg:items-start">
          <div className="min-w-0 space-y-10">
            <section>
              <h2 className="mb-6 text-3xl font-light text-stone-900">{t.interpreters}</h2>
              <div className="grid gap-5 md:grid-cols-2">
                {interpreters.map((provider) => (
                  <ProviderProfileCard key={provider._id} provider={provider as ProviderListItem} lang={lang} appearance="light" cityInterpreterHref={city.slug?.current ? cityInterpreterPath(city.slug.current, lang) : undefined} cityInterpreterLabel={isPrimaryInterpreter(city, provider) ? t.primary : undefined} />
                ))}
              </div>
            </section>

            {fallback ? <RepositoryFallbackContent content={fallback} /> : null}
            {editorialSections.map((section, index) => (
              <article key={section.key || index} className="rounded-2xl bg-white p-6 shadow-sm">
                {section.title ? <h2 className="mb-3 text-2xl font-light text-stone-900">{section.title}</h2> : null}
                {section.text ? <p className="whitespace-pre-line leading-7 text-stone-600">{section.text}</p> : null}
              </article>
            ))}
          </div>

          {hasCta || hasPricing ? (
            <aside className="space-y-4 lg:sticky lg:top-28">
              {hasCta ? <section className="rounded-3xl bg-[#1a1f2e] p-6 text-white"><h2 className="mb-3 text-2xl font-light">{ctaTitle}</h2>{ctaText ? <p className="mb-5 leading-7 text-stone-300">{ctaText}</p> : null}<a href={homeInTheCityWhatsApp} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-12 items-center rounded-full bg-white px-5 py-3 text-sm font-medium text-stone-900">{ctaButton}</a></section> : null}
              {hasPricing ? <section className="rounded-2xl bg-white p-6 shadow-sm"><h2 className="mb-5 text-2xl font-light text-stone-900">{page?.[`pricingTitle_${lang}`] || "Pricing"}</h2><div className="space-y-3">{page?.pricingItems?.map((item) => <div key={item._key} className="border-b border-stone-100 pb-3 last:border-0"><p className="font-medium text-stone-800">{item[`label_${lang}`]}</p><p className="text-sm leading-6 text-stone-600">{item[`detail_${lang}`]}</p></div>)}</div></section> : null}
            </aside>
          ) : null}
        </div>

        <Link href={lang === "pt" ? "/pt/interpretes-brasil" : lang === "nl" ? "/nl/tolken-brazilie" : "/interpreters-brazil"} className="mt-10 inline-block text-sm text-stone-600 underline">{t.allCities}</Link>
      </div>
    </main>
  );
}

function RepositoryFallbackContent({ content }: { content: InterpreterPageContent }) {
  return (
    <>
      <section><h2 className="mb-4 text-3xl font-light text-stone-900">{content.serviceTitle}</h2><p className="mb-5 leading-7 text-stone-600">{content.serviceIntro}</p><div className="grid gap-4 md:grid-cols-2">{content.services.map((item) => <article key={item.title} className="rounded-2xl bg-white p-6 shadow-sm"><h3 className="mb-2 text-xl font-medium text-stone-900">{item.title}</h3><p className="leading-7 text-stone-600">{item.text}</p></article>)}</div></section>
      <section><h2 className="mb-4 text-3xl font-light text-stone-900">{content.focusTitle}</h2><div className="grid gap-4 md:grid-cols-2">{content.focusItems.map((item) => <article key={item.title} className="rounded-2xl bg-white p-6 shadow-sm"><h3 className="mb-2 text-xl font-medium text-stone-900">{item.title}</h3><p className="leading-7 text-stone-600">{item.text}</p></article>)}</div></section>
      <section className="rounded-2xl bg-white p-6 shadow-sm"><h2 className="mb-4 text-2xl font-light text-stone-900">{content.localTitle}</h2><div className="space-y-3">{content.localPoints.map((point) => <p key={point} className="leading-7 text-stone-600">{point}</p>)}</div></section>
    </>
  );
}
