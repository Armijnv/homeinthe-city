"use client";

import { client } from "@/sanity/lib/client";
import { cityQuery } from "@/sanity/lib/queries";
import MuseumCard from "@/app/components/MuseumCard";
import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";

/* ---------- WEATHER ---------- */

function Weather() {
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    fetch(
      "https://api.open-meteo.com/v1/forecast?latitude=-30.03&longitude=-51.23&current=temperature_2m,weather_code"
    )
      .then((res) => res.json())
      .then((json) => setData(json.current));
  }, []);

  if (!data) return <p className="text-stone-400">Weer laden...</p>;

  return (
    <p className="text-stone-600">
      {Math.round(data.temperature_2m)}°C · {getWeatherLabel(data.weather_code)}
    </p>
  );
}

function getWeatherLabel(code: number) {
  if (code === 0) return "heldere lucht";
  if (code <= 3) return "gedeeltelijk bewolkt";
  if (code <= 48) return "bewolkt";
  if (code <= 67) return "regen";
  if (code <= 99) return "storm";
  return "onbekend";
}

/* ---------- PAGE ---------- */

export default function PortoAlegrePage() {
  const [open, setOpen] = useState(false);
  const [city, setCity] = useState<any>(null);

  useEffect(() => {
    client.fetch(cityQuery, { slug: "porto-alegre" }).then(setCity);
  }, []);

  return (
    <div className="min-h-screen bg-[#1a1f2e] px-6 pt-28 pb-16 md:bg-stone-50">
      <div className="relative mx-auto grid max-w-6xl grid-cols-1 gap-8 md:grid-cols-3">

        {/* PROFILE */}
        <div className="fixed right-4 top-24 z-[70] group md:right-8">
          <div
            className="relative h-20 w-20 cursor-pointer md:h-28 md:w-28"
            onClick={() => setOpen(!open)}
          >
            <Image
              src="/me.png"
              alt="Jouw lokale gids"
              fill
              className="rounded-full border-4 border-white object-cover shadow-xl"
            />
          </div>

          {open && (
            <>
              <a href="/hosts/armijn" className="absolute right-32 top-2 bg-white px-4 py-2 rounded-full text-sm shadow-xl">
                Profiel
              </a>
              <a href="https://wa.me/+5551997783369" target="_blank" className="absolute right-36 top-20 bg-white px-4 py-2 rounded-full text-sm shadow-xl">
                WhatsApp
              </a>
              <a href="mailto:armijnvandijk@gmail.com" className="absolute right-24 top-36 bg-white px-4 py-2 rounded-full text-sm shadow-xl">
                Email
              </a>
            </>
          )}
        </div>

        {/* LEFT */}
        <div className="space-y-8 md:col-span-2">

          {/* FLAGS */}
          <div className="mb-4 flex gap-3 text-xl">
            <Link href="/brazil/porto-alegre">🇬🇧</Link>
            <Link href="/pt/brasil/porto-alegre">🇧🇷</Link>
            <Link href="/nl/brazilie/porto-alegre">🇳🇱</Link>
          </div>

          {/* HERO */}
          <div className="rounded-3xl bg-white p-8">
            <h1 className="mb-6 text-4xl font-light text-stone-800 md:text-6xl">
              {city?.headline_nl || "Tolk in Porto Alegre voor zakelijke bezoeken"}
            </h1>

            <p className="max-w-2xl text-stone-600">
              {city?.intro_nl || "Jouw lokale ondersteuning in Porto Alegre voor zakelijke bezoeken."}
            </p>
          </div>

          {/* LIVE EVENTS */}
          <div className="rounded-2xl bg-white p-6">
            <h3 className="mb-4 text-xl text-stone-800">
              Zin in live muziek?
            </h3>
          </div>

          {/* RESTAURANTS */}
          <div className="rounded-2xl bg-white p-6">
            <h3 className="text-xl text-stone-800 mb-2">
              5 plekken waar ik deze week zou eten
            </h3>

            <p className="text-sm text-stone-500 mb-4">
              Geen ranking. Gewoon plekken waar ik zelf ga.
            </p>

            <div className="space-y-3">
              {city?.restaurants?.map((place: any, i: number) => (
                <a
                  key={place.name}
                  href={place.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`block rounded-xl border p-4 transition hover:border-stone-300 hover:bg-stone-50 ${
                    place.favorite
                      ? "border-[#1a1f2e] bg-stone-50"
                      : "border-stone-100"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#1a1f2e] text-xs text-white">
                      {i + 1}
                    </span>

                    <span className="font-medium text-stone-800">
                      {place.name}
                    </span>

                    {place.favorite && (
                      <span className="rounded-full bg-[#1a1f2e] px-3 py-1 text-xs text-white">
                        mijn keuze
                      </span>
                    )}
                  </div>

                  <p className="mt-2 text-sm text-stone-500">
                    {place.note_nl}
                  </p>
                </a>
              ))}
            </div>
          </div>

          {/* CTA */}
          <div className="rounded-2xl bg-white p-6">
            <h3 className="mb-2 text-xl text-stone-800">
              Hulp nodig in de stad?
            </h3>

            <p className="mb-4 text-stone-600">
              Zakelijke bezoeken, meetings of gewoon wegwijs worden — ik help je.
            </p>

            <a
              href="https://wa.me/+5551997783369"
              target="_blank"
              className="inline-block rounded-full bg-[#1a1f2e] px-5 py-3 text-sm text-white"
            >
              {city?.cta_nl || "Stuur me een bericht"}
            </a>
          </div>
        </div>

        {/* RIGHT */}
        <div className="space-y-6 pt-24 md:pt-0">
          <div className="rounded-2xl bg-white p-6">
            <h3 className="mb-2 text-lg text-stone-800">
              Weer vandaag
            </h3>
            <Weather />
          </div>

          <MuseumCard
            href="https://margs.rs.gov.br/jose-vera-margs/"
            image="/margs.jpg"
            title="MARGS — José Verá"
            dates="April → Juli 2026"
            description="Sterke hedendaagse tentoonstelling in het centrum."
          />
        </div>
      </div>
    </div>
  );
}