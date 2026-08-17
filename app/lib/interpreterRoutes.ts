import type { InterpreterLanguage } from "@/app/lib/interpreterTypes";

export const interpreterHubPaths: Record<InterpreterLanguage, string> = {
  en: "/interpreters-brazil",
  pt: "/pt/interpretes-brasil",
  nl: "/nl/tolken-brazilie",
};

export function interpreterHubRoute(pathname: string) {
  return (Object.entries(interpreterHubPaths) as [InterpreterLanguage, string][])
    .find(([, path]) => path === pathname)?.[0];
}

export function cityInterpreterRoute(pathname: string) {
  const match =
    pathname.match(/^\/interpreter\/([^/]+)$/) ||
    pathname.match(/^\/pt\/interprete\/([^/]+)$/) ||
    pathname.match(/^\/nl\/tolk\/([^/]+)$/);
  if (!match) return undefined;

  return {
    citySlug: match[1],
    language: pathname.startsWith("/pt/")
      ? "pt"
      : pathname.startsWith("/nl/")
        ? "nl"
        : ("en" as InterpreterLanguage),
  };
}
