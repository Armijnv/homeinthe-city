export type SpokenLanguageEntry = {
  language?: string;
};

export type ProviderLanguageNavigationItem = {
  slug?: string;
  languages?: SpokenLanguageEntry[];
};

type ContentLocale = "en" | "pt" | "nl";

const languageLabels: Record<ContentLocale, Record<string, string>> = {
  en: {
    en: "English",
    pt: "Portuguese",
    nl: "Dutch",
    es: "Spanish",
    de: "German",
    fr: "French",
  },
  pt: {
    en: "Inglês",
    pt: "Português",
    nl: "Holandês",
    es: "Espanhol",
    de: "Alemão",
    fr: "Francês",
  },
  nl: {
    en: "Engels",
    pt: "Portugees",
    nl: "Nederlands",
    es: "Spaans",
    de: "Duits",
    fr: "Frans",
  },
};

export function spokenLanguageCodes(
  languages: SpokenLanguageEntry[] | null | undefined,
) {
  if (!Array.isArray(languages)) return [];

  return Array.from(
    new Set(
      languages
        .map((entry) => entry.language)
        .filter((language): language is string => Boolean(language)),
    ),
  );
}

export function localizedSpokenLanguageNames(
  languages: SpokenLanguageEntry[] | null | undefined,
  locale: ContentLocale,
) {
  return spokenLanguageCodes(languages).map(
    (language) => languageLabels[locale][language] || language,
  );
}
