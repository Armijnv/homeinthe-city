import Header from "./components/Header";
import Footer from "./components/Footer";
import { ClerkProvider } from "@clerk/nextjs";
import type { Metadata } from "next";
import { Geist } from "next/font/google";
import { headers } from "next/headers";
import "./globals.css";

const geist = Geist({ subsets: ["latin"] });
const siteUrl = "https://homeinthe.city";
const siteName = "Home in the City";

const siteJsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebSite",
      "@id": `${siteUrl}/#website`,
      name: siteName,
      alternateName: "homeinthe.city",
      url: siteUrl,
      inLanguage: ["en", "pt-BR", "nl-NL"],
      publisher: {
        "@id": `${siteUrl}/#organization`,
      },
    },
    {
      "@type": "Organization",
      "@id": `${siteUrl}/#organization`,
      name: siteName,
      url: siteUrl,
      logo: `${siteUrl}/icon.png`,
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

  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/icon.png", type: "image/png", sizes: "512x512" },
      { url: "/favicon-32x32.png", type: "image/png", sizes: "32x32" },
      { url: "/favicon-16x16.png", type: "image/png", sizes: "16x16" },
    ],
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180" }],
  },

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
  },

  twitter: {
    card: "summary_large_image",
    title: `${siteName} | Global Connections, Local Expertise`,
    description:
      "Trusted local hosts, interpreters, translators and city experts for business travel, relocation, meetings and everyday life in unfamiliar places.",
  },
};

/* ======================================================
   ROOT LAYOUT
====================================================== */

function getDocumentLang(pathname: string) {
  if (pathname.startsWith("/pt")) return "pt-BR";
  if (pathname.startsWith("/nl")) return "nl-NL";
  return "en";
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const requestHeaders = await headers();
  const pathname = requestHeaders.get("x-homeinthecity-pathname") || "/";

  return (
    <html lang={getDocumentLang(pathname)}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(siteJsonLd).replace(/</g, "\\u003c"),
          }}
        />

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

          <Header />

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
