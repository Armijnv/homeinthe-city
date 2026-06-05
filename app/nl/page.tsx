import type { Metadata } from "next";
import HomePage from "@/app/components/HomePage";

/* ======================================================
   HOMEPAGE METADATA / SEO
====================================================== */

export const metadata: Metadata = {
  title: "Business Tolk in Porto Alegre | Home in the City",
  description:
    "Business tolk in Porto Alegre voor meetings, bedrijfsbezoeken en lokale ondersteuning. Engels, Portugees en Nederlands tolken, met vertaling, wonen en lokale hulp wanneer nodig.",

  alternates: {
    canonical: "https://homeinthe.city/nl",
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
  return <HomePage lang="nl" />;
}
