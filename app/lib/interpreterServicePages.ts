import {
  interpreterCities,
  interpreterHubPaths,
  interpreterHubServicePageSlug,
  type InterpreterCitySlug,
  type InterpreterLanguage,
} from "@/app/lib/interpreterPages";

export type InterpreterServicePageKey = "brazil" | InterpreterCitySlug | `city:${string}`;

export type InterpreterServicePageDefinition = {
  key: InterpreterServicePageKey;
  title: string;
  detail: string;
  citySlug?: string;
  cityId?: string;
  primaryHostId?: string;
  servicePageSlug: string;
  languages: InterpreterLanguage[];
  paths: Partial<Record<InterpreterLanguage, string>>;
};

export const interpreterServicePages: InterpreterServicePageDefinition[] = [
  {
    key: "brazil",
    title: "Interpreter services in Brazil",
    detail: "General Brazil interpreter page",
    servicePageSlug: interpreterHubServicePageSlug,
    languages: ["en", "pt", "nl"],
    paths: interpreterHubPaths,
  },
  ...Object.values(interpreterCities).map((city) => ({
    key: city.slug,
    title: `Interpreter services in ${city.city}`,
    detail: `${city.city}, ${city.region}`,
    citySlug: city.slug,
    servicePageSlug: city.servicePageSlug,
    languages: city.languages,
    paths: city.paths,
  })),
];

export function interpreterServicePageForKey(key?: string) {
  return interpreterServicePages.find((page) => page.key === key);
}

export function interpreterServicePublicPath(
  page: InterpreterServicePageDefinition,
) {
  return page.paths.en || page.paths.pt || page.paths.nl || "/interpreters-brazil";
}
