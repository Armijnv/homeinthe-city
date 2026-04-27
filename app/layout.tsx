import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";
import Link from "next/link";

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
        <header className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-8 py-4 bg-white/90 backdrop-blur-sm border-b border-stone-100">
          
          {/* Logo area — symbol + wordmark will go here */}
          <Link href="/" className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-stone-100 flex items-center justify-center text-stone-400 text-xs">
              {/* symbol placeholder */}
            </div>
            <span className="text-stone-800 font-medium tracking-tight text-lg">
              home in the city
            </span>
          </Link>

          {/* Nav */}
          <nav className="flex items-center gap-8 text-sm text-stone-500">
            <Link href="/brazil/porto-alegre" className="hover:text-stone-800 transition-colors">Porto Alegre</Link>
            <Link href="/brazil/porto-alegre/hosts" className="hover:text-stone-800 transition-colors">Hosts</Link>
            <Link href="/brazil/porto-alegre/stays" className="hover:text-stone-800 transition-colors">Stays</Link>
            <a href="https://wa.me/+5551997783369" target="_blank" className="hover:text-stone-800 transition-colors">Contact</a>
          </nav>

        </header>

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