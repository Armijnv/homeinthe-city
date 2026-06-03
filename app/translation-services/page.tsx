import type { Metadata } from "next";
import TranslationServicesPage from "@/app/components/TranslationServicesPage";

export const metadata: Metadata = {
  title: "Translation Services | Home in the City",
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
  return <TranslationServicesPage lang="en" />;
}
