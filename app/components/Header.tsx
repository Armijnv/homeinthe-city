import Link from "next/link";
import Image from "next/image";

export default function Header() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-[#1a1f2e] px-8 py-4">
      <div className="flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3">
          <Image
            src="/logo.png"
            alt="Home in the City logo"
            width={64}
            height={64}
            priority
          />

          <div className="flex flex-col">
            <span className="text-white font-medium tracking-tight text-lg">
              home in the city
            </span>

            <span className="hidden md:block text-[10px] text-white/50 tracking-widest uppercase">
              Your local guide · Wherever business takes you
            </span>
          </div>
        </Link>

        <nav className="hidden md:flex items-center gap-8 text-sm text-white/70">
          <Link href="/brazil/porto-alegre" className="hover:text-white">
            Porto Alegre
          </Link>
          <Link href="/hosts/armijn" className="hover:text-white">
            Your Host
          </Link>
          <a
            href="https://wa.me/+5551997783369"
            target="_blank"
            className="hover:text-white"
          >
            Contact
          </a>
        </nav>

        <details className="relative md:hidden">
          <summary className="flex cursor-pointer list-none flex-col gap-1">
            <span className="w-6 h-[2px] bg-white"></span>
            <span className="w-6 h-[2px] bg-white"></span>
            <span className="w-6 h-[2px] bg-white"></span>
          </summary>

          <nav className="absolute right-0 mt-6 flex w-48 flex-col gap-4 rounded-2xl bg-[#1a1f2e] p-5 text-white shadow-xl">
            <a href="/brazil/porto-alegre">Porto Alegre</a>
            <a href="/hosts/armijn">Your Host</a>
            <a href="https://wa.me/+5551997783369" target="_blank">
              Contact
            </a>
          </nav>
        <div className="flex items-center gap-2 ml-4">
  <Link href="/brazil/porto-alegre">
    <span className="text-sm">🇬🇧</span>
  </Link>
  <Link href="/pt/brasil/porto-alegre">
    <span className="text-sm">🇧🇷</span>
  </Link>
</div>
        </details>
      </div>
    </header>
  );
}