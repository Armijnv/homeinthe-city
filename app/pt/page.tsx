import type { Metadata } from "next";
import HomePage from "@/app/components/HomePage";

/* ======================================================
   HOMEPAGE METADATA / SEO
====================================================== */

export const metadata: Metadata = {
  title: "Home in the City | Apoio Local em Porto Alegre",
  description:
    "Apoio local para visitantes internacionais em Porto Alegre. Intérprete, orientação na cidade, restaurantes, eventos e ajuda prática para viagens de negócios.",

  alternates: {
    canonical: "https://homeinthe.city/pt",
    languages: {
      en: "https://homeinthe.city",
      pt: "https://homeinthe.city/pt",
      nl: "https://homeinthe.city/nl",
    },
  },
};

/* ======================================================
   HOMEPAGE
====================================================== */

export default function Page() {
  return <HomePage lang="pt" />;
}