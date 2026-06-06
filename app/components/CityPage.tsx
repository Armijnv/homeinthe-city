"use client";

import { client } from "@/sanity/lib/client";
import { cityQuery } from "@/sanity/lib/queries";
import Image from "next/image";
import Link from "next/link";
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

type CityContent = {
  headline_en?: string;
  headline_pt?: string;
  headline_nl?: string;
  intro_en?: string;
  intro_pt?: string;
  intro_nl?: string;
  introBlocks_en?: string[];
  introBlocks_pt?: string[];
  introBlocks_nl?: string[];
  mapPlaces?: MapPlace[];
  sidebarCards?: SidebarCard[];
  cta_en?: string;
  cta_pt?: string;
  cta_nl?: string;
};

type WeatherData = {
  temperature_2m: number;
};

/* ======================================================
   PORTO ALEGRE CITY GUIDE CONTENT
====================================================== */

const cityGuideContent = {
  en: {
    title: "Porto Alegre: Your Local Guide in Southern Brazil",
    intro:
      "Discover restaurants, business locations, cultural venues, walks, practical information and trusted local contacts for your stay in Porto Alegre.",
    hostLine:
      "Hosted by Armijn van Dijk, your local contact for business visits, interpretation, housing and practical support in the city.",
    serviceCards: [
      {
        title: "Business interpreter in Porto Alegre",
        text: "Language support for meetings, company visits and local business conversations.",
        button: "Interpreter services",
        href: "/interpreter-porto-alegre",
      },
      {
        title: "Document translation",
        text: "Written translation support for documents, business communication and local projects.",
        button: "Translation services",
        href: "/translation-services",
      },
      {
        title: "Apartments and real estate",
        text: "Furnished stays, rentals and buying guidance for short or longer stays in Porto Alegre.",
        button: "Real estate",
        href: "/real-estate/porto-alegre",
      },
      {
        title: "Local business support",
        text: "Practical help with local planning, restaurants, transport, contacts and meeting days.",
        button: "Meet your host",
        href: "/hosts/armijn",
      },
    ],
  },
  pt: {
    title: "Porto Alegre: Seu Guia Local no Sul do Brasil",
    intro:
      "Descubra restaurantes, locais para negócios, espaços culturais, caminhadas, informações práticas e contatos locais confiáveis para sua estadia em Porto Alegre.",
    hostLine:
      "Com curadoria de Armijn van Dijk, seu contato local para visitas de negócios, interpretação, hospedagem e apoio prático na cidade.",
    serviceCards: [
      {
        title: "Intérprete de negócios em Porto Alegre",
        text: "Apoio no idioma para reuniões, visitas a empresas e conversas de negócios locais.",
        button: "Serviços de intérprete",
        href: "/pt/interprete-porto-alegre",
      },
      {
        title: "Tradução de documentos",
        text: "Apoio em tradução escrita para documentos, comunicação empresarial e projetos locais.",
        button: "Serviços de tradução",
        href: "/pt/servicos-de-traducao",
      },
      {
        title: "Apartamentos e imóveis",
        text: "Estadias mobiliadas, aluguel e orientação de compra para visitas curtas ou mais longas.",
        button: "Imóveis",
        href: "/pt/imoveis/porto-alegre",
      },
      {
        title: "Apoio empresarial local",
        text: "Ajuda prática com planejamento local, restaurantes, transporte, contatos e dias de reunião.",
        button: "Conheça seu anfitrião",
        href: "/pt/hosts/armijn",
      },
    ],
  },
  nl: {
    title: "Porto Alegre: Uw Lokale Gids in Zuid-Brazilië",
    intro:
      "Ontdek restaurants, zakelijke locaties, culturele plekken, wandelroutes, praktische informatie en betrouwbare lokale contacten voor uw verblijf in Porto Alegre.",
    hostLine:
      "Samengesteld door Armijn van Dijk, uw lokale contact voor zakelijke bezoeken, tolken, verblijf en praktische ondersteuning in de stad.",
    serviceCards: [
      {
        title: "Business tolk in Porto Alegre",
        text: "Taalondersteuning voor meetings, bedrijfsbezoeken en lokale zakelijke gesprekken.",
        button: "Tolkdiensten",
        href: "/nl/tolk-porto-alegre",
      },
      {
        title: "Documentvertaling",
        text: "Schriftelijke vertaalhulp voor documenten, zakelijke communicatie en lokale projecten.",
        button: "Vertaaldiensten",
        href: "/nl/vertaaldiensten",
      },
      {
        title: "Appartementen en vastgoed",
        text: "Gemeubileerde verblijven, huur en koophulp voor korte of langere verblijven in Porto Alegre.",
        button: "Vastgoed",
        href: "/nl/vastgoed/porto-alegre",
      },
      {
        title: "Lokale zakelijke hulp",
        text: "Praktische hulp met lokale planning, restaurants, vervoer, contacten en meetingdagen.",
        button: "Ontmoet uw host",
        href: "/nl/hosts/armijn",
      },
    ],
  },
};

function normalizeHref(href?: string) {
  return href?.replace(/\/$/, "") || "";
}

function getLocalizedHref(card: SidebarCard, lang: Lang) {
  return normalizeHref(card[`href_${lang}`]);
}

function getLocalizedCardText(card: SidebarCard, lang: Lang) {
  return [
    card[`title_${lang}`],
    card[`text_${lang}`],
    card[`button_${lang}`],
    card[`href_${lang}`],
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();
}

function isDuplicateServiceCard(card: SidebarCard, lang: Lang, serviceHrefs: Set<string>) {
  if (serviceHrefs.has(getLocalizedHref(card, lang))) return true;

  const text = getLocalizedCardText(card, lang);

  return [
    /interpreter|int[eé]rprete|tolk/,
    /translation|translator|tradu[cç][aã]o|tradutor|vertaling|vertaler/,
    /real estate|apartment|apartamento|im[oó]ve|vastgoed/,
    /business support|apoio empresarial|lokale zakelijke hulp/,
  ].some((pattern) => pattern.test(text));
}

function Weather() {
  const [data, setData] = useState<WeatherData | null>(null);

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
  const [city, setCity] = useState<CityContent | null>(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    client.fetch<CityContent | null>(cityQuery, { slug: "porto-alegre" }).then(setCity);
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
  const guide = cityGuideContent[lang];
  const serviceHrefs = new Set(
    guide.serviceCards.map((card) => normalizeHref(card.href))
  );
  const sidebarCards: SidebarCard[] = (city?.sidebarCards || []).filter(
    (card) => !isDuplicateServiceCard(card, lang, serviceHrefs)
  );

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
              {guide.title}
            </h1>

            <p className="max-w-2xl font-medium leading-relaxed text-stone-700">
              {guide.intro}
            </p>

            <p className="mt-4 max-w-2xl leading-relaxed text-stone-700">
              {guide.hostLine}
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

          {/* ======================================================
             SECONDARY SERVICE ENTRY POINTS
          ====================================================== */}

          {guide.serviceCards.map((card) => (
            <div
              key={card.href}
              className="rounded-2xl bg-white/97 p-6 shadow-xl shadow-black/10 backdrop-blur-md"
            >
              <h3 className="mb-3 text-lg font-medium text-black">
                {card.title}
              </h3>

              <p className="mb-5 text-sm leading-relaxed text-stone-700">
                {card.text}
              </p>

              <Link
                href={card.href}
                className="inline-block rounded-full bg-[#1a1f2e] px-5 py-3 text-sm text-white hover:bg-stone-800"
              >
                {card.button}
              </Link>
            </div>
          ))}

          {/* ======================================================
             SANITY CITY CARDS
          ====================================================== */}

          {sidebarCards.map((card, index) => (
            <div
              key={`${getLocalizedHref(card, lang)}-${index}`}
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
