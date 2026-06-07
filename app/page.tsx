import type { Metadata } from "next";
import HomePage from "./components/HomePage";

/* ======================================================
   HOMEPAGE METADATA / SEO
====================================================== */

export const metadata: Metadata = {
  title: {
    absolute: "Home in the City | Global Connections, Local Expertise",
  },
  description:
    "Home in the City connects business travelers, newcomers and international visitors with trusted local hosts, interpreters, translators and city experts in unfamiliar places.",

  alternates: {
    canonical: "https://homeinthe.city",
    languages: {
      en: "https://homeinthe.city",
      pt: "https://homeinthe.city/pt",
      nl: "https://homeinthe.city/nl",
    },
  },

  openGraph: {
    title: "Home in the City | Global Connections, Local Expertise",
    description:
      "Trusted local hosts, interpreters, translators and city experts for business travel, relocation, meetings and everyday life in unfamiliar places.",
    url: "https://homeinthe.city",
    siteName: "Home in the City",
    locale: "en_US",
    type: "website",
  },

  twitter: {
    card: "summary_large_image",
    title: "Home in the City | Global Connections, Local Expertise",
    description:
      "Trusted local hosts, interpreters, translators and city experts for business travel, relocation, meetings and everyday life in unfamiliar places.",
  },
};

/* ======================================================
   HOMEPAGE
====================================================== */

export default function Page() {
  return <HomePage lang="en" />;
}
