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
    title: `${host?.headline_en || host?.name} | Interpreter in Porto Alegre`,
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
      images: [
        {
          url: host?.photo?.asset?.url || "/og-armijn2.jpg",
          width: 1200,
          height: 630,
        },
      ],
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

  return <HostPage lang="en" slug={slug} />;
}