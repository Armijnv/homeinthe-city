import type { Metadata } from "next";
import ProviderPage, {
  type ProviderProfile,
} from "@/app/components/ProviderPage";
import { client } from "@/sanity/lib/client";
import { providerQuery } from "@/sanity/lib/queries";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const provider = await client.fetch<ProviderProfile | null>(providerQuery, {
    slug,
  });

  return {
    title: `${provider?.headline_nl || provider?.name || "Professional"} | Home in the City`,
    description:
      provider?.intro_nl ||
      "Publiek profiel voor tolken, vertalers, hosts en lokale specialisten.",
    alternates: {
      canonical: `https://homeinthe.city/nl/professionals/${slug}`,
      languages: {
        en: `https://homeinthe.city/providers/${slug}`,
        pt: `https://homeinthe.city/pt/profissionais/${slug}`,
        nl: `https://homeinthe.city/nl/professionals/${slug}`,
      },
    },
    openGraph: {
      title: provider?.headline_nl || provider?.name || "Professioneel profiel",
      description: provider?.intro_nl,
      url: `https://homeinthe.city/nl/professionals/${slug}`,
      siteName: "Home in the City",
      images: [
        {
          url: provider?.mainPhoto?.asset?.url || "/og-armijn2.jpg",
          width: 1200,
          height: 630,
        },
      ],
      locale: "nl_NL",
      type: "website",
    },
  };
}

export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const provider = await client.fetch<ProviderProfile | null>(providerQuery, {
    slug,
  });

  return <ProviderPage lang="nl" slug={slug} provider={provider} />;
}
