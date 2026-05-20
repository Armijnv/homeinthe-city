"use client";

import Link from "next/link";

type Lang = "en" | "pt" | "nl";

type ServicePageData = {
  eyebrow_en?: string;
  eyebrow_pt?: string;
  eyebrow_nl?: string;

  title_en?: string;
  title_pt?: string;
  title_nl?: string;

  intro_en?: string;
  intro_pt?: string;
  intro_nl?: string;

  sections?: {
    title_en?: string;
    title_pt?: string;
    title_nl?: string;
    text_en?: string;
    text_pt?: string;
    text_nl?: string;
  }[];

  pricingTitle_en?: string;
  pricingTitle_pt?: string;
  pricingTitle_nl?: string;

  pricingItems?: {
    label_en?: string;
    label_pt?: string;
    label_nl?: string;
    detail_en?: string;
    detail_pt?: string;
    detail_nl?: string;
  }[];

  ctaTitle_en?: string;
  ctaTitle_pt?: string;
  ctaTitle_nl?: string;

  ctaText_en?: string;
  ctaText_pt?: string;
  ctaText_nl?: string;

  button_en?: string;
  button_pt?: string;
  button_nl?: string;
};

const portugueseSeoSections = [
  {
    title: "Reuniões de negócios",
    text:
      "Apoio empresas e visitantes estrangeiros em reuniões comerciais, apresentações, negociações e conversas presenciais em Porto Alegre. O foco é manter a comunicação clara entre português e inglês, com atenção ao contexto cultural e ao objetivo da visita.",
  },
  {
    title: "Visitas técnicas e fábricas",
    text:
      "Também acompanho visitas técnicas, visitas a fábricas, fornecedores, parceiros locais e operações no Rio Grande do Sul. Além da interpretação, ajudo a organizar a comunicação no local para que perguntas, explicações técnicas e próximos passos fiquem claros.",
  },
  {
    title: "Intérprete inglês-português",
    text:
      "Atuo como intérprete inglês-português em Porto Alegre para visitantes que precisam conversar com empresas brasileiras, equipes locais, fornecedores ou clientes. Quando necessário, também posso apoiar conversas em holandês.",
  },
  {
    title: "Acompanhamento empresarial",
    text:
      "O acompanhamento empresarial inclui presença durante compromissos, deslocamentos relacionados à agenda, comunicação com contatos locais e apoio prático para que a visita de negócios aconteça com mais tranquilidade.",
  },
  {
    title: "Apoio local para visitantes estrangeiros",
    text:
      "Para quem chega de fora do Brasil, Porto Alegre pode exigir ajuda além do idioma. Posso orientar visitantes estrangeiros com costumes locais, restaurantes, horários, deslocamentos e situações práticas durante a estadia.",
  },
];

function fixKnownTypos(text?: string) {
  return text?.replace("Brazlië", "Brazilië");
}

export default function InterpreterServicePage({
  lang,
  page,
}: {
  lang: Lang;
  page: ServicePageData;
}) {
  return (
    <main className="min-h-screen bg-stone-50 px-6 pt-32 pb-20">
      <div className="mx-auto max-w-3xl">
        {/* ======================================================
            HERO
        ====================================================== */}

        <div className="mb-12">
          <p className="mb-4 text-sm uppercase tracking-[0.25em] text-stone-500">
            {page[`eyebrow_${lang}`]}
          </p>

          <h1 className="mb-6 text-5xl font-light leading-tight text-stone-800">
            {fixKnownTypos(page[`title_${lang}`])}
          </h1>

          <p className="max-w-2xl text-lg leading-relaxed text-stone-600">
            {page[`intro_${lang}`]}
          </p>
        </div>

        {/* ======================================================
            CMS PAGE SECTIONS
        ====================================================== */}

        <div className="space-y-12">
          {page.sections?.map((section, index) => (
            <div key={index} className="rounded-3xl bg-white p-8 shadow-sm">
              <h2 className="mb-6 text-2xl text-stone-800">
                {section[`title_${lang}`]}
              </h2>

              <p className="whitespace-pre-line leading-relaxed text-stone-600">
                {section[`text_${lang}`]}
              </p>
            </div>
          ))}

          {lang === "pt" &&
            portugueseSeoSections.map((section) => (
              <div key={section.title} className="rounded-3xl bg-white p-8 shadow-sm">
                <h2 className="mb-6 text-2xl text-stone-800">
                  {section.title}
                </h2>

                <p className="whitespace-pre-line leading-relaxed text-stone-600">
                  {section.text}
                </p>
              </div>
            ))}
        </div>

        {/* ======================================================
            PRICING
        ====================================================== */}

        {page.pricingItems && page.pricingItems.length > 0 && (
          <div className="my-12 rounded-3xl bg-white p-8 shadow-sm">
            <h2 className="mb-6 text-2xl text-stone-800">
              {page[`pricingTitle_${lang}`]}
            </h2>

            <div className="space-y-4">
              {page.pricingItems.map((item, index) => (
                <div
                  key={index}
                  className="flex flex-col justify-between gap-1 border-b border-stone-100 pb-4 last:border-b-0 last:pb-0 sm:flex-row"
                >
                  <span className="font-medium text-stone-800">
                    {item[`label_${lang}`]}
                  </span>

                  <span className="text-stone-600">
                    {item[`detail_${lang}`]}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ======================================================
            CTA
        ====================================================== */}

        <div className="rounded-3xl bg-[#1a1f2e] p-8 text-white">
          <h2 className="mb-4 text-3xl font-light">
            {page[`ctaTitle_${lang}`]}
          </h2>

          <p className="mb-6 max-w-xl text-stone-300">
            {page[`ctaText_${lang}`]}
          </p>

          <Link
            href="https://wa.me/5551997783369"
            className="inline-block rounded-full bg-white px-6 py-4 text-sm text-stone-900 transition hover:bg-stone-200"
          >
            {page[`button_${lang}`]}
          </Link>
        </div>
      </div>
    </main>
  );
}
