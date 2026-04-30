import Image from "next/image";
export const metadata = {
  title: "Interpreter in Porto Alegre | Armijn van Dijk",
  description:
    "Local interpreter in Porto Alegre helping international business visitors with meetings, company visits and communication.",
  openGraph: {
    title: "Interpreter in Porto Alegre | Armijn van Dijk",
    description:
      "Local interpreter in Porto Alegre helping international business visitors with meetings and communication.",
    url: "https://homeinthe.city/hosts/armijn",
    siteName: "Home in the City",
    images: [
      {
        url: "/me.png",
        width: 800,
        height: 800,
      },
    ],
    locale: "en_US",
    type: "website",
  },
};
export default function ArmijnHostPage() {
  return (
    <div className="min-h-screen bg-[#1a1f2e] px-6 pt-28 pb-16 text-white">
      <div className="mx-auto max-w-5xl grid grid-cols-1 md:grid-cols-3 gap-10 items-start">

        {/* Photo */}
        <div className="md:sticky md:top-28">
          <div className="overflow-hidden rounded-3xl bg-white/10 shadow-2xl">
            <Image
              src="/me.png"
              alt="Armijn van Dijk"
              width={500}
              height={650}
              className="w-full object-cover grayscale"
              priority
            />
          </div>
        </div>

        {/* Main content */}
        <div className="md:col-span-2">
          <p className="mb-4 text-sm uppercase tracking-widest text-stone-400">
            Local host · Interpreter · Porto Alegre
          </p>

          <h1 className="mb-6 text-4xl font-light leading-tight md:text-6xl">
            Armijn van Dijk
          </h1>

          <p className="mb-8 max-w-2xl text-xl leading-relaxed text-stone-300">
            I help international business visitors feel confident in Porto Alegre —
            with language support, local guidance and practical help on the ground.
          </p>

          <div className="mb-10 rounded-3xl bg-white p-8 text-stone-800">
            <h2 className="mb-4 text-2xl font-light">What I can help with</h2>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div>
                <h3 className="font-medium">On-site interpreting</h3>
                <p className="text-stone-600">
                  English, Dutch and Portuguese support during meetings and visits.
                </p>
              </div>

              <div>
                <h3 className="font-medium">Business visit support</h3>
                <p className="text-stone-600">
                  Help with logistics, timing, communication and local expectations.
                </p>
              </div>

              <div>
                <h3 className="font-medium">Local guidance</h3>
                <p className="text-stone-600">
                  Restaurants, neighborhoods, transport and practical city advice.
                </p>
              </div>

              <div>
                <h3 className="font-medium">Trusted local presence</h3>
                <p className="text-stone-600">
                  Someone who understands both foreign visitors and Brazilian life.
                </p>
              </div>
            </div>
          </div>

          <div className="mb-10 rounded-3xl bg-white/10 p-8">
            <h2 className="mb-3 text-2xl font-light">A little about me</h2>
            <p className="max-w-2xl leading-relaxed text-stone-300">
              I grew up in Holland, lived in California and the Caribbean, and
              have lived in Brazil for more than 25 years. My background is in
              hospitality, business, hands-on work and building things — which
              makes me practical, calm and useful when people need help in a new city.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4">

  <a
    href="https://wa.me/+5551997783369"
    target="_blank"
    className="inline-block rounded-full bg-white px-8 py-4 text-sm text-stone-900 transition hover:bg-stone-200 text-center"
  >
    WhatsApp
  </a>

  <a
    href="mailto:armijnvandijk@gmail.com"
    className="inline-block rounded-full bg-white/10 px-8 py-4 text-sm text-white border border-white/20 transition hover:bg-white/20 text-center"
  >
    Email me
  </a>

</div>
        </div>

      </div>
    </div>
  );
}