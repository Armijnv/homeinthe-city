"use client";

import { useActionState, useState, type ReactNode } from "react";
import { useFormStatus } from "react-dom";
import type { CityDashboardActionState } from "@/app/dashboard/cities/[citySlug]/actions";
import { recommendationGuideCategories } from "@/app/lib/recommendationGuides";

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
    asset?: { _type?: string; _ref?: string };
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
  enabledLanguages?: Lang[];
  hostLanguages?: Lang[];
  headline_en?: string;
  headline_pt?: string;
  headline_nl?: string;
  intro_en?: string;
  intro_pt?: string;
  intro_nl?: string;
  introBlocks_en?: string[];
  introBlocks_pt?: string[];
  introBlocks_nl?: string[];
  sidebarCards?: CityDashboardSidebarCard[];
  recommendationGuides?: CityDashboardRecommendation[];
  recommendations?: Array<{ _key?: string }>;
  mapPlaces?: CityDashboardMapPlace[];
};

type EditorProps = {
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
  { id: "pt", label: "Portuguese", hint: "PT-BR" },
  { id: "nl", label: "Dutch", hint: "NL" },
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
}: {
  cards: CityDashboardSidebarCard[];
  setCards: (cards: CityDashboardSidebarCard[]) => void;
}) {
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

            {languages.map((language) => (
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
}: {
  recommendations: CityDashboardRecommendation[];
  setRecommendations: (recommendations: CityDashboardRecommendation[]) => void;
  mapPlaces: CityDashboardMapPlace[];
  legacyRecommendationCount: number;
}) {
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
        Write recommendations as useful local articles: name the city and topic,
        explain the local context, and include practical advice a visitor can act on.
        {legacyRecommendationCount ? (
          <p className="mt-3 border-t border-white/10 pt-3 text-amber-100">
            {legacyRecommendationCount} legacy place-style recommendation
            {legacyRecommendationCount === 1 ? " is" : "s are"} preserved separately.
            Review and migrate them before deleting anything in Sanity Studio.
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
              {languages.map((language) => (
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
                {recommendation.featuredImage?.asset?._ref
                  ? "Featured image attached. Image and relation changes remain available in Sanity Studio."
                  : "Optional featured images, providers and related city pages can be attached in Sanity Studio."}
              </div>
            </div>

            {isCustom ? (
              <div className="grid gap-3 md:grid-cols-3">
                {languages.map((language) => (
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
  city,
  canManageLanguages,
  saveContentAction,
  saveRecommendationsAction,
}: EditorProps) {
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

  return (
    <div className="space-y-8">
      <Panel eyebrow="City content" title="Public guide copy">
        <form action={contentFormAction} className="space-y-6">
          <ActionMessage state={contentState} />
          <EnabledLanguageFields
            city={city}
            canManageLanguages={canManageLanguages}
          />
          <LanguageFields city={city} />

          <div className="space-y-4 border-t border-white/10 pt-6">
            <h3 className="text-sm font-medium uppercase tracking-widest text-[#d6a85a]">
              Sidebar cards
            </h3>
            <SidebarCardEditor cards={sidebarCards} setCards={setSidebarCards} />
          </div>

          <SaveButton label="Save city content" />
        </form>
      </Panel>

      <Panel eyebrow="Recommendations" title="Curated local guides">
        <form action={recommendationFormAction} className="space-y-6">
          <ActionMessage state={recommendationState} />
          <RecommendationEditor
            recommendations={recommendations}
            setRecommendations={setRecommendations}
            mapPlaces={city.mapPlaces || []}
            legacyRecommendationCount={city.recommendations?.length || 0}
          />
          <SaveButton label="Save recommendation guides" />
        </form>
      </Panel>
    </div>
  );
}
