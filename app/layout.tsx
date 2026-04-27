import Header from "./components/Header";
import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";
import Link from "next/link";
import Image from "next/image";

const geist = Geist({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Home in the City",
  description: "Your local guide and support for business visitors in cities across Brazil and beyond.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={geist.className}>

        {/* Header — logo space reserved on left, nav on right */}
        <Header />

        {/* Page content */}
        <main className="pt-20">
          {children}
        </main>

        {/* Footer */}
        <footer className="border-t border-stone-100 py-8 px-8 mt-20">
          <div className="max-w-6xl mx-auto flex justify-between items-center text-sm text-stone-400">
            <span>© 2026 home in the city</span>
            <div className="flex gap-6">
              <Link href="/brazil/porto-alegre" className="hover:text-stone-700">Porto Alegre</Link>
              <a href="https://www.instagram.com/homeinthe.city/" target="_blank" className="hover:text-stone-700">Instagram</a>
              <a href="https://wa.me/+5551997783369" target="_blank" className="hover:text-stone-700">WhatsApp</a>
            </div>
          </div>
        </footer>

      </body>
    </html>
  );
}