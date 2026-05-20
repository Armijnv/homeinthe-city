import Header from "./components/Header";
import Footer from "./components/Footer";
import type { Metadata } from "next";
import { Geist } from "next/font/google";
import { headers } from "next/headers";
import "./globals.css";

const geist = Geist({ subsets: ["latin"] });

/* ======================================================
   GLOBAL METADATA / SEO
====================================================== */

export const metadata: Metadata = {
  metadataBase: new URL("https://homeinthe.city"),

  title: {
    default: "Interpreter Porto Alegre | Business Interpreter Brazil",
    template: "%s | Home in the City",
  },

  description:
    "On-site interpreter in Porto Alegre for business visitors. Meetings, factory visits, local support. English, Dutch, Portuguese.",

  openGraph: {
    title: "Home in the City | Business Interpreter in Porto Alegre",
    description:
      "Home in the City provides on-site business interpretation and local support in Porto Alegre for meetings, factory visits and business travel.",
    url: "https://homeinthe.city",
    siteName: "Home in the City",
    locale: "en_US",
    type: "website",
  },

  twitter: {
    card: "summary_large_image",
    title: "Home in the City | Business Interpreter in Porto Alegre",
    description:
      "On-site business interpreter in Porto Alegre. English, Portuguese and Dutch support for meetings, factory visits and business travel.",
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
      </body>
    </html>
  );
}
