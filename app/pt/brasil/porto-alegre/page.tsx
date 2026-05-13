import type { Metadata } from "next";
import CityPage from "@/app/components/CityPage";

/* ======================================================
   PORTO ALEGRE PAGE METADATA / SEO
====================================================== */

export const metadata: Metadata = {
  title: "Intérprete em Porto Alegre | Apoio Local para Negócios",
  description:
    "Intérprete em Porto Alegre para visitantes de negócios. Apoio local em português, inglês e holandês para reuniões, visitas a empresas e comunicação na cidade.",

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
    <div className="relative">
      <div className="pointer-events-none fixed inset-0 -z-20 hidden bg-[url('/porto-alegre-desktop-background.jpg')] bg-cover bg-center md:block" />
      <div className="pointer-events-none fixed inset-0 -z-10 hidden bg-white/25 md:block" />

      <CityPage lang="pt" />
    </div>
  );
}
