import Link from "next/link";
import {
  spokenLanguageCodes,
  type SpokenLanguageEntry,
} from "@/app/lib/providerLanguages";

type ProfileLocale = "en" | "pt" | "nl";

const languageFlags: Array<{
  code: string;
  flag: string;
  label: string;
}> = [
  { code: "en", flag: "🇬🇧", label: "English" },
  { code: "pt", flag: "🇧🇷", label: "Portuguese" },
  { code: "nl", flag: "🇳🇱", label: "Dutch" },
  { code: "es", flag: "🇪🇸", label: "Spanish" },
  { code: "de", flag: "🇩🇪", label: "German" },
  { code: "fr", flag: "🇫🇷", label: "French" },
  { code: "other", flag: "🌐", label: "Other language" },
];

export default function ProviderLanguageFlags({
  languages,
  paths,
}: {
  languages?: SpokenLanguageEntry[] | null;
  paths: Record<ProfileLocale, string>;
}) {
  const visibleLanguages = spokenLanguageCodes(languages)
    .map((code) => languageFlags.find((language) => language.code === code))
    .filter((language): language is (typeof languageFlags)[number] =>
      Boolean(language),
    );

  if (!visibleLanguages.length) return null;

  return (
    <nav
      aria-label="Provider spoken languages"
      className="mb-4 flex gap-3 text-xl"
    >
      {visibleLanguages.map(({ code, flag, label }) => {
        const path = paths[code as ProfileLocale];

        return path ? (
          <Link key={code} href={path} aria-label={label}>
            {flag}
          </Link>
        ) : (
          <span key={code} aria-label={label} role="img">
            {flag}
          </span>
        );
      })}
    </nav>
  );
}
