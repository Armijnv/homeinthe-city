"use client";

import Link from "next/link";

type Lang = "en" | "pt" | "nl";

type ServicePageData = {
  eyebrow_en?: string;
  eyebrow_pt?: string;
  eyebrow_nl?: string;

  title_en?: string;
  title_pt?: string;
  title_nl?: string;

  intro_en?: string;
  intro_pt?: string;
  intro_nl?: string;

  sections?: {
    title_en?: string;
    title_pt?: string;
    title_nl?: string;
    text_en?: string;
    text_pt?: string;
    text_nl?: string;
  }[];

  pricingTitle_en?: string;
  pricingTitle_pt?: string;
  pricingTitle_nl?: string;

  pricingItems?: {
    label_en?: string;
    label_pt?: string;
    label_nl?: string;
    detail_en?: string;
    detail_pt?: string;
    detail_nl?: string;
  }[];

  ctaTitle_en?: string;
  ctaTitle_pt?: string;
  ctaTitle_nl?: string;

  ctaText_en?: string;
  ctaText_pt?: string;
  ctaText_nl?: string;

  button_en?: string;
  button_pt?: string;
  button_nl?: string;
};

const content = {
  en: {
    eyebrow: "Interpreter services in Porto Alegre",
    title: "Business Interpreter in Porto Alegre",
    intro:
      "Home in the City provides business interpreter services in Porto Alegre and Rio Grande do Sul for meetings, factory visits, supplier conversations, technical explanations and local business coordination. We currently provide interpreter services in English, Portuguese and Dutch. Additional language pairs are being added.",
    primaryCta: "Contact us on WhatsApp",
    secondaryCta: "See pricing",
    serviceTitle: "Business Support We Provide",
    serviceIntro:
      "Interpreter Porto Alegre support is most useful when language, local context and practical coordination work together. Home in the City helps business visitors before, during and after meetings.",
    services: [
      {
        title: "Business meetings",
        text:
          "Interpretation for introductions, negotiations, partner meetings, sales conversations and follow-up discussions with Brazilian companies.",
      },
      {
        title: "Factory and site visits",
        text:
          "Support during production tours, quality control visits, supplier inspections, technical explanations and operational conversations.",
      },
      {
        title: "English interpreter in Porto Alegre",
        text:
          "English-Portuguese interpreting for visitors who need clear communication with teams, clients, suppliers, distributors and local partners.",
      },
      {
        title: "Local business hosting",
        text:
          "Practical coordination around schedules, transportation, meeting locations, restaurants, local expectations and business etiquette.",
      },
    ],
    industriesTitle: "Industries We Support",
    industries: [
      {
        title: "Manufacturing & Industry",
        text:
          "Factory visits, production discussions, supplier meetings, quality control visits and technical explanations.",
      },
      {
        title: "Agriculture & Agribusiness",
        text:
          "Farm visits, agricultural machinery demonstrations, cooperatives, grain exporters and food processing companies.",
      },
      {
        title: "Food & Beverage",
        text:
          "Producer visits, distributor meetings, restaurant and hospitality conversations, sourcing discussions and product presentations.",
      },
      {
        title: "Machinery & Equipment",
        text:
          "Equipment demonstrations, installation conversations, maintenance discussions, technical training and distributor meetings.",
      },
      {
        title: "Renewable Energy",
        text:
          "Project meetings, site visits, supplier conversations, regulatory context and conversations with local partners.",
      },
      {
        title: "Logistics & Transport",
        text:
          "Port, warehouse, freight, fleet and supply-chain meetings where local terminology and timing matter.",
      },
      {
        title: "Technology & Software",
        text:
          "Business meetings, startup visits, product presentations, conferences, demos and networking events.",
      },
      {
        title: "Healthcare & Medical Equipment",
        text:
          "Hospital visits, equipment demonstrations, distributor meetings, technical training sessions and specialist conversations.",
      },
      {
        title: "Construction & Engineering",
        text:
          "Site visits, engineering discussions, supplier meetings, project reviews and technical documentation conversations.",
      },
      {
        title: "Trade Shows & Business Events",
        text:
          "Conference interpretation, booth conversations, networking support, buyer meetings and event logistics.",
      },
    ],
    localTitle: "Why Work With a Local Interpreter?",
    localPoints: [
      "Understanding Brazilian business culture and meeting expectations.",
      "Local logistics, transportation and timing in Porto Alegre and Rio Grande do Sul.",
      "Restaurant, hotel lobby, coworking and meeting-location recommendations.",
      "Support before, during and after meetings so the visit stays organized.",
      "Practical assistance throughout the visit, not only sentence-by-sentence interpretation.",
    ],
    pricingTitle: "Pricing",
    expertiseTitle: "Local Expertise",
    founderTitle: "About the Founder",
    founderText:
      "Home in the City was founded by Armijn van Dijk, who has lived in Brazil for more than 25 years and brings experience in hospitality, business, hands-on work and local coordination. That local experience helps visitors handle meetings, travel days and practical questions with more confidence.",
    cmsTitle: "Additional Local Notes",
    finalCtaTitle: "Plan interpreter support in Porto Alegre",
    finalCtaText:
      "Share the meeting type, language needs, dates and business context, and Home in the City will help shape the right interpreter support.",
    finalCtaButton: "Message Home in the City",
  },
  pt: {
    eyebrow: "Serviços de intérprete em Porto Alegre",
    title: "Intérprete de negócios em Porto Alegre",
    intro:
      "A Home in the City oferece serviços de intérprete de negócios em Porto Alegre e no Rio Grande do Sul para reuniões, visitas a fábricas, conversas com fornecedores, explicações técnicas e coordenação empresarial local. Atualmente oferecemos serviços de interpretação em inglês, português e holandês. Novos idiomas serão adicionados gradualmente.",
    primaryCta: "Falar pelo WhatsApp",
    secondaryCta: "Ver preços",
    serviceTitle: "Apoio Empresarial Que Oferecemos",
    serviceIntro:
      "O apoio de intérprete em Porto Alegre funciona melhor quando idioma, contexto local e coordenação prática caminham juntos. A Home in the City ajuda visitantes de negócios antes, durante e depois das reuniões.",
    services: [
      {
        title: "Reuniões de negócios",
        text:
          "Interpretação para apresentações, negociações, reuniões com parceiros, conversas comerciais e acompanhamentos com empresas brasileiras.",
      },
      {
        title: "Visitas a fábricas e operações",
        text:
          "Apoio em visitas de produção, controle de qualidade, inspeções de fornecedores, explicações técnicas e conversas operacionais.",
      },
      {
        title: "Intérprete inglês-português em Porto Alegre",
        text:
          "Interpretação inglês-português para visitantes que precisam se comunicar com equipes, clientes, fornecedores, distribuidores e parceiros locais.",
      },
      {
        title: "Acompanhamento empresarial local",
        text:
          "Coordenação prática de agenda, transporte, locais de reunião, restaurantes, expectativas locais e etiqueta de negócios.",
      },
    ],
    industriesTitle: "Setores Que Atendemos",
    industries: [
      {
        title: "Indústria e Manufatura",
        text:
          "Visitas a fábricas, discussões de produção, reuniões com fornecedores, controle de qualidade e explicações técnicas.",
      },
      {
        title: "Agricultura e Agronegócio",
        text:
          "Visitas a fazendas, demonstrações de máquinas agrícolas, cooperativas, exportadores de grãos e empresas de processamento de alimentos.",
      },
      {
        title: "Alimentos e Bebidas",
        text:
          "Visitas a produtores, reuniões com distribuidores, conversas com restaurantes e hotelaria, compras e apresentações de produtos.",
      },
      {
        title: "Máquinas e Equipamentos",
        text:
          "Demonstrações de equipamentos, instalação, manutenção, treinamento técnico e reuniões com distribuidores.",
      },
      {
        title: "Energia Renovável",
        text:
          "Reuniões de projeto, visitas técnicas, conversas com fornecedores, contexto regulatório e contato com parceiros locais.",
      },
      {
        title: "Logística e Transporte",
        text:
          "Reuniões sobre portos, armazéns, frete, frotas e cadeia de suprimentos, com atenção a termos e prazos locais.",
      },
      {
        title: "Tecnologia e Software",
        text:
          "Reuniões de negócios, visitas a startups, apresentações de produtos, conferências, demonstrações e networking.",
      },
      {
        title: "Saúde e Equipamentos Médicos",
        text:
          "Visitas a hospitais, demonstrações de equipamentos, reuniões com distribuidores, treinamentos técnicos e conversas com especialistas.",
      },
      {
        title: "Construção e Engenharia",
        text:
          "Visitas a obras, discussões de engenharia, reuniões com fornecedores, revisões de projeto e conversas sobre documentação técnica.",
      },
      {
        title: "Feiras e Eventos de Negócios",
        text:
          "Interpretação em conferências, conversas em estandes, apoio em networking, reuniões com compradores e logística de eventos.",
      },
    ],
    localTitle: "Por Que Trabalhar Com um Intérprete Local?",
    localPoints: [
      "Compreensão da cultura empresarial brasileira e das expectativas em reuniões.",
      "Logística, transporte e horários em Porto Alegre e no Rio Grande do Sul.",
      "Recomendações de restaurantes, hotéis, coworkings e locais de reunião.",
      "Apoio antes, durante e depois das reuniões para manter a visita organizada.",
      "Ajuda prática ao longo da visita, não apenas interpretação frase por frase.",
    ],
    pricingTitle: "Preços",
    expertiseTitle: "Experiência Local",
    founderTitle: "Sobre o Fundador",
    founderText:
      "A Home in the City foi fundada por Armijn van Dijk, que vive no Brasil há mais de 25 anos e traz experiência em hospitalidade, negócios, trabalho prático e coordenação local. Essa experiência local ajuda visitantes a lidar com reuniões, deslocamentos e dúvidas práticas com mais segurança.",
    cmsTitle: "Notas Locais Adicionais",
    finalCtaTitle: "Planeje apoio de intérprete em Porto Alegre",
    finalCtaText:
      "Envie o tipo de reunião, idiomas necessários, datas e contexto empresarial para que a Home in the City ajude a definir o apoio ideal.",
    finalCtaButton: "Falar com a Home in the City",
  },
  nl: {
    eyebrow: "Tolkdiensten in Porto Alegre",
    title: "Business tolk in Porto Alegre",
    intro:
      "Home in the City biedt zakelijke tolken in Porto Alegre en Rio Grande do Sul voor vergaderingen, fabrieksbezoeken, leveranciersgesprekken, technische uitleg en lokale zakelijke coördinatie. Momenteel bieden wij tolkdiensten aan in het Engels, Portugees en Nederlands. Extra talen worden geleidelijk toegevoegd.",
    primaryCta: "Contact via WhatsApp",
    secondaryCta: "Bekijk tarieven",
    serviceTitle: "Zakelijke Ondersteuning Die We Bieden",
    serviceIntro:
      "Een tolk in Porto Alegre is het nuttigst wanneer taal, lokale context en praktische coördinatie samenkomen. Home in the City ondersteunt zakelijke bezoekers voor, tijdens en na vergaderingen.",
    services: [
      {
        title: "Zakelijke vergaderingen",
        text:
          "Tolken bij introducties, onderhandelingen, partnermeetings, verkoopgesprekken en opvolging met Braziliaanse bedrijven.",
      },
      {
        title: "Fabrieks- en locatiebezoeken",
        text:
          "Ondersteuning tijdens productierondleidingen, kwaliteitscontroles, leveranciersinspecties, technische uitleg en operationele gesprekken.",
      },
      {
        title: "Engelse tolk in Porto Alegre",
        text:
          "Engels-Portugees tolken voor bezoekers die helder moeten communiceren met teams, klanten, leveranciers, distributeurs en lokale partners.",
      },
      {
        title: "Lokale zakelijke begeleiding",
        text:
          "Praktische coördinatie rond planning, vervoer, vergaderlocaties, restaurants, lokale verwachtingen en zakelijke cultuur.",
      },
    ],
    industriesTitle: "Sectoren Die We Ondersteunen",
    industries: [
      {
        title: "Productie en Industrie",
        text:
          "Fabrieksbezoeken, productiegesprekken, leveranciersmeetings, kwaliteitscontrole en technische uitleg.",
      },
      {
        title: "Landbouw en Agribusiness",
        text:
          "Boerderijbezoeken, demonstraties van landbouwmachines, coöperaties, graanexporteurs en voedselverwerkende bedrijven.",
      },
      {
        title: "Food & Beverage",
        text:
          "Producentenbezoeken, distributeursmeetings, restaurant- en hospitalitygesprekken, sourcing en productpresentaties.",
      },
      {
        title: "Machines en Apparatuur",
        text:
          "Apparatuurdemo's, installatiegesprekken, onderhoud, technische trainingen en distributeursmeetings.",
      },
      {
        title: "Hernieuwbare Energie",
        text:
          "Projectmeetings, locatiebezoeken, leveranciersgesprekken, lokale regelgeving en contact met partners.",
      },
      {
        title: "Logistiek en Transport",
        text:
          "Meetings over havens, magazijnen, vracht, wagenparken en supply chains waar lokale termen en timing tellen.",
      },
      {
        title: "Technologie en Software",
        text:
          "Zakelijke meetings, startupbezoeken, productpresentaties, conferenties, demo's en netwerkevents.",
      },
      {
        title: "Zorg en Medische Apparatuur",
        text:
          "Ziekenhuisbezoeken, apparatuurdemo's, distributeursmeetings, technische trainingssessies en specialistische gesprekken.",
      },
      {
        title: "Bouw en Engineering",
        text:
          "Locatiebezoeken, technische besprekingen, leveranciersmeetings, projectreviews en gesprekken over technische documentatie.",
      },
      {
        title: "Beurzen en Zakelijke Events",
        text:
          "Tolken op conferenties, beursgesprekken, netwerkondersteuning, buyer meetings en eventlogistiek.",
      },
    ],
    localTitle: "Waarom Werken Met een Lokale Tolk?",
    localPoints: [
      "Begrip van Braziliaanse zakelijke cultuur en meetingverwachtingen.",
      "Lokale logistiek, vervoer en timing in Porto Alegre en Rio Grande do Sul.",
      "Aanbevelingen voor restaurants, hotellobby's, coworkings en vergaderlocaties.",
      "Ondersteuning voor, tijdens en na meetings zodat het bezoek georganiseerd blijft.",
      "Praktische hulp tijdens het bezoek, niet alleen zin-voor-zin tolken.",
    ],
    pricingTitle: "Tarieven",
    expertiseTitle: "Lokale Expertise",
    founderTitle: "Over de Oprichter",
    founderText:
      "Home in the City is opgericht door Armijn van Dijk, die al meer dan 25 jaar in Brazilië woont en ervaring meebrengt in hospitality, ondernemerschap, praktisch werk en lokale coördinatie. Die lokale ervaring helpt bezoekers met meetings, reisdagen en praktische vragen met meer vertrouwen om te gaan.",
    cmsTitle: "Aanvullende Lokale Notities",
    finalCtaTitle: "Plan tolkhulp in Porto Alegre",
    finalCtaText:
      "Deel het type meeting, de talen, data en zakelijke context, dan helpt Home in the City met de juiste tolkinzet.",
    finalCtaButton: "Bericht Home in the City",
  },
};

function fixKnownTypos(text?: string) {
  return text?.replace("Brazlië", "Brazilië");
}

export default function InterpreterServicePage({
  lang,
  page,
}: {
  lang: Lang;
  page: ServicePageData;
}) {
  const t = content[lang];
  const pricingTitle = page[`pricingTitle_${lang}`] || t.pricingTitle;
  const ctaTitle = page[`ctaTitle_${lang}`] || t.finalCtaTitle;
  const ctaText = page[`ctaText_${lang}`] || t.finalCtaText;
  const ctaButton = page[`button_${lang}`] || t.finalCtaButton;

  return (
    <main className="min-h-screen bg-stone-50 px-6 pt-32 pb-20">
      <div className="mx-auto max-w-5xl">
        <section className="mb-10 max-w-3xl">
          <p className="mb-4 text-sm uppercase tracking-[0.25em] text-stone-500">
            {page[`eyebrow_${lang}`] || t.eyebrow}
          </p>

          <h1 className="mb-6 text-5xl font-light leading-tight text-stone-800">
            {fixKnownTypos(page[`title_${lang}`]) || t.title}
          </h1>

          <p className="max-w-3xl text-lg leading-relaxed text-stone-600">
            {t.intro}
          </p>
        </section>

        <section className="mb-12 rounded-3xl bg-[#1a1f2e] p-8 text-white shadow-sm">
          <h2 className="mb-4 text-3xl font-light">{ctaTitle}</h2>

          <p className="mb-6 max-w-2xl text-stone-300">{ctaText}</p>

          <div className="flex flex-wrap gap-3">
            <Link
              href="https://wa.me/5551997783369"
              className="inline-block rounded-full bg-white px-6 py-4 text-sm text-stone-900 transition hover:bg-stone-200"
            >
              {ctaButton}
            </Link>

            <a
              href="#pricing"
              className="inline-block rounded-full border border-white/20 bg-white/10 px-6 py-4 text-sm text-white transition hover:bg-white/15"
            >
              {t.secondaryCta}
            </a>
          </div>
        </section>

        <section className="mb-12">
          <div className="mb-8 max-w-3xl">
            <h2 className="mb-4 text-3xl font-light text-stone-800">
              {t.serviceTitle}
            </h2>
            <p className="leading-relaxed text-stone-600">{t.serviceIntro}</p>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            {t.services.map((service) => (
              <article key={service.title} className="rounded-2xl bg-white p-6 shadow-sm">
                <h3 className="mb-3 text-xl font-medium text-stone-800">
                  {service.title}
                </h3>
                <p className="leading-relaxed text-stone-600">{service.text}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="mb-12">
          <h2 className="mb-8 text-3xl font-light text-stone-800">
            {t.industriesTitle}
          </h2>

          <div className="grid gap-4 md:grid-cols-2">
            {t.industries.map((industry) => (
              <article key={industry.title} className="rounded-2xl bg-white p-6 shadow-sm">
                <h3 className="mb-3 text-xl font-medium text-stone-800">
                  {industry.title}
                </h3>
                <p className="leading-relaxed text-stone-600">{industry.text}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="mb-12 rounded-3xl bg-white p-8 shadow-sm">
          <h2 className="mb-6 text-3xl font-light text-stone-800">
            {t.localTitle}
          </h2>

          <div className="grid gap-4 md:grid-cols-2">
            {t.localPoints.map((point) => (
              <p
                key={point}
                className="rounded-2xl border border-stone-100 bg-stone-50 p-5 leading-relaxed text-stone-600"
              >
                {point}
              </p>
            ))}
          </div>
        </section>

        {page.pricingItems && page.pricingItems.length > 0 && (
          <section id="pricing" className="mb-12 rounded-3xl bg-white p-8 shadow-sm">
            <h2 className="mb-6 text-3xl font-light text-stone-800">
              {pricingTitle}
            </h2>

            <div className="space-y-4">
              {page.pricingItems.map((item, index) => (
                <div
                  key={index}
                  className="flex flex-col justify-between gap-1 border-b border-stone-100 pb-4 last:border-b-0 last:pb-0 sm:flex-row"
                >
                  <span className="font-medium text-stone-800">
                    {item[`label_${lang}`]}
                  </span>

                  <span className="text-stone-600">
                    {item[`detail_${lang}`]}
                  </span>
                </div>
              ))}
            </div>
          </section>
        )}

        <section className="mb-12 rounded-3xl bg-[#1a1f2e] p-8 text-white shadow-sm">
          <h2 className="mb-4 text-3xl font-light">{t.finalCtaTitle}</h2>

          <p className="mb-6 max-w-2xl text-stone-300">{t.finalCtaText}</p>

          <Link
            href="https://wa.me/5551997783369"
            className="inline-block rounded-full bg-white px-6 py-4 text-sm text-stone-900 transition hover:bg-stone-200"
          >
            {t.finalCtaButton}
          </Link>
        </section>

        <section className="mb-12">
          <h2 className="mb-8 text-3xl font-light text-stone-800">
            {t.expertiseTitle}
          </h2>

          <article className="rounded-3xl bg-white p-8 shadow-sm">
            <h3 className="mb-4 text-2xl font-light text-stone-800">
              {t.founderTitle}
            </h3>
            <p className="leading-relaxed text-stone-600">{t.founderText}</p>
          </article>

          {page.sections && page.sections.length > 0 && (
            <div className="mt-8">
              <h3 className="mb-5 text-2xl font-light text-stone-800">
                {t.cmsTitle}
              </h3>

              <div className="space-y-6">
                {page.sections.map((section, index) => (
                  <article key={index} className="rounded-2xl bg-white p-6 shadow-sm">
                    <h4 className="mb-4 text-xl text-stone-800">
                      {section[`title_${lang}`]}
                    </h4>

                    <p className="whitespace-pre-line leading-relaxed text-stone-600">
                      {section[`text_${lang}`]}
                    </p>
                  </article>
                ))}
              </div>
            </div>
          )}
        </section>

        <section className="rounded-3xl bg-[#1a1f2e] p-8 text-white">
          <h2 className="mb-4 text-3xl font-light">{t.finalCtaTitle}</h2>

          <p className="mb-6 max-w-2xl text-stone-300">{t.finalCtaText}</p>

          <Link
            href="https://wa.me/5551997783369"
            className="inline-block rounded-full bg-white px-6 py-4 text-sm text-stone-900 transition hover:bg-stone-200"
          >
            {t.finalCtaButton}
          </Link>
        </section>
      </div>
    </main>
  );
}
