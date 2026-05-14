import type { Metadata } from "next";
import CityPage from "@/app/components/CityPage";

/* ======================================================
   PORTO ALEGRE PAGE METADATA / SEO
====================================================== */

export const metadata: Metadata = {
  title: "Intérprete em Porto Alegre | Home in the City",
  description:
    "Intérprete de negócios em Porto Alegre para reuniões, visitas a empresas e viagens corporativas. Apoio local em português, inglês e holandês para visitantes internacionais.",

  alternates: {
    canonical: "https://homeinthe.city/pt/brasil/porto-alegre",
    languages: {
      en: "https://homeinthe.city/brazil/porto-alegre",
      pt: "https://homeinthe.city/pt/brasil/porto-alegre",
      nl: "https://homeinthe.city/nl/brazilie/porto-alegre",
    },
  },

  openGraph: {
    title: "Intérprete em Porto Alegre | Home in the City",
    description:
      "Apoio local para visitantes de negócios em Porto Alegre. Português, inglês e holandês.",
    url: "https://homeinthe.city/pt/brasil/porto-alegre",
    siteName: "Home in the City",
    locale: "pt_BR",
    type: "website",
  },
};

/* ======================================================
   PORTO ALEGRE PAGE
====================================================== */

export default function Page() {
  return (
    <div className="relative isolate">
      <div className="pointer-events-none fixed inset-0 z-0 hidden bg-[url('/porto-alegre-desktop-background.jpg')] bg-cover bg-center md:block" />
      <div className="pointer-events-none fixed inset-0 z-0 hidden bg-white/25 md:block" />

      <CityPage lang="pt" />
    </div>
  );
}
