import Link from "next/link";
import ProviderProfileCard, {
  type ProviderListItem,
} from "@/app/components/ProviderProfileCard";

export type { ProviderListItem } from "@/app/components/ProviderProfileCard";

type Lang = "en" | "pt" | "nl";

const labels = {
  en: {
    eyebrow: "Provider profiles",
    title: "Interpreters, translators and local hosts",
    intro: "Published Home in the City profiles for trusted local support in Brazil.",
    empty: "No provider profiles are published yet.",
  },
  pt: {
    eyebrow: "Perfis profissionais",
    title: "Intérpretes, tradutores e anfitriões locais",
    intro: "Perfis publicados da Home in the City para apoio local confiável no Brasil.",
    empty: "Nenhum perfil profissional foi publicado ainda.",
  },
  nl: {
    eyebrow: "Professionele profielen",
    title: "Tolken, vertalers en lokale hosts",
    intro: "Gepubliceerde Home in the City-profielen voor betrouwbare lokale hulp in Brazilië.",
    empty: "Er zijn nog geen professionele profielen gepubliceerd.",
  },
};

const listPaths = {
  en: "/providers",
  pt: "/pt/profissionais",
  nl: "/nl/professionals",
};

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
          <Link href={listPaths.en} aria-label="English provider listings">🇬🇧</Link>
          <Link href={listPaths.pt} aria-label="Portuguese provider listings">🇧🇷</Link>
          <Link href={listPaths.nl} aria-label="Dutch provider listings">🇳🇱</Link>
        </nav>

        {providers.length ? (
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            {providers.map((provider) => (
              <ProviderProfileCard
                key={provider.slug?.current || provider.name}
                provider={provider}
                lang={lang}
              />
            ))}
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
