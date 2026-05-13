import type { Metadata } from "next";
import HomePage from "@/app/components/HomePage";

/* ======================================================
   HOMEPAGE METADATA / SEO
====================================================== */

export const metadata: Metadata = {
  title: "Intérprete em Porto Alegre | Apoio Local para Visitantes de Negócios",
  description:
    "Intérprete em Porto Alegre para visitantes de negócios. Apoio local em português, inglês e holandês para reuniões, visitas a empresas, deslocamentos, restaurantes e orientação na cidade.",

  keywords: [
    "intérprete em Porto Alegre",
    "intérprete Porto Alegre",
    "apoio local Porto Alegre",
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
    title: "Intérprete em Porto Alegre | Home in the City",
    description:
      "Apoio local para visitantes de negócios em Porto Alegre. Português, inglês e holandês.",
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
