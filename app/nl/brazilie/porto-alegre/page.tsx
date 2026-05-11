import type { Metadata } from "next";
import CityPage from "@/app/components/CityPage";

export const metadata: Metadata = {
  title: "Tolk in Porto Alegre | Nederlandse Zakelijke Ondersteuning",
  description:
    "Nederlandse tolk in Porto Alegre voor zakelijke bezoekers. Ondersteuning in Nederlands, Engels en Portugees bij meetings, bedrijfsbezoeken en lokale communicatie.",

  alternates: {
    canonical: "https://homeinthe.city/nl/brazilie/porto-alegre",
    languages: {
      en: "https://homeinthe.city/brazil/porto-alegre",
      pt: "https://homeinthe.city/pt/brasil/porto-alegre",
      nl: "https://homeinthe.city/nl/brazilie/porto-alegre",
    },
  },
};

export default function Page() {
  return (
    <div className="relative">
      <div className="pointer-events-none fixed inset-0 -z-20 hidden bg-[url('/porto-alegre-desktop-background.jpg')] bg-cover bg-center md:block" />
      <div className="pointer-events-none fixed inset-0 -z-10 hidden bg-white/25 md:block" />

      <CityPage lang="nl" />
    </div>
  );
}
