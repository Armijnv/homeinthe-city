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

  if (slug === "armijn") permanentRedirect("/providers/armijn");

  const host = await client.fetch(hostQuery, { slug });

  if (!host) notFound();

  return {
    title: `${cleanMetadataTitle(host?.headline_en || host?.name) || "Host"} | Interpreter in Porto Alegre`,
    description:
      host?.intro_en ||
      "On-site interpreter in Porto Alegre for business visitors. English, Dutch and Portuguese support for meetings and company visits.",

    alternates: {
      canonical: `https://homeinthe.city/hosts/${slug}`,
      languages: {
        en: `https://homeinthe.city/hosts/${slug}`,
        pt: `https://homeinthe.city/pt/hosts/${slug}`,
        nl: `https://homeinthe.city/nl/hosts/${slug}`,
      },
    },

    openGraph: {
      title: host?.headline_en || host?.name,
      description: host?.intro_en,
      url: `https://homeinthe.city/hosts/${slug}`,
      siteName: "Home in the City",
      images: host?.photo?.asset?.url
        ? [{ url: host.photo.asset.url }]
        : undefined,
      locale: "en_US",
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

  if (slug === "armijn") permanentRedirect("/providers/armijn");

  const host = await client.fetch<Host | null>(hostQuery, { slug });

  if (!host) notFound();

  const structuredData = personJsonLd({
    url: `https://homeinthe.city/hosts/${slug}`,
    name: host.name || host.headline_en,
    role: "Local host and interpreter",
    roles: ["Local host", "Interpreter", "Guide"],
    languages: localizedSpokenLanguageNames(host.languages, "en"),
    cities: host.cities
      ?.map((city) => city.name_en || city.name_pt || city.name_nl || "")
      .filter(Boolean),
    image: host.photo?.asset?.url,
    description: host.intro_en,
    inLanguage: "en",
  });

  return (
    <>
      <JsonLdScript data={structuredData} />
      <HostPage lang="en" slug={slug} host={host} />
    </>
  );
}
