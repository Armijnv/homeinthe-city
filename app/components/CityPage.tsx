"use client";

import { client } from "@/sanity/lib/client";
import { cityQuery } from "@/sanity/lib/queries";
import Image from "next/image";
import { useEffect, useState } from "react";
import dynamic from "next/dynamic";

const PortoMap = dynamic(
  () => import("@/app/components/PortoMap").then((mod) => mod.default),
  {
    ssr: false,
    loading: () => (
      <div className="rounded-3xl bg-white p-6">
        <div className="h-[500px] rounded-2xl bg-stone-100" />
      </div>
    ),
  }
);

type Lang = "en" | "pt" | "nl";

type MapPlace = {
  name: string;
  category?: string;
  description_en?: string;
  description_pt?: string;
  description_nl?: string;
  detail_en?: string;
  detail_pt?: string;
  detail_nl?: string;
  latitude?: number;
  longitude?: number;
  googleMaps?: string;
  website?: string;
  favorite?: boolean;
  image?: {
    asset?: {
      url?: string;
    };
  };
};

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
   PLACE SECTION
====================================================== */

function PlaceSection({
  title,
  text,
  places,
  lang,
  pickLabel,
}: {
  title: string;
  text: string;
  places: MapPlace[];
  lang: Lang;
  pickLabel: string;
}) {
  if (!places.length) return null;

  return (
    <div className="rounded-2xl bg-white p-6">
      <h2 className="mb-2 text-xl text-stone-800">{title}</h2>
      <p className="mb-4 text-sm text-stone-500">{text}</p>

      <div className="space-y-4">
        {places.map((place) => (
          <a
            key={place.name}
            href={place.googleMaps || place.website || "#"}
            target="_blank"
            rel="noopener noreferrer"
            className="flex gap-4 rounded-xl border border-stone-100 p-4 transition hover:border-stone-300 hover:bg-stone-50"
          >
            {place.image?.asset?.url && (
              <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-xl bg-stone-100">
                <Image
                  src={place.image.asset.url}
                  alt={place.name}
                  fill
                  sizes="80px"
                  className="object-cover"
                />
              </div>
            )}

            <div>
              <div className="mb-1 flex flex-wrap items-center gap-2">
                <h3 className="font-medium text-stone-800">{place.name}</h3>

                {place.favorite && (
                  <span className="rounded-full bg-[#1a1f2e] px-3 py-1 text-xs text-white">
                    {pickLabel}
                  </span>
                )}
              </div>

              {(place[`detail_${lang}`] || place.detail_en) && (
                <p className="mb-1 text-xs uppercase tracking-widest text-stone-400">
                  {place[`detail_${lang}`] || place.detail_en}
                </p>
              )}

              <p className="text-sm text-stone-500">
                {place[`description_${lang}`] || place.description_en}
              </p>
            </div>
          </a>
        ))}
      </div>
    </div>
  );
}

/* ======================================================
   CITY PAGE TEMPLATE
====================================================== */

export default function CityPage({ lang }: { lang: Lang }) {
  const [city, setCity] = useState<any>(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    client.fetch(cityQuery, { slug: "porto-alegre" }).then(setCity);
  }, []);

  const labels = {
    en: {
      restaurantsTitle: "Where I’d eat this week",
      restaurantsText: "Simple places I actually go to — not a long list.",
      museumsTitle: "Museums & exhibitions",
      museumsText: "Cultural places worth visiting while you are in the city.",
      venuesTitle: "Feel like some live music?",
      venuesText: "A few places where something is almost always happening.",
      cafesTitle: "Coffee stops",
      cafesText: "Good places for coffee, conversation or a short break.",
      businessTitle: "Useful for business visitors",
      businessText: "Places that can help make a work trip smoother.",
      walksTitle: "Walks & city moments",
      walksText: "Easy places to walk, breathe and understand the city.",
      helpTitle: "Need help in the city?",
      weatherTitle: "Weather today",
      pick: "my pick",
      cta: "Talk to me",
      profile: "Profile",
    },
    pt: {
      restaurantsTitle: "Onde eu comeria esta semana",
      restaurantsText: "Lugares simples que eu realmente recomendo.",
      museumsTitle: "Museus e exposições",
      museumsText: "Lugares culturais que valem a visita na cidade.",
      venuesTitle: "Quer ouvir música ao vivo?",
      venuesText: "Alguns lugares onde sempre acontece algo.",
      cafesTitle: "Cafés",
      cafesText: "Bons lugares para café, conversa ou uma pausa rápida.",
      businessTitle: "Útil para visitantes de negócios",
      businessText: "Lugares que podem facilitar uma viagem de trabalho.",
      walksTitle: "Caminhadas e momentos na cidade",
      walksText: "Lugares fáceis para caminhar, respirar e entender a cidade.",
      helpTitle: "Precisa de ajuda na cidade?",
      weatherTitle: "Clima hoje",
      pick: "minha escolha",
      cta: "Fale comigo",
      profile: "Perfil",
    },
    nl: {
      restaurantsTitle: "Waar ik deze week zou eten",
      restaurantsText: "Geen lange lijst, gewoon plekken waar ik zelf ga.",
      museumsTitle: "Musea & tentoonstellingen",
      museumsText: "Culturele plekken die de moeite waard zijn in de stad.",
      venuesTitle: "Zin in live muziek?",
      venuesText: "Een paar plekken waar altijd wel iets gebeurt.",
      cafesTitle: "Koffiestops",
      cafesText: "Goede plekken voor koffie, gesprek of een korte pauze.",
      businessTitle: "Handig voor zakelijke bezoekers",
      businessText: "Plekken die een zakenreis makkelijker kunnen maken.",
      walksTitle: "Wandelen & stadsmomenten",
      walksText: "Makkelijke plekken om te wandelen, ademen en de stad te voelen.",
      helpTitle: "Hulp nodig in de stad?",
      weatherTitle: "Weer vandaag",
      pick: "mijn keuze",
      cta: "Stuur me een bericht",
      profile: "Profiel",
    },
  };

  const t = labels[lang];
  const places: MapPlace[] = city?.mapPlaces || [];

  const restaurants = places.filter((place) => place.category === "restaurant");
  const museums = places.filter((place) => place.category === "museum");
  const venues = places.filter((place) => place.category === "liveMusic");
  const cafes = places.filter((place) => place.category === "coffee");
  const business = places.filter((place) => place.category === "business");
  const walks = places.filter((place) => place.category === "walk");

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#1a1f2e] px-6 pt-28 pb-16 md:bg-stone-50">
      {/* ======================================================
          CITY BACKGROUND IMAGE
      ====================================================== */}

      <div className="pointer-events-none absolute inset-x-0 top-0 h-[520px] bg-[url('/porto-alegre-desktop-background.jpg')] hidden md:block bg-cover bg-center opacity-80" />
      <div className="pointer-events-none absolute inset-x-0 top-0 h-[520px] bg-gradient-to-b from-[#1a1f2e]/30 via-white/45 to-stone-50" />

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
            <a href="/brazil/porto-alegre" title="English">
              🇬🇧
            </a>
            <a href="/pt/brasil/porto-alegre" title="Português">
              🇧🇷
            </a>
            <a href="/nl/brazilie/porto-alegre" title="Nederlands">
              🇳🇱
            </a>
          </div>

          {/* ======================================================
              HERO / INTRO
          ====================================================== */}

          <div className="rounded-3xl bg-white/95 p-8 shadow-xl shadow-black/10 backdrop-blur-sm">
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

          {/* ======================================================
              MAP
          ====================================================== */}

          <PortoMap places={places} lang={lang} />

          {/* ======================================================
              MAP PLACE SECTIONS
          ====================================================== */}

          {/* ======================================================
              HELP / CTA
          ====================================================== */}

          <div className="rounded-2xl bg-white p-6 shadow-sm">
            <h2 className="mb-2 text-xl text-stone-800">{t.helpTitle}</h2>

            <a
              href="https://wa.me/+5551997783369"
              target="_blank"
              className="inline-block rounded-full bg-[#1a1f2e] px-5 py-3 text-sm text-white hover:bg-stone-800"
            >
              {city?.[`cta_${lang}`] || t.cta}
            </a>
          </div>
        </div>

        {/* ======================================================
            RIGHT COLUMN
        ====================================================== */}

        <div className="space-y-6 pt-24 md:pt-0">
          {/* WEATHER */}
          <div className="rounded-2xl bg-white/95 p-6 shadow-xl shadow-black/10 backdrop-blur-sm">
            <h3 className="mb-2 text-lg text-stone-800">{t.weatherTitle}</h3>
            <Weather />
          </div>
        </div>
      </div>
    </div>
  );
}
