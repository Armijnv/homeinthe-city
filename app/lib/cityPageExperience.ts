import type { CityGuideLang } from "@/app/lib/cityGuides";

export const cityPageExperienceFieldNames = [
  "aboutCardTitle",
  "aboutCardDescription",
  "livingCardTitle",
  "livingCardDescription",
  "exploreCardTitle",
  "exploreCardDescription",
  "favoritesCardTitle",
  "favoritesCardDescription",
  "aboutTitle",
  "livingTitle",
  "livingIntroduction",
  "livingBody",
  "exploreTitle",
  "exploreIntroduction",
  "favoritesTitle",
  "favoritesIntroduction",
  "fromHostIntroduction",
  "meetHostTitle",
  "meetHostIntroduction",
] as const;

export type CityPageExperienceField =
  (typeof cityPageExperienceFieldNames)[number];

export type CityPageExperienceLocale = Partial<
  Record<CityPageExperienceField, string>
>;

export type LivingServicePresentationLocale = {
  title?: string;
  description?: string;
  buttonLabel?: string;
};

export type CityPageExperienceImage = {
  _type?: string;
  alt?: string;
  asset?: { _type?: string; _ref?: string; url?: string };
  crop?: { top?: number; bottom?: number; left?: number; right?: number };
  hotspot?: { x?: number; y?: number; height?: number; width?: number };
};

export type LivingServicePresentation = Partial<
  Record<CityGuideLang, LivingServicePresentationLocale>
> & {
  image?: CityPageExperienceImage;
};

export type LivingServicePresentations = {
  interpreter?: LivingServicePresentation;
  realEstate?: LivingServicePresentation;
};

export type CityPageExperience = Partial<
  Record<CityGuideLang, CityPageExperienceLocale>
> & {
  livingServices?: LivingServicePresentations;
};

export const portoAlegreExperienceDefaults: Record<
  CityGuideLang,
  CityPageExperienceLocale
> = {
  en: {
    aboutCardTitle: "About the City",
    aboutCardDescription:
      "Culture, character, economy, neighborhoods and quality of life.",
    livingCardTitle: "Living & Working",
    livingCardDescription:
      "Business, housing, practical support, interpreter services and local assistance.",
    exploreCardTitle: "Explore the City",
    exploreCardDescription:
      "Maps, restaurants, attractions, articles and recommendations.",
    favoritesCardTitle: "Host's Favorites",
    favoritesCardDescription: "Personal recommendations from the local host.",
    aboutTitle: "About the City",
    livingTitle: "Living & Working",
    livingIntroduction:
      "Home in the City is a trusted local contact for business visits, practical questions and informed housing decisions.",
    exploreTitle: "Explore the City",
    exploreIntroduction:
      "Use the map and local guides to discover useful places and understand the city in context.",
    favoritesTitle: "Host's Favorites",
    favoritesIntroduction: "Personal recommendations from your local host.",
    meetHostTitle: "Meet Your Host",
  },
  pt: {
    aboutCardTitle: "Sobre a Cidade",
    aboutCardDescription:
      "Cultura, identidade, economia, bairros e qualidade de vida.",
    livingCardTitle: "Viver e Trabalhar",
    livingCardDescription:
      "Negócios, moradia, apoio prático, serviços de intérprete e assistência local.",
    exploreCardTitle: "Explore a Cidade",
    exploreCardDescription:
      "Mapas, restaurantes, atrações, artigos e recomendações.",
    favoritesCardTitle: "Favoritos do Anfitrião",
    favoritesCardDescription: "Recomendações pessoais do anfitrião local.",
    aboutTitle: "Sobre a Cidade",
    livingTitle: "Viver e Trabalhar",
    livingIntroduction:
      "A Home in the City é um contato local de confiança para visitas de negócios, dúvidas práticas e decisões informadas sobre moradia.",
    exploreTitle: "Explore a Cidade",
    exploreIntroduction:
      "Use o mapa e os guias locais para descobrir lugares úteis e entender a cidade em seu contexto.",
    favoritesTitle: "Favoritos do Anfitrião",
    favoritesIntroduction: "Recomendações pessoais do seu anfitrião local.",
    meetHostTitle: "Conheça Seu Anfitrião",
  },
  nl: {
    aboutCardTitle: "Over de Stad",
    aboutCardDescription:
      "Cultuur, karakter, economie, wijken en levenskwaliteit.",
    livingCardTitle: "Wonen & Werken",
    livingCardDescription:
      "Zakendoen, wonen, praktische hulp, tolkdiensten en lokale ondersteuning.",
    exploreCardTitle: "Ontdek de Stad",
    exploreCardDescription:
      "Kaarten, restaurants, bezienswaardigheden, artikelen en aanbevelingen.",
    favoritesCardTitle: "Favorieten van de Host",
    favoritesCardDescription: "Persoonlijke aanbevelingen van de lokale host.",
    aboutTitle: "Over de Stad",
    livingTitle: "Wonen & Werken",
    livingIntroduction:
      "Home in the City is een vertrouwd lokaal contact voor zakenbezoeken, praktische vragen en weloverwogen woonbeslissingen.",
    exploreTitle: "Ontdek de Stad",
    exploreIntroduction:
      "Gebruik de kaart en lokale gidsen om nuttige plekken te ontdekken en de stad in context te begrijpen.",
    favoritesTitle: "Favorieten van de Host",
    favoritesIntroduction: "Persoonlijke aanbevelingen van uw lokale host.",
    meetHostTitle: "Ontmoet Uw Host",
  },
};

export function portoAlegreExperienceLocale(
  experience: CityPageExperience | null | undefined,
  lang: CityGuideLang,
) {
  return experience
    ? experience[lang] || {}
    : portoAlegreExperienceDefaults[lang];
}
