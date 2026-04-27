"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";

export default function Header() {
  const pathname = usePathname();

  const title = pathname.includes("/brazil/porto-alegre")
    ? "in Porto Alegre"
    : "home in the city";

  return (
    <header className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-8 py-4 bg-white/90 backdrop-blur-sm border-b border-stone-100">
      <Link href="/" className="flex items-center gap-3">
        <Image
          src="/logo.png"
          alt="Home in the City logo"
          width={76}
          height={76}
        />

        <span className="text-stone-800 font-medium tracking-tight text-lg">
          {title}
        </span>
      </Link>

      <nav className="flex items-center gap-8 text-sm text-stone-500">
        <Link href="/brazil/porto-alegre" className="hover:text-stone-800 transition-colors">
          Porto Alegre
        </Link>
        <Link href="/brazil/porto-alegre/hosts" className="hover:text-stone-800 transition-colors">
          Hosts
        </Link>
        <Link href="/brazil/porto-alegre/stays" className="hover:text-stone-800 transition-colors">
          Stays
        </Link>
        <a href="https://wa.me/+5551997783369" target="_blank" className="hover:text-stone-800 transition-colors">
          Contact
        </a>
      </nav>
    </header>
  );
}