import Link from "next/link";
import {
  homeInTheCityWhatsApp,
} from "@/app/lib/interpreterHub";
import type { InterpreterCmsPage, InterpreterLanguage } from "@/app/lib/interpreterTypes";
import ProviderProfileCard, {
  type ProviderListItem,
} from "@/app/components/ProviderProfileCard";
import {
  cityInterpreterName,
  cityInterpreterPath,
  interpreterLanguages,
  type CityInterpreterCoverage,
} from "@/app/lib/cityInterpreterCoverage";
import { client } from "@/sanity/lib/client";
import { cityInterpreterCoverageQuery } from "@/sanity/lib/queries";

const languageNames: Record<InterpreterLanguage, Record<InterpreterLanguage, string>> = {
  en: { en: "English", pt: "Portuguese", nl: "Dutch" },
  pt: { en: "Inglês", pt: "Português", nl: "Holandês" },
  nl: { en: "Engels", pt: "Portugees", nl: "Nederlands" },
};

const networkCopy = {
  en: {
    title: "Meet our interpreters",
    intro:
      "Meet the real local professionals behind Home in the City interpreter services in Brazil.",
    whyTitle: "Why Home in the City",
    cityLink: (city: string) => `View interpreter services in ${city}`,
  },
  pt: {
    title: "Conheça nossos intérpretes",
    intro:
      "Conheça os profissionais locais que fazem parte dos serviços de intérprete da Home in the City no Brasil.",
    whyTitle: "Por que escolher a Home in the City",
    cityLink: (city: string) => `Ver serviços de intérprete em ${city}`,
  },
  nl: {
    title: "Maak kennis met onze tolken",
    intro:
      "Maak kennis met de lokale professionals achter de tolkdiensten van Home in the City in Brazilië.",
    whyTitle: "Waarom Home in the City",
    cityLink: (city: string) => `Bekijk tolkdiensten in ${city}`,
  },
};

export const interpreterHubContent = {
  en: {
    eyebrow: "Interpreter services across Brazil",
    title: "Business interpreter services in Brazil",
    intro:
      "Home in the City coordinates trusted interpreter support for international visitors working in Brazil. Get language help and practical local coordination for meetings, supplier visits, property viewings, trade fairs and demanding travel days.",
    topCta: "Discuss your visit",
    cityCta: "Choose a city",
    servicesTitle: "Interpreter support that travels with the agenda",
    servicesIntro:
      "Tell us what the day needs to accomplish. We qualify the inquiry centrally, confirm availability and coordinate the right local support.",
    services: [
      "Business and corporate meetings",
      "Supplier, factory and site visits",
      "Real estate and property visits",
      "Trade fairs and networking events",
      "Airport, hotel and transport coordination",
      "Practical local support before and after meetings",
    ],
    languagesTitle: "Language support",
    languagesText:
      "English and Portuguese support is available in every listed city. Dutch support is currently available in Porto Alegre. Additional language pairs can be discussed with our central team.",
    citiesTitle: "Interpreter services by city",
    citiesIntro:
      "Choose the city page for local business context, current language availability and city-specific service information.",
    cardButton: "View city interpreter services",
    englishFallback: "Page available in English",
    processTitle: "One central contact, local delivery",
    processText:
      "Home in the City receives every inquiry first. We clarify the schedule, languages and business context, coordinate availability, and assign interpreter support when appropriate. Leads are not sent directly to city hosts or providers at this stage.",
    finalTitle: "Planning meetings in Brazil?",
    finalText:
      "Share your cities, dates, language needs and meeting schedule. Home in the City will help shape a practical interpreter plan.",
    finalButton: "Message Home in the City",
  },
  pt: {
    eyebrow: "Serviços de intérprete no Brasil",
    title: "Intérpretes de negócios no Brasil",
    intro:
      "A Home in the City coordena apoio confiável de intérprete para visitantes internacionais que trabalham no Brasil. Conte com idioma e coordenação local em reuniões, fornecedores, visitas a imóveis, feiras e dias de viagem com agenda intensa.",
    topCta: "Falar sobre sua visita",
    cityCta: "Escolher uma cidade",
    servicesTitle: "Apoio de intérprete alinhado à sua agenda",
    servicesIntro:
      "Conte o que o dia precisa alcançar. Qualificamos a solicitação de forma centralizada, confirmamos a disponibilidade e coordenamos o apoio local adequado.",
    services: [
      "Reuniões empresariais e corporativas",
      "Visitas a fornecedores, fábricas e operações",
      "Visitas a imóveis e propriedades",
      "Feiras, eventos e networking",
      "Coordenação de aeroporto, hotel e transporte",
      "Apoio local prático antes e depois das reuniões",
    ],
    languagesTitle: "Apoio em idiomas",
    languagesText:
      "Inglês e português estão disponíveis em todas as cidades listadas. Holandês está disponível atualmente em Porto Alegre. Outros pares de idiomas podem ser consultados com nossa equipe central.",
    citiesTitle: "Serviços de intérprete por cidade",
    citiesIntro:
      "Escolha a página da cidade para ver contexto empresarial local, idiomas disponíveis e informações específicas do serviço.",
    cardButton: "Ver intérpretes na cidade",
    englishFallback: "Página disponível em inglês",
    processTitle: "Um contato central, atendimento local",
    processText:
      "A Home in the City recebe primeiro todas as solicitações. Esclarecemos agenda, idiomas e contexto empresarial, coordenamos a disponibilidade e designamos o apoio de intérprete adequado. Nesta fase, os contatos não são enviados diretamente a anfitriões ou prestadores locais.",
    finalTitle: "Planejando reuniões no Brasil?",
    finalText:
      "Envie as cidades, datas, idiomas e agenda de reuniões. A Home in the City ajudará a montar um plano prático de interpretação.",
    finalButton: "Falar com a Home in the City",
  },
  nl: {
    eyebrow: "Tolkdiensten in Brazilië",
    title: "Zakelijke tolken in Brazilië",
    intro:
      "Home in the City coördineert betrouwbare tolkhulp voor internationale bezoekers die in Brazilië werken. Krijg taalondersteuning en praktische lokale coördinatie bij meetings, leveranciersbezoeken, vastgoedbezichtigingen, beurzen en drukke reisdagen.",
    topCta: "Bespreek uw bezoek",
    cityCta: "Kies een stad",
    servicesTitle: "Tolkhulp die aansluit op uw agenda",
    servicesIntro:
      "Vertel ons wat de dag moet opleveren. We beoordelen de aanvraag centraal, bevestigen de beschikbaarheid en coördineren de juiste lokale ondersteuning.",
    services: [
      "Zakelijke en corporate meetings",
      "Leveranciers-, fabrieks- en locatiebezoeken",
      "Vastgoedbezoeken en bezichtigingen",
      "Beurzen en netwerkevents",
      "Coördinatie van luchthaven, hotel en vervoer",
      "Praktische lokale hulp voor en na meetings",
    ],
    languagesTitle: "Taalondersteuning",
    languagesText:
      "Engels en Portugees zijn beschikbaar in alle genoemde steden. Nederlands is momenteel beschikbaar in Porto Alegre. Andere talencombinaties kunt u met ons centrale team bespreken.",
    citiesTitle: "Tolkdiensten per stad",
    citiesIntro:
      "Kies een stadspagina voor lokale zakelijke context, actuele talen en stadsspecifieke service-informatie.",
    cardButton: "Bekijk tolkhulp in deze stad",
    englishFallback: "Pagina beschikbaar in het Engels",
    processTitle: "Eén centraal contact, lokale uitvoering",
    processText:
      "Home in the City ontvangt elke aanvraag eerst. We verduidelijken de planning, talen en zakelijke context, coördineren de beschikbaarheid en wijzen passende tolkhulp toe. Aanvragen gaan in deze fase niet rechtstreeks naar lokale hosts of providers.",
    finalTitle: "Meetings plannen in Brazilië?",
    finalText:
      "Deel de steden, data, talen en meetingplanning. Home in the City helpt met een praktisch tolkenplan.",
    finalButton: "Bericht Home in the City",
  },
};

function hubCmsValue(
  page: InterpreterCmsPage | null | undefined,
  field: "eyebrow" | "title" | "intro" | "ctaTitle" | "ctaText" | "button",
  lang: InterpreterLanguage,
) {
  return page?.[`${field}_${lang}`];
}

export default async function InterpreterHubPage({
  lang,
  page,
}: {
  lang: InterpreterLanguage;
  page?: InterpreterCmsPage | null;
}) {
  const fallback = interpreterHubContent[lang];
  const t = {
    ...fallback,
    eyebrow: hubCmsValue(page, "eyebrow", lang) || fallback.eyebrow,
    title: hubCmsValue(page, "title", lang) || fallback.title,
    intro: hubCmsValue(page, "intro", lang) || fallback.intro,
    finalTitle: hubCmsValue(page, "ctaTitle", lang) || fallback.finalTitle,
    finalText: hubCmsValue(page, "ctaText", lang) || fallback.finalText,
    finalButton: hubCmsValue(page, "button", lang) || fallback.finalButton,
    topCta: hubCmsValue(page, "button", lang) || fallback.topCta,
  };
  const network = networkCopy[lang];
  const cities = await client.fetch<CityInterpreterCoverage[]>(cityInterpreterCoverageQuery);
  const interpreterProfiles = cities.flatMap((city) =>
    (city.interpreters || []).map((provider) => ({ city, provider })),
  );

  return (
    <>
      <main className="min-h-screen bg-stone-50 px-4 pb-16 pt-28 sm:px-6 sm:pb-20 sm:pt-32">
        <div className="mx-auto max-w-5xl">
          <section className="mb-8 max-w-3xl sm:mb-10">
            <p className="mb-3 text-xs uppercase tracking-[0.22em] text-stone-500 sm:text-sm">
              {t.eyebrow}
            </p>
            <h1 className="mb-5 text-4xl font-light leading-tight text-stone-900 sm:text-5xl md:text-6xl">
              {t.title}
            </h1>
            <p className="text-base leading-7 text-stone-600 sm:text-lg sm:leading-8">
              {t.intro}
            </p>
          </section>

          <section className="mb-12 rounded-3xl bg-[#1a1f2e] p-6 text-white shadow-lg sm:p-8">
            <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              <a
                href={homeInTheCityWhatsApp}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex min-h-12 items-center justify-center rounded-full bg-white px-6 py-3 text-center text-sm font-medium text-stone-900 transition hover:bg-stone-200"
              >
                {t.topCta}
              </a>
              <a
                href="#cities"
                className="inline-flex min-h-12 items-center justify-center rounded-full border border-white/25 bg-white/10 px-6 py-3 text-center text-sm font-medium text-white transition hover:bg-white/15"
              >
                {t.cityCta}
              </a>
            </div>
          </section>

          <section id="cities" className="mb-12 scroll-mt-28">
            <div className="mb-6 max-w-3xl">
              <h2 className="mb-3 text-3xl font-light text-stone-900 sm:text-4xl">
                {t.citiesTitle}
              </h2>
              <p className="leading-7 text-stone-600">{t.citiesIntro}</p>
            </div>
            <div className="grid gap-5 lg:grid-cols-3">
              {cities.map((city) => {
                const citySlug = city.slug?.current;
                if (!citySlug) return null;
                const href = cityInterpreterPath(citySlug, lang);
                const cityName = cityInterpreterName(city, lang);
                const availableLanguages = Array.from(
                  new Set((city.interpreters || []).flatMap(interpreterLanguages)),
                );

                return (
                  <article
                    key={city._id}
                    className="flex flex-col rounded-3xl border border-stone-200 bg-white p-6 shadow-sm"
                  >
                    <p className="mb-2 text-xs uppercase tracking-widest text-stone-500">
                      {city.country || "Brazil"}
                    </p>
                    <h3 className="mb-3 text-2xl font-medium text-stone-900">
                      {cityName}
                    </h3>
                    <p className="mb-5 flex-1 leading-7 text-stone-600">
                      {(city.interpreters || []).length === 1
                        ? "1 interpreter currently available."
                        : `${(city.interpreters || []).length} interpreters currently available.`}
                    </p>
                    <div className="mb-5 flex flex-wrap gap-2">
                      {availableLanguages.map((language) => (
                        <span key={language} className="rounded-full bg-stone-100 px-3 py-2 text-xs text-stone-700">
                          {languageNames[lang][language as InterpreterLanguage] || language}
                        </span>
                      ))}
                    </div>
                    <Link
                      href={href}
                      className="inline-flex min-h-12 items-center justify-center rounded-full bg-[#1a1f2e] px-5 py-3 text-center text-sm font-medium text-white transition hover:bg-stone-800"
                    >
                      {t.cardButton}
                    </Link>
                  </article>
                );
              })}
            </div>
          </section>

          {interpreterProfiles.length ? (
            <section aria-labelledby="interpreter-network-title" className="mb-12">
              <div className="mb-6 max-w-3xl">
                <h2
                  id="interpreter-network-title"
                  className="mb-3 text-3xl font-light text-stone-900 sm:text-4xl"
                >
                  {network.title}
                </h2>
                <p className="leading-7 text-stone-600">{network.intro}</p>
              </div>
              <div className="grid gap-5 lg:grid-cols-3">
                {interpreterProfiles.map(({ city, provider }) => (
                  <ProviderProfileCard
                    key={`${city._id}-${provider._id}`}
                    provider={provider as ProviderListItem}
                    lang={lang}
                    appearance="light"
                    compact
                    headingLevel={3}
                    cityInterpreterHref={city.slug?.current ? cityInterpreterPath(city.slug.current, lang) : undefined}
                    cityInterpreterLabel={network.cityLink(cityInterpreterName(city, lang))}
                  />
                ))}
              </div>
            </section>
          ) : null}

          <section aria-labelledby="why-home-in-the-city" className="mb-12">
            <h2
              id="why-home-in-the-city"
              className="mb-6 text-3xl font-light text-stone-900 sm:text-4xl"
            >
              {network.whyTitle}
            </h2>

            <div className="mb-8 max-w-3xl">
              <h3 className="mb-3 text-2xl font-light text-stone-900 sm:text-3xl">
                {t.servicesTitle}
              </h3>
              <p className="leading-7 text-stone-600">{t.servicesIntro}</p>
            </div>
            <div className="mb-8 grid gap-3 sm:grid-cols-2">
              {t.services.map((service) => (
                <p
                  key={service}
                  className="rounded-2xl border border-stone-200 bg-white p-5 leading-6 text-stone-700 shadow-sm"
                >
                  {service}
                </p>
              ))}
            </div>

            <div className="mb-8 rounded-3xl bg-white p-6 shadow-sm sm:p-8">
              <h3 className="mb-3 text-2xl font-light text-stone-900 sm:text-3xl">
                {t.languagesTitle}
              </h3>
              <p className="max-w-3xl leading-7 text-stone-600">{t.languagesText}</p>
            </div>

            <div className="rounded-3xl border border-stone-200 bg-stone-100 p-6 sm:p-8">
              <h3 className="mb-3 text-2xl font-light text-stone-900 sm:text-3xl">
                {t.processTitle}
              </h3>
              <p className="max-w-3xl leading-7 text-stone-600">{t.processText}</p>
            </div>
          </section>

          <section className="rounded-3xl bg-[#1a1f2e] p-6 text-white shadow-lg sm:p-8">
            <h2 className="mb-3 text-3xl font-light sm:text-4xl">{t.finalTitle}</h2>
            <p className="mb-6 max-w-2xl leading-7 text-stone-300">{t.finalText}</p>
            <a
              href={homeInTheCityWhatsApp}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-12 w-full items-center justify-center rounded-full bg-white px-6 py-3 text-center text-sm font-medium text-stone-900 transition hover:bg-stone-200 sm:w-auto"
            >
              {t.finalButton}
            </a>
          </section>
        </div>
      </main>
    </>
  );
}
