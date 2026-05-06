import type { Metadata } from "next";
import HomePage from "@/app/components/HomePage";

/* ======================================================
   HOMEPAGE METADATA / SEO
====================================================== */

export const metadata: Metadata = {
  title: "Home in the City | Lokale Ondersteuning in Porto Alegre",
  description:
    "Lokale ondersteuning voor internationale zakenbezoekers in Porto Alegre. Tolkdiensten, stadsgidsen, restaurants, evenementen en praktische hulp ter plaatse.",

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