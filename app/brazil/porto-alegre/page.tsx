"use client";

import Image from "next/image";
import { useState, useEffect } from "react";

export default function PortoAlegrePage() {
  const [open, setOpen] = useState(false);
  const [canUseMenu, setCanUseMenu] = useState(true);

  useEffect(() => {
    // detect very old iPhones → disable menu
    const ua = navigator.userAgent;
    if (/iPhone|iPad|iPod/.test(ua) && !window.CSS) {
      setCanUseMenu(false);
    }
  }, []);

  return (
    <div className="min-h-screen bg-[#1a1f2e] md:bg-stone-50 px-6 pt-28 pb-16">
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 relative">

        {/* Profile image */}
        <div className="fixed top-24 right-4 md:right-8 z-[70] group">

          {/* Click / fallback */}
          <div
            className="relative w-20 h-20 md:w-28 md:h-28"
            onClick={() => {
              if (canUseMenu) {
                setOpen(!open);
              } else {
                window.location.href = "/hosts/armijn";
              }
            }}
          >
            <Image
              src="/me.png"
              alt="Your local host in Porto Alegre"
              fill
              className="rounded-full object-cover border-4 border-white shadow-xl cursor-pointer"
            />
          </div>

          {/* Rays (hover desktop OR tap mobile) */}
          {(open || false) && (
            <div className="opacity-100 pointer-events-auto md:group-hover:opacity-100 md:group-hover:pointer-events-auto transition-opacity duration-300">

              <a
                href="/hosts/armijn"
                className="absolute right-32 top-0 rounded-full bg-white px-4 py-2 text-sm text-stone-800 shadow-xl hover:bg-stone-100"
              >
                Profile
              </a>

              <a
                href="https://wa.me/+5551997783369"
                target="_blank"
                className="absolute right-36 top-16 rounded-full bg-white px-4 py-2 text-sm text-stone-800 shadow-xl hover:bg-stone-100"
              >
                WhatsApp
              </a>

              <a
                href="mailto:armijnvandijk@gmail.com"
                className="absolute right-20 top-32 rounded-full bg-white px-4 py-2 text-sm text-stone-800 shadow-xl hover:bg-stone-100"
              >
                Email me
              </a>

              <a
                href="/brazil/porto-alegre/restaurants"
                className="absolute right-0 top-40 rounded-full bg-white px-4 py-2 text-sm text-stone-800 shadow-xl hover:bg-stone-100 whitespace-nowrap"
              >
                Top 5 restaurants
              </a>
            </div>
          )}

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