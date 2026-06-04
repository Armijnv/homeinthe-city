import type { Metadata } from "next";
import HomePage from "@/app/components/HomePage";

/* ======================================================
   HOMEPAGE METADATA / SEO
====================================================== */

export const metadata: Metadata = {
  title: "Home in the City | Apoio local, intérprete e moradia em Porto Alegre",
  description:
    "A Home in the City é uma conexão local de confiança para estrangeiros, visitantes, profissionais e recém-chegados em Porto Alegre, com interpretação, tradução, hospedagem local, apartamentos mobiliados, ajuda com imóveis e recomendações da cidade.",

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
    title: "Home in the City | Apoio local em Porto Alegre",
    description:
      "Interpretação, tradução, apartamentos mobiliados, imóveis e recomendações locais em Porto Alegre.",
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
