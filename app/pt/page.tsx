import type { Metadata } from "next";
import HomePage from "@/app/components/HomePage";

/* ======================================================
   HOMEPAGE METADATA / SEO
====================================================== */

export const metadata: Metadata = {
  title: "Intérprete de Negócios em Porto Alegre | Home in the City",
  description:
    "Intérprete de negócios em Porto Alegre para reuniões, visitas a empresas e apoio local. Interpretação em português, inglês e holandês, com tradução, moradia e ajuda local disponíveis quando necessário.",

  keywords: [
    "intérprete em Porto Alegre",
    "intérprete Porto Alegre",
    "apoio local Porto Alegre",
    "apartamentos mobiliados Porto Alegre",
    "imóveis Porto Alegre",
    "tradução inglês português holandês",
    "visitantes de negócios Porto Alegre",
    "intérprete inglês português",
    "intérprete holandês Brasil",
    "viagem de negócios Porto Alegre",
  ],

  alternates: {
    canonical: "https://homeinthe.city/pt",
    languages: {
      en: "https://homeinthe.city",
      pt: "https://homeinthe.city/pt",
      nl: "https://homeinthe.city/nl",
    },
  },

  openGraph: {
    title: "Intérprete de Negócios em Porto Alegre | Home in the City",
    description:
      "Interpretação de negócios, apoio local, tradução e moradia em Porto Alegre.",
    url: "https://homeinthe.city/pt",
    siteName: "Home in the City",
    locale: "pt_BR",
    type: "website",
  },
};

/* ======================================================
   HOMEPAGE
====================================================== */

export default function Page() {
  return <HomePage lang="pt" />;
}
