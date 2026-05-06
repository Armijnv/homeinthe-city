"use client";

import { client } from "@/sanity/lib/client";
import { hostQuery } from "@/sanity/lib/queries";
import Image from "next/image";
import { useEffect, useState } from "react";

type Lang = "en" | "pt" | "nl";

export default function HostPage({ lang, slug }: { lang: Lang; slug: string }) {
  const [host, setHost] = useState<any>(null);

  useEffect(() => {
    client.fetch(hostQuery, { slug }).then(setHost);
  }, [slug]);

  const labels = {
    en: { whatsapp: "WhatsApp", email: "Email me" },
    pt: { whatsapp: "WhatsApp", email: "Enviar email" },
    nl: { whatsapp: "WhatsApp", email: "Stuur email" },
  };

  const t = labels[lang];

  return (
    <div className="min-h-screen bg-[#1a1f2e] px-6 pt-28 pb-16 text-white">
      <div className="mx-auto grid max-w-5xl grid-cols-1 items-start gap-10 md:grid-cols-3">
        {/* Photo */}
        <div className="md:sticky md:top-28">
          <div className="overflow-hidden rounded-3xl bg-white/10 shadow-2xl">
            <Image
              src={host?.photo?.asset?.url || "/me.png"}
              alt={host?.name || "Host"}
              width={500}
              height={650}
              className="w-full object-cover grayscale"
              priority
            />
          </div>
        </div>

        {/* Main content */}
        <div className="md:col-span-2">
          {/* Flags */}
          <div className="mb-4 flex gap-3 text-xl">
            <a href={`/hosts/${slug}`}>🇬🇧</a>
            <a href={`/pt/hosts/${slug}`}>🇧🇷</a>
            <a href={`/nl/hosts/${slug}`}>🇳🇱</a>
          </div>

          <p className="mb-4 text-sm uppercase tracking-widest text-stone-400">
            {host?.[`eyebrow_${lang}`] ||
              "Local host · Interpreter · Porto Alegre"}
          </p>

          <h1 className="mb-6 text-4xl font-light leading-tight md:text-6xl">
            {host?.[`headline_${lang}`] || host?.name || "Armijn van Dijk"}
          </h1>

          <p className="mb-8 max-w-2xl text-xl leading-relaxed text-stone-300">
            {host?.[`intro_${lang}`] ||
              "I help international business visitors feel confident in Porto Alegre — with language support, local guidance and practical help on the ground."}
          </p>

          {/* Services */}
          <div className="mb-10 rounded-3xl bg-white p-8 text-stone-800">
            <h2 className="mb-4 text-2xl font-light">
              {host?.[`servicesTitle_${lang}`] || "What I can help with"}
            </h2>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              {host?.services?.map((service: any, index: number) => (
                <div
  key={index}
  className="rounded-2xl bg-stone-50 p-4"
>
  <h3 className="mb-2 font-medium text-stone-800">
    {service[`title_${lang}`]}
  </h3>

  <p className="text-sm leading-relaxed text-stone-600">
    {service[`description_${lang}`]}
  </p>
</div>
              ))}
            </div>
          </div>

          {/* About */}
          <div className="mb-10 rounded-3xl bg-white/10 p-8">
            <h2 className="mb-3 text-2xl font-light">
              {host?.[`aboutTitle_${lang}`] || "A little about me"}
            </h2>

            <p className="max-w-2xl leading-relaxed text-stone-300">
              {host?.[`about_${lang}`] ||
                "I grew up in Holland, lived in California and the Caribbean, and have lived in Brazil for more than 25 years. My background is in hospitality, business, hands-on work and building things — which makes me practical, calm and useful when people need help in a new city."}
            </p>
          </div>

          {/* Buttons */}
          <div className="flex flex-col gap-4 sm:flex-row">
            <a
              href={host?.whatsapp || "https://wa.me/+5551997783369"}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block rounded-full bg-white px-8 py-4 text-center text-sm text-stone-900 transition hover:bg-stone-200"
            >
              {t.whatsapp}
            </a>

            <a
              href={`mailto:${host?.email || "armijnvandijk@gmail.com"}`}
              className="inline-block rounded-full border border-white/20 bg-white/10 px-8 py-4 text-center text-sm text-white transition hover:bg-white/20"
            >
              {t.email}
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}