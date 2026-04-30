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
            className="relative w-20 h-20 md:w-28 md:h-28 cursor-pointer"
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
              alt="Your local host"
              fill
              className="rounded-full object-cover border-4 border-white shadow-xl"
            />
          </div>

          {open && (
            <>
              <a href="/hosts/armijn" className="absolute right-32 top-0 bg-white px-4 py-2 rounded-full text-sm shadow-xl">Profile</a>
              <a href="https://wa.me/+5551997783369" target="_blank" className="absolute right-36 top-16 bg-white px-4 py-2 rounded-full text-sm shadow-xl">WhatsApp</a>
              <a href="mailto:armijnvandijk@gmail.com" className="absolute right-20 top-32 bg-white px-4 py-2 rounded-full text-sm shadow-xl">Email</a>
              <a href="/brazil/porto-alegre/restaurants" className="absolute right-0 top-40 bg-white px-4 py-2 rounded-full text-sm shadow-xl whitespace-nowrap">Top 5</a>
            </>
          )}
        </div>

        {/* LEFT */}
        <div className="md:col-span-2 space-y-8">
          <div className="bg-white p-8 rounded-3xl">
            <p className="text-stone-500 text-sm uppercase tracking-widest mb-4">
              Your local guide · Wherever business takes you
            </p>

            <h1 className="text-4xl md:text-6xl font-light text-stone-800 mb-4">
              Porto Alegre without the friction
            </h1>

            <p className="text-stone-600 max-w-2xl">
              A practical city for business visitors — relaxed, spread out, and easier than it looks.
              If you know where to go.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl">
            <h3 className="text-xl mb-2 text-stone-800">Restaurant highlight</h3>
            <p className="text-stone-600">
              Good places for a quiet client lunch or a proper dinner after work.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl">
            <h3 className="text-xl mb-2 text-stone-800">Tonight in the city</h3>
            <p className="text-stone-600">
              A few things worth doing after work — not everything, just what matters.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl">
            <h3 className="text-xl mb-2 text-stone-800">Need help in the city?</h3>
            <p className="text-stone-600 mb-4">
              Business visit, meetings or just getting around — I can help.
            </p>

            <Link
              href="/hosts/armijn"
              className="inline-block rounded-full bg-[#1a1f2e] px-5 py-3 text-sm text-white hover:bg-stone-800"
            >
              Meet your local host
            </Link>
          </div>
        </div>

        {/* RIGHT */}
        <div className="space-y-6 pt-24 md:pt-0">

          {/* Weather */}
          <div className="bg-white p-6 rounded-2xl">
            <h3 className="text-lg mb-2 text-stone-800">Weather today</h3>
            <p className="text-stone-600">
              Warm, humid, and unpredictable. Expect sun and rain in the same day.
            </p>
          </div>

          {/* MARGS */}
<div className="bg-white rounded-2xl overflow-hidden">
  <a
    href="https://margs.rs.gov.br/jose-vera-margs/"
    target="_blank"
    rel="noopener noreferrer"
  >
    {/* Image */}
    <div className="relative w-full h-48">
      <Image
        src="/margs.jpg"
        alt="José Verá exhibition at MARGS"
        fill
        className="object-cover"
      />
    </div>

    {/* Text */}
    <div className="p-5">
      <h3 className="text-lg text-stone-800 mb-1">
        MARGS — José Verá
      </h3>

      <p className="text-sm text-stone-500 mb-2">
        April → July 2026
      </p>

      <p className="text-stone-600">
        A strong contemporary exhibition rooted in Guarani culture.
        Right in the city center and easy to combine with a walk or lunch.
      </p>
    </div>
  </a>
</div>

          {/* Iberê */}
<div className="bg-white rounded-2xl overflow-hidden">
  <a
    href="https://iberecamargo.org.br/exposicao/erro-de-imagem-a-imagem/"
    target="_blank"
    rel="noopener noreferrer"
  >
    {/* Image */}
    <div className="relative h-40">
      <Image
        src="/ibere.jpg"
        alt="Erró exhibition at Fundação Iberê Camargo"
        fill
        className="object-cover"
      />
    </div>

    {/* Text */}
    <div className="p-5">
      <h3 className="text-lg text-stone-800 mb-1">
        Iberê Camargo — Erró
      </h3>

      <p className="text-sm text-stone-500 mb-2">
        March → August 2026
      </p>

      <p className="text-stone-600">
        A bold, visually dense exhibition mixing pop culture,
        narrative painting and political themes — set in one of
        the city’s most striking buildings by the river.
      </p>
    </div>
  </a>
</div>

          {/* Santander */}
<div className="bg-white rounded-2xl overflow-hidden">
  <a
    href="https://farolsantander.com.br/poa/exposicao/viva-volpi-arte-para-brincar-em-breve"
    target="_blank"
    rel="noopener noreferrer"
  >
    {/* Image */}
    <div className="relative h-40">
      <Image
        src="/santander.jpg"
        alt="Viva Volpi exhibition"
        fill
        className="object-cover"
      />
    </div>

    {/* Text */}
    <div className="p-5">
      <h3 className="text-lg text-stone-800 mb-1">
        Farol Santander — Viva Volpi
      </h3>

      <p className="text-sm text-stone-500 mb-2">
        Feb → May 2026
      </p>

      <p className="text-stone-600">
        A lighter, more playful exhibition — interactive and easy to enjoy.
        Good option if you want something cultural without spending hours.
      </p>
    </div>
  </a>
</div>

          {/* CTA */}
          <div className="bg-white p-6 rounded-2xl">
            <h3 className="text-lg text-stone-800 mb-2">Quick contact</h3>
            <p className="text-stone-600 mb-4">
              Visiting Porto Alegre and need help?
            </p>
            <a
              href="https://wa.me/+5551997783369"
              target="_blank"
              className="inline-block rounded-full bg-[#1a1f2e] px-5 py-3 text-sm text-white hover:bg-stone-800"
            >
              WhatsApp me
            </a>
          </div>

        </div>
      </div>
    </div>
  );
}