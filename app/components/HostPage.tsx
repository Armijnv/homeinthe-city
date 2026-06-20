import Image from "next/image";
import ProviderLanguageFlags from "./ProviderLanguageFlags";

type Lang = "en" | "pt" | "nl";

type HostService = {
  title_en?: string;
  title_pt?: string;
  title_nl?: string;
  description_en?: string;
  description_pt?: string;
  description_nl?: string;
};

export type Host = {
  name?: string;
  eyebrow_en?: string;
  eyebrow_pt?: string;
  eyebrow_nl?: string;
  headline_en?: string;
  headline_pt?: string;
  headline_nl?: string;
  intro_en?: string;
  intro_pt?: string;
  intro_nl?: string;
  servicesTitle_en?: string;
  servicesTitle_pt?: string;
  servicesTitle_nl?: string;
  services?: HostService[];
  aboutTitle_en?: string;
  aboutTitle_pt?: string;
  aboutTitle_nl?: string;
  about_en?: string;
  about_pt?: string;
  about_nl?: string;
  whatsapp?: string;
  email?: string;
  languages?: Array<{
    language?: string;
  }>;
  photo?: {
    asset?: {
      url?: string;
    };
  };
};

export default function HostPage({
  lang,
  slug,
  host,
}: {
  lang: Lang;
  slug: string;
  host: Host | null;
}) {
  const labels = {
    en: {
      eyebrow: "Local host · Interpreter · Porto Alegre",
      headline: "Armijn van Dijk",
      intro:
        "I help international business visitors feel confident in Porto Alegre — with language support, local guidance and practical help on the ground.",
      servicesTitle: "What I can help with",
      aboutTitle: "A little about me",
      about:
        "I grew up in Holland, lived in California and the Caribbean, and have lived in Brazil for more than 25 years. My background is in hospitality, business, hands-on work and building things — which makes me practical, calm and useful when people need help in a new city.",
      whatsapp: "WhatsApp",
      email: "Email me",
    },
    pt: {
      eyebrow: "Anfitrião local · Intérprete · Porto Alegre",
      headline: "Armijn van Dijk",
      intro:
        "Ajudo visitantes internacionais a se sentirem mais seguros em Porto Alegre — com apoio no idioma, orientação local e ajuda prática no dia a dia.",
      servicesTitle: "Como posso ajudar",
      aboutTitle: "Um pouco sobre mim",
      about:
        "Cresci na Holanda, vivi na Califórnia e no Caribe, e moro no Brasil há mais de 25 anos. Minha experiência em hospitalidade, negócios e trabalhos práticos me ajuda a lidar com situações de forma calma, direta e útil para quem está em uma cidade nova.",
      whatsapp: "WhatsApp",
      email: "Enviar email",
    },
    nl: {
      eyebrow: "Lokale host · Tolk · Porto Alegre",
      headline: "Armijn van Dijk",
      intro:
        "Ik help internationale zakenbezoekers zich zekerder te voelen in Porto Alegre — met taalondersteuning, lokale begeleiding en praktische hulp ter plaatse.",
      servicesTitle: "Waarmee ik kan helpen",
      aboutTitle: "Een beetje over mij",
      about:
        "Ik ben in Nederland opgegroeid, woonde in Californië en het Caribisch gebied, en leef al meer dan 25 jaar in Brazilië. Mijn achtergrond in hospitality, ondernemen en praktisch werk helpt me om rustig, direct en nuttig te zijn voor mensen die zich in een nieuwe stad bevinden.",
      whatsapp: "WhatsApp",
      email: "Stuur email",
    },
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
          <ProviderLanguageFlags
            languages={host?.languages}
            paths={{
              en: `/hosts/${slug}`,
              pt: `/pt/hosts/${slug}`,
              nl: `/nl/hosts/${slug}`,
            }}
          />

          <p className="mb-4 text-sm uppercase tracking-widest text-stone-400">
            {host?.[`eyebrow_${lang}`] || t.eyebrow}
          </p>

          <h1 className="mb-6 text-4xl font-light leading-tight md:text-6xl">
            {host?.[`headline_${lang}`] || host?.name || t.headline}
          </h1>

          <p className="mb-8 max-w-2xl text-xl leading-relaxed text-stone-300">
            {host?.[`intro_${lang}`] || t.intro}
          </p>

          {/* Services */}
          <div className="mb-10 rounded-3xl bg-white p-8 text-stone-800">
            <h2 className="mb-4 text-2xl font-light">
              {host?.[`servicesTitle_${lang}`] || t.servicesTitle}
            </h2>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              {host?.services?.map((service, index) => (
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
              {host?.[`aboutTitle_${lang}`] || t.aboutTitle}
            </h2>

            <p className="max-w-2xl leading-relaxed text-stone-300">
              {host?.[`about_${lang}`] || t.about}
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
              href={`mailto:${host?.email || "armijn@homeinthe.city"}`}
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
