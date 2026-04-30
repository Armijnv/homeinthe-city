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
      Warm and humid most of the year. Expect quick changes —
      sunshine, then rain within the same day.
    </p>
  </div>

  {/* MARGS */}
  <div className="bg-white rounded-2xl overflow-hidden">
    <img
      src="https://upload.wikimedia.org/wikipedia/commons/3/3f/MARGS_Porto_Alegre.jpg"
      alt="MARGS museum Porto Alegre"
      className="w-full h-40 object-cover"
    />
    <div className="p-5">
      <h3 className="text-lg text-stone-800 mb-1">
        MARGS
      </h3>
      <p className="text-sm text-stone-500 mb-2">
        Museu de Arte do Rio Grande do Sul
      </p>
      <p className="text-stone-600">
        Rotating exhibitions of Brazilian art in a historic building
        in the center.
      </p>
    </div>
  </div>

  {/* Iberê Camargo */}
  <div className="bg-white rounded-2xl overflow-hidden">
    <img
      src="https://upload.wikimedia.org/wikipedia/commons/6/6c/Fundacao_Ibere_Camargo.jpg"
      alt="Fundação Iberê Camargo"
      className="w-full h-40 object-cover"
    />
    <div className="p-5">
      <h3 className="text-lg text-stone-800 mb-1">
        Fundação Iberê Camargo
      </h3>
      <p className="text-stone-600">
        Modern art museum by the river. Calm, minimal architecture
        and strong exhibitions.
      </p>
    </div>
  </div>

  {/* Santander Cultural */}
  <div className="bg-white rounded-2xl overflow-hidden">
    <img
      src="https://upload.wikimedia.org/wikipedia/commons/0/0e/Santander_Cultural_Porto_Alegre.jpg"
      alt="Santander Cultural Porto Alegre"
      className="w-full h-40 object-cover"
    />
    <div className="p-5">
      <h3 className="text-lg text-stone-800 mb-1">
        Santander Cultural
      </h3>
      <p className="text-stone-600">
        Smaller curated exhibitions, often contemporary and
        well worth a quick visit.
      </p>
    </div>
  </div>

  {/* Cinema */}
  <div className="bg-white p-6 rounded-2xl">
    <h3 className="text-lg text-stone-800 mb-2">
      Cinema tonight
    </h3>
    <p className="text-stone-600">
      Best options: GNC Praia de Belas or Iguatemi.
      Comfortable, safe and easy after work.
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
    </div>
  );
}