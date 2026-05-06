import type { Metadata } from "next";
import HostPage from "@/app/components/HostPage";
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
  const host = await client.fetch(hostQuery, { slug });

  return {
    title: `${host?.headline_nl || host?.name} | Nederlandse tolk in Porto Alegre`,
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
      images: [
        {
          url: host?.photo?.asset?.url || "/og-armijn2.jpg",
          width: 1200,
          height: 630,
        },
      ],
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

  return <HostPage lang="nl" slug={slug} />;
}