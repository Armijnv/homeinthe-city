"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useState } from "react";

export default function Header() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const englishPath =
    pathname.includes("/pt/hosts/")
      ? pathname.replace("/pt/hosts", "/hosts")
      : pathname.includes("/nl/hosts/")
      ? pathname.replace("/nl/hosts", "/hosts")
      : pathname.includes("/pt/brasil/")
      ? pathname.replace("/pt/brasil", "/brazil")
      : pathname.includes("/nl/brazilie/")
      ? pathname.replace("/nl/brazilie", "/brazil")
      : pathname === "/pt" || pathname === "/nl"
      ? "/"
      : pathname;

  const portuguesePath =
    pathname.includes("/nl/hosts/")
      ? pathname.replace("/nl/hosts", "/pt/hosts")
      : pathname.includes("/hosts/")
      ? `/pt${pathname}`
      : pathname.includes("/nl/brazilie/")
      ? pathname.replace("/nl/brazilie", "/pt/brasil")
      : pathname.includes("/brazil/")
      ? `/pt${pathname.replace("/brazil", "/brasil")}`
      : pathname === "/"
      ? "/pt"
      : pathname === "/nl"
      ? "/pt"
      : pathname;

  const dutchPath =
    pathname.includes("/pt/hosts/")
      ? pathname.replace("/pt/hosts", "/nl/hosts")
      : pathname.includes("/hosts/")
      ? `/nl${pathname}`
      : pathname.includes("/pt/brasil/")
      ? pathname.replace("/pt/brasil", "/nl/brazilie")
      : pathname.includes("/brazil/")
      ? `/nl${pathname.replace("/brazil", "/brazilie")}`
      : pathname === "/"
      ? "/nl"
      : pathname === "/pt"
      ? "/nl"
      : pathname;

  return (
    <header className="fixed left-0 right-0 top-0 z-50 bg-[#1a1f2e] px-8 py-4">
      <div className="flex items-center justify-between">

        {/* ======================================================
            LOGO / BRAND
        ====================================================== */}

        <Link href="/" className="flex items-center gap-3">
          <Image
            src="/logo.png"
            alt="Home in the City logo"
            width={64}
            height={64}
            priority
          />

          <div className="flex flex-col">
            <span className="text-lg font-medium tracking-tight text-white">
              home in the city
            </span>

            <span className="hidden text-[10px] uppercase tracking-widest text-white/50 md:block">
              Your local guide · Wherever business takes you
            </span>
          </div>
        </Link>

        {/* ======================================================
            DESKTOP NAVIGATION
        ====================================================== */}

        <nav className="hidden items-center gap-8 text-sm text-white/70 md:flex">
          <Link
  href={
    pathname.startsWith("/pt")
      ? "/pt/brasil/porto-alegre"
      : pathname.startsWith("/nl")
      ? "/nl/brazilie/porto-alegre"
      : "/brazil/porto-alegre"
  }
  className="hover:text-white"
>
  Porto Alegre
</Link>

<Link
  href={
    pathname.startsWith("/pt")
      ? "/pt/hosts/armijn"
      : pathname.startsWith("/nl")
      ? "/nl/hosts/armijn"
      : "/hosts/armijn"
  }
  className="hover:text-white"
>
  Your Host
</Link>

          <a
            href="https://wa.me/+5551997783369"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-white"
          >
            Contact
          </a>

          {/* LANGUAGE FLAGS */}
          <div className="ml-2 flex items-center gap-2 text-lg">
            <Link href={englishPath} title="English">
              🇬🇧
            </Link>

            <Link href={portuguesePath} title="Português">
              🇧🇷
            </Link>

            <Link href={dutchPath} title="Nederlands">
              🇳🇱
            </Link>
          </div>
        </nav>

        {/* ======================================================
            MOBILE MENU
        ====================================================== */}

        <div className="relative md:hidden">

          <button
            onClick={() => setOpen(!open)}
            className="flex cursor-pointer flex-col gap-1"
          >
            <span className="h-[2px] w-6 bg-white"></span>
            <span className="h-[2px] w-6 bg-white"></span>
            <span className="h-[2px] w-6 bg-white"></span>
          </button>

          {open && (
            <nav className="absolute right-0 mt-6 flex w-52 flex-col gap-4 rounded-2xl bg-[#1a1f2e] p-5 text-white shadow-xl">

              <Link
  href={
    pathname.startsWith("/pt")
      ? "/pt/brasil/porto-alegre"
      : pathname.startsWith("/nl")
      ? "/nl/brazilie/porto-alegre"
      : "/brazil/porto-alegre"
  }
  onClick={() => setOpen(false)}
>
  Porto Alegre
</Link>

<Link
  href={
    pathname.startsWith("/pt")
      ? "/pt/hosts/armijn"
      : pathname.startsWith("/nl")
      ? "/nl/hosts/armijn"
      : "/hosts/armijn"
  }
  onClick={() => setOpen(false)}
>
  Your Host
</Link>

              <a
                href="https://wa.me/+5551997783369"
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setOpen(false)}
              >
                Contact
              </a>

              {/* LANGUAGE FLAGS */}
              <div className="flex gap-3 pt-2 text-xl">

                <Link
                  href={englishPath}
                  title="English"
                  onClick={() => setOpen(false)}
                >
                  🇬🇧
                </Link>

                <Link
                  href={portuguesePath}
                  title="Português"
                  onClick={() => setOpen(false)}
                >
                  🇧🇷
                </Link>

                <Link
                  href={dutchPath}
                  title="Nederlands"
                  onClick={() => setOpen(false)}
                >
                  🇳🇱
                </Link>

              </div>
            </nav>
          )}

        </div>
      </div>
    </header>
  );
}