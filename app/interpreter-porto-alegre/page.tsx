import Link from "next/link";

export const metadata = {
  title: "Interpreter in Porto Alegre for Business Meetings",
  description:
    "English, Dutch and Portuguese interpreter in Porto Alegre for factory visits, business meetings and local coordination.",
};

export default function InterpreterPortoAlegrePage() {
  return (
    <main className="min-h-screen bg-stone-50 px-6 pt-32 pb-20">
      <div className="mx-auto max-w-3xl">

        {/* ======================================================
            HERO
        ====================================================== */}

        <div className="mb-12">
          <p className="mb-4 text-sm uppercase tracking-[0.25em] text-stone-500">
            Porto Alegre · Brazil
          </p>

          <h1 className="mb-6 text-5xl font-light leading-tight text-stone-800">
            Interpreter in Porto Alegre for Business Meetings
          </h1>

          <p className="max-w-2xl text-lg leading-relaxed text-stone-600">
            I help international business visitors communicate clearly and move comfortably through Porto Alegre during meetings, factory visits and company introductions.
          </p>
        </div>

        {/* ======================================================
            SERVICES
        ====================================================== */}

        <div className="mb-12 rounded-3xl bg-white p-8 shadow-sm">
          <h2 className="mb-6 text-2xl text-stone-800">
            Services
          </h2>

          <div className="space-y-4 text-stone-600">
            <p>• On-site interpreting during meetings</p>
            <p>• Factory and supplier visits</p>
            <p>• Local business coordination</p>
            <p>• Airport pickup and transport guidance</p>
            <p>• Restaurant and city recommendations</p>
            <p>• English · Portuguese · Dutch</p>
          </div>
        </div>

        {/* ======================================================
            EXPERIENCE
        ====================================================== */}

        <div className="mb-12 rounded-3xl bg-white p-8 shadow-sm">
          <h2 className="mb-6 text-2xl text-stone-800">
            Local support that goes beyond translation
          </h2>

          <p className="leading-relaxed text-stone-600">
            Business trips run smoother when someone local helps bridge both the language and the culture. I assist visitors during negotiations, technical visits and day-to-day logistics so communication stays relaxed and efficient.
          </p>
        </div>

        {/* ======================================================
            CTA
        ====================================================== */}

        <div className="rounded-3xl bg-[#1a1f2e] p-8 text-white">
          <h2 className="mb-4 text-3xl font-light">
            Coming to Porto Alegre?
          </h2>

          <p className="mb-6 max-w-xl text-stone-300">
            Send me your dates and meeting schedule and I’ll let you know how I can help.
          </p>

          <Link
            href="https://wa.me/5551997783369"
            className="inline-block rounded-full bg-white px-6 py-4 text-sm text-stone-900 transition hover:bg-stone-200"
          >
            Contact on WhatsApp
          </Link>
        </div>
      </div>
    </main>
  );
}