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
    title: `${provider?.headline_pt || provider?.name || "Profissional"} | Home in the City`,
    description:
      provider?.intro_pt ||
      "Perfil publico para interpretes, tradutores, anfitrioes e especialistas locais.",
    alternates: {
      canonical: `https://homeinthe.city/pt/profissionais/${slug}`,
      languages: {
        en: `https://homeinthe.city/providers/${slug}`,
        pt: `https://homeinthe.city/pt/profissionais/${slug}`,
        nl: `https://homeinthe.city/nl/professionals/${slug}`,
      },
    },
    openGraph: {
      title: provider?.headline_pt || provider?.name || "Perfil profissional",
      description: provider?.intro_pt,
      url: `https://homeinthe.city/pt/profissionais/${slug}`,
      siteName: "Home in the City",
      images: [
        {
          url: provider?.mainPhoto?.asset?.url || "/og-armijn2.jpg",
          width: 1200,
          height: 630,
        },
      ],
      locale: "pt_BR",
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

  return <ProviderPage lang="pt" slug={slug} provider={provider} />;
}
