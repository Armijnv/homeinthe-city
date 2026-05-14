import type { Metadata } from "next";
import CityPage from "@/app/components/CityPage";

export const metadata: Metadata = {
  title: "Tolk Porto Alegre | Home in the City",
  description:
    "Zakelijke tolk in Porto Alegre voor meetings, bedrijfsbezoeken en zakenreizen. Ondersteuning in Nederlands, Engels en Portugees voor internationale bezoekers in Zuid-Brazilië.",

  alternates: {
    canonical: "https://homeinthe.city/nl/brazilie/porto-alegre",
    languages: {
      en: "https://homeinthe.city/brazil/porto-alegre",
      pt: "https://homeinthe.city/pt/brasil/porto-alegre",
      nl: "https://homeinthe.city/nl/brazilie/porto-alegre",
    },
  },

  openGraph: {
    title: "Tolk Porto Alegre | Home in the City",
    description:
      "Nederlandse zakelijke ondersteuning in Porto Alegre. Nederlands, Engels en Portugees.",
    url: "https://homeinthe.city/nl/brazilie/porto-alegre",
    siteName: "Home in the City",
    locale: "nl_NL",
    type: "website",
  },
};

export default function Page() {
  return (
    <div className="relative isolate">
      <div className="pointer-events-none fixed inset-0 z-0 hidden bg-[url('/porto-alegre-desktop-background.jpg')] bg-cover bg-center md:block" />
      <div className="pointer-events-none fixed inset-0 z-0 hidden bg-white/25 md:block" />

      <CityPage lang="nl" />
    </div>
  );
}
