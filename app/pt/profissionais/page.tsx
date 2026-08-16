import type { Metadata } from "next";
import ProviderListPage, {
  type ProviderListItem,
} from "@/app/components/ProviderListPage";
import { client } from "@/sanity/lib/client";
import { providerListQuery } from "@/sanity/lib/queries";

export const metadata: Metadata = {
  title: "Diretório de Profissionais",
  description:
    "Perfis publicados de intérpretes, tradutores, anfitriões e especialistas locais da Home in the City.",
  alternates: {
    canonical: "https://homeinthe.city/pt/profissionais",
    languages: {
      en: "https://homeinthe.city/providers",
      pt: "https://homeinthe.city/pt/profissionais",
      nl: "https://homeinthe.city/nl/professionals",
      "x-default": "https://homeinthe.city/providers",
    },
  },
  openGraph: { title: "Diretório de Profissionais", description: "Perfis publicados de intérpretes, tradutores, anfitriões e especialistas locais da Home in the City.", url: "https://homeinthe.city/pt/profissionais", siteName: "Home in the City", locale: "pt_BR", type: "website" },
  twitter: { card: "summary_large_image", title: "Diretório de Profissionais", description: "Perfis publicados de intérpretes, tradutores, anfitriões e especialistas locais da Home in the City." },
};

export default async function Page() {
  const providers = await client.fetch<ProviderListItem[]>(providerListQuery);

  return <ProviderListPage lang="pt" providers={providers} />;
}
