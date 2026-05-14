import type { Metadata } from "next";
import HomePage from "./components/HomePage";

/* ======================================================
   HOMEPAGE METADATA / SEO
====================================================== */

export const metadata: Metadata = {
  title: "Home in the City | Business Interpreter in Porto Alegre",
  description:
    "Home in the City provides on-site business interpretation and local support in Porto Alegre. English, Portuguese and Dutch interpreter for meetings, factory visits and business travel in southern Brazil.",

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
