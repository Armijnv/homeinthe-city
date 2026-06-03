import type { Metadata } from "next";
import TranslationServicesPage from "@/app/components/TranslationServicesPage";

export const metadata: Metadata = {
  title: "Vertaaldiensten | Home in the City",
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
  return <TranslationServicesPage lang="nl" />;
}
