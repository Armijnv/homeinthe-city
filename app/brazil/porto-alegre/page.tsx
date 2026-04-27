export default function PortoAlegrePage() {
  return (
    <div className="min-h-screen bg-stone-50 px-6 pt-28 pb-16">

      {/* Page title */}
      <div className="max-w-6xl mx-auto mb-10">
        <h1 className="text-4xl md:text-6xl font-light text-stone-800">
          Porto Alegre
        </h1>
      </div>

      {/* Layout */}
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">

        {/* LEFT — Main content */}
        <div className="md:col-span-2 space-y-8">

          {/* Main feature */}
          <div className="bg-white p-6 rounded-2xl">
            <h2 className="text-2xl text-stone-800 mb-2">
              A city that works at your pace
            </h2>
            <p className="text-stone-600">
              Porto Alegre combines business and lifestyle in a relaxed way.
              Wide streets, green parks and a strong local culture make it
              easy to navigate and comfortable to stay.
            </p>
          </div>

          {/* Featured restaurant */}
          <div className="bg-white p-6 rounded-2xl">
            <h3 className="text-xl text-stone-800 mb-2">
              Restaurant highlight
            </h3>
            <p className="text-stone-600">
              A place to meet clients or unwind after work.
            </p>
          </div>

          {/* Cultural highlight */}
          <div className="bg-white p-6 rounded-2xl">
            <h3 className="text-xl text-stone-800 mb-2">
              Cultural highlight
            </h3>
            <p className="text-stone-600">
              Concerts and events at Araujo Viana.
            </p>
          </div>

        </div>

        {/* RIGHT — Big info blocks */}
        <div className="space-y-6">

          {/* Weather */}
          <div className="bg-white p-6 rounded-2xl">
            <h3 className="text-lg text-stone-800 mb-2">Weather</h3>
            <p className="text-stone-600">25°C — sunny</p>
          </div>

          {/* Cinema */}
          <div className="bg-white p-6 rounded-2xl">
            <h3 className="text-lg text-stone-800 mb-2">Cinema today</h3>
            <p className="text-stone-600">Top movies playing in the city</p>
          </div>

          {/* Transport */}
          <div className="bg-white p-6 rounded-2xl">
            <h3 className="text-lg text-stone-800 mb-2">Catamaran</h3>
            <p className="text-stone-600">Next departure to Guaíba</p>
          </div>

        </div>

      </div>

    </div>
  );
}