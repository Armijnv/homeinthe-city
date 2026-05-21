import Image from "next/image";
import Link from "next/link";

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

export type ProviderListItem = {
  name?: string;
  slug?: {
    current?: string;
  };
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
    eyebrow: "Provider profiles",
    title: "Interpreters, translators and local hosts",
    intro:
      "Published Home in the City profiles for local support in Porto Alegre.",
    empty: "No provider profiles are published yet.",
    primaryRole: "Primary role",
    allRoles: "All roles",
    city: "City",
    languages: "Languages",
    verified: "Verified",
    pending: "Pending",
    unverified: "Unverified",
    rejected: "Rejected",
    profile: "View profile",
  },
  pt: {
    eyebrow: "Perfis profissionais",
    title: "Interpretes, tradutores e anfitrioes locais",
    intro:
      "Perfis publicados da Home in the City para apoio local em Porto Alegre.",
    empty: "Nenhum perfil profissional foi publicado ainda.",
    primaryRole: "Funcao principal",
    allRoles: "Todas as funcoes",
    city: "Cidade",
    languages: "Idiomas",
    verified: "Verificado",
    pending: "Pendente",
    unverified: "Nao verificado",
    rejected: "Rejeitado",
    profile: "Ver perfil",
  },
  nl: {
    eyebrow: "Professionele profielen",
    title: "Tolken, vertalers en lokale hosts",
    intro:
      "Gepubliceerde Home in the City-profielen voor lokale ondersteuning in Porto Alegre.",
    empty: "Er zijn nog geen professionele profielen gepubliceerd.",
    primaryRole: "Hoofdrol",
    allRoles: "Alle rollen",
    city: "Werkgebied",
    languages: "Talen",
    verified: "Geverifieerd",
    pending: "In behandeling",
    unverified: "Niet geverifieerd",
    rejected: "Afgewezen",
    profile: "Bekijk profiel",
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

const languageLevelLabels: Record<Lang, Record<string, string>> = {
  en: {
    native: "Native",
    fluent: "Fluent",
    professional: "Professional",
    conversational: "Conversational",
  },
  pt: {
    native: "Nativo",
    fluent: "Fluente",
    professional: "Profissional",
    conversational: "Conversacional",
  },
  nl: {
    native: "Moedertaal",
    fluent: "Vloeiend",
    professional: "Professioneel",
    conversational: "Gespreksniveau",
  },
};

const profilePaths = {
  en: "/providers",
  pt: "/pt/profissionais",
  nl: "/nl/professionals",
};

const listPaths = {
  en: "/providers",
  pt: "/pt/profissionais",
  nl: "/nl/professionals",
};

function localizedText(
  item: ProviderListItem | ProviderCity,
  field: "headline" | "intro" | "name",
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

function localizedRole(lang: Lang, role?: string) {
  if (!role) return "";
  return roleLabels[lang][role] || role;
}

function localizedLanguageLevel(lang: Lang, level?: string) {
  if (!level) return "";
  return languageLevelLabels[lang][level] || level;
}

function formatList(items: string[]) {
  return items.filter(Boolean).join(" · ");
}

function verificationLabel(lang: Lang, status?: string) {
  const t = labels[lang];

  if (status === "verified") return t.verified;
  if (status === "pending") return t.pending;
  if (status === "rejected") return t.rejected;

  return t.unverified;
}

function verificationClass(status?: string) {
  if (status === "verified") return "border-emerald-300/40 text-emerald-100";
  if (status === "pending") return "border-amber-300/40 text-amber-100";
  if (status === "rejected") return "border-red-300/40 text-red-100";

  return "border-white/20 text-stone-300";
}

export default function ProviderListPage({
  lang,
  providers,
}: {
  lang: Lang;
  providers: ProviderListItem[];
}) {
  const t = labels[lang];

  return (
    <div className="min-h-screen bg-[#1a1f2e] px-6 pt-28 pb-16 text-white">
      <div className="mx-auto max-w-6xl">
        <p className="mb-4 text-sm uppercase tracking-widest text-stone-400">
          {t.eyebrow}
        </p>
        <h1 className="mb-5 max-w-4xl text-4xl font-light leading-tight md:text-6xl">
          {t.title}
        </h1>
        <p className="mb-12 max-w-2xl text-lg leading-relaxed text-stone-300">
          {t.intro}
        </p>

        <nav aria-label="Language versions" className="mb-8 flex gap-3 text-xl">
          <Link href={listPaths.en} aria-label="English provider listings">
            🇬🇧
          </Link>
          <Link href={listPaths.pt} aria-label="Portuguese provider listings">
            🇧🇷
          </Link>
          <Link href={listPaths.nl} aria-label="Dutch provider listings">
            🇳🇱
          </Link>
        </nav>

        {providers.length ? (
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            {providers.map((provider) => {
              const slug = provider.slug?.current;
              const primaryRole = localizedRole(lang, provider.primaryRole);
              const roles = provider.roles?.map((role) => localizedRole(lang, role)) || [];
              const cities =
                provider.cities?.map((city) => localizedText(city, "name", lang)) ||
                [];
              const languages =
                provider.languages?.map((language) =>
                  formatList([
                    language.language
                      ? languageLabels[language.language] || language.language
                      : "",
                    localizedLanguageLevel(lang, language.level),
                  ]),
                ) || [];
              const headline = localizedText(provider, "headline", lang);
              const intro = localizedText(provider, "intro", lang);
              const photoUrl = provider.mainPhoto?.asset?.url || "/me.png";
              const photoAlt =
                provider.mainPhoto?.alt || provider.name || t.eyebrow;

              return (
                <article
                  key={slug || provider.name}
                  className="grid grid-cols-1 overflow-hidden rounded-3xl border border-white/10 bg-white/10 shadow-2xl md:grid-cols-[180px_1fr]"
                >
                  <div className="relative min-h-72 bg-white/5 md:min-h-full">
                    <Image
                      src={photoUrl}
                      alt={photoAlt}
                      fill
                      sizes="(min-width: 1024px) 180px, 100vw"
                      className="object-cover grayscale"
                    />
                  </div>

                  <div className="p-6">
                    <div className="mb-4 flex flex-wrap items-center gap-3">
                      <span
                        className={`rounded-full border px-3 py-1 text-xs ${verificationClass(provider.verificationStatus)}`}
                      >
                        {verificationLabel(lang, provider.verificationStatus)}
                      </span>
                      {primaryRole ? (
                        <span className="text-sm text-stone-300">
                          {primaryRole}
                        </span>
                      ) : null}
                    </div>

                    <h2 className="mb-2 text-3xl font-light leading-tight text-white">
                      {provider.name || headline || t.eyebrow}
                    </h2>

                    {headline ? (
                      <p className="mb-4 text-lg leading-relaxed text-stone-300">
                        {headline}
                      </p>
                    ) : null}

                    <div className="mb-5 grid grid-cols-1 gap-3 text-sm text-stone-300 sm:grid-cols-2">
                      {roles.length ? (
                        <p>
                          <span className="block text-xs uppercase tracking-widest text-stone-500">
                            {t.allRoles}
                          </span>
                          {formatList(roles)}
                        </p>
                      ) : null}
                      {cities.length ? (
                        <p>
                          <span className="block text-xs uppercase tracking-widest text-stone-500">
                            {t.city}
                          </span>
                          {formatList(cities)}
                        </p>
                      ) : null}
                      {languages.length ? (
                        <p className="sm:col-span-2">
                          <span className="block text-xs uppercase tracking-widest text-stone-500">
                            {t.languages}
                          </span>
                          {formatList(languages)}
                        </p>
                      ) : null}
                    </div>

                    {intro ? (
                      <p className="mb-6 line-clamp-3 leading-relaxed text-stone-300">
                        {intro}
                      </p>
                    ) : null}

                    {slug ? (
                      <Link
                        href={`${profilePaths[lang]}/${slug}`}
                        className="inline-block rounded-full bg-white px-6 py-3 text-sm text-stone-900 transition hover:bg-stone-200"
                      >
                        {t.profile}
                      </Link>
                    ) : null}
                  </div>
                </article>
              );
            })}
          </div>
        ) : (
          <p className="rounded-2xl border border-white/10 bg-white/10 p-6 text-stone-300">
            {t.empty}
          </p>
        )}
      </div>
    </div>
  );
}
