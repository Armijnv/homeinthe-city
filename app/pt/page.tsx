import type { Metadata } from "next";
import HomePage from "@/app/components/HomePage";

/* ======================================================
   HOMEPAGE METADATA / SEO
====================================================== */

export const metadata: Metadata = {
  title: {
    absolute: "Home in the City | Conexões Globais, Experiência Local",
  },
  description:
    "A Home in the City conecta viajantes de negócios, recém-chegados e visitantes internacionais a anfitriões locais, intérpretes, tradutores e especialistas da cidade.",

  keywords: [
    "apoio local global",
    "anfitriões locais",
    "apoio para viagem de negócios",
    "intérpretes e especialistas locais",
    "conexões locais confiáveis",
    "Home in the City",
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
    title: "Home in the City | Conexões Globais, Experiência Local",
    description:
      "Anfitriões locais, intérpretes, tradutores e especialistas da cidade para quem chega a lugares desconhecidos.",
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
