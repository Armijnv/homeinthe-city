export type MapCategoryLang = "en" | "pt" | "nl";

export type MapCategoryPlace = {
  categoryPreset?: string;
  categoryLabel_en?: string;
  categoryLabel_pt?: string;
  categoryLabel_nl?: string;
};

export const mapCategoryPresets = [
  {
    id: "restaurant",
    labels: { en: "Restaurant", pt: "Restaurante", nl: "Restaurant" },
    aliases: ["restaurant", "restaurants", "restaurante", "restaurantes"],
  },
  {
    id: "cafe",
    labels: { en: "Café", pt: "Café", nl: "Café" },
    aliases: ["cafe", "cafes", "café", "cafés", "coffee"],
  },
  {
    id: "bakery",
    labels: { en: "Bakery", pt: "Padaria", nl: "Bakkerij" },
    aliases: ["bakery", "bakeries", "padaria", "padarias", "bakkerij", "bakkerijen"],
  },
  {
    id: "beach",
    labels: { en: "Beach", pt: "Praia", nl: "Strand" },
    aliases: ["beach", "beaches", "praia", "praias", "strand", "stranden"],
  },
  {
    id: "surfShop",
    labels: { en: "Surf Shop", pt: "Loja de Surf", nl: "Surfwinkel" },
    aliases: ["surf shop", "surf shops", "surfshop", "loja de surf", "surfwinkel"],
  },
  {
    id: "surfboardRepair",
    labels: {
      en: "Surfboard Repair",
      pt: "Conserto de Pranchas",
      nl: "Surfplank Reparatie",
    },
    aliases: [
      "surfboard repair",
      "surfboard repairs",
      "board repair",
      "conserto de pranchas",
      "surfplank reparatie",
    ],
  },
  {
    id: "organicMarket",
    labels: {
      en: "Organic Market",
      pt: "Feira Orgânica",
      nl: "Biologische Markt",
    },
    aliases: [
      "organic market",
      "organic markets",
      "organic fair",
      "organicfair",
      "feira organica",
      "feira orgânica",
      "biologische markt",
      "biologische markten",
    ],
  },
  {
    id: "coworking",
    labels: { en: "Coworking", pt: "Coworking", nl: "Coworking" },
    aliases: ["coworking", "coworking space", "coworking spaces"],
  },
  {
    id: "walk",
    labels: { en: "Walk", pt: "Caminhada", nl: "Wandeling" },
    aliases: ["walk", "walks", "caminhada", "caminhadas", "wandeling", "wandelingen"],
  },
  {
    id: "museum",
    labels: { en: "Museum", pt: "Museu", nl: "Museum" },
    aliases: ["museum", "museums", "museu", "museus", "musea"],
  },
  {
    id: "liveMusic",
    labels: { en: "Live Music", pt: "Música ao Vivo", nl: "Live Muziek" },
    aliases: [
      "live music",
      "livemusic",
      "music",
      "musica ao vivo",
      "música ao vivo",
      "live muziek",
    ],
  },
  {
    id: "businessService",
    labels: {
      en: "Business Service",
      pt: "Serviço Empresarial",
      nl: "Zakelijke Dienst",
    },
    aliases: [
      "business",
      "business service",
      "business services",
      "servico empresarial",
      "serviço empresarial",
      "zakelijke dienst",
      "zakelijke diensten",
    ],
  },
  {
    id: "yogaSchool",
    labels: { en: "Yoga School", pt: "Escola de Yoga", nl: "Yogaschool" },
    aliases: ["yoga", "yoga school", "yoga schools", "escola de yoga", "yogaschool"],
  },
] as const;

export function normalizeCategoryAlias(value?: string) {
  return (value || "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/([a-z])([A-Z])/g, "$1 $2")
    .replace(/[^a-zA-Z0-9]+/g, " ")
    .trim()
    .toLowerCase();
}

function slugifyCategory(value: string) {
  return normalizeCategoryAlias(value).replace(/\s+/g, "-") || "other";
}

function customCategoryLabel(place: MapCategoryPlace, lang: MapCategoryLang) {
  return (
    place[`categoryLabel_${lang}`] ||
    place.categoryLabel_en ||
    "Other"
  );
}

export function mapCategoryForPlace(place: MapCategoryPlace, lang: MapCategoryLang) {
  const preset = place.categoryPreset;

  if (preset && preset !== "custom") {
    const selectedPreset = mapCategoryPresets.find((category) => category.id === preset);

    if (selectedPreset) {
      return {
        id: selectedPreset.id,
        label: selectedPreset.labels[lang],
      };
    }
  }

  const label = customCategoryLabel(place, lang);

  return {
    id: `custom-${slugifyCategory(place.categoryLabel_en || label)}`,
    label,
  };
}
