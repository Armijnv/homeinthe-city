import Link from "next/link";

export default function PortoAlegrePage() {
  return (
    <div className="min-h-screen bg-stone-50">

      {/* Hero */}
      <section className="h-[60vh] flex items-center justify-center text-center px-8">
        <div>
          <p className="text-sm uppercase tracking-widest text-stone-400 mb-4">
            Brazil
          </p>
          <h1 className="text-4xl md:text-6xl font-light text-stone-800 mb-6">
            Porto Alegre
          </h1>
        </div>
      </section>

      {/* Intro text */}
      <section className="max-w-3xl mx-auto px-8 mb-16 text-center">
        <p className="text-lg text-stone-600 leading-relaxed">
          Porto Alegre is a green and safe city along a beautiful river in southern Brazil.
          It’s a place where business and daily life blend naturally — with great restaurants,
          a charming historic center and a lively public market.
        </p>

        <p className="text-lg text-stone-600 leading-relaxed mt-6">
          With its relaxed atmosphere, mild climate and spacious parks, it offers a comfortable
          environment for international visitors — both for work and to unwind after.
        </p>
      </section>

      {/* Sections */}
      <section className="max-w-5xl mx-auto px-8 grid gap-12 pb-20">

        {/* Hosts */}
        <div>
          <h2 className="text-2xl font-light text-stone-800 mb-3">
            Meet your local host
          </h2>
          <p className="text-stone-500 mb-4">
            Get personal support from someone who knows the city and understands international business needs.
          </p>
          <Link href="/brazil/porto-alegre/hosts" className="text-stone-800 underline">
            View hosts →
          </Link>
        </div>

        {/* Stays */}
        <div>
          <h2 className="text-2xl font-light text-stone-800 mb-3">
            Find a place to stay
          </h2>
          <p className="text-stone-500 mb-4">
            Carefully selected apartments that offer comfort, safety and a local experience.
          </p>
          <Link href="/brazil/porto-alegre/stays" className="text-stone-800 underline">
            View stays →
          </Link>
        </div>

        {/* Eat */}
        <div>
          <h2 className="text-2xl font-light text-stone-800 mb-3">
            Where to eat
          </h2>
          <p className="text-stone-500 mb-4">
            A curated selection of restaurants and cafés — from business lunches to relaxed evenings.
          </p>
          <Link href="/brazil/porto-alegre/eat" className="text-stone-800 underline">
            Explore restaurants →
          </Link>
        </div>

        {/* Agenda */}
        <div>
          <h2 className="text-2xl font-light text-stone-800 mb-3">
            What’s happening
          </h2>
          <p className="text-stone-500 mb-4">
            Events, culture and activities worth knowing during your stay.
          </p>
          <Link href="/brazil/porto-alegre/agenda" className="text-stone-800 underline">
            View agenda →
          </Link>
        </div>

        {/* Services */}
        <div>
          <h2 className="text-2xl font-light text-stone-800 mb-3">
            Need something specific?
          </h2>
          <p className="text-stone-500 mb-4">
            From transport and translation to tailored support — we help you arrange what you need.
          </p>
          <Link href="/brazil/porto-alegre/services" className="text-stone-800 underline">
            View services →
          </Link>
        </div>

      </section>

    </div>
  );
}