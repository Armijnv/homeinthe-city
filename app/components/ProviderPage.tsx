import Image from "next/image";

type Lang = "en" | "pt" | "nl";

type ProviderLanguage = {
  language?: string;
  level?: string;
  services?: string[];
};

type ProviderCity = {
  name_en?: string;
  name_pt?: string;
  name_nl?: string;
};

export type ProviderProfile = {
  name?: string;
  roles?: string[];
  primaryRole?: string;
  cities?: ProviderCity[];
  languages?: ProviderLanguage[];
  headline_en?: string;
  headline_pt?: string;
  headline_nl?: string;
  intro_en?: string;
  intro_pt?: string;
  intro_nl?: string;
  about_en?: string;
  about_pt?: string;
  about_nl?: string;
  contactOptions?: {
    email?: string;
    phone?: string;
    whatsapp?: string;
    website?: string;
    preferredContact?: string;
  };
  mainPhoto?: {
    alt?: string;
    asset?: {
      url?: string;
    };
  };
  verificationStatus?: string;
};

const labels = {
  en: {
    fallbackTitle: "Profile not available",
    fallbackText:
      "This provider profile is not published yet, or it could not be found.",
    profileType: "Provider profile",
    about: "About",
    languages: "Languages",
    cities: "Works in",
    contact: "Contact",
    whatsapp: "WhatsApp",
    email: "Email",
    website: "Website",
  },
  pt: {
    fallbackTitle: "Perfil indisponível",
    fallbackText:
      "Este perfil profissional ainda não foi publicado ou não foi encontrado.",
    profileType: "Perfil profissional",
    about: "Sobre",
    languages: "Idiomas",
    cities: "Atende em",
    contact: "Contato",
    whatsapp: "WhatsApp",
    email: "Email",
    website: "Site",
  },
  nl: {
    fallbackTitle: "Profiel niet beschikbaar",
    fallbackText:
      "Dit professionele profiel is nog niet gepubliceerd of kon niet worden gevonden.",
    profileType: "Professioneel profiel",
    about: "Over",
    languages: "Talen",
    cities: "Werkgebied",
    contact: "Contact",
    whatsapp: "WhatsApp",
    email: "Email",
    website: "Website",
  },
};

const roleLabels: Record<Lang, Record<string, string>> = {
  en: {
    host: "Host",
    interpreter: "Interpreter",
    translator: "Translator",
    guide: "Guide",
    specialist: "Specialist",
  },
  pt: {
    host: "Anfitriao",
    interpreter: "Interprete",
    translator: "Tradutor",
    guide: "Guia",
    specialist: "Especialista",
  },
  nl: {
    host: "Host",
    interpreter: "Tolk",
    translator: "Vertaler",
    guide: "Gids",
    specialist: "Specialist",
  },
};

const languageLabels: Record<string, string> = {
  en: "English",
  pt: "Portuguese",
  nl: "Dutch",
  es: "Spanish",
  de: "German",
  fr: "French",
  other: "Other",
};

const pagePaths = {
  en: "/providers",
  pt: "/pt/profissionais",
  nl: "/nl/professionals",
};

function localizedRole(lang: Lang, role?: string) {
  if (!role) return "";
  return roleLabels[lang][role] || role;
}

function localizedText(
  item: ProviderProfile | ProviderCity,
  field: "headline" | "intro" | "about" | "name",
  lang: Lang,
) {
  const langKey = `${field}_${lang}` as keyof typeof item;
  const englishKey = `${field}_en` as keyof typeof item;
  const localized = item[langKey];
  const english = item[englishKey];

  if (typeof localized === "string") return localized;
  if (typeof english === "string") return english;

  return "";
}

function formatList(items: string[]) {
  return items.filter(Boolean).join(" · ");
}

export default function ProviderPage({
  lang,
  slug,
  provider,
}: {
  lang: Lang;
  slug: string;
  provider: ProviderProfile | null;
}) {
  const t = labels[lang];

  if (!provider) {
    return (
      <div className="min-h-screen bg-[#1a1f2e] px-6 pt-28 pb-16 text-white">
        <div className="mx-auto max-w-3xl">
          <p className="mb-4 text-sm uppercase tracking-widest text-stone-400">
            {t.profileType}
          </p>
          <h1 className="mb-5 text-4xl font-light leading-tight md:text-6xl">
            {t.fallbackTitle}
          </h1>
          <p className="max-w-2xl text-xl leading-relaxed text-stone-300">
            {t.fallbackText}
          </p>
        </div>
      </div>
    );
  }

  const headline =
    localizedText(provider, "headline", lang) || provider.name || t.profileType;
  const intro = localizedText(provider, "intro", lang);
  const about = localizedText(provider, "about", lang);
  const roles = provider.roles?.map((role) => localizedRole(lang, role)) || [];
  const cities =
    provider.cities?.map((city) => localizedText(city, "name", lang)) || [];
  const primaryRole = localizedRole(lang, provider.primaryRole);
  const contact = provider.contactOptions;
  const photoUrl = provider.mainPhoto?.asset?.url || "/me.png";
  const photoAlt = provider.mainPhoto?.alt || provider.name || t.profileType;

  return (
    <div className="min-h-screen bg-[#1a1f2e] px-6 pt-28 pb-16 text-white">
      <div className="mx-auto grid max-w-5xl grid-cols-1 items-start gap-10 md:grid-cols-3">
        <div className="md:sticky md:top-28">
          <div className="overflow-hidden rounded-3xl bg-white/10 shadow-2xl">
            <Image
              src={photoUrl}
              alt={photoAlt}
              width={500}
              height={650}
              className="w-full object-cover grayscale"
              priority
            />
          </div>
        </div>

        <div className="md:col-span-2">
          <div className="mb-4 flex gap-3 text-xl">
            <a href={`${pagePaths.en}/${slug}`}>🇬🇧</a>
            <a href={`${pagePaths.pt}/${slug}`}>🇧🇷</a>
            <a href={`${pagePaths.nl}/${slug}`}>🇳🇱</a>
          </div>

          <p className="mb-4 text-sm uppercase tracking-widest text-stone-400">
            {formatList([primaryRole, ...roles.filter((role) => role !== primaryRole)]) ||
              t.profileType}
          </p>

          <h1 className="mb-6 text-4xl font-light leading-tight md:text-6xl">
            {headline}
          </h1>

          {intro ? (
            <p className="mb-8 max-w-2xl text-xl leading-relaxed text-stone-300">
              {intro}
            </p>
          ) : null}

          <div className="mb-10 grid grid-cols-1 gap-4 md:grid-cols-2">
            {provider.languages?.length ? (
              <section className="rounded-2xl bg-white p-6 text-stone-800">
                <h2 className="mb-4 text-xl font-light">{t.languages}</h2>
                <div className="space-y-3">
                  {provider.languages.map((language) => (
                    <div key={`${language.language}-${language.level}`}>
                      <p className="font-medium text-stone-800">
                        {language.language
                          ? languageLabels[language.language] ||
                            language.language
                          : ""}
                      </p>
                      <p className="text-sm capitalize text-stone-600">
                        {[language.level, ...(language.services || [])]
                          .filter(Boolean)
                          .join(" · ")}
                      </p>
                    </div>
                  ))}
                </div>
              </section>
            ) : null}

            {cities.length ? (
              <section className="rounded-2xl bg-white/10 p-6">
                <h2 className="mb-4 text-xl font-light">{t.cities}</h2>
                <p className="leading-relaxed text-stone-300">
                  {formatList(cities)}
                </p>
              </section>
            ) : null}
          </div>

          {about ? (
            <section className="mb-10 rounded-3xl bg-white/10 p-8">
              <h2 className="mb-3 text-2xl font-light">{t.about}</h2>
              <p className="max-w-2xl leading-relaxed text-stone-300">
                {about}
              </p>
            </section>
          ) : null}

          {contact?.email || contact?.whatsapp || contact?.website ? (
            <section>
              <h2 className="sr-only">{t.contact}</h2>
              <div className="flex flex-col gap-4 sm:flex-row">
                {contact.whatsapp ? (
                  <a
                    href={contact.whatsapp}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block rounded-full bg-white px-8 py-4 text-center text-sm text-stone-900 transition hover:bg-stone-200"
                  >
                    {t.whatsapp}
                  </a>
                ) : null}
                {contact.email ? (
                  <a
                    href={`mailto:${contact.email}`}
                    className="inline-block rounded-full border border-white/20 bg-white/10 px-8 py-4 text-center text-sm text-white transition hover:bg-white/20"
                  >
                    {t.email}
                  </a>
                ) : null}
                {contact.website ? (
                  <a
                    href={contact.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block rounded-full border border-white/20 bg-white/10 px-8 py-4 text-center text-sm text-white transition hover:bg-white/20"
                  >
                    {t.website}
                  </a>
                ) : null}
              </div>
            </section>
          ) : null}
        </div>
      </div>
    </div>
  );
}
