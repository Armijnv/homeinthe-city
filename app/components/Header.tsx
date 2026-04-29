"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useState } from "react";

export default function Header() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const title = pathname.includes("/brazil/porto-alegre")
    ? "in Porto Alegre"
    : "home in the city";

  return (
    <header className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-8 py-4 bg-[#1a1f2e]">
      
      {/* Logo */}
      <Link href="/" className="flex items-center gap-3">
        <Image src="/logo.png" alt="Home in the City logo" width={64} height={64} />
        <span className="text-white font-medium tracking-tight text-lg">
          {title}
        </span>
      </Link>

      {/* Desktop nav */}
      <nav className="hidden md:flex items-center gap-8 text-sm text-white/70">
        {pathname !== "/brazil/porto-alegre" && (
          <Link href="/brazil/porto-alegre">Porto Alegre</Link>
        )}

        <Link href="/hosts/armijn" className="hover:text-white transition-colors">
          Your Host
        </Link>

        <a
          href="https://wa.me/+5551997783369"
          target="_blank"
          className="hover:text-white transition-colors"
        >
          Contact
        </a>
      </nav>

      {/* Mobile button */}
      <button
        onClick={() => setOpen(!open)}
        className="md:hidden flex flex-col gap-1"
      >
        <span className="w-6 h-[2px] bg-white"></span>
        <span className="w-6 h-[2px] bg-white"></span>
        <span className="w-6 h-[2px] bg-white"></span>
      </button>

      {/* Mobile menu */}
      {open && (
        <div className="absolute top-full left-0 w-full bg-[#1a1f2e] flex flex-col items-start p-6 gap-4 text-white">

          {pathname !== "/brazil/porto-alegre" && (
            <Link href="/brazil/porto-alegre" onClick={() => setOpen(false)}>
              Porto Alegre
            </Link>
          )}

          <Link href="/hosts/armijn" onClick={() => setOpen(false)}>
            Your Host
          </Link>

          <a
            href="https://wa.me/+5551997783369"
            target="_blank"
            onClick={() => setOpen(false)}
          >
            Contact
          </a>

        </div>
      )}
    </header>
  );
}