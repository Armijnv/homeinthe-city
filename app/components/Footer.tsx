"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Footer() {
  const pathname = usePathname();
  const lang = pathname.startsWith("/pt")
    ? "pt"
    : pathname.startsWith("/nl")
    ? "nl"
    : "en";

  const content = {
    en: {
      tagline: "Business interpreter in Porto Alegre · English, Portuguese & Dutch",
      cityHref: "/brazil/porto-alegre",
      cityLabel: "Interpreter Porto Alegre",
      forProviders: "For Providers",
      providerLogin: "Provider Login",
      copyright: "Business Interpreter Porto Alegre",
    },
    pt: {
      tagline: "Intérprete em Porto Alegre · Português, inglês e holandês",
      cityHref: "/pt/brasil/porto-alegre",
      cityLabel: "Intérprete em Porto Alegre",
      forProviders: "Para prestadores",
      providerLogin: "Login de prestador",
      copyright: "Intérprete em Porto Alegre",
    },
    nl: {
      tagline: "Tolk in Porto Alegre · Nederlands, Engels en Portugees",
      cityHref: "/nl/brazilie/porto-alegre",
      cityLabel: "Tolk Porto Alegre",
      forProviders: "Voor aanbieders",
      providerLogin: "Provider Login",
      copyright: "Tolk Porto Alegre",
    },
  };

  const t = content[lang];

  return (
    <footer className="relative z-30 bg-[#1a1f2e] px-6 py-4">
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-3 text-center text-xs text-stone-400 md:flex-row md:items-center md:justify-between md:text-left">
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
              {t.tagline}
            </p>
          </div>
        </div>

        <div className="flex flex-col items-center gap-1 md:items-end">
          <div className="flex flex-wrap justify-center gap-4 md:justify-end">
            <Link href={t.cityHref} className="hover:text-white">
              {t.cityLabel}
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

          <div className="flex items-center gap-2 border-t border-white/10 text-[11px]">
            <span className="uppercase tracking-wider text-stone-600">
              {t.forProviders}
            </span>

            <Link
              href="/dashboard"
              className="inline-flex min-h-11 items-center text-stone-500 transition hover:text-stone-300 md:min-h-0"
            >
              {t.providerLogin}
            </Link>
          </div>

          <span className="text-[11px] text-stone-600">
            © 2026 Home in the City · {t.copyright}
          </span>
        </div>
      </div>
    </footer>
  );
}
