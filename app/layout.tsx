import Header from "./components/Header";
import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";
import Link from "next/link";
import Image from "next/image";

const geist = Geist({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: {
    default: "Home in the City",
    template: "%s | Home in the City",
  },
  description:
    "Your local guide and support for business visitors in cities across Brazil and beyond.",
};

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
      </head>

      <body className={`${geist.className} bg-[#1a1f2e]`}>
        <Header />

        <main>{children}</main>

        <footer className="bg-[#1a1f2e] px-6 py-12">
          <div className="mx-auto flex max-w-6xl flex-col items-center gap-8 text-center text-sm text-stone-400 md:flex-row md:items-end md:justify-between md:text-left">
            
            <div className="flex flex-col items-center gap-3 md:items-start">
              <Image
                src="/logo.png"
                alt="Home in the City logo"
                width={44}
                height={44}
                className="opacity-80"
              />

              <div>
                <p className="text-white">home in the city</p>
                <p className="mt-1 max-w-xs text-stone-500">
                  Local support for business visitors who want to feel at home.
                </p>
              </div>
            </div>

            <div className="flex flex-col items-center gap-4 md:items-end">
              <div className="flex flex-wrap justify-center gap-6 md:justify-end">
                <Link href="/brazil/porto-alegre" className="hover:text-white">
                  Porto Alegre
                </Link>
                <a
                  href="https://www.instagram.com/homeinthe.city/"
                  target="_blank"
                  className="hover:text-white"
                >
                  Instagram
                </a>
                <a
                  href="https://wa.me/+5551997783369"
                  target="_blank"
                  className="hover:text-white"
                >
                  WhatsApp
                </a>
              </div>

              <span className="text-xs text-stone-600">
                © 2026 home in the city
              </span>
            </div>

          </div>
        </footer>
      </body>
    </html>
  );
}