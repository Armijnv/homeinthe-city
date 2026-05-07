"use client";

import MuseumCard from "@/app/components/MuseumCard";
import Image from "next/image";
import { useEffect, useState } from "react";

type Lang = "en" | "pt" | "nl";

/* ======================================================
   WEATHER COMPONENT
====================================================== */

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

  return <p className="text-stone-600">{Math.round(data.temperature_2m)}°C</p>;
}

/* ======================================================
   CITY PAGE CLIENT TEMPLATE
====================================================== */

export default function CityPageClient({
  lang,
  city,
}: {
  lang: Lang;
  city: any;
}) {
  const [open, setOpen] = useState(false);

  const labels = {
    en: {
      liveTitle: "Feel like some live music?",
      liveText: "A few places where something is almost always happening.",
      foodTitle: "Where I’d eat this week",
      foodText: "Simple places I actually go to — not a long list.",
      helpTitle: "Need help in the city?",
      weatherTitle: "Weather today",
      museumTitle: "Museums & exhibitions",
      pick: "my pick",
      cta: "Talk to me",
      profile: "Profile",
    },
    pt: {
      liveTitle: "Quer ouvir música ao vivo?",
      liveText: "Alguns lugares onde sempre acontece algo.",
      foodTitle: "Onde eu comeria esta semana",
      foodText: "Lugares simples que eu realmente recomendo.",
      helpTitle: "Precisa de ajuda na cidade?",
      weatherTitle: "Clima hoje",
      museumTitle: "Museus e exposições",
      pick: "minha escolha",
      cta: "Fale comigo",
      profile: "Perfil",
    },
    nl: {
      liveTitle: "Zin in live muziek?",
      liveText: "Een paar plekken waar altijd wel iets gebeurt.",
      foodTitle: "Waar ik deze week zou eten",
      foodText: "Geen lange lijst, gewoon plekken waar ik zelf ga.",
      helpTitle: "Hulp nodig in de stad?",
      weatherTitle: "Weer vandaag",
      museumTitle: "Musea & tentoonstellingen",
      pick: "mijn keuze",
      cta: "Stuur me een bericht",
      profile: "Profiel",
    },
  };

  const t = labels[lang];

  return (
    <div className="min-h-screen bg-[#1a1f2e] px-6 pt-28 pb-16 md:bg-stone-50">
      <div className="relative mx-auto grid max-w-6xl grid-cols-1 gap-8 md:grid-cols-3">

        {/* ======================================================
            FLOATING HOST PHOTO / CONTACT MENU
        ====================================================== */}

        <div className="fixed right-4 top-24 z-[70] group md:right-8">
          <div
            className="relative h-20 w-20 cursor-pointer md:h-28 md:w-28"
            onClick={() => setOpen(!open)}
          >
            <Image
              src="/me.png"
              alt="Your local host"
              fill
              sizes="(max-width: 768px) 80px, 112px"
              className="rounded-full border-4 border-white object-cover shadow-xl"
            />
          </div>

          {open && (
            <>
              <a
                href={
                  lang === "pt"
                    ? "/pt/hosts/armijn"
                    : lang === "nl"
                    ? "/nl/hosts/armijn"
                    : "/hosts/armijn"
                }
                className="absolute right-32 top-2 rounded-full bg-white px-4 py-2 text-sm shadow-xl hover:bg-stone-100"
              >
                {t.profile}
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

        {/* ======================================================
            LEFT COLUMN
        ====================================================== */}

        <div className="space-y-8 md:col-span-2">

          {/* LANGUAGE FLAGS */}
          <div className="flex gap-3 text-xl">
            <a href="/brazil/porto-alegre" title="English">🇬🇧</a>
            <a href="/pt/brasil/porto-alegre" title="Português">🇧🇷</a>
            <a href="/nl/brazilie/porto-alegre" title="Nederlands">🇳🇱</a>
          </div>

          {/* ======================================================
              HERO / INTRO
          ====================================================== */}

          <div className="rounded-3xl bg-white p-8">
            <h1 className="mb-6 text-4xl font-light text-stone-800 md:text-6xl">
              {city?.[`headline_${lang}`] ||
                "Interpreter in Porto Alegre for Business Meetings"}
            </h1>

            <p className="max-w-2xl text-stone-600">
              {city?.[`intro_${lang}`] ||
                "Your local guide in Porto Alegre for business visits."}
            </p>

            <div className="mt-6 space-y-4">
              {city?.[`introBlocks_${lang}`]?.map(
                (block: string, index: number) => (
                  <p key={index} className="max-w-2xl text-stone-600">
                    {block}
                  </p>
                )
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}