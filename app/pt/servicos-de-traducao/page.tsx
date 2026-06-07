import type { Metadata } from "next";
import TranslationServicesPage from "@/app/components/TranslationServicesPage";
import { JsonLdScript, serviceJsonLd } from "@/app/lib/structuredData";

const structuredData = serviceJsonLd({
  url: "https://homeinthe.city/pt/servicos-de-traducao",
  name: "Serviços de tradução da Home in the City",
  description:
    "Serviços de tradução entre português, inglês e holandês com Luciana Graziuso, tradutora verificada no Home in the City.",
  serviceType: [
    "Tradução de documentos",
    "Tradução português inglês",
    "Tradução inglês português",
    "Tradução holandês português",
    "Tradução holandês inglês",
  ],
  areaServed: {
    "@type": "Country",
    name: "Brasil",
  },
  availableLanguage: ["pt-BR", "en", "nl"],
  inLanguage: "pt-BR",
});

export const metadata: Metadata = {
  title: "Serviços de Tradução",
  description:
    "Serviços de tradução entre português, inglês e holandês com Luciana Graziuso, tradutora verificada no Home in the City.",
  alternates: {
    canonical: "https://homeinthe.city/pt/servicos-de-traducao",
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
      <TranslationServicesPage lang="pt" />
    </>
  );
}
