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

  if (!data) return <p className="text-stone-400">Loading weather...</p>;

  return <p className="text-stone-600">{Math.round(data.temperature_2m)}°C</p>;
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
    <div className="relative min-h-screen overflow-hidden bg-stone-50 px-6 pt-28 pb-24">
      <div className="pointer-events-none fixed inset-0 -z-20 hidden bg-[url('/porto-alegre-desktop-background.jpg')] bg-cover bg-center md:block" />
      <div className="pointer-events-none fixed inset-0 -z-10 hidden bg-white/45 md:block" />

      <div className="relative mx-auto grid max-w-6xl grid-cols-1 gap-8 md:grid-cols-3">
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

        <div className="space-y-8 md:col-span-2">
          <div className="flex gap-3 text-xl">
            <a href="/brazil/porto-alegre">🇬🇧</a>
            <a href="/pt/brasil/porto-alegre">🇧🇷</a>
            <a href="/nl/brazilie/porto-alegre">🇳🇱</a>
          </div>

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

          <PortoMap places={places} lang={lang} />

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

        <div className="space-y-6 pt-24 md:pt-0">
          <div className="rounded-2xl bg-white/95 p-6 shadow-xl shadow-black/10 backdrop-blur-sm">
            <h3 className="mb-2 text-lg text-stone-800">{t.weatherTitle}</h3>
            <Weather />
          </div>

          {sidebarCards.map((card, index) => (
            <div
              key={index}
              className="rounded-2xl bg-white/95 p-6 shadow-xl shadow-black/10 backdrop-blur-sm"
            >
              <h3 className="mb-3 text-lg text-stone-800">
                {card[`title_${lang}`]}
              </h3>

              <p className="mb-5 text-sm leading-relaxed text-stone-600">
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
