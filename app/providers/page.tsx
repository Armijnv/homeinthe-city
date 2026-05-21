import type { Metadata } from "next";
import ProviderListPage, {
  type ProviderListItem,
} from "@/app/components/ProviderListPage";
import { client } from "@/sanity/lib/client";
import { providerListQuery } from "@/sanity/lib/queries";

export const metadata: Metadata = {
  title: "Providers | Home in the City",
  description:
    "Published profiles for interpreters, translators, hosts and local specialists in Porto Alegre.",
  alternates: {
    canonical: "https://homeinthe.city/providers",
    languages: {
      en: "https://homeinthe.city/providers",
      pt: "https://homeinthe.city/pt/profissionais",
      nl: "https://homeinthe.city/nl/professionals",
    },
  },
};

export default async function Page() {
  const providers = await client.fetch<ProviderListItem[]>(providerListQuery);

  return <ProviderListPage lang="en" providers={providers} />;
}
