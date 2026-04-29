import Image from "next/image";

export default function PortoAlegrePage() {
  return (
    <div className="min-h-screen bg-[#1a1f2e] md:bg-stone-50 px-6 pt-28 pb-16">
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 relative">

        {/* Floating profile image */}
        <div className="absolute -top-12 right-2 md:right-0 z-[70]">
  <Image
    src="/me.png"
    alt="Your local host in Porto Alegre"
    width={90}
    height={90}
    className="rounded-full border-4 border-white shadow-xl object-cover md:w-[120px] md:h-[120px]"
  />
</div>

        {/* LEFT */}
        <div className="md:col-span-2 space-y-8">

          <div className="bg-white p-8 rounded-3xl">
            <p className="text-stone-500 text-sm tracking-widest uppercase mb-4">
              Your local guide · Wherever business takes you
            </p>

            <h1 className="text-4xl md:text-6xl font-light text-stone-800 mb-4">
              A city that works at your pace
            </h1>

            <p className="text-stone-600 max-w-2xl">
              Porto Alegre combines business and lifestyle in a relaxed way.
              Wide streets, green parks and a strong local culture make it
              easy to navigate and comfortable to stay.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl">
            <h3 className="text-xl text-stone-800 mb-2">
              Restaurant highlight
            </h3>
            <p className="text-stone-600">
              A place to meet clients or unwind after work.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl">
            <h3 className="text-xl text-stone-800 mb-2">
              Cultural highlight
            </h3>
            <p className="text-stone-600">
              Concerts and events at Araujo Viana.
            </p>
          </div>
        </div>

        {/* RIGHT */}
        <div className="space-y-6 pt-24 md:pt-0">
          <div className="bg-white p-6 rounded-2xl">
            <h3 className="text-lg text-stone-800 mb-2">Weather</h3>
            <p className="text-stone-600">25°C — sunny</p>
          </div>

          <div className="bg-white p-6 rounded-2xl">
            <h3 className="text-lg text-stone-800 mb-2">Cinema today</h3>
            <p className="text-stone-600">Top movies playing in the city</p>
          </div>

          <div className="bg-white p-6 rounded-2xl">
            <h3 className="text-lg text-stone-800 mb-2">Catamaran</h3>
            <p className="text-stone-600">Next departure to Guaíba</p>
          </div>
        </div>

      </div>
    </div>
  );
}