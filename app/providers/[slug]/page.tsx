import type { Metadata } from "next";
import ProviderPage, {
  type ProviderProfile,
} from "@/app/components/ProviderPage";
import { cleanMetadataTitle } from "@/app/lib/metadataTitle";
import { JsonLdScript, personJsonLd } from "@/app/lib/structuredData";
import { client } from "@/sanity/lib/client";
import { providerQuery } from "@/sanity/lib/queries";

const languageNames: Record<string, string> = {
  en: "English",
  pt: "Portuguese",
  nl: "Dutch",
  es: "Spanish",
  de: "German",
  fr: "French",
};

function label(value?: string) {
  if (!value) return "";
  return value
    .split(/[-_\s]+/)
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
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
    title: cleanMetadataTitle(provider?.headline_en || provider?.name) || "Provider",
    description:
      provider?.intro_en ||
      "Public provider profile for interpreters, translators, hosts and local specialists.",
    alternates: {
      canonical: `https://homeinthe.city/providers/${slug}`,
      languages: {
        en: `https://homeinthe.city/providers/${slug}`,
        pt: `https://homeinthe.city/pt/profissionais/${slug}`,
        nl: `https://homeinthe.city/nl/professionals/${slug}`,
      },
    },
    openGraph: {
      title: provider?.headline_en || provider?.name || "Provider profile",
      description: provider?.intro_en,
      url: `https://homeinthe.city/providers/${slug}`,
      siteName: "Home in the City",
      images: [
        {
          url: provider?.mainPhoto?.asset?.url || "/og-armijn2.jpg",
          width: 1200,
          height: 630,
        },
      ],
      locale: "en_US",
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

  const profileUrl = `https://homeinthe.city/providers/${slug}`;
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
            ? languageNames[language.language] || label(language.language)
            : "",
        )
        .filter(Boolean),
      cities: provider.cities
        ?.map((city) => city.name_en || city.name_pt || city.name_nl || "")
        .filter(Boolean),
      image: provider.mainPhoto?.asset?.url,
      description: provider.intro_en,
      inLanguage: "en",
    });

  return (
    <>
      {structuredData ? <JsonLdScript data={structuredData} /> : null}
      <ProviderPage lang="en" slug={slug} provider={provider} />
    </>
  );
}
