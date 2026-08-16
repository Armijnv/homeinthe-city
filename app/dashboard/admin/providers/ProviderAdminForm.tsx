"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import {
  dashboardFileInputClass,
  selectedDashboardImageError,
} from "@/app/lib/dashboardImageSelection";
import { providerSelfEditableFields } from "@/app/lib/clerkIdentityPolicy";

type EditorialLanguage = "en" | "pt" | "nl";

export type ProviderAdminCityOption = {
  _id: string;
  name_en?: string;
  name_pt?: string;
  name_nl?: string;
};

export type ProviderAdminLanguage = {
  language?: string;
  level?: string;
  services?: string[];
};

export type ProviderAdminService = {
  _key?: string;
  roles?: string[];
  title_en?: string;
  title_pt?: string;
  title_nl?: string;
  description_en?: string;
  description_pt?: string;
  description_nl?: string;
};

export type ProviderAdminFormData = {
  _id?: string;
  name?: string;
  slug?: { current?: string };
  status?: string;
  verificationStatus?: string;
  roles?: string[];
  primaryRole?: string;
  languages?: ProviderAdminLanguage[];
  cities?: Array<{ _id?: string }>;
  managedCities?: Array<{ _id?: string }>;
  headline_en?: string;
  headline_pt?: string;
  headline_nl?: string;
  intro_en?: string;
  intro_pt?: string;
  intro_nl?: string;
  about_en?: string;
  about_pt?: string;
  about_nl?: string;
  servicesTitle_en?: string;
  servicesTitle_pt?: string;
  servicesTitle_nl?: string;
  services?: ProviderAdminService[];
  mainPhoto?: {
    alt?: string;
    asset?: { _ref?: string; url?: string };
  };
  ownership?: {
    contactEmail?: string;
    ownerUserId?: string;
    ownershipStatus?: string;
    selfEditEnabled?: boolean;
    selfEditableFields?: string[];
  };
  contactOptions?: {
    email?: string;
    phone?: string;
    whatsapp?: string;
    website?: string;
    preferredContact?: string;
  };
};

const roles = [
  ["host", "Host"],
  ["interpreter", "Interpreter"],
  ["translator", "Translator"],
  ["guide", "Guide"],
  ["specialist", "Specialist"],
  ["realtor", "Real estate agent"],
] as const;

const languages = [
  ["en", "English"],
  ["pt", "Portuguese"],
  ["nl", "Dutch"],
  ["es", "Spanish"],
  ["de", "German"],
  ["fr", "French"],
  ["other", "Other"],
] as const;

const editorialLanguages: Array<{
  id: EditorialLanguage;
  label: string;
  hint: string;
}> = [
  { id: "en", label: "English", hint: "English" },
  { id: "pt", label: "Português", hint: "Portuguese" },
  { id: "nl", label: "Nederlands", hint: "Dutch" },
];

const languageLevels = [
  ["", "No level specified"],
  ["native", "Native"],
  ["fluent", "Fluent"],
  ["professional", "Professional"],
  ["conversational", "Conversational"],
] as const;

const languageServices = [
  ["speaks", "Speaks"],
  ["interpretsFrom", "Interprets from"],
  ["interpretsTo", "Interprets to"],
  ["translatesFrom", "Translates from"],
  ["translatesTo", "Translates to"],
] as const;

const selfEditableFieldLabels: Record<
  (typeof providerSelfEditableFields)[number],
  string
> = {
  name: "Name",
  cities: "Cities served",
  languages: "Languages",
  headlines: "Headlines",
  intro: "Introduction text",
  about: "About text",
  contactOptions: "Contact options",
  mainPhoto: "Profile photo",
};

const inputClass =
  "w-full min-w-0 rounded-lg border border-white/15 bg-[#1a1f2e] px-4 py-3 text-sm text-white placeholder:text-stone-500";

function cityName(city: ProviderAdminCityOption) {
  return city.name_en || city.name_pt || city.name_nl || "Untitled city";
}

function selectedIds(values?: Array<{ _id?: string }>) {
  return new Set(values?.map((value) => value._id).filter(Boolean));
}

function initialLocalized(provider?: ProviderAdminFormData | null) {
  return Object.fromEntries(
    editorialLanguages.map(({ id }) => [
      id,
      {
        headline: provider?.[`headline_${id}`] || "",
        intro: provider?.[`intro_${id}`] || "",
        about: provider?.[`about_${id}`] || "",
        servicesTitle: provider?.[`servicesTitle_${id}`] || "",
      },
    ]),
  ) as Record<
    EditorialLanguage,
    { headline: string; intro: string; about: string; servicesTitle: string }
  >;
}

function serviceKey(index: number) {
  return `admin-service-${Date.now()}-${index}`;
}

export default function ProviderAdminForm({
  provider,
  cities,
  action,
  submitLabel,
}: {
  provider?: ProviderAdminFormData | null;
  cities: ProviderAdminCityOption[];
  action: (formData: FormData) => void | Promise<void>;
  submitLabel: string;
}) {
  const [activeLanguage, setActiveLanguage] =
    useState<EditorialLanguage>("en");
  const [localized, setLocalized] = useState(() => initialLocalized(provider));
  const [serviceCards, setServiceCards] = useState<ProviderAdminService[]>(
    () => provider?.services || [],
  );
  const [selectedPhotoUrl, setSelectedPhotoUrl] = useState("");
  const [photoError, setPhotoError] = useState("");
  const selectedRoles = new Set(provider?.roles || []);
  const servedCityIds = selectedIds(provider?.cities);
  const managedCityIds = selectedIds(provider?.managedCities);
  const selectedSelfEditableFields = new Set(
    provider?.ownership?.selfEditableFields || [],
  );
  const languageValues = useMemo(
    () =>
      new Map(
        provider?.languages
          ?.filter((entry) => entry.language)
          .map((entry) => [entry.language || "", entry]) || [],
      ),
    [provider?.languages],
  );
  const savedPhotoUrl = provider?.mainPhoto?.asset?.url || "";
  const displayedPhotoUrl = selectedPhotoUrl || savedPhotoUrl;
  const activeLanguageLabel =
    editorialLanguages.find((language) => language.id === activeLanguage)?.hint ||
    "English";

  useEffect(
    () => () => {
      if (selectedPhotoUrl) URL.revokeObjectURL(selectedPhotoUrl);
    },
    [selectedPhotoUrl],
  );

  function updateLocalized(
    field: "headline" | "intro" | "about" | "servicesTitle",
    value: string,
  ) {
    setLocalized((current) => ({
      ...current,
      [activeLanguage]: { ...current[activeLanguage], [field]: value },
    }));
  }

  function updateService(index: number, patch: Partial<ProviderAdminService>) {
    setServiceCards((current) =>
      current.map((service, serviceIndex) =>
        serviceIndex === index ? { ...service, ...patch } : service,
      ),
    );
  }

  function toggleServiceRole(index: number, role: string) {
    const selected = new Set(serviceCards[index]?.roles || []);
    if (selected.has(role)) selected.delete(role);
    else selected.add(role);
    updateService(index, { roles: [...selected] });
  }

  function updateServiceLocalized(
    index: number,
    field: "title" | "description",
    value: string,
  ) {
    updateService(index, { [`${field}_${activeLanguage}`]: value });
  }

  return (
    <form action={action} className="space-y-8">
      {provider?._id ? (
        <input type="hidden" name="providerId" value={provider._id} />
      ) : null}
      {editorialLanguages.flatMap(({ id }) => [
        <input
          key={`headline-${id}`}
          type="hidden"
          name={`headline_${id}`}
          value={localized[id].headline}
        />,
        <input
          key={`intro-${id}`}
          type="hidden"
          name={`intro_${id}`}
          value={localized[id].intro}
        />,
        <input
          key={`about-${id}`}
          type="hidden"
          name={`about_${id}`}
          value={localized[id].about}
        />,
        <input
          key={`services-title-${id}`}
          type="hidden"
          name={`servicesTitle_${id}`}
          value={localized[id].servicesTitle}
        />,
      ])}
      <input
        type="hidden"
        name="servicesJson"
        value={JSON.stringify(serviceCards)}
      />

      <p className="rounded-xl border border-amber-300/25 bg-amber-950/20 px-4 py-3 text-sm leading-6 text-amber-100">
        Changes here read from and save directly to the published provider document. Sanity Studio drafts are not shown, changed, or published by this editor.
      </p>

      <section className="rounded-2xl border border-white/10 bg-white/10 p-4 sm:p-6">
        <h2 className="text-2xl font-light text-white">Identity and visibility</h2>
        <div className="mt-6 grid gap-5 md:grid-cols-2">
          <label>
            <span className="mb-2 block text-xs uppercase tracking-widest text-stone-400">
              Name
            </span>
            <input
              name="name"
              required
              className={inputClass}
              defaultValue={provider?.name || ""}
            />
          </label>
          <label>
            <span className="mb-2 block text-xs uppercase tracking-widest text-stone-400">
              Slug
            </span>
            <input
              name="slug"
              required
              pattern="[a-z0-9]+(?:-[a-z0-9]+)*"
              placeholder="jon-smith"
              className={inputClass}
              defaultValue={provider?.slug?.current || ""}
            />
          </label>
          <label>
            <span className="mb-2 block text-xs uppercase tracking-widest text-stone-400">
              Status / visibility
            </span>
            <select
              name="status"
              className={inputClass}
              defaultValue={provider?.status || "draft"}
            >
              <option value="draft">Draft — hidden</option>
              <option value="review">Review — hidden</option>
              <option value="published">Published — public</option>
              <option value="disabled">Disabled — hidden</option>
            </select>
          </label>
          <label>
            <span className="mb-2 block text-xs uppercase tracking-widest text-stone-400">
              Verified provider
            </span>
            <select
              name="verificationStatus"
              className={inputClass}
              defaultValue={provider?.verificationStatus || "unverified"}
            >
              <option value="unverified">Unverified</option>
              <option value="pending">Pending review</option>
              <option value="verified">Verified</option>
              <option value="rejected">Rejected</option>
            </select>
            <span className="mt-2 block text-sm leading-6 text-stone-300">
              Shows a Verified badge on public provider cards and profiles.
            </span>
          </label>
          <label>
            <span className="mb-2 block text-xs uppercase tracking-widest text-stone-400">
              Primary role
            </span>
            <select
              name="primaryRole"
              required
              className={inputClass}
              defaultValue={provider?.primaryRole || "host"}
            >
              {roles.map(([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>
          </label>
        </div>
      </section>

      <section className="rounded-2xl border border-white/10 bg-white/10 p-4 sm:p-6">
        <h2 className="text-2xl font-light text-white">Public profile photo</h2>
        <p className="mt-2 text-sm leading-6 text-stone-300">
          This is the current image used on the public provider profile and provider cards.
        </p>
        <div className="mt-5 grid min-w-0 gap-5 md:grid-cols-[minmax(0,15rem)_minmax(0,1fr)]">
          <div className="relative aspect-[3/4] w-full max-w-60 overflow-hidden rounded-2xl border border-white/10 bg-black/20">
            {displayedPhotoUrl ? (
              <Image
                src={displayedPhotoUrl}
                alt={provider?.mainPhoto?.alt || provider?.name || "Provider photo"}
                fill
                sizes="240px"
                className="object-cover"
              />
            ) : (
              <div className="flex h-full items-center justify-center p-5 text-center text-sm text-stone-400">
                No profile photo saved
              </div>
            )}
          </div>
          <div className="min-w-0 space-y-4">
            <label className="block">
              <span className="mb-2 block text-xs uppercase tracking-widest text-stone-400">
                {savedPhotoUrl ? "Replace photo" : "Upload photo"}
              </span>
              <input
                type="file"
                name="mainPhotoFile"
                accept="image/jpeg,image/png,image/webp,image/gif,image/heic,image/heif,.heic,.heif"
                className={dashboardFileInputClass}
                onChange={(event) => {
                  const file = event.currentTarget.files?.[0];
                  const error = file
                    ? selectedDashboardImageError(file, "Profile photo")
                    : "";
                  event.currentTarget.setCustomValidity(error);
                  setPhotoError(error);
                  setSelectedPhotoUrl(file && !error ? URL.createObjectURL(file) : "");
                }}
              />
            </label>
            {photoError ? <p className="text-sm text-red-200">{photoError}</p> : null}
            <label className="block">
              <span className="mb-2 block text-xs uppercase tracking-widest text-stone-400">
                Alternative text
              </span>
              <input
                name="mainPhotoAlt"
                className={inputClass}
                defaultValue={provider?.mainPhoto?.alt || ""}
                placeholder={`${provider?.name || "Provider"} profile photo`}
              />
            </label>
            {savedPhotoUrl ? (
              <label className="flex min-h-11 items-center gap-3 rounded-lg border border-white/10 bg-black/10 px-3 py-2 text-sm text-stone-200">
                <input
                  type="checkbox"
                  name="removeMainPhoto"
                  value="true"
                  className="size-4 accent-[#d6a85a]"
                />
                Remove the saved profile photo
              </label>
            ) : null}
            <p className="text-xs leading-5 text-stone-400">
              JPG, PNG, WebP, GIF, HEIC or HEIF, up to 10 MB.
            </p>
          </div>
        </div>
      </section>

      <section className="rounded-2xl border border-white/10 bg-white/10 p-4 sm:p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="text-2xl font-light text-white">Public profile copy</h2>
            <p className="mt-2 text-sm leading-6 text-stone-300">
              Edit the headline, introduction and biography shown on the public profile.
            </p>
          </div>
          <div
            role="tablist"
            aria-label="Provider profile language"
            className="grid grid-cols-3 rounded-xl border border-white/10 bg-black/15 p-1"
          >
            {editorialLanguages.map((language) => (
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
        <div role="tabpanel" className="mt-6 grid min-w-0 gap-5">
          <label>
            <span className="mb-2 block text-xs uppercase tracking-widest text-stone-400">
              Headline ({activeLanguageLabel})
            </span>
            <input
              className={inputClass}
              value={localized[activeLanguage].headline}
              onChange={(event) => updateLocalized("headline", event.target.value)}
            />
          </label>
          <label>
            <span className="mb-2 block text-xs uppercase tracking-widest text-stone-400">
              Introduction ({activeLanguageLabel})
            </span>
            <textarea
              rows={4}
              className={inputClass}
              value={localized[activeLanguage].intro}
              onChange={(event) => updateLocalized("intro", event.target.value)}
            />
          </label>
          <label>
            <span className="mb-2 block text-xs uppercase tracking-widest text-stone-400">
              About / biography ({activeLanguageLabel})
            </span>
            <textarea
              rows={7}
              className={inputClass}
              value={localized[activeLanguage].about}
              onChange={(event) => updateLocalized("about", event.target.value)}
            />
          </label>
        </div>
      </section>

      <section className="rounded-2xl border border-white/10 bg-white/10 p-4 sm:p-6">
        <h2 className="text-2xl font-light text-white">Contact and account matching</h2>
        <p className="mt-3 max-w-3xl text-sm leading-6 text-stone-300">
          Account matching remains separate from the contact details shown publicly.
        </p>
        <div className="mt-6 grid min-w-0 gap-5 md:grid-cols-2">
          <label>
            <span className="mb-2 block text-xs uppercase tracking-widest text-stone-400">
              Account matching email
            </span>
            <input
              name="contactEmail"
              type="email"
              className={inputClass}
              defaultValue={provider?.ownership?.contactEmail || ""}
            />
          </label>
          <label>
            <span className="mb-2 block text-xs uppercase tracking-widest text-stone-400">
              Public email
            </span>
            <input
              name="publicEmail"
              type="email"
              className={inputClass}
              defaultValue={provider?.contactOptions?.email || ""}
            />
          </label>
          <label>
            <span className="mb-2 block text-xs uppercase tracking-widest text-stone-400">
              WhatsApp
            </span>
            <input
              name="whatsapp"
              placeholder="https://wa.me/5551999999999"
              className={inputClass}
              defaultValue={provider?.contactOptions?.whatsapp || ""}
            />
          </label>
          <label>
            <span className="mb-2 block text-xs uppercase tracking-widest text-stone-400">
              Phone
            </span>
            <input
              name="phone"
              className={inputClass}
              defaultValue={provider?.contactOptions?.phone || ""}
            />
          </label>
          <label>
            <span className="mb-2 block text-xs uppercase tracking-widest text-stone-400">
              Website
            </span>
            <input
              name="website"
              type="url"
              placeholder="https://example.com"
              className={inputClass}
              defaultValue={provider?.contactOptions?.website || ""}
            />
          </label>
          <label>
            <span className="mb-2 block text-xs uppercase tracking-widest text-stone-400">
              Preferred public contact
            </span>
            <select
              name="preferredContact"
              className={inputClass}
              defaultValue={provider?.contactOptions?.preferredContact || ""}
            >
              <option value="">No preference</option>
              <option value="email">Email</option>
              <option value="phone">Phone</option>
              <option value="whatsapp">WhatsApp</option>
              <option value="website">Website</option>
            </select>
          </label>
        </div>
        {provider?.ownership?.ownerUserId ? (
          <p className="mt-4 break-all text-sm text-stone-300">
            Connected Clerk user: {provider.ownership.ownerUserId}
          </p>
        ) : (
          <p className="mt-4 text-sm text-[#d6a85a]">
            Account status: {provider?.ownership?.ownershipStatus || "unclaimed"}
          </p>
        )}
      </section>

      {provider?._id ? (
        <section className="rounded-2xl border border-white/10 bg-white/10 p-4 sm:p-6">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <h2 className="text-2xl font-light text-white">Provider self-editing</h2>
              <p className="mt-2 max-w-3xl text-sm leading-6 text-stone-300">
                Controls which profile sections this provider may publish directly. Administrator access is unaffected.
              </p>
            </div>
            <span
              className={`w-fit rounded-full border px-3 py-1 text-xs uppercase tracking-widest ${
                provider.ownership?.selfEditEnabled
                  ? "border-emerald-300/30 text-emerald-200"
                  : "border-white/15 text-stone-300"
              }`}
            >
              {provider.ownership?.selfEditEnabled ? "Enabled" : "Disabled"}
            </span>
          </div>
          <div className="mt-6 grid gap-5 md:grid-cols-2">
            <label>
              <span className="mb-2 block text-xs uppercase tracking-widest text-stone-400">
                Self-editing status
              </span>
              <select
                name="selfEditEnabled"
                className={inputClass}
                defaultValue={provider.ownership?.selfEditEnabled ? "true" : "false"}
              >
                <option value="false">Disabled</option>
                <option value="true">Enabled</option>
              </select>
              <span className="mt-2 block text-sm leading-6 text-stone-300">
                The provider must still match the connected Clerk account or verified contact email.
              </span>
            </label>
            <fieldset>
              <legend className="text-xs uppercase tracking-widest text-stone-400">
                Allowed profile sections
              </legend>
              <div className="mt-3 grid gap-3 sm:grid-cols-2">
                {providerSelfEditableFields.map((field) => (
                  <label
                    key={field}
                    className="flex min-h-11 items-center gap-3 rounded-lg border border-white/10 bg-black/10 px-3 py-2 text-sm text-stone-200"
                  >
                    <input
                      type="checkbox"
                      name="selfEditableFields"
                      value={field}
                      defaultChecked={selectedSelfEditableFields.has(field)}
                      className="size-4 shrink-0 accent-[#d6a85a]"
                    />
                    {selfEditableFieldLabels[field]}
                  </label>
                ))}
              </div>
              <p className="mt-3 text-sm leading-6 text-stone-300">
                When enabled, at least one section must be selected.
              </p>
            </fieldset>
          </div>
        </section>
      ) : null}

      <section className="rounded-2xl border border-white/10 bg-white/10 p-4 sm:p-6">
        <h2 className="text-2xl font-light text-white">Roles</h2>
        <div className="mt-5 flex flex-wrap gap-5">
          {roles.map(([value, label]) => (
            <label key={value} className="flex min-h-11 items-center gap-2 text-sm">
              <input
                type="checkbox"
                name="roles"
                value={value}
                defaultChecked={selectedRoles.has(value)}
                className="size-4 accent-[#d6a85a]"
              />
              {label}
            </label>
          ))}
        </div>
      </section>

      <section className="rounded-2xl border border-white/10 bg-white/10 p-4 sm:p-6">
        <h2 className="text-2xl font-light text-white">Languages</h2>
        <div className="mt-5 grid gap-4 lg:grid-cols-2">
          {languages.map(([code, label]) => {
            const language = languageValues.get(code);
            const services = new Set(language?.services || []);

            return (
              <div key={code} className="min-w-0 rounded-xl border border-white/10 bg-black/10 p-4">
                <label className="flex min-h-11 items-center gap-2 font-medium text-white">
                  <input
                    type="checkbox"
                    name="languages"
                    value={code}
                    defaultChecked={Boolean(language)}
                    className="size-4 accent-[#d6a85a]"
                  />
                  {label}
                </label>
                <select
                  name={`language-${code}-level`}
                  className={`${inputClass} mt-3`}
                  defaultValue={language?.level || ""}
                >
                  {languageLevels.map(([value, levelLabel]) => (
                    <option key={value || "none"} value={value}>
                      {levelLabel}
                    </option>
                  ))}
                </select>
                <div className="mt-3 flex flex-wrap gap-3">
                  {languageServices.map(([value, serviceLabel]) => (
                    <label key={value} className="flex min-h-11 items-center gap-2 text-xs text-stone-300">
                      <input
                        type="checkbox"
                        name={`language-${code}-services`}
                        value={value}
                        defaultChecked={services.has(value)}
                        className="size-4 accent-[#d6a85a]"
                      />
                      {serviceLabel}
                    </label>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-2xl border border-white/10 bg-white/10 p-4 sm:p-6">
          <h2 className="text-2xl font-light text-white">Cities served</h2>
          <p className="mt-2 text-sm text-stone-300">Shown on the public provider profile.</p>
          <div className="mt-5 space-y-1">
            {cities.map((city) => (
              <label key={city._id} className="flex min-h-11 items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  name="cities"
                  value={city._id}
                  defaultChecked={servedCityIds.has(city._id)}
                  className="size-4 accent-[#d6a85a]"
                />
                {cityName(city)}
              </label>
            ))}
          </div>
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/10 p-4 sm:p-6">
          <h2 className="text-2xl font-light text-white">Managed cities</h2>
          <p className="mt-2 text-sm text-stone-300">
            Grants city-host dashboard access. It does not change public coverage.
          </p>
          <div className="mt-5 space-y-1">
            {cities.map((city) => (
              <label key={city._id} className="flex min-h-11 items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  name="managedCities"
                  value={city._id}
                  defaultChecked={managedCityIds.has(city._id)}
                  className="size-4 accent-[#d6a85a]"
                />
                {cityName(city)}
              </label>
            ))}
          </div>
        </div>
      </section>

      <section className="rounded-2xl border border-white/10 bg-white/10 p-4 sm:p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="text-2xl font-light text-white">Public service cards</h2>
            <p className="mt-2 max-w-3xl text-sm leading-6 text-stone-300">
              These are the existing provider service cards. A card appears publicly when one of its selected roles belongs to the provider.
            </p>
          </div>
          <span className="text-sm text-stone-400">Editing {activeLanguageLabel}</span>
        </div>
        <label className="mt-5 block">
          <span className="mb-2 block text-xs uppercase tracking-widest text-stone-400">
            Section heading ({activeLanguageLabel})
          </span>
          <input
            className={inputClass}
            value={localized[activeLanguage].servicesTitle}
            onChange={(event) => updateLocalized("servicesTitle", event.target.value)}
          />
        </label>
        <div className="mt-5 grid gap-4">
          {serviceCards.map((service, index) => (
            <article key={service._key || index} className="min-w-0 rounded-xl border border-white/10 bg-black/10 p-4">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <h3 className="font-medium text-white">Service card {index + 1}</h3>
                  <p className="mt-1 text-xs text-stone-400">Choose every provider role this card supports.</p>
                </div>
                <button
                  type="button"
                  onClick={() => setServiceCards((cards) => cards.filter((_, cardIndex) => cardIndex !== index))}
                  className="min-h-11 rounded-lg border border-red-300/25 px-3 py-2 text-sm text-red-100"
                >
                  Remove
                </button>
              </div>
              <div className="mt-3 flex flex-wrap gap-3">
                {roles.map(([role, label]) => (
                  <label key={role} className="flex min-h-11 items-center gap-2 text-xs text-stone-300">
                    <input
                      type="checkbox"
                      checked={service.roles?.includes(role) || false}
                      onChange={() => toggleServiceRole(index, role)}
                      className="size-4 accent-[#d6a85a]"
                    />
                    {label}
                  </label>
                ))}
              </div>
              <div className="mt-4 grid min-w-0 gap-4">
                <label>
                  <span className="mb-2 block text-xs uppercase tracking-widest text-stone-400">
                    Title ({activeLanguageLabel})
                  </span>
                  <input
                    className={inputClass}
                    value={service[`title_${activeLanguage}`] || ""}
                    onChange={(event) => updateServiceLocalized(index, "title", event.target.value)}
                  />
                </label>
                <label>
                  <span className="mb-2 block text-xs uppercase tracking-widest text-stone-400">
                    Description ({activeLanguageLabel})
                  </span>
                  <textarea
                    rows={4}
                    className={inputClass}
                    value={service[`description_${activeLanguage}`] || ""}
                    onChange={(event) => updateServiceLocalized(index, "description", event.target.value)}
                  />
                </label>
              </div>
            </article>
          ))}
          {!serviceCards.length ? (
            <p className="rounded-xl border border-dashed border-white/15 p-4 text-sm text-stone-400">
              No provider service cards are saved.
            </p>
          ) : null}
        </div>
        <button
          type="button"
          onClick={() =>
            setServiceCards((cards) => [
              ...cards,
              { _key: serviceKey(cards.length), roles: [] },
            ])
          }
          className="mt-4 min-h-11 rounded-lg border border-white/15 px-4 py-2 text-sm text-white transition hover:border-[#d6a85a] hover:text-[#d6a85a]"
        >
          Add service card
        </button>
      </section>

      <div className="flex flex-wrap gap-3">
        <button
          type="submit"
          className="min-h-11 rounded-lg bg-[#d6a85a] px-5 py-3 text-sm font-medium text-[#1a1f2e] transition hover:bg-white"
        >
          {submitLabel}
        </button>
        <Link
          href="/dashboard/admin/providers"
          className="inline-flex min-h-11 items-center rounded-lg border border-white/15 px-5 py-3 text-sm text-white transition hover:border-[#d6a85a] hover:text-[#d6a85a]"
        >
          Cancel
        </Link>
      </div>
    </form>
  );
}
