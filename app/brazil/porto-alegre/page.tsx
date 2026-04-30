"use client";
import MuseumCard from "@/app/components/MuseumCard";
import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
function Weather() {
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    fetch(
      "https://api.open-meteo.com/v1/forecast?latitude=-30.03&longitude=-51.23&current=temperature_2m,weather_code"
    )
      .then((res) => res.json())
      .then((json) => setData(json.current));
  }, []);

  if (!data) {
    return <p className="text-stone-400">Loading weather...</p>;
  }

  return (
    <p className="text-stone-600">
      {Math.round(data.temperature_2m)}°C ·{" "}
      {getWeatherLabel(data.weather_code)}
    </p>
  );
}

function getWeatherLabel(code: number) {
  if (code === 0) return "clear sky";
  if (code <= 3) return "partly cloudy";
  if (code <= 48) return "cloudy";
  if (code <= 67) return "rain";
  if (code <= 77) return "snow";
  if (code <= 99) return "storm";
  return "unknown";
}
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
            <h1 className="text-4xl md:text-6xl font-light text-stone-800 mb-6">
  Porto Alegre without the friction
</h1>

<p className="text-stone-600 max-w-2xl">
  Changes in latitude, changes in attitude. It sounds easy — until you land somewhere new and nothing quite works the way you expect.
</p>

<p className="text-stone-600 max-w-2xl mt-4">
  Porto Alegre is a relaxed city, but not always an obvious one. Things take time, conversations take effort, and small details slow you down.
</p>

<p className="text-stone-600 max-w-2xl mt-4">
  I help you move through it smoothly — meetings, places, decisions — so you can focus on why you came here in the first place.
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

  <Weather />
</div>

          <MuseumCard
  href="https://margs.rs.gov.br/jose-vera-margs/"
  image="/margs.jpg"
  title="MARGS — José Verá"
  dates="April → July 2026"
  description="A strong contemporary exhibition rooted in Guarani culture, right in the city center."
/>

<MuseumCard
  href="https://iberecamargo.org.br/exposicao/erro-de-imagem-a-imagem/"
  image="/ibere.jpg"
  title="Iberê Camargo — Erró"
  dates="March → August 2026"
  description="Bold, visual and political work in one of the most striking buildings by the river."
/>

<MuseumCard
  href="https://farolsantander.com.br/poa/exposicao/viva-volpi-arte-para-brincar-em-breve"
  image="/santander.jpg"
  title="Farol Santander — Viva Volpi"
  dates="Feb → May 2026"
  description="A lighter, playful and interactive exhibition — easy to enjoy after work."
/>

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