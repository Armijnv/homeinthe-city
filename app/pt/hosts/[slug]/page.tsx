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
    title: `${host?.headline_pt || host?.name} | Intérprete em Porto Alegre`,
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
      images: [
        {
          url: host?.photo?.asset?.url || "/og-armijn2.jpg",
          width: 1200,
          height: 630,
        },
      ],
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

  return <HostPage lang="pt" slug={slug} />;
}