import Header from "./components/Header";
import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";
import Link from "next/link";

const geist = Geist({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Home in the City",
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
      <body className={`${geist.className} bg-[#1a1f2e]`}>

        <Header />

        <main>
          {children}
        </main>

        {/* Footer */}
        <footer className="px-6 py-10 bg-[#1a1f2e]">
          <div className="max-w-6xl mx-auto flex flex-col items-center gap-6 text-sm text-stone-400 md:flex-row md:justify-between">
            
            {/* Left */}
            <span className="text-center md:text-left">
              © 2026 home in the city
            </span>

            {/* Links */}
            <div className="flex flex-col items-center gap-4 md:flex-row md:gap-6">
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

          </div>
        </footer>

      </body>
    </html>
  );
}