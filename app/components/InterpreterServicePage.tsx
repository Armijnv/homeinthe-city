import Link from "next/link";
import {
  homeInTheCityWhatsApp,
  interpreterCities,
  type InterpreterCitySlug,
  type InterpreterCmsPage,
  type InterpreterLanguage,
} from "@/app/lib/interpreterPages";

const languageNames: Record<InterpreterLanguage, Record<InterpreterLanguage, string>> = {
  en: { en: "English", pt: "Portuguese", nl: "Dutch" },
  pt: { en: "Inglês", pt: "Português", nl: "Holandês" },
  nl: { en: "Engels", pt: "Portugees", nl: "Nederlands" },
};

function localizedCmsValue(
  value: InterpreterCmsPage | undefined | null,
  field: "eyebrow" | "title" | "intro" | "pricingTitle" | "ctaTitle" | "ctaText" | "button",
  lang: InterpreterLanguage,
) {
  return value?.[`${field}_${lang}`];
}

export default function InterpreterServicePage({
  citySlug,
  lang,
  page,
}: {
  citySlug: InterpreterCitySlug;
  lang: InterpreterLanguage;
  page?: InterpreterCmsPage | null;
}) {
  const city = interpreterCities[citySlug];
  const content = city.content[lang];

  if (!content) {
    throw new Error(`No ${lang} interpreter content configured for ${citySlug}`);
  }

  const eyebrow = localizedCmsValue(page, "eyebrow", lang) || content.eyebrow;
  const title = localizedCmsValue(page, "title", lang) || content.title;
  const intro = localizedCmsValue(page, "intro", lang) || content.intro;
  const pricingTitle = localizedCmsValue(page, "pricingTitle", lang) || content.pricingTitle;
  const ctaTitle = localizedCmsValue(page, "ctaTitle", lang) || content.ctaTitle;
  const ctaText = localizedCmsValue(page, "ctaText", lang) || content.ctaText;
  const ctaButton = localizedCmsValue(page, "button", lang) || content.ctaButton;
  const cityLinks = Object.values(interpreterCities).flatMap((item) => {
    const href = item.paths[lang];
    return href ? [{ href, label: item.city, current: item.slug === city.slug }] : [];
  });

  return (
    <main className="min-h-screen bg-stone-50 px-6 pt-32 pb-20">
      <div className="mx-auto max-w-5xl">
        <section className="mb-10 max-w-3xl">
          <p className="mb-4 text-sm uppercase tracking-[0.25em] text-stone-500">
            {eyebrow}
          </p>
          <h1 className="mb-6 text-5xl font-light leading-tight text-stone-800">
            {title}
          </h1>
          <p className="max-w-3xl text-lg leading-relaxed text-stone-600">
            {intro}
          </p>
        </section>

        <section className="mb-12 rounded-3xl bg-[#1a1f2e] p-8 text-white shadow-sm">
          <h2 className="mb-4 text-3xl font-light">{ctaTitle}</h2>
          <p className="mb-6 max-w-2xl text-stone-300">{ctaText}</p>
          <div className="flex flex-wrap gap-3">
            <a
              href={homeInTheCityWhatsApp}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block rounded-full bg-white px-6 py-4 text-sm text-stone-900 transition hover:bg-stone-200"
            >
              {ctaButton}
            </a>
            <a
              href="#pricing"
              className="inline-block rounded-full border border-white/20 bg-white/10 px-6 py-4 text-sm text-white transition hover:bg-white/15"
            >
              {content.pricingButton}
            </a>
          </div>
        </section>

        <section className="mb-12">
          <div className="mb-8 max-w-3xl">
            <h2 className="mb-4 text-3xl font-light text-stone-800">
              {content.serviceTitle}
            </h2>
            <p className="leading-relaxed text-stone-600">{content.serviceIntro}</p>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            {content.services.map((service) => (
              <article key={service.title} className="rounded-2xl bg-white p-6 shadow-sm">
                <h3 className="mb-3 text-xl font-medium text-stone-800">{service.title}</h3>
                <p className="leading-relaxed text-stone-600">{service.text}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="mb-12">
          <h2 className="mb-8 text-3xl font-light text-stone-800">{content.focusTitle}</h2>
          <div className="grid gap-4 md:grid-cols-2">
            {content.focusItems.map((item) => (
              <article key={item.title} className="rounded-2xl bg-white p-6 shadow-sm">
                <h3 className="mb-3 text-xl font-medium text-stone-800">{item.title}</h3>
                <p className="leading-relaxed text-stone-600">{item.text}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="mb-12 rounded-3xl bg-white p-8 shadow-sm">
          <h2 className="mb-6 text-3xl font-light text-stone-800">{content.localTitle}</h2>
          <div className="grid gap-4 md:grid-cols-2">
            {content.localPoints.map((point) => (
              <p key={point} className="rounded-2xl border border-stone-100 bg-stone-50 p-5 leading-relaxed text-stone-600">
                {point}
              </p>
            ))}
          </div>
        </section>

        <section className="mb-12 grid gap-4 md:grid-cols-2">
          <article className="rounded-3xl bg-white p-8 shadow-sm">
            <h2 className="mb-5 text-3xl font-light text-stone-800">{content.providerTitle}</h2>
            <p className="mb-2 text-2xl text-stone-800">{city.provider}</p>
            <p className="mb-5 text-sm uppercase tracking-wider text-stone-500">{content.providerRole}</p>
            <p className="leading-relaxed text-stone-600">{content.providerText}</p>
          </article>
          <article className="rounded-3xl bg-white p-8 shadow-sm">
            <h2 className="mb-5 text-3xl font-light text-stone-800">{content.languagesTitle}</h2>
            <div className="flex flex-wrap gap-3">
              {city.languages.map((language) => (
                <span key={language} className="rounded-full bg-stone-100 px-4 py-2 text-stone-700">
                  {languageNames[lang][language]}
                </span>
              ))}
            </div>
            <p className="mt-6 text-sm leading-relaxed text-stone-500">
              {city.city} · {city.region}
            </p>
          </article>
        </section>

        <section id="pricing" className="mb-12 scroll-mt-28 rounded-3xl bg-white p-8 shadow-sm">
          <h2 className="mb-6 text-3xl font-light text-stone-800">{pricingTitle}</h2>
          {page?.pricingItems?.length ? (
            <div className="space-y-4">
              {page.pricingItems.map((item, index) => (
                <div key={index} className="flex flex-col justify-between gap-1 border-b border-stone-100 pb-4 last:border-b-0 last:pb-0 sm:flex-row">
                  <span className="font-medium text-stone-800">{item[`label_${lang}`]}</span>
                  <span className="text-stone-600">{item[`detail_${lang}`]}</span>
                </div>
              ))}
            </div>
          ) : (
            <p className="max-w-3xl leading-relaxed text-stone-600">{content.pricingNote}</p>
          )}
        </section>

        {page?.sections?.length ? (
          <section className="mb-12 space-y-4">
            {page.sections.map((section, index) => {
              const sectionTitle = section[`title_${lang}`];
              const sectionText = section[`text_${lang}`];
              return sectionTitle || sectionText ? (
                <article key={index} className="rounded-2xl bg-white p-6 shadow-sm">
                  {sectionTitle ? <h2 className="mb-4 text-2xl text-stone-800">{sectionTitle}</h2> : null}
                  {sectionText ? <p className="whitespace-pre-line leading-relaxed text-stone-600">{sectionText}</p> : null}
                </article>
              ) : null;
            })}
          </section>
        ) : null}

        <nav aria-labelledby="interpreter-cities-title" className="mb-12 rounded-3xl border border-stone-200 bg-stone-100 p-8">
          <h2 id="interpreter-cities-title" className="mb-5 text-2xl font-light text-stone-800">
            {content.citiesTitle}
          </h2>
          <div className="flex flex-wrap gap-3">
            {cityLinks.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                aria-current={item.current ? "page" : undefined}
                className={item.current ? "rounded-full bg-[#1a1f2e] px-5 py-3 text-sm text-white" : "rounded-full bg-white px-5 py-3 text-sm text-stone-700 transition hover:bg-stone-200"}
              >
                {item.label}
              </Link>
            ))}
          </div>
        </nav>

        <section className="rounded-3xl bg-[#1a1f2e] p-8 text-white">
          <h2 className="mb-4 text-3xl font-light">{ctaTitle}</h2>
          <p className="mb-6 max-w-2xl text-stone-300">{ctaText}</p>
          <a
            href={homeInTheCityWhatsApp}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block rounded-full bg-white px-6 py-4 text-sm text-stone-900 transition hover:bg-stone-200"
          >
            {ctaButton}
          </a>
        </section>
      </div>
    </main>
  );
}
