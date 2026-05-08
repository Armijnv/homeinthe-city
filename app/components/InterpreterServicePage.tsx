"use client";

import Link from "next/link";

type Lang = "en" | "pt" | "nl";

/* ======================================================
   CONTENT
====================================================== */

const content = {
  en: {
    eyebrow: "Porto Alegre · Brazil",

    title: "Interpreter in Porto Alegre for Business Meetings",

    intro:
      "I help international business visitors communicate clearly and move comfortably through Porto Alegre during meetings, factory visits and company introductions.",

    servicesTitle: "Services",

    services: [
      "On-site interpreting during meetings",
      "Factory and supplier visits",
      "Local business coordination",
      "Airport pickup and transport guidance",
      "Restaurant and city recommendations",
      "English · Portuguese · Dutch",
    ],

    supportTitle: "Local support that goes beyond translation",

    supportText:
      "Business trips run smoother when someone local helps bridge both the language and the culture. I assist visitors during negotiations, technical visits and day-to-day logistics so communication stays relaxed and efficient.",

    translationTitle: "Translation & local coordination",

    translationText:
      "Besides interpreting during meetings, I can also help with practical communication, written translations and local coordination before or during your stay in Porto Alegre.",

    ctaTitle: "Coming to Porto Alegre?",

    ctaText:
      "Send me your dates and meeting schedule and I’ll let you know how I can help.",

    button: "Contact on WhatsApp",
  },

  pt: {
    eyebrow: "Porto Alegre · Brasil",

    title: "Intérprete em Porto Alegre para reuniões de negócios",

    intro:
      "Ajudo visitantes internacionais a se comunicarem com clareza e se movimentarem com tranquilidade por Porto Alegre durante reuniões, visitas técnicas e apresentações empresariais.",

    servicesTitle: "Serviços",

    services: [
      "Interpretação presencial em reuniões",
      "Visitas a fábricas e fornecedores",
      "Coordenação local para negócios",
      "Recepção no aeroporto e orientação de transporte",
      "Recomendações de restaurantes e da cidade",
      "Inglês · Português · Holandês",
    ],

    supportTitle: "Apoio local que vai além da tradução",

    supportText:
      "Viagens de negócios funcionam melhor quando alguém local ajuda a conectar idioma e cultura. Auxilio visitantes em negociações, visitas técnicas e logística diária para manter a comunicação leve e eficiente.",

    translationTitle: "Tradução e coordenação local",

    translationText:
      "Além da interpretação durante reuniões, também posso ajudar com comunicação prática, traduções escritas e coordenação local antes ou durante sua estadia em Porto Alegre.",

    ctaTitle: "Vindo para Porto Alegre?",

    ctaText:
      "Envie suas datas e agenda de reuniões e eu aviso como posso ajudar.",

    button: "Contato no WhatsApp",
  },

  nl: {
    eyebrow: "Porto Alegre · Brazilië",

    title: "Tolk in Porto Alegre voor zakelijke meetings",

    intro:
      "Ik help internationale zakenbezoekers helder communiceren en zich comfortabel door Porto Alegre bewegen tijdens meetings, fabrieksbezoeken en bedrijfsintroducties.",

    servicesTitle: "Diensten",

    services: [
      "Tolkdiensten tijdens meetings",
      "Bezoeken aan fabrieken en leveranciers",
      "Lokale zakelijke coördinatie",
      "Airport pickup en transporthulp",
      "Restaurant- en stadstips",
      "Engels · Portugees · Nederlands",
    ],

    supportTitle: "Lokale ondersteuning die verder gaat dan vertalen",

    supportText:
      "Zakenreizen verlopen soepeler wanneer iemand lokaal helpt de brug te slaan tussen taal en cultuur. Ik ondersteun bezoekers tijdens onderhandelingen, technische bezoeken en dagelijkse logistiek zodat communicatie ontspannen en efficiënt blijft.",

    translationTitle: "Vertaling & lokale coördinatie",

    translationText:
      "Naast tolken tijdens meetings kan ik ook helpen met praktische communicatie, geschreven vertalingen en lokale coördinatie voor of tijdens uw verblijf in Porto Alegre.",

    ctaTitle: "Komt u naar Porto Alegre?",

    ctaText:
      "Stuur uw data en meetingschema door en ik laat weten hoe ik kan helpen.",

    button: "Contact via WhatsApp",
  },
};

/* ======================================================
   PAGE
====================================================== */

export default function InterpreterServicePage({
  lang,
}: {
  lang: Lang;
}) {
  const t = content[lang];

  return (
    <main className="min-h-screen bg-stone-50 px-6 pt-32 pb-20">
      <div className="mx-auto max-w-3xl">

        {/* ======================================================
            HERO
        ====================================================== */}

        <div className="mb-12">
          <p className="mb-4 text-sm uppercase tracking-[0.25em] text-stone-500">
            {t.eyebrow}
          </p>

          <h1 className="mb-6 text-5xl font-light leading-tight text-stone-800">
            {t.title}
          </h1>

          <p className="max-w-2xl text-lg leading-relaxed text-stone-600">
            {t.intro}
          </p>
        </div>

        {/* ======================================================
            SERVICES
        ====================================================== */}

        <div className="mb-12 rounded-3xl bg-white p-8 shadow-sm">
          <h2 className="mb-6 text-2xl text-stone-800">
            {t.servicesTitle}
          </h2>

          <div className="space-y-4 text-stone-600">
            {t.services.map((service) => (
              <p key={service}>• {service}</p>
            ))}
          </div>
        </div>

        {/* ======================================================
            SUPPORT
        ====================================================== */}

        <div className="mb-12 rounded-3xl bg-white p-8 shadow-sm">
          <h2 className="mb-6 text-2xl text-stone-800">
            {t.supportTitle}
          </h2>

          <p className="leading-relaxed text-stone-600">
            {t.supportText}
          </p>
        </div>

        {/* ======================================================
            TRANSLATION / COORDINATION
        ====================================================== */}

        <div className="mb-12 rounded-3xl bg-white p-8 shadow-sm">
          <h2 className="mb-6 text-2xl text-stone-800">
            {t.translationTitle}
          </h2>

          <p className="leading-relaxed text-stone-600">
            {t.translationText}
          </p>
        </div>

        {/* ======================================================
            CTA
        ====================================================== */}

        <div className="rounded-3xl bg-[#1a1f2e] p-8 text-white">
          <h2 className="mb-4 text-3xl font-light">
            {t.ctaTitle}
          </h2>

          <p className="mb-6 max-w-xl text-stone-300">
            {t.ctaText}
          </p>

          <Link
            href="https://wa.me/5551997783369"
            className="inline-block rounded-full bg-white px-6 py-4 text-sm text-stone-900 transition hover:bg-stone-200"
          >
            {t.button}
          </Link>
        </div>
      </div>
    </main>
  );
}