import type { InterpreterLanguage } from "@/app/lib/interpreterTypes";

export type CityInterpreterProvider = {
  _id: string;
  name?: string;
  slug?: { current?: string };
  roles?: string[];
  primaryRole?: string;
  languages?: Array<{ language?: string; services?: string[] }>;
  mainPhoto?: { alt?: string; asset?: { url?: string } };
};

export type CityInterpreterCoverage = {
  _id: string;
  _updatedAt?: string;
  name_en?: string;
  name_pt?: string;
  name_nl?: string;
  slug?: { current?: string };
  country?: string;
  primaryHost?: { _id?: string; name?: string; slug?: { current?: string }; status?: string; roles?: string[]; primaryRole?: string };
  interpreters?: CityInterpreterProvider[];
  servicePage?: { _id?: string; _rev?: string; _updatedAt?: string; slug?: { current?: string } };
};

export function cityInterpreterName(city: CityInterpreterCoverage, lang: InterpreterLanguage) {
  return city[`name_${lang}`] || city.name_en || city.name_pt || city.name_nl || "Untitled city";
}

export function interpreterLanguages(provider: CityInterpreterProvider) {
  return Array.from(
    new Set(
      (provider.languages || [])
        .map((entry) => entry.language)
        .filter((language): language is string => Boolean(language)),
    ),
  );
}

export function isPrimaryInterpreter(
  city: CityInterpreterCoverage,
  provider: CityInterpreterProvider,
) {
  return city.primaryHost?._id === provider._id;
}

export function cityInterpreterPath(citySlug: string, lang: InterpreterLanguage) {
  if (lang === "pt") return `/pt/interprete/${citySlug}`;
  if (lang === "nl") return `/nl/tolk/${citySlug}`;
  return `/interpreter/${citySlug}`;
}

export function hasInterpreterRole(provider: {
  roles?: string[];
  primaryRole?: string;
} | null | undefined) {
  return Boolean(
    provider &&
      (provider.primaryRole === "interpreter" || provider.roles?.includes("interpreter")),
  );
}
