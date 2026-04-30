"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";

export default function PortoAlegrePage() {
  const [open, setOpen] = useState(false);
  const [canUseMenu, setCanUseMenu] = useState(true);

  useEffect(() => {
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

          {open && (
            <div className="opacity-100 pointer-events-auto transition-opacity duration-300">
              <a href="/hosts/armijn" className="absolute right-32 top-0 rounded-full bg-white px-4 py-2 text-sm text-stone-800 shadow-xl hover:bg-stone-100">
                Profile
              </a>
              <a href="https://wa.me/+5551997783369" target="_blank" className="absolute right-36 top-16 rounded-full bg-white px-4 py-2 text-sm text-stone-800 shadow-xl hover:bg-stone-100">
                WhatsApp
              </a>
              <a href="mailto:armijnvandijk@gmail.com" className="absolute right-20 top-32 rounded-full bg-white px-4 py-2 text-sm text-stone-800 shadow-xl hover:bg-stone-100">
                Email me
              </a>
              <a href="/brazil/porto-alegre/restaurants" className="absolute right-0 top-40 rounded-full bg-white px-4 py-2 text-sm text-stone-800 shadow-xl hover:bg-stone-100 whitespace-nowrap">
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
              Porto Alegre without the friction
            </h1>

            <p className="text-stone-600 max-w-2xl">
              A practical city guide for international business visitors — where
              to eat, what to do after work, how to move around, and who to call
              when Portuguese gets in the way.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl">
            <h3 className="text-xl text-stone-800 mb-2">
              Restaurant highlight
            </h3>
            <p className="text-stone-600">
              Good places for a quiet client lunch, a relaxed dinner, or a proper
              local meal after meetings. My top picks are being added next.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl">
            <h3 className="text-xl text-stone-800 mb-2">
              Tonight in the city
            </h3>
            <p className="text-stone-600">
              Theatre, concerts, cinema and cultural events worth knowing about —
              not everything, just the things a visitor might actually enjoy.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl">
            <h3 className="text-xl text-stone-800 mb-2">
              Need help on the ground?
            </h3>
            <p className="text-stone-600 mb-5">
              If you are visiting Porto Alegre for business, I can help with
              interpreting, local guidance and practical support.
            </p>

            <Link
              href="/hosts/armijn"
              className="inline-block rounded-full bg-[#1a1f2e] px-6 py-3 text-sm text-white hover:bg-stone-800"
            >
              Meet your local host
            </Link>
          </div>
        </div>

        {/* RIGHT */}
<div className="space-y-6 pt-24 md:pt-0">

  {/* Weather */}
  <div className="bg-white p-6 rounded-2xl">
    <h3 className="text-lg text-stone-800 mb-2">
      Weather today
    </h3>
    <p className="text-stone-600">
      Warm and humid most of the year. Expect quick weather changes —
      sunshine, then rain within the same day.
    </p>
  </div>

  {/* Exhibitions */}
  <div className="bg-white p-6 rounded-2xl">
    <h3 className="text-lg text-stone-800 mb-2">
      Exhibitions right now
    </h3>
    <p className="text-stone-600">
      MARGS — rotating Brazilian art exhibitions  
      Fundação Iberê Camargo — modern art by the river  
      Santander Cultural — smaller curated shows in the center
    </p>
  </div>

  {/* Cinema */}
  <div className="bg-white p-6 rounded-2xl">
    <h3 className="text-lg text-stone-800 mb-2">
      Cinema tonight
    </h3>
    <p className="text-stone-600">
      Best options: GNC Praia de Belas or Iguatemi.
      Comfortable, safe and easy to reach after work.
    </p>
  </div>

  {/* Catamaran */}
  <div className="bg-white p-6 rounded-2xl">
    <h3 className="text-lg text-stone-800 mb-2">
      Catamaran to Guaíba
    </h3>
    <p className="text-stone-600">
      A simple way to step out of the city. Cross the water,
      see the skyline, and slow things down for an hour.
    </p>
  </div>

  {/* CTA */}
  <div className="bg-white p-6 rounded-2xl">
    <h3 className="text-lg text-stone-800 mb-2">
      Need help in the city?
    </h3>
    <p className="text-stone-600 mb-4">
      Business visit, meetings or just getting around — I can help.
    </p>

    <a
      href="/hosts/armijn"
      className="inline-block rounded-full bg-[#1a1f2e] px-5 py-3 text-sm text-white hover:bg-stone-800"
    >
      Meet your local host
    </a>
  </div>

</div>
      </div>
    </div>
  );
}