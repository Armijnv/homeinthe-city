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

type SidebarCard = {
  title_en?: string;
  title_pt?: string;
  title_nl?: string;
  text_en?: string;
  text_pt?: string;
  text_nl?: string;
  button_en?: string;
  button_pt?: string;
  button_nl?: string;
  href_en?: string;
  href_pt?: string;
  href_nl?: string;
};

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

function Weather() {
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    fetch(
      "https://api.open-meteo.com/v1/forecast?latitude=-30.03&longitude=-51.23&current=temperature_2m,weather_code"
    )
      .then((res) => res.json())
      .then((json) => setData(json.current));
  }, []);

  if (!data) return <p className="text-stone-500">Loading weather...</p>;

  return (
    <p className="font-medium text-stone-700">
      {Math.round(data.temperature_2m)}°C
    </p>
  );
}

export default function CityPage({ lang }: { lang: Lang }) {
  const [city, setCity] = useState<any>(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    client.fetch(cityQuery, { slug: "porto-alegre" }).then(setCity);
  }, []);

  const labels = {
    en: {
      helpTitle: "Need help in the city?",
      weatherTitle: "Weather today",
      cta: "Talk to me",
      profile: "Profile",
    },
    pt: {
      helpTitle: "Precisa de ajuda na cidade?",
      weatherTitle: "Clima hoje",
      cta: "Fale comigo",
      profile: "Perfil",
    },
    nl: {
      helpTitle: "Hulp nodig in de stad?",
      weatherTitle: "Weer vandaag",
      cta: "Stuur me een bericht",
      profile: "Profiel",
    },
  };

  const t = labels[lang];
  const places: MapPlace[] = city?.mapPlaces || [];
  const sidebarCards: SidebarCard[] = city?.sidebarCards || [];

  return (
    <div className="relative z-10 min-h-screen overflow-hidden bg-stone-50 px-6 pt-28 pb-14 md:bg-transparent">
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-white/10 via-transparent to-white/20" />

      <div className="relative mx-auto grid max-w-6xl grid-cols-1 gap-8 md:grid-cols-3">
        <div className="fixed right-4 top-24 z-[70] group md:right-8 lg:top-24">
          <div
            className="relative h-20 w-20 cursor-pointer md:h-24 md:w-24 lg:h-28 lg:w-28"
            onClick={() => setOpen(!open)}
          >
            <Image
              src="/me.png"
              alt="Your local host"
              fill
              sizes="(max-width: 768px) 80px, (max-width: 1024px) 96px, 112px"
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
                className="absolute right-28 top-2 rounded-full bg-white px-4 py-2 text-sm font-medium text-stone-900 shadow-xl hover:bg-stone-100 md:right-28 lg:right-32"
              >
                {t.profile}
              </a>

              <a
                href="https://wa.me/+5551997783369"
                target="_blank"
                className="absolute right-32 top-16 rounded-full bg-white px-4 py-2 text-sm font-medium text-stone-900 shadow-xl hover:bg-stone-100 md:right-32 lg:right-36 lg:top-20"
              >
                WhatsApp
              </a>

              <a
                href="mailto:contact@homeinthe.city"
                className="absolute right-20 top-[7.5rem] rounded-full bg-white px-4 py-2 text-sm font-medium text-stone-900 shadow-xl hover:bg-stone-100 md:right-20 lg:right-24 lg:top-36"
              >
                Email
              </a>
            </>
          )}
        </div>

        <div className="space-y-8 md:col-span-2">
          <div className="flex gap-3 text-xl">
            <a href="/brazil/porto-alegre">🇬🇧</a>
            <a href="/pt/brasil/porto-alegre">🇧🇷</a>
            <a href="/nl/brazilie/porto-alegre">🇳🇱</a>
          </div>

          <div className="rounded-3xl bg-white/97 p-8 shadow-2xl shadow-black/15 backdrop-blur-md">
            <h1 className="mb-6 text-4xl font-normal tracking-tight text-black md:text-6xl">
              {city?.[`headline_${lang}`] ||
                "Interpreter in Porto Alegre for Business Meetings"}
            </h1>

            <p className="max-w-2xl font-medium leading-relaxed text-stone-700">
              {city?.[`intro_${lang}`] ||
                "Your local guide in Porto Alegre for business visits."}
            </p>

            <div className="mt-6 space-y-4">
              {city?.[`introBlocks_${lang}`]?.map(
                (block: string, index: number) => (
                  <p
                    key={index}
                    className="max-w-2xl leading-relaxed text-stone-700"
                  >
                    {block}
                  </p>
                )
              )}
            </div>
          </div>

          <PortoMap places={places} lang={lang} />

          <div className="rounded-2xl bg-white/97 p-6 shadow-lg shadow-black/10 backdrop-blur-sm">
            <h2 className="mb-2 text-xl font-medium text-black">{t.helpTitle}</h2>

            <a
              href="https://wa.me/+5551997783369"
              target="_blank"
              className="inline-block rounded-full bg-[#1a1f2e] px-5 py-3 text-sm text-white hover:bg-stone-800"
            >
              {city?.[`cta_${lang}`] || t.cta}
            </a>
          </div>
        </div>

        <div className="space-y-6 pt-24 md:pt-36 lg:pt-0">
          <div className="rounded-2xl bg-white/97 p-6 shadow-xl shadow-black/10 backdrop-blur-md">
            <h3 className="mb-2 text-lg font-medium text-black">{t.weatherTitle}</h3>
            <Weather />
          </div>

          {sidebarCards.map((card, index) => (
            <div
              key={index}
              className="rounded-2xl bg-white/97 p-6 shadow-xl shadow-black/10 backdrop-blur-md"
            >
              <h3 className="mb-3 text-lg font-medium text-black">
                {card[`title_${lang}`]}
              </h3>

              <p className="mb-5 text-sm leading-relaxed text-stone-700">
                {card[`text_${lang}`]}
              </p>

              <a
                href={card[`href_${lang}`]}
                className="inline-block rounded-full bg-[#1a1f2e] px-5 py-3 text-sm text-white hover:bg-stone-800"
              >
                {card[`button_${lang}`]}
              </a>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
