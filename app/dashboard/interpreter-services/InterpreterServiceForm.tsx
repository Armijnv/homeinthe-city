"use client";

import Link from "next/link";
import { useState } from "react";
import type { InterpreterCmsPage, InterpreterLanguage } from "@/app/lib/interpreterTypes";

type LocalizedField =
  | "seoTitle"
  | "seoDescription"
  | "eyebrow"
  | "title"
  | "intro"
  | "pricingTitle"
  | "ctaTitle"
  | "ctaText"
  | "button";

type ServiceSection = NonNullable<InterpreterCmsPage["sections"]>[number];
type PricingItem = NonNullable<InterpreterCmsPage["pricingItems"]>[number];

const languageOptions: Array<{
  id: InterpreterLanguage;
  label: string;
}> = [
  { id: "en", label: "English" },
  { id: "pt", label: "Português" },
  { id: "nl", label: "Nederlands" },
];

const localizedFields: LocalizedField[] = [
  "seoTitle",
  "seoDescription",
  "eyebrow",
  "title",
  "intro",
  "pricingTitle",
  "ctaTitle",
  "ctaText",
  "button",
];

const inputClass =
  "w-full min-w-0 rounded-lg border border-white/15 bg-[#1a1f2e] px-4 py-3 text-sm text-white placeholder:text-stone-500";

function initialLocalized(page: InterpreterCmsPage) {
  return Object.fromEntries(
    languageOptions.map(({ id }) => [
      id,
      Object.fromEntries(
        localizedFields.map((field) => [field, page[`${field}_${id}`] || ""]),
      ),
    ]),
  ) as Record<InterpreterLanguage, Record<LocalizedField, string>>;
}

function itemKey(prefix: string, index: number) {
  return `${prefix}-${Date.now()}-${index}`;
}

export default function InterpreterServiceForm({
  page,
  pageKey,
  isGeneralPage,
  isAdmin,
  publicPath,
  action,
}: {
  page: InterpreterCmsPage;
  pageKey: string;
  isGeneralPage: boolean;
  isAdmin: boolean;
  publicPath: string;
  action: (formData: FormData) => void | Promise<void>;
}) {
  const [activeLanguage, setActiveLanguage] =
    useState<InterpreterLanguage>("en");
  const [localized, setLocalized] = useState(() => initialLocalized(page));
  const [sections, setSections] = useState<ServiceSection[]>(
    () => page.sections || [],
  );
  const [pricingItems, setPricingItems] = useState<PricingItem[]>(
    () => page.pricingItems || [],
  );

  function setLocalizedField(field: LocalizedField, value: string) {
    setLocalized((current) => ({
      ...current,
      [activeLanguage]: {
        ...current[activeLanguage],
        [field]: value,
      },
    }));
  }

  function updateSection(index: number, field: "title" | "text", value: string) {
    setSections((current) =>
      current.map((section, sectionIndex) =>
        sectionIndex === index
          ? { ...section, [`${field}_${activeLanguage}`]: value }
          : section,
      ),
    );
  }

  function updatePricing(
    index: number,
    field: "label" | "detail",
    value: string,
  ) {
    setPricingItems((current) =>
      current.map((item, itemIndex) =>
        itemIndex === index
          ? { ...item, [`${field}_${activeLanguage}`]: value }
          : item,
      ),
    );
  }

  return (
    <form action={action} className="space-y-6">
      <input type="hidden" name="pageKey" value={pageKey} />
      {languageOptions.flatMap(({ id }) =>
        localizedFields
          .filter((field) => isAdmin || !["seoTitle", "seoDescription", "eyebrow", "title"].includes(field))
          .map((field) => (
          <input
            key={`${field}-${id}`}
            type="hidden"
            name={`${field}_${id}`}
            value={localized[id][field]}
          />
          )),
      )}
      <input
        type="hidden"
        name="sectionsJson"
        value={JSON.stringify(sections)}
      />
      <input
        type="hidden"
        name="pricingItemsJson"
        value={JSON.stringify(pricingItems)}
      />

      <section className="rounded-2xl border border-white/10 bg-white/5 p-4 sm:p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="text-xl font-medium text-white">Editing language</h2>
            <p className="mt-1 text-sm leading-6 text-stone-400">
              Only one language is shown. The other translations remain preserved.
            </p>
          </div>
          <div
            role="tablist"
            aria-label="Service page language"
            className="grid grid-cols-3 rounded-xl border border-white/10 bg-black/15 p-1"
          >
            {languageOptions.map((language) => (
              <button
                key={language.id}
                type="button"
                role="tab"
                aria-selected={activeLanguage === language.id}
                onClick={() => setActiveLanguage(language.id)}
                className={`min-h-11 rounded-lg px-3 py-2 text-xs transition sm:text-sm ${
                  activeLanguage === language.id
                    ? "bg-[#d6a85a] text-[#1a1f2e]"
                    : "text-stone-300 hover:text-white"
                }`}
              >
                {language.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      {isAdmin ? <details className="rounded-2xl border border-white/10 bg-white/5 p-4 sm:p-6">
        <summary className="cursor-pointer text-xl font-medium text-white">Advanced search settings</summary>
        <p className="mt-3 text-sm leading-6 text-stone-400">
          Leave these blank to use the automatic city-aware title and search description. Any text entered here is a custom override.
        </p>
        <div className="mt-5 grid min-w-0 gap-5">
          <label>
            <span className="mb-2 block text-xs uppercase tracking-widest text-stone-400">
              Search title override
            </span>
            <input
              className={inputClass}
              value={localized[activeLanguage].seoTitle}
              onChange={(event) => setLocalizedField("seoTitle", event.target.value)}
            />
          </label>
          <label>
            <span className="mb-2 block text-xs uppercase tracking-widest text-stone-400">
              Search description override
            </span>
            <textarea
              rows={4}
              className={inputClass}
              value={localized[activeLanguage].seoDescription}
              onChange={(event) =>
                setLocalizedField("seoDescription", event.target.value)
              }
            />
          </label>
        </div>
      </details> : null}

      <section className="rounded-2xl border border-white/10 bg-white/5 p-4 sm:p-6">
        <h2 className="text-xl font-medium text-white">Page introduction</h2>
        <p className="mt-1 text-sm leading-6 text-stone-400">The page title is generated automatically from the city and interpreter service.</p>
        <div className="mt-5 grid min-w-0 gap-5">
          {isAdmin ? <details className="rounded-xl border border-white/10 bg-black/10 p-4">
            <summary className="cursor-pointer text-sm font-medium text-white">Advanced heading overrides</summary>
            <p className="mt-2 text-sm leading-6 text-stone-400">Leave these blank to use the automatic page title and the shared small heading.</p>
            <label className="mt-4 block">
            <span className="mb-2 block text-xs uppercase tracking-widest text-stone-400">Small heading above the title</span>
            <input
              className={inputClass}
              value={localized[activeLanguage].eyebrow}
              onChange={(event) => setLocalizedField("eyebrow", event.target.value)}
            />
            </label>
            <label className="mt-4 block">
            <span className="mb-2 block text-xs uppercase tracking-widest text-stone-400">Page title override</span>
            <input
              className={inputClass}
              value={localized[activeLanguage].title}
              onChange={(event) => setLocalizedField("title", event.target.value)}
            />
            </label>
          </details> : null}
          <label>
            <span className="mb-2 block text-xs uppercase tracking-widest text-stone-400">Introduction</span>
            <textarea
              rows={6}
              className={inputClass}
              value={localized[activeLanguage].intro}
              onChange={(event) => setLocalizedField("intro", event.target.value)}
            />
          </label>
        </div>
      </section>

      {!isGeneralPage ? (
        <>
          <section className="rounded-2xl border border-white/10 bg-white/5 p-4 sm:p-6">
            <div className="flex flex-wrap items-end justify-between gap-3">
              <div>
                <h2 className="text-xl font-medium text-white">Services and local support</h2>
                <p className="mt-1 text-sm leading-6 text-stone-400">
                  Add helpful city-specific service and support information.
                </p>
              </div>
              <button
                type="button"
                onClick={() =>
                  setSections((current) => [
                    ...current,
                    { _key: itemKey("section", current.length) },
                  ])
                }
                className="min-h-11 rounded-lg border border-white/15 px-4 py-2 text-sm text-white"
              >
                Add information section
              </button>
            </div>
            <div className="mt-5 grid gap-4">
              {sections.map((section, index) => (
                <article key={section._key || index} className="min-w-0 rounded-xl border border-white/10 bg-black/10 p-4">
                  <div className="flex items-center justify-between gap-3">
                    <h3 className="font-medium text-white">Section {index + 1}</h3>
                    <button
                      type="button"
                      onClick={() => setSections((current) => current.filter((_, itemIndex) => itemIndex !== index))}
                      className="min-h-11 text-sm text-red-200"
                    >
                      Remove
                    </button>
                  </div>
                  <div className="mt-3 grid min-w-0 gap-3">
                    <input
                      aria-label={`Section ${index + 1} title`}
                      className={inputClass}
                      value={section[`title_${activeLanguage}`] || ""}
                      onChange={(event) => updateSection(index, "title", event.target.value)}
                      placeholder="Section title"
                    />
                    <textarea
                      aria-label={`Section ${index + 1} text`}
                      rows={5}
                      className={inputClass}
                      value={section[`text_${activeLanguage}`] || ""}
                      onChange={(event) => updateSection(index, "text", event.target.value)}
                      placeholder="Section text"
                    />
                  </div>
                </article>
              ))}
            </div>
          </section>

          <section className="rounded-2xl border border-white/10 bg-white/5 p-4 sm:p-6">
            <div className="flex flex-wrap items-end justify-between gap-3">
              <div>
                <h2 className="text-xl font-medium text-white">Pricing</h2>
                <p className="mt-1 text-sm leading-6 text-stone-400">
                  Empty rows use the existing tailored-quote explanation.
                </p>
              </div>
              <button
                type="button"
                onClick={() =>
                  setPricingItems((current) => [
                    ...current,
                    { _key: itemKey("price", current.length) },
                  ])
                }
                className="min-h-11 rounded-lg border border-white/15 px-4 py-2 text-sm text-white"
              >
                Add pricing row
              </button>
            </div>
            <label className="mt-5 block">
              <span className="mb-2 block text-xs uppercase tracking-widest text-stone-400">Pricing heading</span>
              <input
                className={inputClass}
                value={localized[activeLanguage].pricingTitle}
                onChange={(event) => setLocalizedField("pricingTitle", event.target.value)}
              />
            </label>
            <div className="mt-4 grid gap-4">
              {pricingItems.map((item, index) => (
                <article key={item._key || index} className="min-w-0 rounded-xl border border-white/10 bg-black/10 p-4">
                  <div className="flex items-center justify-between gap-3">
                    <h3 className="font-medium text-white">Pricing row {index + 1}</h3>
                    <button
                      type="button"
                      onClick={() => setPricingItems((current) => current.filter((_, itemIndex) => itemIndex !== index))}
                      className="min-h-11 text-sm text-red-200"
                    >
                      Remove
                    </button>
                  </div>
                  <div className="mt-3 grid min-w-0 gap-3 sm:grid-cols-2">
                    <input
                      aria-label={`Pricing row ${index + 1} label`}
                      className={inputClass}
                      value={item[`label_${activeLanguage}`] || ""}
                      onChange={(event) => updatePricing(index, "label", event.target.value)}
                      placeholder="Label"
                    />
                    <input
                      aria-label={`Pricing row ${index + 1} detail`}
                      className={inputClass}
                      value={item[`detail_${activeLanguage}`] || ""}
                      onChange={(event) => updatePricing(index, "detail", event.target.value)}
                      placeholder="Detail"
                    />
                  </div>
                </article>
              ))}
            </div>
          </section>
        </>
      ) : null}

      <section className="rounded-2xl border border-white/10 bg-white/5 p-4 sm:p-6">
        <h2 className="text-xl font-medium text-white">Contact / call to action</h2>
        <div className="mt-5 grid min-w-0 gap-5">
          <label>
            <span className="mb-2 block text-xs uppercase tracking-widest text-stone-400">Heading</span>
            <input
              className={inputClass}
              value={localized[activeLanguage].ctaTitle}
              onChange={(event) => setLocalizedField("ctaTitle", event.target.value)}
            />
          </label>
          <label>
            <span className="mb-2 block text-xs uppercase tracking-widest text-stone-400">Explanation</span>
            <textarea
              rows={5}
              className={inputClass}
              value={localized[activeLanguage].ctaText}
              onChange={(event) => setLocalizedField("ctaText", event.target.value)}
            />
          </label>
          <label>
            <span className="mb-2 block text-xs uppercase tracking-widest text-stone-400">Button label</span>
            <input
              className={inputClass}
              value={localized[activeLanguage].button}
              onChange={(event) => setLocalizedField("button", event.target.value)}
            />
          </label>
        </div>
      </section>

      <section className="rounded-2xl border border-[#d6a85a]/25 bg-[#d6a85a]/10 p-4 sm:p-5">
        <h2 className="font-medium text-[#f0d6a2]">Managed automatically</h2>
        <p className="mt-2 text-sm leading-6 text-stone-300">
          City links, provider assignment, available languages, public routes, shared service cards and the central WhatsApp destination come from existing system configuration and provider/city data. They are shown publicly but are not duplicated in this editor.
        </p>
      </section>

      <div className="flex flex-wrap gap-3">
        <button
          type="submit"
          className="min-h-11 rounded-lg bg-[#d6a85a] px-5 py-3 text-sm font-medium text-[#1a1f2e]"
        >
          Save interpreter page
        </button>
        <Link
          href={publicPath}
          className="inline-flex min-h-11 items-center rounded-lg border border-white/15 px-5 py-3 text-sm text-white"
        >
          View public page
        </Link>
      </div>
    </form>
  );
}
