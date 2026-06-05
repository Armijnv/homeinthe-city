import type { Metadata } from "next";
import HomePage from "./components/HomePage";

/* ======================================================
   HOMEPAGE METADATA / SEO
====================================================== */

export const metadata: Metadata = {
  title: "Business Interpreter in Porto Alegre | Home in the City",
  description:
    "Business interpreter in Porto Alegre for meetings, factory visits and local support. English, Portuguese and Dutch interpreting, with translation, housing and city help available when needed.",

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
