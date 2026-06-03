import type { Metadata } from "next";
import TranslationServicesPage from "@/app/components/TranslationServicesPage";

export const metadata: Metadata = {
  title: "Serviços de Tradução | Home in the City",
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
  return <TranslationServicesPage lang="pt" />;
}
