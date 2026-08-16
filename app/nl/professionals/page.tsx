import type { Metadata } from "next";
import ProviderListPage, {
  type ProviderListItem,
} from "@/app/components/ProviderListPage";
import { client } from "@/sanity/lib/client";
import { providerListQuery } from "@/sanity/lib/queries";

export const metadata: Metadata = {
  title: "Professionals Directory",
  description:
    "Gepubliceerde profielen van tolken, vertalers, hosts en lokale specialisten bij Home in the City.",
  alternates: {
    canonical: "https://homeinthe.city/nl/professionals",
    languages: {
      en: "https://homeinthe.city/providers",
      pt: "https://homeinthe.city/pt/profissionais",
      nl: "https://homeinthe.city/nl/professionals",
      "x-default": "https://homeinthe.city/providers",
    },
  },
  openGraph: { title: "Professionals Directory", description: "Gepubliceerde profielen van tolken, vertalers, hosts en lokale specialisten bij Home in the City.", url: "https://homeinthe.city/nl/professionals", siteName: "Home in the City", locale: "nl_NL", type: "website" },
  twitter: { card: "summary_large_image", title: "Professionals Directory", description: "Gepubliceerde profielen van tolken, vertalers, hosts en lokale specialisten bij Home in the City." },
};

export default async function Page() {
  const providers = await client.fetch<ProviderListItem[]>(providerListQuery);

  return <ProviderListPage lang="nl" providers={providers} />;
}
