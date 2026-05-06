import type { Metadata } from "next";
import CityPage from "@/app/components/CityPage";

/* ======================================================
   CITY PAGE METADATA / SEO
====================================================== */

export const metadata: Metadata = {
  title: "Tolk in Porto Alegre | Nederlandse Zakelijke Ondersteuning",
  description:
    "Nederlandse tolk in Porto Alegre voor zakelijke bezoekers. Ondersteuning in Nederlands, Engels en Portugees bij meetings, bedrijfsbezoeken en lokale communicatie.",

  alternates: {
    canonical: "https://homeinthe.city/nl/brazilie/porto-alegre",
    languages: {
      en: "https://homeinthe.city/brazil/porto-alegre",
      pt: "https://homeinthe.city/pt/brasil/porto-alegre",
      nl: "https://homeinthe.city/nl/brazilie/porto-alegre",
    },
  },
};

/* ======================================================
   CITY PAGE
====================================================== */

export default function Page() {
  return <CityPage lang="nl" />;
}