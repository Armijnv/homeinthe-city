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
          <span className="text-white font-medium tracking-tight text-lg">
            home in the city
          </span>
        </Link>

        {/* Desktop nav */}
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

        {/* Mobile menu checkbox */}
        <input id="menu-toggle" type="checkbox" className="peer hidden" />

        <label
          htmlFor="menu-toggle"
          className="md:hidden flex flex-col gap-1 cursor-pointer"
        >
          <span className="w-6 h-[2px] bg-white"></span>
          <span className="w-6 h-[2px] bg-white"></span>
          <span className="w-6 h-[2px] bg-white"></span>
        </label>
      </div>

      {/* Mobile menu */}
      <nav className="hidden peer-checked:flex md:hidden flex-col gap-4 pt-6 text-white">
        <a href="/brazil/porto-alegre">Porto Alegre</a>
        <a href="/hosts/armijn">Your Host</a>
        <a href="https://wa.me/+5551997783369" target="_blank">
          Contact
        </a>
      </nav>
    </header>
  );
}