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
          <p className="text-stone-500 max-w-xl mx-auto">
            Your local guide to navigating the city — from trusted hosts to the best places to stay, eat and explore.
          </p>
        </div>
      </section>

      {/* Sections */}
      <section className="max-w-6xl mx-auto px-8 pb-20 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

        {/* Hosts */}
        <Link href="/brazil/porto-alegre/hosts" className="block bg-white p-6 rounded-2xl hover:shadow-md transition-shadow">
          <h3 className="text-xl text-stone-800 mb-2">Local Hosts</h3>
          <p className="text-sm text-stone-500">
            Meet trusted people who help you navigate the city.
          </p>
        </Link>

        {/* Stays */}
        <Link href="/brazil/porto-alegre/stays" className="block bg-white p-6 rounded-2xl hover:shadow-md transition-shadow">
          <h3 className="text-xl text-stone-800 mb-2">Stays</h3>
          <p className="text-sm text-stone-500">
            Carefully selected apartments and accommodations.
          </p>
        </Link>

        {/* Eat */}
        <Link href="/brazil/porto-alegre/eat" className="block bg-white p-6 rounded-2xl hover:shadow-md transition-shadow">
          <h3 className="text-xl text-stone-800 mb-2">Where to Eat</h3>
          <p className="text-sm text-stone-500">
            A curated selection of restaurants and cafés.
          </p>
        </Link>

        {/* Agenda */}
        <Link href="/brazil/porto-alegre/agenda" className="block bg-white p-6 rounded-2xl hover:shadow-md transition-shadow">
          <h3 className="text-xl text-stone-800 mb-2">Agenda</h3>
          <p className="text-sm text-stone-500">
            What’s happening in the city during your stay.
          </p>
        </Link>

        {/* Tips */}
        <Link href="/brazil/porto-alegre/tips" className="block bg-white p-6 rounded-2xl hover:shadow-md transition-shadow">
          <h3 className="text-xl text-stone-800 mb-2">Tips</h3>
          <p className="text-sm text-stone-500">
            Essential information for international visitors.
          </p>
        </Link>

        {/* Services */}
        <Link href="/brazil/porto-alegre/services" className="block bg-white p-6 rounded-2xl hover:shadow-md transition-shadow">
          <h3 className="text-xl text-stone-800 mb-2">Services</h3>
          <p className="text-sm text-stone-500">
            Transport, translation, and other local support.
          </p>
        </Link>

      </section>

    </div>
  );
}