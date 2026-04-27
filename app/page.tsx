import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen">

      {/* Hero */}
      <section className="h-screen flex items-center justify-center bg-stone-50">
        <div className="text-center px-8">
          <p className="text-stone-500 text-sm tracking-widest uppercase mb-4">
            Your local guide · Wherever business takes you
          </p>

          <h1 className="text-5xl md:text-7xl font-light text-stone-800 mb-6 leading-tight">
            Feel at home.<br/>
            <span className="text-stone-400">In any city.</span>
          </h1>

          <p className="text-stone-500 text-lg mb-10 max-w-xl mx-auto">
            Local hosts, trusted stays, restaurant guides and cultural agendas — 
            for international business visitors who want more than a hotel room.
          </p>

          <Link 
            href="/brazil/porto-alegre"
            className="inline-block bg-stone-800 text-white px-8 py-4 rounded-full text-sm hover:bg-stone-700 transition-colors"
          >
            Explore Porto Alegre →
          </Link>
        </div>
      </section>

    </div>
  );
}