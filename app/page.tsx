import type { Metadata } from "next";
import HomePage from "./components/HomePage";

/* ======================================================
   HOMEPAGE METADATA / SEO
====================================================== */

export const metadata: Metadata = {
  title: "Home in the City | Local Support, Interpreter & Housing in Porto Alegre",
  description:
    "Home in the City is a trusted local connection for foreigners, visitors, professionals and newcomers in Porto Alegre, with interpreting, translation, local hosting, furnished apartments, real estate help and city recommendations.",

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
