import type { Metadata } from "next";
import HomePage from "@/app/components/HomePage";

/* ======================================================
   HOMEPAGE METADATA / SEO
====================================================== */

export const metadata: Metadata = {
  title: "Home in the City | Lokale hulp, tolk en wonen in Porto Alegre",
  description:
    "Home in the City is een vertrouwde lokale verbinding voor buitenlanders, bezoekers, professionals en nieuwkomers in Porto Alegre, met tolken, vertaaldiensten, lokale hosting, gemeubileerde appartementen, vastgoedhulp en stadskennis.",

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
