import type { Metadata } from "next";
import ProviderListPage, {
  type ProviderListItem,
} from "@/app/components/ProviderListPage";
import { client } from "@/sanity/lib/client";
import { providerListQuery } from "@/sanity/lib/queries";

export const metadata: Metadata = {
  title: "Profissionais | Home in the City",
  description:
    "Perfis publicados de interpretes, tradutores, anfitrioes e especialistas locais em Porto Alegre.",
  alternates: {
    canonical: "https://homeinthe.city/pt/profissionais",
    languages: {
      en: "https://homeinthe.city/providers",
      pt: "https://homeinthe.city/pt/profissionais",
      nl: "https://homeinthe.city/nl/professionals",
    },
  },
};

export default async function Page() {
  const providers = await client.fetch<ProviderListItem[]>(providerListQuery);

  return <ProviderListPage lang="pt" providers={providers} />;
}
