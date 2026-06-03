import Link from "next/link";

type Lang = "en" | "pt" | "nl";

const content = {
  en: {
    eyebrow: "Translation services",
    title: "English, Portuguese and Dutch document translation",
    intro:
      "Professional translation support for people and businesses working between English, Portuguese and Dutch.",
    sections: [
      {
        title: "Clear written translations",
        text:
          "Get careful document translation for business communication, immigration paperwork, personal documents, websites and local projects where accuracy and tone both matter.",
      },
      {
        title: "Portuguese, English and Dutch",
        text:
          "Translation work can support English to Portuguese, Portuguese to English, Dutch to Portuguese, Portuguese to Dutch, English to Dutch and Dutch to English needs.",
      },
      {
        title: "Verified translator",
        text:
          "Luciana Graziuso is currently the verified translator on Home in the City, with long experience helping clients communicate clearly across these languages.",
      },
    ],
    ctaTitle: "Work with Luciana",
    ctaText:
      "View Luciana's profile to learn more about her translation services and contact options.",
    button: "Luciana profile",
    profileHref: "/providers/luciana",
  },
  pt: {
    eyebrow: "Serviços de tradução",
    title: "Tradução de documentos em português, inglês e holandês",
    intro:
      "Apoio profissional para pessoas e empresas que precisam traduzir documentos entre português, inglês e holandês.",
    sections: [
      {
        title: "Traduções escritas com clareza",
        text:
          "Tradução cuidadosa para comunicação empresarial, documentos pessoais, imigração, sites e projetos locais em que precisão e tom são importantes.",
      },
      {
        title: "Português, inglês e holandês",
        text:
          "O serviço atende traduções entre português, inglês e holandês, incluindo combinações nos dois sentidos conforme a necessidade do documento.",
      },
      {
        title: "Tradutora verificada",
        text:
          "Luciana Graziuso é atualmente a tradutora verificada no Home in the City, com ampla experiência ajudando clientes a se comunicarem com clareza nesses idiomas.",
      },
    ],
    ctaTitle: "Fale com Luciana",
    ctaText:
      "Veja o perfil da Luciana para conhecer melhor seus serviços de tradução e formas de contato.",
    button: "Perfil da Luciana",
    profileHref: "/pt/profissionais/luciana",
  },
  nl: {
    eyebrow: "Vertaaldiensten",
    title: "Documentvertaling in Nederlands, Engels en Portugees",
    intro:
      "Professionele vertaalondersteuning voor mensen en bedrijven die werken tussen Nederlands, Engels en Portugees.",
    sections: [
      {
        title: "Heldere schriftelijke vertalingen",
        text:
          "Zorgvuldige vertaling van zakelijke communicatie, persoonlijke documenten, immigratiepapieren, websites en lokale projecten waar nauwkeurigheid en toon belangrijk zijn.",
      },
      {
        title: "Nederlands, Engels en Portugees",
        text:
          "Vertaalwerk kan Nederlands-Portugees, Portugees-Nederlands, Engels-Portugees, Portugees-Engels, Nederlands-Engels en Engels-Nederlands ondersteunen.",
      },
      {
        title: "Geverifieerde vertaler",
        text:
          "Luciana Graziuso is momenteel de geverifieerde vertaler op Home in the City, met ruime ervaring in duidelijke communicatie tussen deze talen.",
      },
    ],
    ctaTitle: "Werk met Luciana",
    ctaText:
      "Bekijk Luciana's profiel voor meer informatie over haar vertaaldiensten en contactmogelijkheden.",
    button: "Luciana profiel",
    profileHref: "/nl/professionals/luciana",
  },
};

export default function TranslationServicesPage({ lang }: { lang: Lang }) {
  const page = content[lang];

  return (
    <main className="min-h-screen bg-stone-50 px-6 pt-32 pb-20">
      <div className="mx-auto max-w-3xl">
        <div className="mb-12">
          <p className="mb-4 text-sm uppercase tracking-[0.25em] text-stone-500">
            {page.eyebrow}
          </p>

          <h1 className="mb-6 text-5xl font-light leading-tight text-stone-800">
            {page.title}
          </h1>

          <p className="max-w-2xl text-lg leading-relaxed text-stone-600">
            {page.intro}
          </p>
        </div>

        <div className="space-y-12">
          {page.sections.map((section) => (
            <section key={section.title} className="rounded-3xl bg-white p-8 shadow-sm">
              <h2 className="mb-6 text-2xl text-stone-800">
                {section.title}
              </h2>

              <p className="leading-relaxed text-stone-600">
                {section.text}
              </p>
            </section>
          ))}
        </div>

        <div className="mt-12 rounded-3xl bg-[#1a1f2e] p-8 text-white">
          <h2 className="mb-4 text-3xl font-light">{page.ctaTitle}</h2>

          <p className="mb-6 max-w-xl text-stone-300">{page.ctaText}</p>

          <Link
            href={page.profileHref}
            className="inline-block rounded-full bg-white px-6 py-4 text-sm text-stone-900 transition hover:bg-stone-200"
          >
            {page.button}
          </Link>
        </div>
      </div>
    </main>
  );
}
