import Header from "./components/Header";
import Footer from "./components/Footer";
import { ClerkProvider } from "@clerk/nextjs";
import { JsonLdScript, organizationId, websiteId } from "@/app/lib/structuredData";
import type { CityGuideContent } from "@/app/lib/cityGuides";
import type { ProviderLanguageNavigationItem } from "@/app/lib/providerLanguages";
import { client } from "@/sanity/lib/client";
import {
  cityNavigationQuery,
  providerLanguageNavigationQuery,
} from "@/sanity/lib/queries";
import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";

const geist = Geist({ subsets: ["latin"] });
const siteUrl = "https://homeinthe.city";
const siteName = "Home in the City";
const defaultOgImage = `${siteUrl}/og-armijn2.jpg`;

const siteJsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebSite",
      "@id": websiteId,
      name: siteName,
      alternateName: "homeinthe.city",
      url: siteUrl,
      inLanguage: ["en", "pt-BR", "nl-NL"],
      publisher: {
        "@id": organizationId,
      },
      image: defaultOgImage,
    },
    {
      "@type": "Organization",
      "@id": organizationId,
      name: siteName,
      url: siteUrl,
      logo: `${siteUrl}/icon.png`,
      brand: {
        "@type": "Brand",
        name: siteName,
        url: siteUrl,
      },
      description:
        "Home in the City connects business travelers, newcomers and international visitors with trusted local hosts, interpreters, translators and city experts.",
      image: defaultOgImage,
    },
  ],
};

/* ======================================================
   GLOBAL METADATA / SEO
====================================================== */

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  applicationName: siteName,
  creator: siteName,
  publisher: siteName,
  manifest: "/manifest.webmanifest",

  title: {
    default: "Home in the City | Global Connections, Local Expertise",
    template: `%s | ${siteName}`,
  },

  description:
    "Home in the City connects business travelers, newcomers and international visitors with trusted local hosts, interpreters, translators and city experts.",

  openGraph: {
    title: `${siteName} | Global Connections, Local Expertise`,
    description:
      "Trusted local hosts, interpreters, translators and city experts for business travel, relocation, meetings and everyday life in unfamiliar places.",
    url: siteUrl,
    siteName,
    locale: "en_US",
    type: "website",
    images: [
      {
        url: defaultOgImage,
        width: 1200,
        height: 630,
        alt: "Home in the City",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    title: `${siteName} | Global Connections, Local Expertise`,
    description:
      "Trusted local hosts, interpreters, translators and city experts for business travel, relocation, meetings and everyday life in unfamiliar places.",
    images: [defaultOgImage],
  },
};

/* ======================================================
   ROOT LAYOUT
====================================================== */

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [cityGuides, providerLanguages] = await Promise.all([
    client.fetch<CityGuideContent[]>(cityNavigationQuery).catch(() => []),
    client
      .fetch<ProviderLanguageNavigationItem[]>(providerLanguageNavigationQuery)
      .catch(() => []),
  ]);

  return (
    <html lang="en">
      <head>
        <JsonLdScript data={siteJsonLd} />

        <meta
          name="google-site-verification"
          content="UP4h8B-BAThTU-bsGtY6i0ldvgdKuacyc6mMpZgi5Qk"
        />

        <meta
          name="msvalidate.01"
          content="9384E5E1766FDB69069141549D0C48D5"
        />
      </head>

      <body className={`${geist.className} bg-[#1a1f2e]`}>
        <ClerkProvider>
          {/* ======================================================
              HEADER
          ====================================================== */}

          <Header
            cityGuides={cityGuides}
            providerLanguages={providerLanguages}
          />

          {/* ======================================================
              PAGE CONTENT
          ====================================================== */}

          <main>{children}</main>

          {/* ======================================================
              FOOTER
          ====================================================== */}

          <Footer />
        </ClerkProvider>
      </body>
    </html>
  );
}
