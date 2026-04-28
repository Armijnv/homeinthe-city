import GlobeComponent from "./components/Globe";
import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-[#1a1f2e]">
      <section className="relative min-h-screen pt-28 flex items-center justify-center overflow-hidden bg-[#1a1f2e]">
        
        {/* Globe */}
        <div className="absolute z-50 left-1/2 top-[58%] -translate-x-1/2 -translate-y-1/2 scale-60 opacity-90 md:left-[28%] md:top-1/2 md:scale-110">
          <GlobeComponent />
        </div>

        {/* Text */}
        <div className="relative z-10 px-8 text-center md:ml-[42%] md:text-left">
          <p className="mb-4 text-sm uppercase tracking-widest text-stone-400">
            Your local guide · Wherever business takes you
          </p>

          <h1 className="mb-6 text-5xl font-light leading-tight text-white md:text-7xl">
            Feel at home.
            <br />
            <span className="text-stone-300">In any city.</span>
          </h1>

          <p className="mx-auto mb-10 max-w-xl text-lg text-stone-400 md:mx-0">
            Local hosts, trusted stays, restaurant guides and cultural agendas —
            for international business visitors who want more than a hotel room.
          </p>

          <Link
            href="/brazil/porto-alegre"
            className="inline-block rounded-full bg-white px-8 py-4 text-sm text-stone-900 transition-colors hover:bg-stone-200"
          >
            Explore Porto Alegre →
          </Link>
        </div>

      </section>
    </div>
  );
}