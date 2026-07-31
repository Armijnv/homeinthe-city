import type { Metadata } from "next";
import { notFound, permanentRedirect } from "next/navigation";
import HostPage from "@/app/components/HostPage";
import type { Host } from "@/app/components/HostPage";
import { cleanMetadataTitle } from "@/app/lib/metadataTitle";
import { localizedSpokenLanguageNames } from "@/app/lib/providerLanguages";
import { JsonLdScript, personJsonLd } from "@/app/lib/structuredData";
import { client } from "@/sanity/lib/client";
import { hostQuery } from "@/sanity/lib/queries";

/* ======================================================
   DYNAMIC SEO METADATA
====================================================== */

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;

  if (slug === "armijn") permanentRedirect("/nl/professionals/armijn");

  const host = await client.fetch(hostQuery, { slug });

  if (!host) notFound();

  return {
    title: `${cleanMetadataTitle(host?.headline_nl || host?.name) || "Host"} | Nederlandse tolk in Porto Alegre`,
    description:
      host?.intro_nl ||
      "Nederlandse tolk in Porto Alegre voor zakelijke bezoekers. Ondersteuning in Nederlands, Engels en Portugees voor meetings en bedrijfsbezoeken.",

    alternates: {
      canonical: `https://homeinthe.city/nl/hosts/${slug}`,
      languages: {
        en: `https://homeinthe.city/hosts/${slug}`,
        pt: `https://homeinthe.city/pt/hosts/${slug}`,
        nl: `https://homeinthe.city/nl/hosts/${slug}`,
      },
    },

    openGraph: {
      title: host?.headline_nl || host?.name,
      description: host?.intro_nl,
      url: `https://homeinthe.city/nl/hosts/${slug}`,
      siteName: "Home in the City",
      images: host?.photo?.asset?.url
        ? [{ url: host.photo.asset.url }]
        : undefined,
      locale: "nl_NL",
      type: "website",
    },
  };
}

/* ======================================================
   HOST PAGE
====================================================== */

export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  if (slug === "armijn") permanentRedirect("/nl/professionals/armijn");

  const host = await client.fetch<Host | null>(hostQuery, { slug });

  if (!host) notFound();

  const structuredData = personJsonLd({
    url: `https://homeinthe.city/nl/hosts/${slug}`,
    name: host.name || host.headline_nl,
    role: "Lokale host en tolk",
    roles: ["Lokale host", "Tolk", "Gids"],
    languages: localizedSpokenLanguageNames(host.languages, "nl"),
    cities: host.cities
      ?.map((city) => city.name_nl || city.name_en || city.name_pt || "")
      .filter(Boolean),
    image: host.photo?.asset?.url,
    description: host.intro_nl,
    inLanguage: "nl-NL",
  });

  return (
    <>
      <JsonLdScript data={structuredData} />
      <HostPage lang="nl" slug={slug} host={host} />
    </>
  );
}
