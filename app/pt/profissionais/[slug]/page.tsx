import type { Metadata } from "next";
import ProviderPage, {
  type ProviderProfile,
} from "@/app/components/ProviderPage";
import { cleanMetadataTitle } from "@/app/lib/metadataTitle";
import { JsonLdScript, personJsonLd } from "@/app/lib/structuredData";
import { client } from "@/sanity/lib/client";
import { providerQuery } from "@/sanity/lib/queries";

const languageNames: Record<string, string> = {
  en: "Inglês",
  pt: "Português",
  nl: "Holandês",
  es: "Espanhol",
  de: "Alemão",
  fr: "Francês",
};

const roleNames: Record<string, string> = {
  host: "Anfitrião",
  interpreter: "Intérprete",
  translator: "Tradutor",
  guide: "Guia",
  specialist: "Especialista",
  realtor: "Corretor de imóveis",
};

function label(value?: string) {
  return value ? roleNames[value] || value : "";
}

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
    title:
      cleanMetadataTitle(provider?.headline_pt || provider?.name) ||
      "Profissional",
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

  const profileUrl = `https://homeinthe.city/pt/profissionais/${slug}`;
  const structuredData =
    provider &&
    personJsonLd({
      url: profileUrl,
      name: provider.name,
      role: label(provider.primaryRole),
      roles: provider.roles?.map(label),
      languages: provider.languages
        ?.map((language) =>
          language.language
            ? languageNames[language.language] || language.language
            : "",
        )
        .filter(Boolean),
      cities: provider.cities
        ?.map((city) => city.name_pt || city.name_en || city.name_nl || "")
        .filter(Boolean),
      image: provider.mainPhoto?.asset?.url,
      description: provider.intro_pt || provider.intro_en,
      inLanguage: "pt-BR",
    });

  return (
    <>
      {structuredData ? <JsonLdScript data={structuredData} /> : null}
      <ProviderPage lang="pt" slug={slug} provider={provider} />
    </>
  );
}
