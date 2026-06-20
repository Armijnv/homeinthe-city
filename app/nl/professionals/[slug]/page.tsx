import type { Metadata } from "next";
import ProviderPage, {
  type ProviderProfile,
} from "@/app/components/ProviderPage";
import { cleanMetadataTitle } from "@/app/lib/metadataTitle";
import { JsonLdScript, personJsonLd } from "@/app/lib/structuredData";
import { client } from "@/sanity/lib/client";
import { providerQuery } from "@/sanity/lib/queries";

const languageNames: Record<string, string> = {
  en: "Engels",
  pt: "Portugees",
  nl: "Nederlands",
  es: "Spaans",
  de: "Duits",
  fr: "Frans",
};

const roleNames: Record<string, string> = {
  host: "Host",
  interpreter: "Tolk",
  translator: "Vertaler",
  guide: "Gids",
  specialist: "Specialist",
  realtor: "Makelaar",
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
      cleanMetadataTitle(provider?.headline_nl || provider?.name) ||
      "Professional",
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
      images: provider?.mainPhoto?.asset?.url
        ? [{ url: provider.mainPhoto.asset.url }]
        : undefined,
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

  const profileUrl = `https://homeinthe.city/nl/professionals/${slug}`;
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
        ?.map((city) => city.name_nl || city.name_en || city.name_pt || "")
        .filter(Boolean),
      image: provider.mainPhoto?.asset?.url,
      description: provider.intro_nl || provider.intro_en,
      inLanguage: "nl-NL",
    });

  return (
    <>
      {structuredData ? <JsonLdScript data={structuredData} /> : null}
      <ProviderPage lang="nl" slug={slug} provider={provider} />
    </>
  );
}
