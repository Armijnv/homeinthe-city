"use client";

import MuseumCard from "@/app/components/MuseumCard";
import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
export const metadata = {
  title: "Interpreter Porto Alegre | Business Guide & Local Support",
  description:
    "Local interpreter in Porto Alegre for business visitors. Meetings, company visits, and smooth communication in Brazil.",
};
function Weather() {
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    fetch(
      "https://api.open-meteo.com/v1/forecast?latitude=-30.03&longitude=-51.23&current=temperature_2m,weather_code"
    )
      .then((res) => res.json())
      .then((json) => setData(json.current));
  }, []);

  if (!data) return <p className="text-stone-400">Loading weather...</p>;

  return (
    <p className="text-stone-600">
      {Math.round(data.temperature_2m)}°C · {getWeatherLabel(data.weather_code)}
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

const places = [
  { name: "Boxfim", note: "Good Brazilian-style burger. The Borrucia is my favorite." },
  { name: "Le Bateau Ivre", note: "Classic, quiet, and good for a romantic evening out." },
  { name: "Sambo", note: "Really nice sushi, with plenty of other options too." },
  { name: "Barranco", note: "On a sunny day in spring or fall, there is no better place than the garden at Barranco." },
  { name: "Madre", note: "Complete lunch buffet with a great selection of dishes." },
];

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
    <div className="min-h-screen bg-[#1a1f2e] px-6 pt-28 pb-16 md:bg-stone-50">
      <div className="relative mx-auto grid max-w-6xl grid-cols-1 gap-8 md:grid-cols-3">

        {/* Profile image */}
        <div className="fixed right-4 top-24 z-[70] group md:right-8">
          <div
            className="relative h-20 w-20 cursor-pointer md:h-28 md:w-28"
            onClick={() => {
              if (canUseMenu) setOpen(!open);
              else window.location.href = "/hosts/armijn";
            }}
          >
            <Image
              src="/me.png"
              alt="Your local host"
              fill
              className="rounded-full border-4 border-white object-cover shadow-xl"
            />
          </div>

          {open && (
  <>
    <a
      href="/hosts/armijn"
      className="absolute right-32 top-2 rounded-full bg-white px-4 py-2 text-sm shadow-xl hover:bg-stone-100"
    >
      Profile
    </a>

    <a
      href="https://wa.me/+5551997783369"
      target="_blank"
      className="absolute right-36 top-20 rounded-full bg-white px-4 py-2 text-sm shadow-xl hover:bg-stone-100"
    >
      WhatsApp
    </a>

    <a
      href="mailto:armijnvandijk@gmail.com"
      className="absolute right-24 top-36 rounded-full bg-white px-4 py-2 text-sm shadow-xl hover:bg-stone-100"
    >
      Email
    </a>
  </>
)}
        </div>

        {/* LEFT */}
        <div className="space-y-8 md:col-span-2">
          <div className="rounded-3xl bg-white p-8">
            <h1 className="mb-6 text-4xl font-light text-stone-800 md:text-6xl">
  Interpreter in Porto Alegre for Business Visitors
</h1>

            <p className="max-w-2xl text-stone-600">
              Changes in latitude, changes in attitude. It sounds easy — until
              you land somewhere new and nothing quite works the way you expect.
            </p>

            <p className="mt-4 max-w-2xl text-stone-600">
              Porto Alegre is a relaxed city, but not always an obvious one.
              Things take time, conversations take effort, and small details
              slow you down.
            </p>

            <p className="mt-4 max-w-2xl text-stone-600">
              I help you move through it smoothly — meetings, places, decisions
              — so you can focus on why you came here in the first place.
            </p>
          </div>

          {/* Live events */}
          <div className="rounded-2xl bg-white p-6">
            <h3 className="mb-4 text-xl text-stone-800">Live events this week</h3>

            <div className="space-y-4">
              <a href="https://araujoviannaoficial.com.br/programacao/" target="_blank" className="flex items-center gap-4 rounded-xl p-3 transition hover:bg-stone-50">
                <div className="flex h-20 w-20 items-center justify-center rounded-lg bg-white">
                  <Image src="/araujovianna.jpg" alt="Araújo Vianna" width={70} height={40} className="object-contain" />
                </div>
                <div>
                  <h4 className="text-stone-800">Araújo Vianna</h4>
                  <p className="text-sm text-stone-500">Concerts and major shows in the city</p>
                </div>
              </a>

              <a href="https://opiniaopoa.com.br/agenda/" target="_blank" className="flex items-center gap-4 rounded-xl p-3 transition hover:bg-stone-50">
                <div className="flex h-20 w-20 items-center justify-center rounded-lg bg-white">
                  <Image src="/opiniao.jpg" alt="Opinião" width={70} height={40} className="object-contain" />
                </div>
                <div>
                  <h4 className="text-stone-800">Opinião</h4>
                  <p className="text-sm text-stone-500">Live music, more alternative and local scene</p>
                </div>
              </a>

              <a href="https://www.hardrockcafe.com/location/porto-alegre/" target="_blank" className="flex items-center gap-4 rounded-xl p-3 transition hover:bg-stone-50">
                <div className="flex h-20 w-20 items-center justify-center rounded-lg bg-white">
                  <Image src="/hardrock.jpg" alt="Hard Rock Cafe" width={70} height={40} className="object-contain" />
                </div>
                <div>
                  <h4 className="text-stone-800">Hard Rock Café</h4>
                  <p className="text-sm text-stone-500">Easy option, live music and central location</p>
                </div>
              </a>
            </div>
          </div>

          {/* Top 5 places */}
          <div className="rounded-2xl bg-white p-6">
            <div className="mb-5">
              <h3 className="text-xl text-stone-800">5 places I’d go this week</h3>
              <p className="mt-1 text-sm text-stone-500">
                Not a ranking. Just places I’d actually recommend right now.
              </p>
            </div>

            <div className="space-y-3">
              {places.map((place, i) => (
                <div
                  key={place.name}
                  className={`group rounded-xl border p-4 transition hover:border-stone-300 hover:bg-stone-50 ${
                    i === 0 ? "border-[#1a1f2e] bg-stone-50" : "border-stone-100"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#1a1f2e] text-xs text-white">
                      {i + 1}
                    </span>
                    <span className="font-medium text-stone-800">{place.name}</span>
                    {i === 0 && (
                      <span className="rounded-full bg-[#1a1f2e] px-3 py-1 text-xs text-white">
                        my pick
                      </span>
                    )}
                  </div>

                  <p className="mt-2 text-sm text-stone-500 md:opacity-0 md:transition-opacity md:group-hover:opacity-100">
                    {place.note}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-2xl bg-white p-6">
            <h3 className="mb-2 text-xl text-stone-800">Need help in the city?</h3>
            <p className="mb-4 text-stone-600">
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
          <div className="rounded-2xl bg-white p-6">
            <h3 className="mb-2 text-lg text-stone-800">Weather today</h3>
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

          <div className="rounded-2xl bg-white p-6">
            <h3 className="mb-2 text-lg text-stone-800">Quick contact</h3>
            <p className="mb-4 text-stone-600">
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