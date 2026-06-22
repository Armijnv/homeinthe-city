export type RecommendationGuideLang = "en" | "pt" | "nl";

export const recommendationGuideCategories = [
  {
    id: "localExperience",
    labels: {
      en: "Local Experience",
      pt: "Experiência Local",
      nl: "Lokale Ervaring",
    },
  },
  {
    id: "foodDrink",
    labels: { en: "Food & Drink", pt: "Comida e Bebida", nl: "Eten & Drinken" },
  },
  {
    id: "businessVisitor",
    labels: {
      en: "Business Visitor",
      pt: "Visitante a Negócios",
      nl: "Zakelijke Bezoeker",
    },
  },
  {
    id: "weekendGuide",
    labels: { en: "Weekend Guide", pt: "Guia de Fim de Semana", nl: "Weekendgids" },
  },
  {
    id: "walkingRoute",
    labels: { en: "Walking Route", pt: "Rota a Pé", nl: "Wandelroute" },
  },
  {
    id: "familyFriendly",
    labels: {
      en: "Family Friendly",
      pt: "Para Famílias",
      nl: "Gezinsvriendelijk",
    },
  },
  {
    id: "hiddenGems",
    labels: { en: "Hidden Gems", pt: "Tesouros Escondidos", nl: "Verborgen Parels" },
  },
] as const;

export type RecommendationGuideCategory =
  | (typeof recommendationGuideCategories)[number]["id"]
  | "custom";

type RecommendationCategorySource = {
  recommendationType?: string;
  customCategory_en?: string;
  customCategory_pt?: string;
  customCategory_nl?: string;
};

export function recommendationCategoryLabel(
  recommendation: RecommendationCategorySource,
  lang: RecommendationGuideLang,
) {
  if (recommendation.recommendationType === "custom") {
    return (
      recommendation[`customCategory_${lang}`] ||
      recommendation.customCategory_en ||
      "Local guide"
    );
  }

  const category = recommendationGuideCategories.find(
    (item) => item.id === recommendation.recommendationType,
  );

  return category?.labels[lang] || recommendationGuideCategories[0].labels[lang];
}

export function localizedRecommendationGuideText(
  recommendation: Record<string, unknown>,
  field: "title" | "introduction" | "content",
  lang: RecommendationGuideLang,
) {
  const localized = recommendation[`${field}_${lang}`];
  const english = recommendation[`${field}_en`];

  if (typeof localized === "string" && localized.trim()) return localized.trim();
  if (typeof english === "string" && english.trim()) return english.trim();

  return "";
}
