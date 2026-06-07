import type { Metadata } from "next";
import HomePage from "@/app/components/HomePage";

/* ======================================================
   HOMEPAGE METADATA / SEO
====================================================== */

export const metadata: Metadata = {
  title: {
    absolute: "Home in the City | Wereldwijde Connecties, Lokale Expertise",
  },
  description:
    "Home in the City verbindt zakelijke reizigers, nieuwkomers en internationale bezoekers met vertrouwde lokale hosts, tolken, vertalers en stadsexperts.",

  alternates: {
    canonical: "https://homeinthe.city/nl",
    languages: {
      en: "https://homeinthe.city",
      pt: "https://homeinthe.city/pt",
      nl: "https://homeinthe.city/nl",
    },
  },

  openGraph: {
    title: "Home in the City | Wereldwijde Connecties, Lokale Expertise",
    description:
      "Vertrouwde lokale hosts, tolken, vertalers en stadsexperts voor zakenreizen, verhuizen, meetings en het dagelijks leven op onbekende plekken.",
    url: "https://homeinthe.city/nl",
    siteName: "Home in the City",
    locale: "nl_NL",
    type: "website",
  },
};

/* ======================================================
   HOMEPAGE
====================================================== */

export default function Page() {
  return <HomePage lang="nl" />;
}
