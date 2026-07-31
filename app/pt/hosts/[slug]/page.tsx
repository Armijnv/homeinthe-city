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

  if (slug === "armijn") permanentRedirect("/pt/profissionais/armijn");

  const host = await client.fetch(hostQuery, { slug });

  if (!host) notFound();

  return {
    title: `${cleanMetadataTitle(host?.headline_pt || host?.name) || "Host"} | Intérprete em Porto Alegre`,
    description:
      host?.intro_pt ||
      "Intérprete em Porto Alegre para visitantes de negócios. Suporte em inglês, holandês e português para reuniões e visitas empresariais.",

    alternates: {
      canonical: `https://homeinthe.city/pt/hosts/${slug}`,
      languages: {
        en: `https://homeinthe.city/hosts/${slug}`,
        pt: `https://homeinthe.city/pt/hosts/${slug}`,
        nl: `https://homeinthe.city/nl/hosts/${slug}`,
      },
    },

    openGraph: {
      title: host?.headline_pt || host?.name,
      description: host?.intro_pt,
      url: `https://homeinthe.city/pt/hosts/${slug}`,
      siteName: "Home in the City",
      images: host?.photo?.asset?.url
        ? [{ url: host.photo.asset.url }]
        : undefined,
      locale: "pt_BR",
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

  if (slug === "armijn") permanentRedirect("/pt/profissionais/armijn");

  const host = await client.fetch<Host | null>(hostQuery, { slug });

  if (!host) notFound();

  const structuredData = personJsonLd({
    url: `https://homeinthe.city/pt/hosts/${slug}`,
    name: host.name || host.headline_pt,
    role: "Anfitrião local e intérprete",
    roles: ["Anfitrião local", "Intérprete", "Guia"],
    languages: localizedSpokenLanguageNames(host.languages, "pt"),
    cities: host.cities
      ?.map((city) => city.name_pt || city.name_en || city.name_nl || "")
      .filter(Boolean),
    image: host.photo?.asset?.url,
    description: host.intro_pt,
    inLanguage: "pt-BR",
  });

  return (
    <>
      <JsonLdScript data={structuredData} />
      <HostPage lang="pt" slug={slug} host={host} />
    </>
  );
}
