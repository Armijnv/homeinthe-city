import type { Metadata } from "next";
import TranslationServicesPage from "@/app/components/TranslationServicesPage";
import { JsonLdScript, serviceJsonLd } from "@/app/lib/structuredData";

const structuredData = serviceJsonLd({
  url: "https://homeinthe.city/nl/vertaaldiensten",
  name: "Home in the City vertaaldiensten",
  description:
    "Vertaaldiensten tussen Nederlands, Engels en Portugees met Luciana Graziuso, geverifieerde vertaler op Home in the City.",
  serviceType: [
    "Documentvertaling",
    "Vertaling Nederlands Portugees",
    "Vertaling Portugees Nederlands",
    "Vertaling Engels Portugees",
    "Vertaling Nederlands Engels",
  ],
  areaServed: {
    "@type": "Country",
    name: "Brazilië",
  },
  availableLanguage: ["nl", "en", "pt-BR"],
  inLanguage: "nl-NL",
});

export const metadata: Metadata = {
  title: "Vertaaldiensten",
  description:
    "Vertaaldiensten tussen Nederlands, Engels en Portugees met Luciana Graziuso, geverifieerde vertaler op Home in the City.",
  alternates: {
    canonical: "https://homeinthe.city/nl/vertaaldiensten",
    languages: {
      en: "https://homeinthe.city/translation-services",
      pt: "https://homeinthe.city/pt/servicos-de-traducao",
      nl: "https://homeinthe.city/nl/vertaaldiensten",
    },
  },
};

export default function Page() {
  return (
    <>
      <JsonLdScript data={structuredData} />
      <TranslationServicesPage lang="nl" />
    </>
  );
}
