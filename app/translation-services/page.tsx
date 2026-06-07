import type { Metadata } from "next";
import TranslationServicesPage from "@/app/components/TranslationServicesPage";
import { JsonLdScript, serviceJsonLd } from "@/app/lib/structuredData";

const structuredData = serviceJsonLd({
  url: "https://homeinthe.city/translation-services",
  name: "Home in the City Translation Services",
  description:
    "English, Portuguese and Dutch document translation services with Luciana Graziuso, verified translator on Home in the City.",
  serviceType: [
    "Document translation",
    "English Portuguese translation",
    "Portuguese English translation",
    "Dutch Portuguese translation",
    "Dutch English translation",
  ],
  areaServed: {
    "@type": "Country",
    name: "Brazil",
  },
  availableLanguage: ["en", "pt-BR", "nl"],
  inLanguage: "en",
});

export const metadata: Metadata = {
  title: "Translation Services",
  description:
    "English, Portuguese and Dutch document translation services with Luciana Graziuso, verified translator on Home in the City.",
  alternates: {
    canonical: "https://homeinthe.city/translation-services",
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
      <TranslationServicesPage lang="en" />
    </>
  );
}
