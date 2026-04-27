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
    <header className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-8 py-4 bg-white/90 backdrop-blur-sm border-b border-stone-100 relative">
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

      <nav className="hidden md:flex items-center gap-8 text-sm text-stone-500">
        {pathname !== "/brazil/porto-alegre" && (
  <Link href="/brazil/porto-alegre" onClick={() => setOpen(false)}>
    Porto Alegre
  </Link>
)}
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

      <button
        onClick={() => setOpen(!open)}
        className="md:hidden flex flex-col gap-1"
      >
        <span className="w-6 h-[2px] bg-stone-800"></span>
        <span className="w-6 h-[2px] bg-stone-800"></span>
        <span className="w-6 h-[2px] bg-stone-800"></span>
      </button>

      {open && (
  <div className="absolute top-full left-0 w-full bg-white border-t border-stone-100 flex flex-col items-start p-6 gap-4 text-stone-700">

    {pathname !== "/brazil/porto-alegre" && (
      <Link href="/brazil/porto-alegre" onClick={() => setOpen(false)}>
        Porto Alegre
      </Link>
    )}

    <Link href="/brazil/porto-alegre/hosts" onClick={() => setOpen(false)}>
      Hosts
    </Link>

    <Link href="/brazil/porto-alegre/stays" onClick={() => setOpen(false)}>
      Stays
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