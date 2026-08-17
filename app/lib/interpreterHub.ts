import type { Metadata } from "next";
import { cleanMetadataTitle } from "@/app/lib/metadataTitle";
import { interpreterHubPaths } from "@/app/lib/interpreterRoutes";
import type { InterpreterCmsPage, InterpreterLanguage } from "@/app/lib/interpreterTypes";
import { serviceJsonLd } from "@/app/lib/structuredData";

export const homeInTheCityWhatsApp = "https://wa.me/5551997783369";
export const interpreterHubServicePageSlug = "interpreters-brazil";

export const interpreterHubSeo: Record<
  InterpreterLanguage,
  { title: string; description: string; keywords: string[] }
> = {
  en: {
    title: "Interpreter Services in Brazil | English, Portuguese and Dutch",
    description: "Business interpreter services in Brazil for meetings, supplier visits, trade fairs, real estate visits and local coordination.",
    keywords: ["interpreter services Brazil", "business interpreter Brazil", "English Portuguese interpreter Brazil", "Dutch interpreter Brazil"],
  },
  pt: {
    title: "Serviços de Intérprete no Brasil | Inglês, Português e Holandês",
    description: "Serviços de intérprete de negócios no Brasil para reuniões, fornecedores, feiras, visitas a imóveis e coordenação local.",
    keywords: ["serviços de intérprete Brasil", "intérprete de negócios Brasil", "intérprete inglês português Brasil"],
  },
  nl: {
    title: "Tolkdiensten in Brazilië | Engels, Portugees en Nederlands",
    description: "Zakelijke tolken in Brazilië voor meetings, leveranciersbezoeken, beurzen, vastgoedbezoeken en lokale coördinatie.",
    keywords: ["tolkdiensten Brazilië", "zakelijke tolk Brazilië", "Engels Portugees tolk Brazilië"],
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

export function interpreterHubMetadata(
  lang: InterpreterLanguage,
  cmsPage?: InterpreterCmsPage | null,
): Metadata {
  const url = `https://homeinthe.city${interpreterHubPaths[lang]}`;
  const seo = interpreterHubSeo[lang];
  const title = cleanMetadataTitle(cmsPage?.[`seoTitle_${lang}`]) || seo.title;
  const description = cmsPage?.[`seoDescription_${lang}`] || seo.description;

  return {
    title,
    description,
    keywords: seo.keywords,
    alternates: { canonical: url, languages: interpreterHubAlternates() },
    openGraph: {
      title,
      description,
      url,
      siteName: "Home in the City",
      locale: lang === "pt" ? "pt_BR" : lang === "nl" ? "nl_NL" : "en_US",
      type: "website",
    },
  };
}

export function interpreterHubStructuredData(lang: InterpreterLanguage) {
  const seo = interpreterHubSeo[lang];
  return serviceJsonLd({
    url: `https://homeinthe.city${interpreterHubPaths[lang]}`,
    name: seo.title,
    description: seo.description,
    image: "https://homeinthe.city/og-armijn2.jpg",
    serviceType: ["Business interpreter services in Brazil", "English Portuguese interpreter", "Dutch Portuguese interpreter", "Local business coordination"],
    areaServed: { "@type": "Country", name: "Brazil" },
    availableLanguage: ["en", "pt-BR", "nl"],
    inLanguage: lang === "pt" ? "pt-BR" : lang === "nl" ? "nl-NL" : "en",
  });
}
