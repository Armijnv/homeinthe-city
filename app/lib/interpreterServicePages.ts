import { interpreterHubServicePageSlug } from "@/app/lib/interpreterHub";
import { interpreterHubPaths } from "@/app/lib/interpreterRoutes";
import type { InterpreterLanguage } from "@/app/lib/interpreterTypes";

export type InterpreterServicePageKey = "brazil" | `city:${string}`;

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

const interpreterHubPage: InterpreterServicePageDefinition = {
  key: "brazil",
  title: "Interpreter services in Brazil",
  detail: "General Brazil interpreter page",
  servicePageSlug: interpreterHubServicePageSlug,
  languages: ["en", "pt", "nl"],
  paths: interpreterHubPaths,
};

export function interpreterServicePageForKey(key?: string) {
  return key === "brazil" ? interpreterHubPage : undefined;
}

export function interpreterServicePublicPath(
  page: InterpreterServicePageDefinition,
) {
  return page.paths.en || page.paths.pt || page.paths.nl || "/interpreters-brazil";
}
