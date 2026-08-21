export type AutomaticCityServiceLanguage = "en" | "pt" | "nl";

type ServicePresentation = {
  title?: string;
  description?: string;
  buttonLabel?: string;
};

const interpreterCopy = {
  en: {
    title: (cityName: string) => `Interpreter services in ${cityName}`,
    button: "Interpreter services",
  },
  pt: {
    title: (cityName: string) => `Serviços de intérprete em ${cityName}`,
    button: "Serviços de intérprete",
  },
  nl: {
    title: (cityName: string) => `Tolkdiensten in ${cityName}`,
    button: "Tolkdiensten",
  },
} satisfies Record<
  AutomaticCityServiceLanguage,
  { title: (cityName: string) => string; button: string }
>;

export function localizedAutomaticServiceValue<T>(
  value: string | undefined,
  fallback: T,
) {
  return value?.trim() || fallback;
}

export function automaticInterpreterServiceCopy({
  lang,
  cityName,
  presentation,
}: {
  lang: AutomaticCityServiceLanguage;
  cityName: string;
  presentation?: ServicePresentation;
}) {
  const fallback = interpreterCopy[lang];
  return {
    title: localizedAutomaticServiceValue(
      presentation?.title,
      fallback.title(cityName),
    ),
    description: presentation?.description?.trim(),
    button: localizedAutomaticServiceValue(
      presentation?.buttonLabel,
      fallback.button,
    ),
  };
}
