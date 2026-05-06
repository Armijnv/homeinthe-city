import type { Metadata } from "next";
import HomePage from "./components/HomePage";

/* ======================================================
   HOMEPAGE METADATA / SEO
====================================================== */

export const metadata: Metadata = {
  title: "Home in the City | Local Support for Business Visitors",
  description:
    "Local support for international business visitors in Porto Alegre. Interpreting, city guidance, restaurants, events and practical help on the ground.",

  alternates: {
    canonical: "https://homeinthe.city",
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
  return <HomePage lang="en" />;
}