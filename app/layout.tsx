import Header from "./components/Header";
import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";
import Link from "next/link";
import Image from "next/image";

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

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
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

        <footer className="relative z-30 bg-[#1a1f2e] px-6 py-4">
          <div className="mx-auto flex max-w-6xl flex-col items-center gap-3 text-center text-xs text-stone-400 md:flex-row md:items-center md:justify-between md:text-left">

            {/* FOOTER BRAND */}
            <div className="flex items-center gap-2">
              <Image
                src="/logo.png"
                alt="Home in the City logo"
                width={28}
                height={28}
                className="opacity-75"
              />

              <div>
                <p className="text-sm text-white">Home in the City</p>

                <p className="mt-0.5 hidden max-w-sm text-stone-500 sm:block">
                  Business interpreter in Porto Alegre · English, Portuguese & Dutch
                </p>
              </div>
            </div>

            {/* FOOTER LINKS */}
            <div className="flex flex-col items-center gap-1 md:items-end">
              <div className="flex flex-wrap justify-center gap-4 md:justify-end">
                <Link
                  href="/brazil/porto-alegre"
                  className="hover:text-white"
                >
                  Interpreter Porto Alegre
                </Link>

                <a
                  href="https://www.instagram.com/homeinthe.city/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white"
                >
                  Instagram
                </a>

                <a
                  href="https://wa.me/+5551997783369"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white"
                >
                  WhatsApp
                </a>
              </div>

              <span className="text-[11px] text-stone-600">
                © 2026 Home in the City · Business Interpreter Porto Alegre
              </span>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
