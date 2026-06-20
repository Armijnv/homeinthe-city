import Image from "next/image";
import Link from "next/link";

export type ProviderCardLanguage = "en" | "pt" | "nl";

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
  slug?: { current?: string };
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
    asset?: { url?: string };
  };
  verificationStatus?: string;
};

const roleLabels: Record<ProviderCardLanguage, Record<string, string>> = {
  en: { host: "Host", interpreter: "Interpreter", translator: "Translator", guide: "Guide", specialist: "Specialist", realtor: "Real estate agent" },
  pt: { host: "Anfitrião", interpreter: "Intérprete", translator: "Tradutor", guide: "Guia", specialist: "Especialista", realtor: "Corretor de imóveis" },
  nl: { host: "Host", interpreter: "Tolk", translator: "Vertaler", guide: "Gids", specialist: "Specialist", realtor: "Makelaar" },
};

const languageLabels: Record<ProviderCardLanguage, Record<string, string>> = {
  en: { en: "English", pt: "Portuguese", nl: "Dutch", es: "Spanish", de: "German", fr: "French", other: "Other" },
  pt: { en: "Inglês", pt: "Português", nl: "Holandês", es: "Espanhol", de: "Alemão", fr: "Francês", other: "Outro" },
  nl: { en: "Engels", pt: "Portugees", nl: "Nederlands", es: "Spaans", de: "Duits", fr: "Frans", other: "Anders" },
};

const labels = {
  en: { allRoles: "Roles", city: "City", languages: "Languages", profile: "View profile", verified: "Verified", pending: "Pending", unverified: "Unverified", rejected: "Rejected", fallback: "Home in the City professional" },
  pt: { allRoles: "Funções", city: "Cidade", languages: "Idiomas", profile: "Ver perfil", verified: "Verificado", pending: "Pendente", unverified: "Não verificado", rejected: "Rejeitado", fallback: "Profissional da Home in the City" },
  nl: { allRoles: "Rollen", city: "Werkgebied", languages: "Talen", profile: "Bekijk profiel", verified: "Geverifieerd", pending: "In behandeling", unverified: "Niet geverifieerd", rejected: "Afgewezen", fallback: "Home in the City-professional" },
};

const profilePaths: Record<ProviderCardLanguage, string> = {
  en: "/providers",
  pt: "/pt/profissionais",
  nl: "/nl/professionals",
};

function localizedText(
  item: ProviderListItem | ProviderCity,
  field: "headline" | "intro" | "name",
  lang: ProviderCardLanguage,
) {
  const localized = item[`${field}_${lang}` as keyof typeof item];
  const english = item[`${field}_en` as keyof typeof item];
  return typeof localized === "string"
    ? localized
    : typeof english === "string"
      ? english
      : "";
}

function formatList(items: string[]) {
  return items.filter(Boolean).join(" · ");
}

function verificationLabel(lang: ProviderCardLanguage, status?: string) {
  if (status === "verified") return labels[lang].verified;
  if (status === "pending") return labels[lang].pending;
  if (status === "rejected") return labels[lang].rejected;
  return labels[lang].unverified;
}

function verificationClass(status: string | undefined, light: boolean) {
  if (status === "verified") return light ? "border-emerald-300 text-emerald-800" : "border-emerald-300/40 text-emerald-100";
  if (status === "pending") return light ? "border-amber-300 text-amber-800" : "border-amber-300/40 text-amber-100";
  if (status === "rejected") return light ? "border-red-300 text-red-800" : "border-red-300/40 text-red-100";
  return light ? "border-stone-300 text-stone-600" : "border-white/20 text-stone-300";
}

export default function ProviderProfileCard({
  provider,
  lang,
  appearance = "dark",
  compact = false,
  headingLevel = 2,
  cityInterpreterHref,
  cityInterpreterLabel,
}: {
  provider: ProviderListItem;
  lang: ProviderCardLanguage;
  appearance?: "dark" | "light";
  compact?: boolean;
  headingLevel?: 2 | 3;
  cityInterpreterHref?: string;
  cityInterpreterLabel?: string;
}) {
  const t = labels[lang];
  const light = appearance === "light";
  const slug = provider.slug?.current;
  const primaryRole = provider.primaryRole
    ? roleLabels[lang][provider.primaryRole] || provider.primaryRole
    : "";
  const roles = provider.roles?.map((role) => roleLabels[lang][role] || role) || [];
  const cities = provider.cities?.map((city) => localizedText(city, "name", lang)) || [];
  const languages =
    provider.languages?.map((language) =>
      language.language
        ? languageLabels[lang][language.language] || language.language
        : "",
    ) || [];
  const headline = localizedText(provider, "headline", lang);
  const intro = localizedText(provider, "intro", lang);
  const photoUrl = provider.mainPhoto?.asset?.url || "/profile-placeholder.svg";
  const photoAlt = provider.mainPhoto?.alt || provider.name || t.fallback;
  const Heading = headingLevel === 2 ? "h2" : "h3";

  return (
    <article
      className={`overflow-hidden rounded-3xl border shadow-sm ${
        compact ? "flex flex-col" : "grid grid-cols-1 md:grid-cols-[180px_1fr]"
      } ${light ? "border-stone-200 bg-white" : "border-white/10 bg-white/10 shadow-2xl"}`}
    >
      <div className={`relative bg-stone-100 ${compact ? "h-64" : "min-h-72 md:min-h-full"}`}>
        <Image
          src={photoUrl}
          alt={photoAlt}
          fill
          sizes={compact ? "(min-width: 1024px) 320px, 100vw" : "(min-width: 1024px) 180px, 100vw"}
          className={`object-cover ${light ? "" : "grayscale"}`}
        />
      </div>

      <div className="flex flex-1 flex-col p-6">
        <div className="mb-4 flex flex-wrap items-center gap-3">
          <span className={`rounded-full border px-3 py-1 text-xs ${verificationClass(provider.verificationStatus, light)}`}>
            {verificationLabel(lang, provider.verificationStatus)}
          </span>
          {primaryRole ? (
            <span className={`text-sm ${light ? "text-stone-600" : "text-stone-300"}`}>
              {primaryRole}
            </span>
          ) : null}
        </div>

        <Heading className={`mb-2 text-3xl font-light leading-tight ${light ? "text-stone-900" : "text-white"}`}>
          {provider.name || headline || t.fallback}
        </Heading>

        {headline ? (
          <p className={`mb-4 text-lg leading-relaxed ${light ? "text-stone-700" : "text-stone-300"}`}>
            {headline}
          </p>
        ) : null}

        <div className={`mb-5 grid grid-cols-1 gap-3 text-sm sm:grid-cols-2 ${light ? "text-stone-700" : "text-stone-300"}`}>
          {roles.length ? (
            <p>
              <span className={`block text-xs uppercase tracking-widest ${light ? "text-stone-500" : "text-stone-500"}`}>{t.allRoles}</span>
              {formatList(roles)}
            </p>
          ) : null}
          {cities.length ? (
            <p>
              <span className={`block text-xs uppercase tracking-widest ${light ? "text-stone-500" : "text-stone-500"}`}>{t.city}</span>
              {formatList(cities)}
            </p>
          ) : null}
          {languages.length ? (
            <p className="sm:col-span-2">
              <span className={`block text-xs uppercase tracking-widest ${light ? "text-stone-500" : "text-stone-500"}`}>{t.languages}</span>
              {formatList(languages)}
            </p>
          ) : null}
        </div>

        {intro ? (
          <p className={`mb-6 line-clamp-2 leading-relaxed ${light ? "text-stone-600" : "text-stone-300"}`}>
            {intro}
          </p>
        ) : null}

        <div className="mt-auto flex flex-col gap-3">
          {cityInterpreterHref && cityInterpreterLabel ? (
            <Link
              href={cityInterpreterHref}
              className="inline-flex min-h-12 items-center justify-center rounded-full bg-[#1a1f2e] px-5 py-3 text-center text-sm font-medium text-white transition hover:bg-stone-800"
            >
              {cityInterpreterLabel}
            </Link>
          ) : null}
          {slug ? (
            <Link
              href={`${profilePaths[lang]}/${slug}`}
              className={`inline-flex min-h-12 items-center justify-center rounded-full px-5 py-3 text-center text-sm font-medium transition ${
                light
                  ? "border border-stone-300 bg-white text-stone-900 hover:bg-stone-100"
                  : "bg-white text-stone-900 hover:bg-stone-200"
              }`}
            >
              {t.profile}
            </Link>
          ) : null}
        </div>
      </div>
    </article>
  );
}
