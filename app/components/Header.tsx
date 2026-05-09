"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";

export default function Header() {
  const pathname = usePathname();

  /* ======================================================
     LANGUAGE
  ====================================================== */

  const lang = pathname.startsWith("/pt")
    ? "pt"
    : pathname.startsWith("/nl")
    ? "nl"
    : "en";

  const labels = {
    en: {
      interpreter: "Interpreter",
      host: "Your Host",
      contact: "Contact",
      tagline: "Your local guide · Wherever business takes you",
    },
    pt: {
      interpreter: "Intérprete",
      host: "Seu anfitrião",
      contact: "Contato",
      tagline: "Seu apoio local · Onde os negócios levarem você",
    },
    nl: {
      interpreter: "Tolk",
      host: "Uw host",
      contact: "Contact",
      tagline: "Je lokale gids · Waar je zakenreis je ook brengt",
    },
  };

  const t = labels[lang];

  const homePath = lang === "pt" ? "/pt" : lang === "nl" ? "/nl" : "/";

  /* ======================================================
     LANGUAGE PATHS
  ====================================================== */

  const englishPath =
    pathname === "/pt/interprete-porto-alegre"
      ? "/interpreter-porto-alegre"
      : pathname === "/nl/tolk-porto-alegre"
      ? "/interpreter-porto-alegre"
      : pathname.includes("/pt/hosts/")
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
    pathname === "/interpreter-porto-alegre"
      ? "/pt/interprete-porto-alegre"
      : pathname === "/nl/tolk-porto-alegre"
      ? "/pt/interprete-porto-alegre"
      : pathname.includes("/nl/hosts/")
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
    pathname === "/interpreter-porto-alegre"
      ? "/nl/tolk-porto-alegre"
      : pathname === "/pt/interprete-porto-alegre"
      ? "/nl/tolk-porto-alegre"
      : pathname.includes("/pt/hosts/")
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

  const portoAlegrePath = pathname.startsWith("/pt")
    ? "/pt/brasil/porto-alegre"
    : pathname.startsWith("/nl")
    ? "/nl/brazilie/porto-alegre"
    : "/brazil/porto-alegre";

  const hostPath = pathname.startsWith("/pt")
    ? "/pt/hosts/armijn"
    : pathname.startsWith("/nl")
    ? "/nl/hosts/armijn"
    : "/hosts/armijn";

  const interpreterPath = pathname.startsWith("/pt")
    ? "/pt/interprete-porto-alegre"
    : pathname.startsWith("/nl")
    ? "/nl/tolk-porto-alegre"
    : "/interpreter-porto-alegre";

  /* ======================================================
     MENU CLOSE
  ====================================================== */

  function closeMenuOnLinkClick(event: React.MouseEvent<HTMLDetailsElement>) {
    const target = event.target as HTMLElement;

    if (target.closest("a")) {
      event.currentTarget.removeAttribute("open");
    }
  }

  return (
    <header className="fixed left-0 right-0 top-0 z-50 bg-[#1a1f2e] px-8 py-4">
      <div className="flex items-center justify-between">
        {/* ======================================================
            LOGO / BRAND
        ====================================================== */}

        <Link href={homePath} className="flex items-center gap-3">
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
              {t.tagline}
            </span>
          </div>
        </Link>

        {/* ======================================================
            DESKTOP NAVIGATION
        ====================================================== */}

        <nav className="hidden items-center gap-8 text-sm text-white/70 md:flex">
          <Link href={portoAlegrePath} className="hover:text-white">
            Porto Alegre
          </Link>

          <Link href={interpreterPath} className="hover:text-white">
            {t.interpreter}
          </Link>

          <Link href={hostPath} className="hover:text-white">
            {t.host}
          </Link>

          <a
            href="https://wa.me/+5551997783369"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-white"
          >
            {t.contact}
          </a>

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
            MOBILE MENU - SAFER NATIVE VERSION
        ====================================================== */}

        <details
          className="relative md:hidden"
          onClick={closeMenuOnLinkClick}
        >
          <summary className="flex cursor-pointer list-none flex-col gap-1 [&::-webkit-details-marker]:hidden">
            <span className="h-[2px] w-6 bg-white"></span>
            <span className="h-[2px] w-6 bg-white"></span>
            <span className="h-[2px] w-6 bg-white"></span>
          </summary>

          <nav className="absolute right-0 mt-6 flex w-52 flex-col gap-4 rounded-2xl bg-[#1a1f2e] p-5 text-white shadow-xl">
            <Link href={portoAlegrePath}>Porto Alegre</Link>

            <Link href={interpreterPath}>{t.interpreter}</Link>

            <Link href={hostPath}>{t.host}</Link>

            <a
              href="https://wa.me/+5551997783369"
              target="_blank"
              rel="noopener noreferrer"
            >
              {t.contact}
            </a>

            <div className="flex gap-3 pt-2 text-xl">
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
        </details>
      </div>
    </header>
  );
}