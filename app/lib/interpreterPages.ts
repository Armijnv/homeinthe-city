import type { Metadata } from "next";
import { cleanMetadataTitle } from "@/app/lib/metadataTitle";
import { serviceJsonLd } from "@/app/lib/structuredData";

export type InterpreterLanguage = "en" | "pt" | "nl";
export type InterpreterCitySlug = "porto-alegre" | "florianopolis" | "sao-paulo";

type LocalizedText = Record<InterpreterLanguage, string>;
type LocalizedTextList = Record<InterpreterLanguage, string[]>;

export type InterpreterPageContent = {
  eyebrow: string;
  title: string;
  intro: string;
  serviceTitle: string;
  serviceIntro: string;
  services: { title: string; text: string }[];
  focusTitle: string;
  focusItems: { title: string; text: string }[];
  localTitle: string;
  localPoints: string[];
  providerTitle: string;
  providerRole: string;
  providerText: string;
  languagesTitle: string;
  pricingTitle: string;
  pricingNote: string;
  ctaTitle: string;
  ctaText: string;
  ctaButton: string;
  pricingButton: string;
  citiesTitle: string;
};

type InterpreterCity = {
  slug: InterpreterCitySlug;
  city: string;
  region: string;
  provider: string;
  providerSlug: string;
  languages: InterpreterLanguage[];
  paths: Partial<Record<InterpreterLanguage, string>>;
  seo: Record<InterpreterLanguage, { title: string; description: string; keywords: string[] }>;
  content: Partial<Record<InterpreterLanguage, InterpreterPageContent>>;
};

export type InterpreterCmsPage = {
  seoTitle_en?: string;
  seoTitle_pt?: string;
  seoTitle_nl?: string;
  seoDescription_en?: string;
  seoDescription_pt?: string;
  seoDescription_nl?: string;
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

const shared = {
  serviceTitles: {
    en: "Business support we provide",
    pt: "Apoio empresarial que oferecemos",
    nl: "Zakelijke ondersteuning die we bieden",
  },
  focusTitles: {
    en: "Local business focus",
    pt: "Foco empresarial local",
    nl: "Lokale zakelijke focus",
  },
  localTitles: {
    en: "Why work with local interpreter support?",
    pt: "Por que contar com apoio local de intérprete?",
    nl: "Waarom lokale tolkondersteuning?",
  },
  providerTitles: {
    en: "Your local professional",
    pt: "Seu profissional local",
    nl: "Uw lokale professional",
  },
  providerRoles: {
    en: "Featured local provider for Home in the City",
    pt: "Prestador local em destaque da Home in the City",
    nl: "Lokale provider van Home in the City",
  },
  providerTexts: {
    en: "Home in the City qualifies each inquiry, confirms availability and coordinates the right interpreter support. All contact stays with our central team while the local network grows.",
    pt: "A Home in the City qualifica cada solicitação, confirma a disponibilidade e coordena o apoio de intérprete adequado. Todo contato permanece com nossa equipe central enquanto a rede local cresce.",
    nl: "Home in the City beoordeelt elke aanvraag, bevestigt de beschikbaarheid en coördineert de juiste tolkhulp. Alle contact loopt via ons centrale team terwijl het lokale netwerk groeit.",
  },
  languageTitles: {
    en: "Available languages",
    pt: "Idiomas disponíveis",
    nl: "Beschikbare talen",
  },
  pricingTitles: { en: "Pricing", pt: "Preços", nl: "Tarieven" },
  pricingNotes: {
    en: "Pricing depends on the language pair, preparation, location, duration and travel requirements. Share the details for a tailored quote.",
    pt: "O preço depende do par de idiomas, preparação, local, duração e deslocamento. Envie os detalhes para receber uma proposta personalizada.",
    nl: "De prijs hangt af van de talencombinatie, voorbereiding, locatie, duur en reisvereisten. Deel de details voor een offerte op maat.",
  },
  ctaButtons: {
    en: "Message Home in the City",
    pt: "Falar com a Home in the City",
    nl: "Bericht Home in the City",
  },
  pricingButtons: { en: "See pricing", pt: "Ver preços", nl: "Bekijk tarieven" },
  citiesTitles: {
    en: "Interpreter services by city",
    pt: "Serviços de intérprete por cidade",
    nl: "Tolkdiensten per stad",
  },
} satisfies Record<string, LocalizedText>;

const commonServices = {
  en: [
    { title: "Business meetings", text: "Interpretation for introductions, negotiations, partner meetings, sales conversations and follow-up discussions." },
    { title: "Supplier and site visits", text: "Clear communication during supplier visits, inspections, demonstrations and operational conversations." },
    { title: "English–Portuguese interpretation", text: "Language support for visitors meeting Brazilian teams, clients, suppliers and professional advisers." },
    { title: "Local business coordination", text: "Practical help with schedules, transport, meeting locations, hotels and local business expectations." },
  ],
  pt: [
    { title: "Reuniões de negócios", text: "Interpretação para apresentações, negociações, reuniões com parceiros, conversas comerciais e acompanhamentos." },
    { title: "Visitas a fornecedores e locais", text: "Comunicação clara em visitas a fornecedores, inspeções, demonstrações e conversas operacionais." },
    { title: "Interpretação inglês–português", text: "Apoio no idioma para visitantes em contato com equipes, clientes, fornecedores e consultores brasileiros." },
    { title: "Coordenação empresarial local", text: "Ajuda prática com agenda, transporte, locais de reunião, hotéis e expectativas de negócios locais." },
  ],
  nl: [
    { title: "Zakelijke vergaderingen", text: "Tolken bij introducties, onderhandelingen, partnermeetings, verkoopgesprekken en opvolging." },
    { title: "Leveranciers- en locatiebezoeken", text: "Heldere communicatie tijdens leveranciersbezoeken, inspecties, demonstraties en operationele gesprekken." },
    { title: "Engels–Portugees tolken", text: "Taalondersteuning voor bezoekers die Braziliaanse teams, klanten, leveranciers en adviseurs ontmoeten." },
    { title: "Lokale zakelijke coördinatie", text: "Praktische hulp bij planning, vervoer, vergaderlocaties, hotels en lokale zakelijke verwachtingen." },
  ],
};

const localPoints: LocalizedTextList = {
  en: [
    "Brazilian business culture and meeting expectations.",
    "Local logistics, transportation and realistic travel times.",
    "Preparation before the meeting and practical follow-up afterwards.",
    "Support throughout the visit, not only sentence-by-sentence interpretation.",
  ],
  pt: [
    "Cultura empresarial brasileira e expectativas em reuniões.",
    "Logística local, transporte e tempos de deslocamento realistas.",
    "Preparação antes da reunião e acompanhamento prático depois.",
    "Apoio ao longo da visita, não apenas interpretação frase por frase.",
  ],
  nl: [
    "Braziliaanse zakelijke cultuur en verwachtingen rond meetings.",
    "Lokale logistiek, vervoer en realistische reistijden.",
    "Voorbereiding vóór de meeting en praktische opvolging erna.",
    "Ondersteuning tijdens het hele bezoek, niet alleen zin-voor-zin tolken.",
  ],
};

function pageContent(
  lang: InterpreterLanguage,
  input: Omit<
    InterpreterPageContent,
    | "serviceTitle"
    | "focusTitle"
    | "localTitle"
    | "providerTitle"
    | "providerRole"
    | "providerText"
    | "languagesTitle"
    | "pricingTitle"
    | "pricingNote"
    | "ctaButton"
    | "pricingButton"
    | "citiesTitle"
  >,
): InterpreterPageContent {
  return {
    ...input,
    serviceTitle: shared.serviceTitles[lang],
    focusTitle: shared.focusTitles[lang],
    localTitle: shared.localTitles[lang],
    providerTitle: shared.providerTitles[lang],
    providerRole: shared.providerRoles[lang],
    providerText: shared.providerTexts[lang],
    languagesTitle: shared.languageTitles[lang],
    pricingTitle: shared.pricingTitles[lang],
    pricingNote: shared.pricingNotes[lang],
    ctaButton: shared.ctaButtons[lang],
    pricingButton: shared.pricingButtons[lang],
    citiesTitle: shared.citiesTitles[lang],
  };
}

const portoAlegreContent = {
  en: pageContent("en", {
    eyebrow: "Interpreter services in Porto Alegre",
    title: "Business Interpreter in Porto Alegre",
    intro: "Home in the City provides business interpreter services in Porto Alegre and Rio Grande do Sul for meetings, factory visits, supplier conversations, technical explanations and local business coordination. Services are available in English, Portuguese and Dutch.",
    serviceIntro: "Language, local context and practical coordination work together to keep business visits productive before, during and after meetings.",
    services: commonServices.en,
    focusItems: [
      { title: "Manufacturing & industry", text: "Factory visits, production discussions, supplier meetings, quality control and technical explanations." },
      { title: "Agribusiness", text: "Farm visits, agricultural machinery, cooperatives, exporters and food-processing businesses." },
      { title: "Machinery & equipment", text: "Demonstrations, installation, maintenance, training and distributor meetings." },
      { title: "Trade shows & events", text: "Booth conversations, buyer meetings, networking and event logistics." },
    ],
    localPoints: localPoints.en,
    ctaTitle: "Plan interpreter support in Porto Alegre",
    ctaText: "Share the meeting type, language needs, dates and business context. Home in the City will qualify the request and coordinate availability.",
  }),
  pt: pageContent("pt", {
    eyebrow: "Serviços de intérprete em Porto Alegre",
    title: "Intérprete de negócios em Porto Alegre",
    intro: "A Home in the City oferece serviços de intérprete de negócios em Porto Alegre e no Rio Grande do Sul para reuniões, visitas a fábricas, conversas com fornecedores, explicações técnicas e coordenação empresarial local. O atendimento está disponível em inglês, português e holandês.",
    serviceIntro: "Idioma, contexto local e coordenação prática trabalham juntos para manter visitas de negócios produtivas antes, durante e depois das reuniões.",
    services: commonServices.pt,
    focusItems: [
      { title: "Indústria e manufatura", text: "Visitas a fábricas, produção, fornecedores, controle de qualidade e explicações técnicas." },
      { title: "Agronegócio", text: "Visitas a fazendas, máquinas agrícolas, cooperativas, exportadores e empresas de alimentos." },
      { title: "Máquinas e equipamentos", text: "Demonstrações, instalação, manutenção, treinamento e reuniões com distribuidores." },
      { title: "Feiras e eventos", text: "Conversas em estandes, reuniões com compradores, networking e logística de eventos." },
    ],
    localPoints: localPoints.pt,
    ctaTitle: "Planeje apoio de intérprete em Porto Alegre",
    ctaText: "Envie o tipo de reunião, idiomas, datas e contexto empresarial. A Home in the City qualificará a solicitação e coordenará a disponibilidade.",
  }),
  nl: pageContent("nl", {
    eyebrow: "Tolkdiensten in Porto Alegre",
    title: "Business tolk in Porto Alegre",
    intro: "Home in the City biedt zakelijke tolken in Porto Alegre en Rio Grande do Sul voor vergaderingen, fabrieksbezoeken, leveranciersgesprekken, technische uitleg en lokale zakelijke coördinatie. Diensten zijn beschikbaar in het Engels, Portugees en Nederlands.",
    serviceIntro: "Taal, lokale context en praktische coördinatie zorgen samen voor productieve zakenbezoeken vóór, tijdens en na meetings.",
    services: commonServices.nl,
    focusItems: [
      { title: "Productie en industrie", text: "Fabrieksbezoeken, productiegesprekken, leveranciersmeetings, kwaliteitscontrole en technische uitleg." },
      { title: "Agribusiness", text: "Boerderijbezoeken, landbouwmachines, coöperaties, exporteurs en voedselverwerkers." },
      { title: "Machines en apparatuur", text: "Demonstraties, installatie, onderhoud, training en distributeursmeetings." },
      { title: "Beurzen en events", text: "Standgesprekken, buyer meetings, netwerken en eventlogistiek." },
    ],
    localPoints: localPoints.nl,
    ctaTitle: "Plan tolkhulp in Porto Alegre",
    ctaText: "Deel het type meeting, de talen, data en zakelijke context. Home in the City beoordeelt de aanvraag en coördineert de beschikbaarheid.",
  }),
};

const florianopolisContent = {
  en: pageContent("en", {
    eyebrow: "Interpreter services in Florianópolis",
    title: "Business Interpreter in Florianópolis",
    intro: "Home in the City provides English–Portuguese interpreter support in Florianópolis and Santa Catarina for business meetings, property visits, technology companies, hospitality businesses and conversations with local suppliers.",
    serviceIntro: "Combine interpretation with practical local coordination for meetings across the island and the Greater Florianópolis area.",
    services: commonServices.en,
    focusItems: [
      { title: "Technology & remote work", text: "Startup meetings, software demonstrations, coworking visits and conversations with distributed teams." },
      { title: "Real estate & property visits", text: "Support during viewings and practical conversations with agents, owners and service providers." },
      { title: "Tourism & hospitality", text: "Meetings with hotels, restaurants, tour operators and other visitor-economy businesses." },
      { title: "Local suppliers", text: "Interpretation for sourcing, service-provider meetings, site visits and follow-up conversations." },
    ],
    localPoints: localPoints.en,
    ctaTitle: "Plan interpreter support in Florianópolis",
    ctaText: "Tell Home in the City about your meetings, property visits, dates and language needs. We will qualify the request and coordinate local availability.",
  }),
  pt: pageContent("pt", {
    eyebrow: "Serviços de intérprete em Florianópolis",
    title: "Intérprete de negócios em Florianópolis",
    intro: "A Home in the City oferece apoio de intérprete inglês–português em Florianópolis e Santa Catarina para reuniões de negócios, visitas a imóveis, empresas de tecnologia, negócios de turismo e hotelaria e conversas com fornecedores locais.",
    serviceIntro: "Combine interpretação e coordenação prática local para reuniões na ilha e na Grande Florianópolis.",
    services: commonServices.pt,
    focusItems: [
      { title: "Tecnologia e trabalho remoto", text: "Reuniões com startups, demonstrações de software, visitas a coworkings e equipes distribuídas." },
      { title: "Imóveis e visitas a propriedades", text: "Apoio em visitas e conversas práticas com corretores, proprietários e prestadores de serviços." },
      { title: "Turismo e hotelaria", text: "Reuniões com hotéis, restaurantes, operadoras e outros negócios ligados ao turismo." },
      { title: "Fornecedores locais", text: "Interpretação para compras, reuniões com prestadores, visitas técnicas e acompanhamentos." },
    ],
    localPoints: localPoints.pt,
    ctaTitle: "Planeje apoio de intérprete em Florianópolis",
    ctaText: "Conte à Home in the City sobre reuniões, visitas a imóveis, datas e idiomas. Qualificaremos a solicitação e coordenaremos a disponibilidade local.",
  }),
};

const saoPauloContent = {
  en: pageContent("en", {
    eyebrow: "Interpreter services in São Paulo",
    title: "Business Interpreter in São Paulo",
    intro: "Home in the City provides English–Portuguese interpreter support in São Paulo for corporate meetings, trade fairs, supplier visits, professional appointments and high-volume business travel.",
    serviceIntro: "São Paulo schedules move quickly. Interpretation and practical coordination help visitors keep meetings, transfers and follow-up conversations on track.",
    services: commonServices.en,
    focusItems: [
      { title: "Corporate meetings & trade fairs", text: "Interpretation for executive meetings, exhibitions, booth conversations, buyer meetings and networking." },
      { title: "Suppliers & site visits", text: "Support for sourcing meetings, inspections, demonstrations and operational discussions." },
      { title: "Finance, legal & real estate", text: "Language support in practical meetings with advisers, lawyers, financial professionals, agents and owners." },
      { title: "Airport, hotel & business coordination", text: "Help aligning arrivals, hotel meetings, transport and dense multi-meeting schedules." },
    ],
    localPoints: localPoints.en,
    ctaTitle: "Plan interpreter support in São Paulo",
    ctaText: "Share your meeting schedule, event, locations, dates and language needs. Home in the City will qualify the request and coordinate local availability.",
  }),
  pt: pageContent("pt", {
    eyebrow: "Serviços de intérprete em São Paulo",
    title: "Intérprete de negócios em São Paulo",
    intro: "A Home in the City oferece apoio de intérprete inglês–português em São Paulo para reuniões corporativas, feiras, visitas a fornecedores, compromissos profissionais e viagens de negócios com agenda intensa.",
    serviceIntro: "As agendas em São Paulo avançam rapidamente. Interpretação e coordenação prática ajudam a manter reuniões, deslocamentos e acompanhamentos organizados.",
    services: commonServices.pt,
    focusItems: [
      { title: "Reuniões corporativas e feiras", text: "Interpretação em reuniões executivas, exposições, estandes, encontros com compradores e networking." },
      { title: "Fornecedores e visitas técnicas", text: "Apoio em compras, inspeções, demonstrações e discussões operacionais." },
      { title: "Finanças, jurídico e imóveis", text: "Apoio no idioma em reuniões com consultores, advogados, profissionais financeiros, corretores e proprietários." },
      { title: "Coordenação de aeroporto, hotel e negócios", text: "Ajuda para alinhar chegadas, reuniões em hotéis, transporte e agendas com vários compromissos." },
    ],
    localPoints: localPoints.pt,
    ctaTitle: "Planeje apoio de intérprete em São Paulo",
    ctaText: "Envie sua agenda, evento, locais, datas e idiomas. A Home in the City qualificará a solicitação e coordenará a disponibilidade local.",
  }),
};

export const interpreterCities: Record<InterpreterCitySlug, InterpreterCity> = {
  "porto-alegre": {
    slug: "porto-alegre",
    city: "Porto Alegre",
    region: "Rio Grande do Sul",
    provider: "Armijn van Dijk",
    providerSlug: "armijn",
    languages: ["en", "pt", "nl"],
    paths: { en: "/interpreter-porto-alegre", pt: "/pt/interprete-porto-alegre", nl: "/nl/tolk-porto-alegre" },
    seo: {
      en: { title: "Business Interpreter in Porto Alegre", description: "Interpreter in Porto Alegre for business meetings, factory visits and local support during business trips in Brazil. English, Portuguese and Dutch.", keywords: ["interpreter Porto Alegre", "business interpreter Brazil", "English Portuguese interpreter", "Dutch interpreter Brazil"] },
      pt: { title: "Intérprete em Porto Alegre para Reuniões de Negócios", description: "Intérprete em Porto Alegre para reuniões, visitas industriais e apoio local em viagens corporativas. Português, inglês e holandês.", keywords: ["intérprete Porto Alegre", "intérprete inglês português", "visitas industriais Porto Alegre"] },
      nl: { title: "Nederlandse tolk in Porto Alegre voor zakelijke meetings", description: "Nederlandse tolk in Porto Alegre voor meetings, fabrieksbezoeken en zakenreizen in Brazilië. Engels, Portugees en Nederlands.", keywords: ["Nederlandse tolk Porto Alegre", "zakelijke tolk Brazilië", "Portugees Nederlands tolk"] },
    },
    content: portoAlegreContent,
  },
  florianopolis: {
    slug: "florianopolis",
    city: "Florianópolis",
    region: "Santa Catarina",
    provider: "Jon",
    providerSlug: "jon",
    languages: ["en", "pt"],
    paths: { en: "/interpreter-florianopolis", pt: "/pt/interprete-florianopolis" },
    seo: {
      en: { title: "Business Interpreter in Florianópolis", description: "English–Portuguese interpreter support in Florianópolis for technology meetings, property visits, hospitality businesses and local suppliers.", keywords: ["interpreter Florianópolis", "business interpreter Santa Catarina", "English Portuguese interpreter Florianópolis"] },
      pt: { title: "Intérprete de Negócios em Florianópolis", description: "Apoio de intérprete inglês–português em Florianópolis para tecnologia, visitas a imóveis, turismo, hotelaria e fornecedores locais.", keywords: ["intérprete Florianópolis", "intérprete inglês português Florianópolis", "intérprete Santa Catarina"] },
      nl: { title: "", description: "", keywords: [] },
    },
    content: florianopolisContent,
  },
  "sao-paulo": {
    slug: "sao-paulo",
    city: "São Paulo",
    region: "São Paulo",
    provider: "Claudia",
    providerSlug: "claudia",
    languages: ["en", "pt"],
    paths: { en: "/interpreter-sao-paulo", pt: "/pt/interprete-sao-paulo" },
    seo: {
      en: { title: "Business Interpreter in São Paulo", description: "English–Portuguese interpreter support in São Paulo for corporate meetings, trade fairs, suppliers and high-volume business travel.", keywords: ["interpreter São Paulo", "business interpreter São Paulo", "trade fair interpreter Brazil"] },
      pt: { title: "Intérprete de Negócios em São Paulo", description: "Apoio de intérprete inglês–português em São Paulo para reuniões corporativas, feiras, fornecedores e viagens de negócios.", keywords: ["intérprete São Paulo", "intérprete inglês português São Paulo", "intérprete para feiras São Paulo"] },
      nl: { title: "", description: "", keywords: [] },
    },
    content: saoPauloContent,
  },
};

export const homeInTheCityWhatsApp = "https://wa.me/5551997783369";

export const interpreterHubPaths: Record<InterpreterLanguage, string> = {
  en: "/interpreters-brazil",
  pt: "/pt/interpretes-brasil",
  nl: "/nl/tolken-brazilie",
};

export const interpreterHubSeo: Record<
  InterpreterLanguage,
  { title: string; description: string; keywords: string[] }
> = {
  en: {
    title: "Interpreter Services in Brazil | English, Portuguese and Dutch",
    description:
      "Business interpreter services in Brazil for meetings, supplier visits, trade fairs, real estate visits and local coordination in Porto Alegre, Florianópolis and São Paulo.",
    keywords: [
      "interpreter services Brazil",
      "business interpreter Brazil",
      "English Portuguese interpreter Brazil",
      "Dutch interpreter Brazil",
    ],
  },
  pt: {
    title: "Serviços de Intérprete no Brasil | Inglês, Português e Holandês",
    description:
      "Serviços de intérprete de negócios no Brasil para reuniões, fornecedores, feiras, visitas a imóveis e coordenação local em Porto Alegre, Florianópolis e São Paulo.",
    keywords: [
      "serviços de intérprete Brasil",
      "intérprete de negócios Brasil",
      "intérprete inglês português Brasil",
      "intérprete holandês Brasil",
    ],
  },
  nl: {
    title: "Tolkdiensten in Brazilië | Engels, Portugees en Nederlands",
    description:
      "Zakelijke tolken in Brazilië voor meetings, leveranciersbezoeken, beurzen, vastgoedbezoeken en lokale coördinatie in Porto Alegre, Florianópolis en São Paulo.",
    keywords: [
      "tolkdiensten Brazilië",
      "zakelijke tolk Brazilië",
      "Engels Portugees tolk Brazilië",
      "Nederlandse tolk Brazilië",
    ],
  },
};

export function interpreterHubAlternates() {
  return Object.fromEntries(
    Object.entries(interpreterHubPaths).map(([language, path]) => [
      language,
      `https://homeinthe.city${path}`,
    ]),
  );
}

export function interpreterHubMetadata(lang: InterpreterLanguage): Metadata {
  const path = interpreterHubPaths[lang];
  const seo = interpreterHubSeo[lang];
  const url = `https://homeinthe.city${path}`;

  return {
    title: seo.title,
    description: seo.description,
    keywords: seo.keywords,
    alternates: {
      canonical: url,
      languages: interpreterHubAlternates(),
    },
    openGraph: {
      title: seo.title,
      description: seo.description,
      url,
      siteName: "Home in the City",
      locale: lang === "pt" ? "pt_BR" : lang === "nl" ? "nl_NL" : "en_US",
      type: "website",
    },
  };
}

export function interpreterHubStructuredData(lang: InterpreterLanguage) {
  const url = `https://homeinthe.city${interpreterHubPaths[lang]}`;
  const seo = interpreterHubSeo[lang];

  return serviceJsonLd({
    url,
    name: seo.title,
    description: seo.description,
    image: "https://homeinthe.city/og-armijn2.jpg",
    serviceType: [
      "Business interpreter services in Brazil",
      "English Portuguese interpreter",
      "Dutch Portuguese interpreter",
      "Local business coordination",
    ],
    areaServed: {
      "@type": "Country",
      name: "Brazil",
    },
    availableLanguage: ["en", "pt-BR", "nl"],
    inLanguage: lang === "pt" ? "pt-BR" : lang === "nl" ? "nl-NL" : "en",
  });
}

export function interpreterHubRoute(pathname: string) {
  return (Object.entries(interpreterHubPaths) as [InterpreterLanguage, string][])
    .find(([, path]) => path === pathname)?.[0];
}

export function interpreterCity(slug: InterpreterCitySlug) {
  return interpreterCities[slug];
}

export function interpreterCityForSlug(slug?: string) {
  if (!slug) return undefined;

  return Object.values(interpreterCities).find((city) => city.slug === slug);
}

export function cityInterpreterPath(
  citySlug: string | undefined,
  lang: InterpreterLanguage,
) {
  return interpreterCityForSlug(citySlug)?.paths[lang];
}

export function interpreterAlternates(city: InterpreterCity) {
  return Object.fromEntries(
    city.languages.flatMap((language) => {
      const path = city.paths[language];
      return path ? [[language, `https://homeinthe.city${path}`]] : [];
    }),
  );
}

export function interpreterMetadata(
  city: InterpreterCity,
  lang: InterpreterLanguage,
  cmsPage?: InterpreterCmsPage | null,
): Metadata {
  const path = city.paths[lang];
  if (!path) throw new Error(`No ${lang} interpreter route configured for ${city.slug}`);
  const suffix = lang === "en" ? "en" : lang;
  const cmsTitle = cmsPage?.[`seoTitle_${suffix}`];
  const cmsDescription = cmsPage?.[`seoDescription_${suffix}`];

  return {
    title: cleanMetadataTitle(cmsTitle) || city.seo[lang].title,
    description: cmsDescription || city.seo[lang].description,
    keywords: city.seo[lang].keywords,
    alternates: {
      canonical: `https://homeinthe.city${path}`,
      languages: interpreterAlternates(city),
    },
  };
}

export function interpreterStructuredData(city: InterpreterCity, lang: InterpreterLanguage) {
  const path = city.paths[lang];
  if (!path) throw new Error(`No ${lang} interpreter route configured for ${city.slug}`);
  const url = `https://homeinthe.city${path}`;

  return serviceJsonLd({
    url,
    name: city.seo[lang].title,
    description: city.seo[lang].description,
    image: "https://homeinthe.city/og-armijn2.jpg",
    serviceType: [
      `Business interpreter in ${city.city}`,
      "English Portuguese interpreter",
      "Local business coordination",
    ],
    areaServed: {
      "@type": "AdministrativeArea",
      name: `${city.city}, ${city.region}`,
      addressCountry: "BR",
    },
    availableLanguage: city.languages.map((language) =>
      language === "pt" ? "pt-BR" : language,
    ),
    inLanguage: lang === "pt" ? "pt-BR" : lang === "nl" ? "nl-NL" : "en",
  });
}

export function interpreterRoute(pathname: string) {
  return Object.values(interpreterCities).flatMap((city) =>
    city.languages.flatMap((language) =>
      city.paths[language] === pathname ? [{ city, language }] : [],
    ),
  )[0];
}
