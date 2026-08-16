import type { Metadata } from "next";
import ProviderListPage, {
  type ProviderListItem,
} from "@/app/components/ProviderListPage";
import { client } from "@/sanity/lib/client";
import { providerListQuery } from "@/sanity/lib/queries";

export const metadata: Metadata = {
  title: "Provider Directory",
  description:
    "Published profiles for interpreters, translators, hosts and local specialists on Home in the City.",
  alternates: {
    canonical: "https://homeinthe.city/providers",
    languages: {
      en: "https://homeinthe.city/providers",
      pt: "https://homeinthe.city/pt/profissionais",
      nl: "https://homeinthe.city/nl/professionals",
      "x-default": "https://homeinthe.city/providers",
    },
  },
  openGraph: { title: "Provider Directory", description: "Published profiles for interpreters, translators, hosts and local specialists on Home in the City.", url: "https://homeinthe.city/providers", siteName: "Home in the City", type: "website" },
  twitter: { card: "summary_large_image", title: "Provider Directory", description: "Published profiles for interpreters, translators, hosts and local specialists on Home in the City." },
};

export default async function Page() {
  const providers = await client.fetch<ProviderListItem[]>(providerListQuery);

  return <ProviderListPage lang="en" providers={providers} />;
}
