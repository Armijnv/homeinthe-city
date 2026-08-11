"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  useActionState,
  useEffect,
  useState,
  type ChangeEvent,
  type ReactNode,
} from "react";
import { useFormStatus } from "react-dom";
import type { CityDashboardActionState } from "@/app/dashboard/cities/[citySlug]/actions";
import { recommendationGuideCategories } from "@/app/lib/recommendationGuides";
import {
  portoAlegreExperienceDefaults,
  type CityPageExperience,
  type CityPageExperienceField,
} from "@/app/lib/cityPageExperience";
import {
  dashboardFileInputClass,
  selectedDashboardImageError,
} from "@/app/lib/dashboardImageSelection";

type Lang = "en" | "pt" | "nl";

export type CityDashboardSidebarCard = {
  _key?: string;
  title_en?: string;
  title_pt?: string;
  title_nl?: string;
  text_en?: string;
  text_pt?: string;
  text_nl?: string;
  button_en?: string;
  button_pt?: string;
  button_nl?: string;
  href_en?: string;
  href_pt?: string;
  href_nl?: string;
};

export type CityDashboardRecommendation = {
  _key?: string;
  title_en?: string;
  title_pt?: string;
  title_nl?: string;
  introduction_en?: string;
  introduction_pt?: string;
  introduction_nl?: string;
  content_en?: string;
  content_pt?: string;
  content_nl?: string;
  recommendationType?: string;
  customCategory_en?: string;
  customCategory_pt?: string;
  customCategory_nl?: string;
  relatedMapPlaceKeys?: string[];
  featuredImage?: {
    _type?: string;
    alt?: string;
    asset?: { _type?: string; _ref?: string; url?: string };
    crop?: { top?: number; bottom?: number; left?: number; right?: number };
    hotspot?: { x?: number; y?: number; height?: number; width?: number };
  };
  relatedProvider?: { _type?: string; _ref?: string };
  relatedCity?: { _type?: string; _ref?: string };
};

type CityDashboardMapPlace = {
  _key?: string;
  name?: string;
  name_en?: string;
  name_pt?: string;
};

export type CityDashboardEditorData = {
  name_en?: string;
  name_pt?: string;
  name_nl?: string;
  enabledLanguages?: Lang[];
  hostLanguages?: Lang[];
  headline_en?: string;
  headline_pt?: string;
  headline_nl?: string;
  cta_en?: string;
  cta_pt?: string;
  cta_nl?: string;
  intro_en?: string;
  intro_pt?: string;
  intro_nl?: string;
  introBlocks_en?: string[];
  introBlocks_pt?: string[];
  introBlocks_nl?: string[];
  heroImage?: {
    alt?: string;
    asset?: { url?: string; _ref?: string };
  };
  primaryHost?: {
    name?: string;
    status?: string;
    primaryRole?: string;
  } | null;
  cityPageExperience?: CityPageExperience;
  sidebarCards?: CityDashboardSidebarCard[];
  recommendationGuides?: CityDashboardRecommendation[];
  recommendations?: Array<{ _key?: string }>;
  mapPlaces?: CityDashboardMapPlace[];
};

type EditorProps = {
  citySlug: string;
  city: CityDashboardEditorData;
  canManageLanguages: boolean;
  saveContentAction: (
    previousState: CityDashboardActionState,
    formData: FormData,
  ) => Promise<CityDashboardActionState>;
  saveRecommendationsAction: (
    previousState: CityDashboardActionState,
    formData: FormData,
  ) => Promise<CityDashboardActionState>;
};

const initialActionState: CityDashboardActionState = {
  status: "idle",
};

const languages: Array<{ id: Lang; label: string; hint: string }> = [
  { id: "en", label: "English", hint: "EN" },
  { id: "pt", label: "Português", hint: "PT-BR" },
  { id: "nl", label: "Nederlands", hint: "NL" },
];

const inputClass =
  "w-full rounded-lg border border-white/15 bg-white/10 px-4 py-3 text-sm text-white placeholder:text-stone-400";
const textareaClass = `${inputClass} min-h-28`;

function newKey(prefix: string) {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

function itemTitle(item: CityDashboardRecommendation) {
  return item.title_en || item.title_pt || item.title_nl || "Untitled guide";
}

function RecommendationImageField({
  recommendation,
  cityName,
}: {
  recommendation: CityDashboardRecommendation;
  cityName: string;
}) {
  const recommendationKey = recommendation._key || "new-recommendation";
  const savedImageUrl = recommendation.featuredImage?.asset?.url;
  const defaultAlt = `${itemTitle(recommendation)} in ${cityName}`;
  const [previewUrl, setPreviewUrl] = useState("");
  const [imageError, setImageError] = useState("");
  const [imageSelected, setImageSelected] = useState(false);

  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  function handleImageChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (previewUrl) URL.revokeObjectURL(previewUrl);

    if (!file) {
      setPreviewUrl("");
      setImageError("");
      setImageSelected(false);
      event.target.setCustomValidity("");
      return;
    }

    const error = selectedDashboardImageError(file, "Featured image");

    setPreviewUrl(error ? "" : URL.createObjectURL(file));
    setImageError(error);
    setImageSelected(true);
    event.target.setCustomValidity(error);
  }

  const displayUrl = previewUrl || savedImageUrl;

  return (
    <fieldset className="rounded-xl border border-white/10 p-4">
      <legend className="px-2 text-xs uppercase tracking-widest text-stone-400">
        Featured image
      </legend>
      <div className="mt-2 grid gap-4 md:grid-cols-[220px_1fr] md:items-start">
        {displayUrl ? (
          <div className="space-y-3">
            <div className="relative aspect-[16/10] overflow-hidden rounded-xl border border-white/10 bg-black/20">
              <Image
                src={displayUrl}
                alt={recommendation.featuredImage?.alt || defaultAlt}
                fill
                unoptimized={displayUrl.startsWith("blob:")}
                sizes="220px"
                className="object-cover"
              />
            </div>
            {savedImageUrl ? (
              <label className="flex items-center gap-2 text-sm text-stone-300">
                <input
                  type="checkbox"
                  name={`removeFeaturedImage-${recommendationKey}`}
                  className="size-4 accent-[#d6a85a]"
                />
                Remove saved image
              </label>
            ) : null}
          </div>
        ) : (
          <div className="rounded-xl border border-dashed border-white/15 p-4 text-sm text-stone-400">
            No featured image yet.
          </div>
        )}

        <div className="space-y-4">
          <Field label={savedImageUrl ? "Replace image" : "Upload image"}>
            <input
              name={`featuredImage-${recommendationKey}`}
              type="file"
              accept="image/*,.jpg,.jpeg,.png,.webp,.gif,.heic,.heif"
              className={dashboardFileInputClass}
              onChange={handleImageChange}
            />
          </Field>
          <input
            type="hidden"
            name={`featuredImageSelected-${recommendationKey}`}
            value={imageSelected ? "1" : ""}
          />
          {imageError ? (
            <p className="rounded-lg border border-red-300/40 bg-red-950/30 px-3 py-2 text-sm text-red-100">
              {imageError}
            </p>
          ) : null}
          <Field label="Image alt text">
            <input
              name={`featuredImageAlt-${recommendationKey}`}
              className={inputClass}
              defaultValue={recommendation.featuredImage?.alt || defaultAlt}
              placeholder={defaultAlt}
            />
          </Field>
          <p className="text-sm leading-6 text-stone-400">
            JPG, PNG, WebP, GIF or HEIC/HEIF, up to 10 MB. A new image replaces
            the saved image when the recommendation guides are saved.
          </p>
        </div>
      </div>
    </fieldset>
  );
}

function Panel({
  title,
  eyebrow,
  children,
}: {
  title: string;
  eyebrow: string;
  children: ReactNode;
}) {
  return (
    <section className="rounded-2xl border border-white/10 bg-white/10 p-4 shadow-xl shadow-black/10 md:p-6">
      <p className="mb-3 text-xs uppercase tracking-widest text-[#d6a85a]">
        {eyebrow}
      </p>
      <h2 className="text-2xl font-light text-white">{title}</h2>
      <div className="mt-6 space-y-6">{children}</div>
    </section>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children: ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-2 block text-xs uppercase tracking-widest text-stone-400">
        {label}
      </span>
      {children}
    </label>
  );
}

function SaveButton({ label }: { label: string }) {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className="w-full rounded-lg bg-[#d6a85a] px-5 py-3 text-sm font-medium text-[#1a1f2e] transition hover:bg-white disabled:cursor-wait disabled:opacity-70 sm:w-auto"
    >
      {pending ? "Saving..." : label}
    </button>
  );
}

function ActionMessage({ state }: { state: CityDashboardActionState }) {
  if (state.status === "idle" || !state.message) return null;

  const className =
    state.status === "success"
      ? "border-emerald-300/40 bg-emerald-950/30 text-emerald-100"
      : "border-red-300/40 bg-red-950/30 text-red-100";

  return (
    <p className={`rounded-xl border p-4 text-sm leading-6 ${className}`}>
      {state.message}
    </p>
  );
}

function LanguageFields({
  city,
}: {
  city: CityDashboardEditorData;
}) {
  return (
    <div className="space-y-5">
      {languages.map((language) => (
        <div
          key={language.id}
          className="rounded-xl border border-white/10 bg-black/10 p-4"
        >
          <div className="mb-4 flex items-center justify-between gap-3">
            <h3 className="text-sm font-medium uppercase tracking-widest text-white">
              {language.label}
            </h3>
            <span className="rounded-full border border-white/15 px-3 py-1 text-xs uppercase tracking-widest text-stone-300">
              {language.hint}
            </span>
          </div>

          <div className="grid gap-4">
            <Field label="Headline">
              <input
                name={`headline_${language.id}`}
                className={inputClass}
                defaultValue={city[`headline_${language.id}`] || ""}
              />
            </Field>
            <Field label="Intro text">
              <textarea
                name={`intro_${language.id}`}
                className={textareaClass}
                rows={4}
                defaultValue={city[`intro_${language.id}`] || ""}
              />
            </Field>
            <Field label="City description">
              <textarea
                name={`introBlocks_${language.id}`}
                className={textareaClass}
                rows={6}
                defaultValue={(city[`introBlocks_${language.id}`] || []).join("\n\n")}
              />
            </Field>
          </div>
        </div>
      ))}
    </div>
  );
}

function experienceValue(
  city: CityDashboardEditorData,
  language: Lang,
  field: CityPageExperienceField,
) {
  const experience = city.cityPageExperience || portoAlegreExperienceDefaults;
  return experience[language]?.[field] || "";
}

function ExperienceInput({
  city,
  language,
  field,
  label,
  multiline = false,
  rows = 4,
}: {
  city: CityDashboardEditorData;
  language: Lang;
  field: CityPageExperienceField;
  label: string;
  multiline?: boolean;
  rows?: number;
}) {
  const shared = {
    name: `experience_${language}_${field}`,
    defaultValue: experienceValue(city, language, field),
  };

  return (
    <Field label={label}>
      {multiline ? (
        <textarea {...shared} className={textareaClass} rows={rows} />
      ) : (
        <input {...shared} className={inputClass} />
      )}
    </Field>
  );
}

type PortoEditorSection = "about" | "living" | "explore" | "from-host";

const portoEditorSections: Array<{ id: PortoEditorSection; label: string }> = [
  { id: "about", label: "About the City" },
  { id: "living", label: "Living & Working" },
  { id: "explore", label: "Explore the City" },
  { id: "from-host", label: "From Your Host" },
];

function PortoAlegreExperienceFields({
  city,
  citySlug,
  activeLanguage,
  activeSection,
  sidebarCards,
  setSidebarCards,
}: {
  city: CityDashboardEditorData;
  citySlug: string;
  activeLanguage: Lang;
  activeSection: PortoEditorSection;
  sidebarCards: CityDashboardSidebarCard[];
  setSidebarCards: (cards: CityDashboardSidebarCard[]) => void;
}) {
  return (
    <div className="space-y-6">
      <section className="rounded-xl border border-white/10 bg-black/10 p-4 md:p-5">
        <div className="mb-5">
          <p className="text-xs uppercase tracking-widest text-[#d6a85a]">
            General / top of page
          </p>
          <h3 className="mt-2 text-xl font-light text-white">City header</h3>
          <p className="mt-2 text-sm leading-6 text-stone-300">
            These fields control the compact header at the top of the public page.
          </p>
        </div>

        {languages.map((language) => (
          <div
            key={language.id}
            hidden={language.id !== activeLanguage}
            className="grid gap-4 sm:grid-cols-2"
          >
            <Field label="City name">
              <input
                name={`name_${language.id}`}
                className={inputClass}
                defaultValue={city[`name_${language.id}`] || ""}
              />
            </Field>
            <Field label="Short tagline">
              <input
                name={`headline_${language.id}`}
                className={inputClass}
                defaultValue={city[`headline_${language.id}`] || ""}
              />
            </Field>
          </div>
        ))}

        <div className="mt-5 rounded-lg border border-white/10 bg-white/5 p-4">
          <p className="text-xs uppercase tracking-widest text-stone-400">
            Primary host
          </p>
          <p className="mt-2 text-base text-white">
            {city.primaryHost?.name || "No primary host assigned"}
          </p>
          {city.primaryHost ? (
            <p className="mt-1 text-sm text-stone-400">
              {city.primaryHost.primaryRole || "Provider"} · {city.primaryHost.status || "status unknown"}
            </p>
          ) : null}
          <p className="mt-3 text-xs leading-5 text-stone-400">
            Host identity and contact details come from the Provider profile. Assignment remains an administrator setting.
          </p>
        </div>
      </section>

      <section
        id="porto-about-editor"
        role="tabpanel"
        aria-labelledby="porto-about-editor-tab"
        hidden={activeSection !== "about"}
        className="rounded-xl border border-white/10 bg-black/10 p-4 md:p-5"
      >
        <h3 className="text-xl font-light text-white">About the City</h3>
        <p className="mt-2 text-sm leading-6 text-stone-300">
          Edit the introduction and main content shown in the public About tab.
        </p>
        {languages.map((language) => (
          <div key={language.id} hidden={language.id !== activeLanguage} className="mt-5 grid gap-4">
            <ExperienceInput city={city} language={language.id} field="aboutTitle" label="Section title" />
            <Field label="Introduction">
              <textarea
                name={`intro_${language.id}`}
                className={textareaClass}
                rows={4}
                defaultValue={city[`intro_${language.id}`] || ""}
              />
            </Field>
            <Field label="Main formatted content">
              <textarea
                name={`introBlocks_${language.id}`}
                className={`${textareaClass} min-h-48`}
                rows={10}
                defaultValue={(city[`introBlocks_${language.id}`] || []).join("\n\n")}
              />
            </Field>
            <p className="text-xs leading-5 text-stone-400">
              Use blank lines for paragraphs. Start consecutive lines with “- ” for a bullet list.
            </p>
          </div>
        ))}
      </section>

      <section
        id="porto-living-editor"
        role="tabpanel"
        aria-labelledby="porto-living-editor-tab"
        hidden={activeSection !== "living"}
        className="rounded-xl border border-white/10 bg-black/10 p-4 md:p-5"
      >
        <h3 className="text-xl font-light text-white">Living &amp; Working</h3>
        <p className="mt-2 text-sm leading-6 text-stone-300">
          Practical city information and supporting service cards shown in the public Living &amp; Working tab.
        </p>
        {languages.map((language) => (
          <div key={language.id} hidden={language.id !== activeLanguage} className="mt-5 grid gap-4">
            <ExperienceInput city={city} language={language.id} field="livingTitle" label="Section title" />
            <ExperienceInput city={city} language={language.id} field="livingIntroduction" label="Introduction" multiline />
            <ExperienceInput city={city} language={language.id} field="livingBody" label="Main formatted content" multiline rows={10} />
            <p className="text-xs leading-5 text-stone-400">
              Interpreter and available-property links are added automatically. Use blank lines for paragraphs and “- ” for lists.
            </p>
          </div>
        ))}
        <div className="mt-6 border-t border-white/10 pt-6">
          <h4 className="text-sm font-medium uppercase tracking-widest text-[#d6a85a]">
            Additional Living &amp; Working cards
          </h4>
          <p className="mb-4 mt-2 text-sm leading-6 text-stone-400">
            Optional cards displayed alongside the automatically generated service links.
          </p>
          <SidebarCardEditor
            cards={sidebarCards}
            setCards={setSidebarCards}
            activeLanguage={activeLanguage}
          />
        </div>
      </section>

      <section
        id="porto-explore-editor"
        role="tabpanel"
        aria-labelledby="porto-explore-editor-tab"
        hidden={activeSection !== "explore"}
        className="rounded-xl border border-white/10 bg-black/10 p-4 md:p-5"
      >
        <h3 className="text-xl font-light text-white">Explore the City</h3>
        <p className="mt-2 text-sm leading-6 text-stone-300">
          Control the introduction and the heading used for host-recommended places. Places and guides are managed below.
        </p>
        {languages.map((language) => (
          <div key={language.id} hidden={language.id !== activeLanguage} className="mt-5 grid gap-4">
            <ExperienceInput city={city} language={language.id} field="exploreTitle" label="Section title" />
            <ExperienceInput city={city} language={language.id} field="exploreIntroduction" label="Introduction" multiline />
            <div className="mt-2 border-t border-white/10 pt-5">
              <p className="mb-4 text-sm font-medium text-white">Host-recommended places</p>
              <div className="grid gap-4">
                <ExperienceInput city={city} language={language.id} field="favoritesTitle" label="Recommendations heading" />
                <ExperienceInput city={city} language={language.id} field="favoritesIntroduction" label="Recommendations introduction" multiline />
              </div>
            </div>
          </div>
        ))}
        <div className="mt-6 rounded-lg border border-[#d6a85a]/35 bg-[#d6a85a]/10 p-4">
          <p className="font-medium text-white">Map places and quick place creation</p>
          <p className="mt-2 text-sm leading-6 text-stone-300">
            Add restaurants, cafés, museums, walks, markets and host recommendations using the existing phone-friendly place form.
          </p>
          <Link
            href={`/dashboard/cities/${citySlug}/map`}
            className="mt-4 inline-flex min-h-11 items-center rounded-lg bg-[#d6a85a] px-4 py-2 text-sm font-medium text-[#1a1f2e] transition hover:bg-white"
          >
            Manage Explore places
          </Link>
        </div>
      </section>

      <section
        id="porto-from-host-editor"
        role="tabpanel"
        aria-labelledby="porto-from-host-editor-tab"
        hidden={activeSection !== "from-host"}
        className="rounded-xl border border-white/10 bg-black/10 p-4 md:p-5"
      >
        <h3 className="text-xl font-light text-white">From Your Host</h3>
        <p className="mt-2 text-sm leading-6 text-stone-300">
          A minimal editorial introduction for personal observations or perspective on the city. This is separate from the host profile.
        </p>
        {languages.map((language) => (
          <div key={language.id} hidden={language.id !== activeLanguage} className="mt-5 space-y-4">
            <ExperienceInput
              city={city}
              language={language.id}
              field="fromHostIntroduction"
              label="Introduction"
              multiline
              rows={7}
            />
            <Field label="Primary contact button label">
              <input
                name={`cta_${language.id}`}
                className={inputClass}
                defaultValue={city[`cta_${language.id}`] || ""}
              />
            </Field>
          </div>
        ))}
        <p className="mt-4 text-xs leading-5 text-stone-400">
          Host name, photo and contact details continue to come from the Provider profile and are not part of this editorial area.
        </p>
      </section>
    </div>
  );
}

function EnabledLanguageFields({
  city,
  canManageLanguages,
}: {
  city: CityDashboardEditorData;
  canManageLanguages: boolean;
}) {
  const hasOverride = Array.isArray(city.enabledLanguages);
  const enabled = hasOverride ? city.enabledLanguages || [] : city.hostLanguages || [];
  const [inheritHostLanguages, setInheritHostLanguages] = useState(!hasOverride);

  if (!canManageLanguages) {
    return (
      <section className="rounded-xl border border-white/10 bg-black/10 p-4">
        <h3 className="text-sm font-medium uppercase tracking-widest text-white">
          Published languages
        </h3>
        <p className="mt-3 text-sm leading-6 text-stone-300">
          {enabled.length
            ? `${enabled.map((lang) => lang.toUpperCase()).join(", ")} — ${hasOverride ? "set by an admin" : "inherited from the primary host"}.`
            : "No public languages are available. Ask an admin to review the primary host assignment."}
        </p>
      </section>
    );
  }

  return (
    <fieldset className="rounded-xl border border-white/10 bg-black/10 p-4">
      <legend className="px-2 text-sm font-medium uppercase tracking-widest text-white">
        Published languages
      </legend>
      <p className="mb-4 text-sm leading-6 text-stone-300">
        By default, public flags follow the primary host’s provider languages.
        An admin override can limit or replace that list.
      </p>
      <label className="mb-4 flex items-center gap-2 text-sm text-stone-200">
        <input
          type="checkbox"
          name="inheritHostLanguages"
          defaultChecked={!hasOverride}
          onChange={(event) => setInheritHostLanguages(event.target.checked)}
          className="size-4 accent-[#d6a85a]"
        />
        Use primary host languages
      </label>
      <div className="flex flex-wrap gap-5">
        {languages.map((language) => (
          <label key={language.id} className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              name="enabledLanguages"
              value={language.id}
              defaultChecked={enabled.includes(language.id)}
              disabled={inheritHostLanguages}
              className="size-4 accent-[#d6a85a]"
            />
            {language.label}
          </label>
        ))}
      </div>
    </fieldset>
  );
}

function SidebarCardEditor({
  cards,
  setCards,
  activeLanguage,
}: {
  cards: CityDashboardSidebarCard[];
  setCards: (cards: CityDashboardSidebarCard[]) => void;
  activeLanguage?: Lang;
}) {
  const editingLanguages = activeLanguage
    ? languages.filter((language) => language.id === activeLanguage)
    : languages;
  function updateCard(
    index: number,
    field: keyof CityDashboardSidebarCard,
    value: string,
  ) {
    setCards(
      cards.map((card, cardIndex) =>
        cardIndex === index ? { ...card, [field]: value } : card,
      ),
    );
  }

  function addCard() {
    setCards([
      ...cards,
      {
        _key: newKey("sidebar"),
        title_en: "",
        text_en: "",
        button_en: "",
        href_en: "",
      },
    ]);
  }

  function deleteCard(index: number) {
    setCards(cards.filter((_, cardIndex) => cardIndex !== index));
  }

  return (
    <div className="space-y-4">
      <input type="hidden" name="sidebarCardsJson" value={JSON.stringify(cards)} />

      {cards.length ? (
        cards.map((card, index) => (
          <div
            key={card._key || index}
            className="space-y-4 rounded-xl border border-white/10 bg-black/10 p-4"
          >
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <h3 className="text-sm font-medium uppercase tracking-widest text-white">
                Sidebar card {index + 1}
              </h3>
              <button
                type="button"
                onClick={() => deleteCard(index)}
                className="rounded-lg border border-red-300/40 px-3 py-2 text-sm text-red-100 transition hover:border-red-200 hover:text-white"
              >
                Delete card
              </button>
            </div>

            {editingLanguages.map((language) => (
              <div key={language.id} className="grid gap-3 md:grid-cols-2">
                <Field label={`Title (${language.hint})`}>
                  <input
                    className={inputClass}
                    value={card[`title_${language.id}`] || ""}
                    onChange={(event) =>
                      updateCard(index, `title_${language.id}`, event.target.value)
                    }
                  />
                </Field>
                <Field label={`Button (${language.hint})`}>
                  <input
                    className={inputClass}
                    value={card[`button_${language.id}`] || ""}
                    onChange={(event) =>
                      updateCard(index, `button_${language.id}`, event.target.value)
                    }
                  />
                </Field>
                <Field label={`Text (${language.hint})`}>
                  <textarea
                    className={textareaClass}
                    rows={3}
                    value={card[`text_${language.id}`] || ""}
                    onChange={(event) =>
                      updateCard(index, `text_${language.id}`, event.target.value)
                    }
                  />
                </Field>
                <Field label={`Link (${language.hint})`}>
                  <input
                    className={inputClass}
                    value={card[`href_${language.id}`] || ""}
                    onChange={(event) =>
                      updateCard(index, `href_${language.id}`, event.target.value)
                    }
                  />
                </Field>
              </div>
            ))}
          </div>
        ))
      ) : (
        <div className="rounded-xl border border-dashed border-white/15 p-4 text-sm text-stone-400">
          No sidebar cards yet.
        </div>
      )}

      <button
        type="button"
        onClick={addCard}
        className="w-full rounded-lg border border-white/15 px-4 py-3 text-sm text-white transition hover:border-[#d6a85a] hover:text-[#d6a85a] sm:w-auto"
      >
        Add sidebar card
      </button>
    </div>
  );
}

function RecommendationEditor({
  recommendations,
  setRecommendations,
  mapPlaces,
  legacyRecommendationCount,
  cityName,
  activeLanguage,
}: {
  recommendations: CityDashboardRecommendation[];
  setRecommendations: (recommendations: CityDashboardRecommendation[]) => void;
  mapPlaces: CityDashboardMapPlace[];
  legacyRecommendationCount: number;
  cityName: string;
  activeLanguage?: Lang;
}) {
  const editingLanguages = activeLanguage
    ? languages.filter((language) => language.id === activeLanguage)
    : languages;
  function updateRecommendation(
    index: number,
    field: keyof CityDashboardRecommendation,
    value: string | string[],
  ) {
    setRecommendations(
      recommendations.map((recommendation, recommendationIndex) =>
        recommendationIndex === index
          ? { ...recommendation, [field]: value }
          : recommendation,
      ),
    );
  }

  function addRecommendation() {
    setRecommendations([
      ...recommendations,
      {
        _key: newKey("recommendation"),
        recommendationType: "localExperience",
      },
    ]);
  }

  function deleteRecommendation(index: number) {
    setRecommendations(
      recommendations.filter((_, recommendationIndex) => recommendationIndex !== index),
    );
  }

  function moveRecommendation(index: number, direction: -1 | 1) {
    const destination = index + direction;
    if (destination < 0 || destination >= recommendations.length) return;

    const reordered = [...recommendations];
    [reordered[index], reordered[destination]] = [
      reordered[destination],
      reordered[index],
    ];
    setRecommendations(reordered);
  }

  function toggleRelatedPlace(index: number, placeKey: string) {
    const selected = recommendations[index].relatedMapPlaceKeys || [];
    updateRecommendation(
      index,
      "relatedMapPlaceKeys",
      selected.includes(placeKey)
        ? selected.filter((key) => key !== placeKey)
        : [...selected, placeKey],
    );
  }

  return (
    <div className="space-y-5">
      <input
        type="hidden"
        name="recommendationGuidesJson"
        value={JSON.stringify(recommendations)}
      />

      <div className="rounded-xl border border-white/10 bg-black/10 p-4 text-sm leading-6 text-stone-300">
        Curated guides and previous Host&apos;s Favorites are both published inside
        Explore the City. Write guides as useful local articles with practical context.
        {legacyRecommendationCount ? (
          <p className="mt-3 border-t border-white/10 pt-3 text-amber-100">
            {legacyRecommendationCount} previous Host&apos;s Favorite
            {legacyRecommendationCount === 1 ? " is" : "s are"} already published in
            Explore. New place recommendations should use the map-place workflow.
          </p>
        ) : null}
      </div>

      {!recommendations.length ? (
        <div className="rounded-xl border border-dashed border-white/15 p-4 text-sm text-stone-400">
          No curated recommendation guides yet.
        </div>
      ) : null}

      {recommendations.map((recommendation, index) => {
        const isCustom = recommendation.recommendationType === "custom";

        return (
          <div
            key={recommendation._key || index}
            className="space-y-5 rounded-xl border border-white/10 bg-black/10 p-4 md:p-5"
          >
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h3 className="text-sm font-medium uppercase tracking-widest text-white">
                  {index + 1}. {itemTitle(recommendation)}
                </h3>
                <p className="mt-1 text-sm text-stone-400">
                  Curated guide article
                </p>
              </div>
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  disabled={index === 0}
                  onClick={() => moveRecommendation(index, -1)}
                  className="rounded-lg border border-white/15 px-3 py-2 text-sm text-stone-200 transition hover:border-white/30 disabled:cursor-not-allowed disabled:opacity-35"
                >
                  Move up
                </button>
                <button
                  type="button"
                  disabled={index === recommendations.length - 1}
                  onClick={() => moveRecommendation(index, 1)}
                  className="rounded-lg border border-white/15 px-3 py-2 text-sm text-stone-200 transition hover:border-white/30 disabled:cursor-not-allowed disabled:opacity-35"
                >
                  Move down
                </button>
                <button
                  type="button"
                  onClick={() => deleteRecommendation(index)}
                  className="rounded-lg border border-red-300/40 px-3 py-2 text-sm text-red-100 transition hover:border-red-200 hover:text-white"
                >
                  Delete
                </button>
              </div>
            </div>

            <div className="grid gap-4 lg:grid-cols-3">
              {editingLanguages.map((language) => (
                <section
                  key={language.id}
                  className="space-y-4 rounded-xl border border-white/10 p-4"
                >
                  <h4 className="text-sm font-medium text-[#d6a85a]">
                    {language.label}
                  </h4>
                  <Field label={`Title (${language.hint})`}>
                  <input
                    className={inputClass}
                    value={recommendation[`title_${language.id}`] || ""}
                    onChange={(event) =>
                      updateRecommendation(
                        index,
                        `title_${language.id}`,
                        event.target.value,
                      )
                    }
                    placeholder="A Perfect Sunday in Porto Alegre"
                  />
                  </Field>
                  <Field label={`Short introduction (${language.hint})`}>
                    <textarea
                      className={textareaClass}
                      rows={3}
                      value={recommendation[`introduction_${language.id}`] || ""}
                      onChange={(event) =>
                        updateRecommendation(
                          index,
                          `introduction_${language.id}`,
                          event.target.value,
                        )
                      }
                      placeholder="Summarize who this guide is for and what local insight it offers."
                    />
                  </Field>
                  <Field label={`Full content (${language.hint})`}>
                    <textarea
                      className={`${textareaClass} min-h-64`}
                      rows={10}
                      value={recommendation[`content_${language.id}`] || ""}
                      onChange={(event) =>
                        updateRecommendation(
                          index,
                          `content_${language.id}`,
                          event.target.value,
                        )
                      }
                      placeholder={"Write practical local advice in paragraphs.\n\n- Use dashed lines for lists\n- Include timing, areas and local context"}
                    />
                  </Field>
                </section>
              ))}
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <Field label="Recommendation type">
                <select
                  className={inputClass}
                  value={recommendation.recommendationType || "localExperience"}
                  onChange={(event) =>
                    updateRecommendation(index, "recommendationType", event.target.value)
                  }
                >
                  {recommendationGuideCategories.map((category) => (
                    <option key={category.id} value={category.id} className="text-stone-900">
                      {category.labels.en}
                    </option>
                  ))}
                  <option value="custom" className="text-stone-900">
                    Custom category
                  </option>
                </select>
              </Field>
              <div className="rounded-lg border border-white/10 px-4 py-3 text-sm leading-6 text-stone-400">
                Optional provider and related city references remain available in
                Sanity Studio. Featured images and map-place links can be managed here.
              </div>
            </div>

            {isCustom ? (
              <div className="grid gap-3 md:grid-cols-3">
                {editingLanguages.map((language) => (
                  <Field key={language.id} label={`Category label (${language.hint})`}>
                    <input
                      className={inputClass}
                      value={recommendation[`customCategory_${language.id}`] || ""}
                      onChange={(event) =>
                        updateRecommendation(
                          index,
                          `customCategory_${language.id}`,
                          event.target.value,
                        )
                      }
                    />
                  </Field>
                ))}
              </div>
            ) : null}

            <RecommendationImageField
              recommendation={recommendation}
              cityName={cityName}
            />

            {mapPlaces.some((place) => place._key) ? (
              <fieldset className="rounded-xl border border-white/10 p-4">
                <legend className="px-2 text-xs uppercase tracking-widest text-stone-400">
                  Related map places
                </legend>
                <div className="mt-2 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
                  {mapPlaces.flatMap((place) => {
                    if (!place._key) return [];
                    const label = place.name_en || place.name || place.name_pt || place._key;
                    return [
                      <label
                        key={place._key}
                        className="flex items-center gap-3 rounded-lg border border-white/10 px-3 py-3 text-sm text-stone-200"
                      >
                        <input
                          type="checkbox"
                          checked={(recommendation.relatedMapPlaceKeys || []).includes(place._key)}
                          onChange={() => toggleRelatedPlace(index, place._key as string)}
                          className="size-4 accent-[#d6a85a]"
                        />
                        {label}
                      </label>,
                    ];
                  })}
                </div>
              </fieldset>
            ) : null}
          </div>
        );
      })}

      <button
        type="button"
        onClick={addRecommendation}
        className="w-full rounded-lg border border-white/15 px-4 py-3 text-sm text-white transition hover:border-[#d6a85a] hover:text-[#d6a85a] sm:w-auto"
      >
        Create recommendation guide
      </button>
    </div>
  );
}

export default function CityDashboardEditors({
  citySlug,
  city,
  canManageLanguages,
  saveContentAction,
  saveRecommendationsAction,
}: EditorProps) {
  const router = useRouter();
  const [contentState, contentFormAction] = useActionState(
    saveContentAction,
    initialActionState,
  );
  const [recommendationState, recommendationFormAction] = useActionState(
    saveRecommendationsAction,
    initialActionState,
  );
  const [sidebarCards, setSidebarCards] = useState(city.sidebarCards || []);
  const [recommendations, setRecommendations] = useState(
    city.recommendationGuides || [],
  );
  const [activeLanguage, setActiveLanguage] = useState<Lang>("en");
  const [activePortoSection, setActivePortoSection] =
    useState<PortoEditorSection>("about");
  const isPortoAlegre = citySlug === "porto-alegre";

  useEffect(() => {
    if (recommendationState.status === "success") {
      router.refresh();
    }
  }, [recommendationState.status, recommendationState.submittedAt, router]);

  useEffect(() => {
    if (contentState.status === "success") {
      router.refresh();
    }
  }, [contentState.status, contentState.submittedAt, router]);

  return (
    <div className="space-y-8">
      <Panel
        eyebrow="City content"
        title={isPortoAlegre ? "City page" : "Public guide copy"}
      >
        {isPortoAlegre ? (
          <div className="space-y-5 rounded-xl border border-white/10 bg-black/10 p-3 md:p-4">
            <div>
              <p className="mb-2 text-xs uppercase tracking-widest text-stone-400">
                Editing language
              </p>
              <div
                role="tablist"
                aria-label="Editing language"
                className="grid grid-cols-3 gap-2"
              >
                {languages.map((language) => (
                  <button
                    key={language.id}
                    type="button"
                    role="tab"
                    aria-selected={activeLanguage === language.id}
                    onClick={() => setActiveLanguage(language.id)}
                    className={`min-h-11 rounded-lg px-2 py-2 text-sm font-medium transition focus:outline-none focus:ring-2 focus:ring-[#d6a85a] ${
                      activeLanguage === language.id
                        ? "bg-[#d6a85a] text-[#1a1f2e]"
                        : "bg-white/5 text-stone-200 hover:bg-white/10"
                    }`}
                  >
                    {language.label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <p className="mb-2 text-xs uppercase tracking-widest text-stone-400">
                Public page tab
              </p>
              <div
                role="tablist"
                aria-label="Public page editing areas"
                className="grid grid-cols-2 gap-2 lg:grid-cols-4"
              >
                {portoEditorSections.map((section) => (
                  <button
                    key={section.id}
                    id={`porto-${section.id}-editor-tab`}
                    type="button"
                    role="tab"
                    aria-selected={activePortoSection === section.id}
                    aria-controls={`porto-${section.id}-editor`}
                    onClick={() => setActivePortoSection(section.id)}
                    className={`min-h-12 rounded-lg px-3 py-2 text-sm font-medium leading-tight transition focus:outline-none focus:ring-2 focus:ring-[#d6a85a] ${
                      activePortoSection === section.id
                        ? "bg-white text-[#1a1f2e]"
                        : "bg-white/5 text-stone-200 hover:bg-white/10"
                    }`}
                  >
                    {section.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        ) : null}

        <form action={contentFormAction} className="space-y-6">
          <ActionMessage state={contentState} />
          <EnabledLanguageFields
            city={city}
            canManageLanguages={canManageLanguages}
          />
          {isPortoAlegre ? (
            <PortoAlegreExperienceFields
              city={city}
              citySlug={citySlug}
              activeLanguage={activeLanguage}
              activeSection={activePortoSection}
              sidebarCards={sidebarCards}
              setSidebarCards={setSidebarCards}
            />
          ) : (
            <LanguageFields city={city} />
          )}

          {!isPortoAlegre ? (
            <div className="space-y-4 border-t border-white/10 pt-6">
              <h3 className="text-sm font-medium uppercase tracking-widest text-[#d6a85a]">
                Sidebar cards
              </h3>
              <SidebarCardEditor cards={sidebarCards} setCards={setSidebarCards} />
            </div>
          ) : null}

          <SaveButton label="Save city content" />
        </form>
      </Panel>

      <div hidden={isPortoAlegre && activePortoSection !== "explore"}>
        <Panel
          eyebrow={isPortoAlegre ? "Explore the City" : "Recommendations"}
          title="Curated local guides"
        >
          <form
            key={recommendationState.submittedAt || "recommendation-guides"}
            action={recommendationFormAction}
            className="space-y-6"
          >
            <ActionMessage state={recommendationState} />
            <RecommendationEditor
              recommendations={recommendations}
              setRecommendations={setRecommendations}
              mapPlaces={city.mapPlaces || []}
              legacyRecommendationCount={city.recommendations?.length || 0}
              cityName={city.name_en || city.name_pt || city.name_nl || "the city"}
              activeLanguage={isPortoAlegre ? activeLanguage : undefined}
            />
            <SaveButton label="Save recommendation guides" />
          </form>
        </Panel>
      </div>
    </div>
  );
}
