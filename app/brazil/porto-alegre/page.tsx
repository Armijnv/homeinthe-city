import type { Metadata } from "next";
import CityPage from "@/app/components/CityPage";

/* ======================================================
   PORTO ALEGRE PAGE METADATA / SEO
====================================================== */

export const metadata: Metadata = {
  title: "Porto Alegre Business Interpreter | Home in the City",
  description:
    "Business interpreter in Porto Alegre for meetings, factory visits and business travel. English, Portuguese and Dutch local support for international visitors in southern Brazil.",

  alternates: {
    canonical: "https://homeinthe.city/brazil/porto-alegre",
    languages: {
      en: "https://homeinthe.city/brazil/porto-alegre",
      pt: "https://homeinthe.city/pt/brasil/porto-alegre",
      nl: "https://homeinthe.city/nl/brazilie/porto-alegre",
    },
  },

  openGraph: {
    title: "Porto Alegre Business Interpreter | Home in the City",
    description:
      "On-site business interpreter in Porto Alegre. English, Portuguese and Dutch support for meetings, factory visits and local business coordination.",
    url: "https://homeinthe.city/brazil/porto-alegre",
    siteName: "Home in the City",
    locale: "en_US",
    type: "website",
  },
};

export default function Page() {
  return (
    <div className="relative isolate">
      <div className="pointer-events-none fixed inset-0 z-0 hidden bg-[url('/porto-alegre-desktop-background.jpg')] bg-cover bg-center md:block" />
      <div className="pointer-events-none fixed inset-0 z-0 hidden bg-white/25 md:block" />

      <CityPage lang="en" />
    </div>
  );
}
