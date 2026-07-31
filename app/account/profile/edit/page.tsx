import { currentUser } from "@clerk/nextjs/server";
import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import {
  effectiveOwnerUserId,
  providerOwnershipMatchFilter,
  selectProviderForUser,
  verifiedEmailAddresses,
  verifiedPrimaryEmailAddress,
} from "@/app/lib/clerkIdentity";
import {
  saveProviderProfileDraft,
  submitProviderProfileForReview,
} from "./actions";
import { client } from "@/sanity/lib/client";

type CityOption = {
  _id: string;
  name_en?: string;
  name_pt?: string;
  name_nl?: string;
};

type LanguageEntry = {
  language?: string;
  level?: string;
  services?: string[];
};

type ContactOptions = {
  email?: string;
  phone?: string;
  whatsapp?: string;
  website?: string;
  preferredContact?: string;
};

type PhotoValue = {
  alt?: string;
  asset?: {
    url?: string;
  };
};

type ProviderProfile = {
  _id: string;
  name?: string;
  slug?: {
    current?: string;
  };
  status?: string;
  primaryRole?: string;
  headline_en?: string;
  headline_pt?: string;
  headline_nl?: string;
  intro_en?: string;
  intro_pt?: string;
  intro_nl?: string;
  about_en?: string;
  about_pt?: string;
  about_nl?: string;
  contactOptions?: ContactOptions;
  cities?: CityOption[];
  cityRefs?: string[];
  languages?: LanguageEntry[];
  mainPhoto?: PhotoValue;
  ownership?: {
    contactEmail?: string;
    ownerUserId?: string;
  };
};

type SubmissionSnapshot = Partial<
  Pick<
    ProviderProfile,
    | "name"
    | "headline_en"
    | "headline_pt"
    | "headline_nl"
    | "intro_en"
    | "intro_pt"
    | "intro_nl"
    | "about_en"
    | "about_pt"
    | "about_nl"
    | "contactOptions"
    | "languages"
    | "mainPhoto"
  >
> & {
  cities?: Array<{
    _ref?: string;
  }>;
};

type ProviderSubmission = {
  _id: string;
  status?: string;
  profileSnapshot?: SubmissionSnapshot;
  _updatedAt?: string;
};

type PageProps = {
  searchParams: Promise<{
    error?: string;
    saved?: string;
    submitted?: string;
  }>;
};

const matchedProviderForAccountQuery = `
  *[
    _type == "provider" &&
    (
      ${providerOwnershipMatchFilter}
    )
  ]{
    _id,
    name,
    slug,
    status,
    primaryRole,
    headline_en,
    headline_pt,
    headline_nl,
    intro_en,
    intro_pt,
    intro_nl,
    about_en,
    about_pt,
    about_nl,
    contactOptions{
      email,
      phone,
      whatsapp,
      website,
      preferredContact
    },
    "cityRefs": cities[]._ref,
    cities[]->{
      _id,
      name_en,
      name_pt,
      name_nl
    },
    languages[]{
      language,
      level,
      services
    },
    mainPhoto{
      alt,
      asset->{
        url
      }
    },
    ownership{
      contactEmail,
      ownerUserId
    }
  }
`;

const draftSubmissionQuery = `
  *[
    _type == "providerSubmission" &&
    provider._ref == $providerId &&
    status == "draft" &&
    (
      lower(ownerEmail) in $emails ||
      ownerUserId == $ownerUserId
    )
  ] | order(_updatedAt desc)[0]{
    _id,
    status,
    _updatedAt,
    profileSnapshot{
      name,
      headline_en,
      headline_pt,
      headline_nl,
      intro_en,
      intro_pt,
      intro_nl,
      about_en,
      about_pt,
      about_nl,
      contactOptions,
      cities,
      languages,
      mainPhoto{
        alt,
        asset->{
          url
        }
      }
    }
  }
`;

const cityOptionsQuery = `
  *[_type == "city"] | order(name_en asc){
    _id,
    name_en,
    name_pt,
    name_nl
  }
`;

const languageOptions = [
  ["", "Choose language"],
  ["en", "English"],
  ["pt", "Portuguese"],
  ["nl", "Dutch"],
  ["es", "Spanish"],
  ["de", "German"],
  ["fr", "French"],
  ["other", "Other"],
];

const languageLevels = [
  ["", "Choose level"],
  ["native", "Native"],
  ["fluent", "Fluent"],
  ["professional", "Professional"],
  ["conversational", "Conversational"],
];

const languageServices = [
  ["speaks", "Speaks"],
  ["interpretsFrom", "Interprets from"],
  ["interpretsTo", "Interprets to"],
  ["translatesFrom", "Translates from"],
  ["translatesTo", "Translates to"],
];

const preferredContactOptions = [
  ["", "Choose preferred option"],
  ["email", "Email"],
  ["phone", "Phone"],
  ["whatsapp", "WhatsApp"],
  ["website", "Website"],
];

const providerRoleLabels: Record<string, string> = {
  host: "Host",
  interpreter: "Interpreter",
  translator: "Translator",
  guide: "Guide",
  specialist: "Specialist",
  realtor: "Real estate agent",
};

export const metadata: Metadata = {
  title: "Edit provider profile",
};

function fieldValue(
  submission: ProviderSubmission | null,
  provider: Partial<ProviderProfile>,
  key: keyof SubmissionSnapshot,
) {
  const snapshotValue = submission?.profileSnapshot?.[key];
  const providerValue = provider[key as keyof ProviderProfile];

  return snapshotValue ?? providerValue ?? "";
}

function textFieldValue(
  submission: ProviderSubmission | null,
  provider: Partial<ProviderProfile>,
  key: keyof SubmissionSnapshot,
) {
  const nextValue = fieldValue(submission, provider, key);
  return typeof nextValue === "string" ? nextValue : "";
}

function snapshotCityRefs(submission: ProviderSubmission | null) {
  return (
    submission?.profileSnapshot?.cities
      ?.map((city) => city._ref)
      .filter((cityRef): cityRef is string => Boolean(cityRef)) || []
  );
}

function cityLabel(city: CityOption) {
  return city.name_en || city.name_pt || city.name_nl || "Untitled city";
}

function formatUpdatedAt(updatedAt?: string) {
  if (!updatedAt) return "";

  return new Intl.DateTimeFormat("en", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(updatedAt));
}

function providerRoleLabel(role?: string) {
  if (!role) return "";
  return providerRoleLabels[role] || role;
}

function inputClass(extra = "") {
  return `w-full rounded-lg border border-white/15 bg-white/10 px-4 py-3 text-white outline-none transition placeholder:text-stone-500 focus:border-[#d6a85a] ${extra}`;
}

function labelClass() {
  return "mb-2 block text-xs font-medium uppercase tracking-widest text-stone-400";
}

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="border-t border-white/10 pt-8">
      <h2 className="mb-5 text-2xl font-light text-white">{title}</h2>
      {children}
    </section>
  );
}

export default async function Page({ searchParams }: PageProps) {
  const user = await currentUser();

  if (!user?.id) {
    redirect("/sign-in");
  }

  const emails = verifiedEmailAddresses(user);
  const signedInEmail = verifiedPrimaryEmailAddress(user);
  const providerMatches = await client.fetch<ProviderProfile[]>(
    matchedProviderForAccountQuery,
    {
      userId: user.id,
      emails,
    },
  );
  const provider = selectProviderForUser(providerMatches, user.id);
  const ownerUserId = effectiveOwnerUserId(
    provider?.ownership?.ownerUserId,
    user.id,
  );

  const [submission, cities, params] = await Promise.all([
    provider
      ? client.fetch<ProviderSubmission | null>(draftSubmissionQuery, {
          providerId: provider._id,
          emails,
          ownerUserId,
        })
      : Promise.resolve(null),
    client.fetch<CityOption[]>(cityOptionsQuery),
    searchParams,
  ]);

  const contactOptions =
    (fieldValue(submission, provider || {}, "contactOptions") as ContactOptions) ||
    {};
  const languages =
    (fieldValue(submission, provider || {}, "languages") as LanguageEntry[]) ||
    [];
  const selectedCityRefs = new Set(
    submission ? snapshotCityRefs(submission) : provider?.cityRefs || [],
  );
  const photo = fieldValue(submission, provider || {}, "mainPhoto") as PhotoValue;

  return (
    <div className="min-h-screen bg-[#1a1f2e] px-6 pt-28 pb-16 text-white">
      <div className="mx-auto max-w-5xl">
        <Link
          href="/dashboard"
          className="mb-8 inline-flex text-sm text-stone-300 underline-offset-4 hover:text-white hover:underline"
        >
          Back to dashboard
        </Link>

        <p className="mb-4 text-sm uppercase tracking-widest text-stone-400">
          Provider account
        </p>
        <h1 className="mb-8 text-4xl font-light leading-tight md:text-6xl">
          Edit profile
        </h1>

        <section className="mb-10 rounded-lg border border-white/10 bg-white/10 p-6">
          <p className="mb-4 text-xs uppercase tracking-widest text-stone-400">
            Matched provider
          </p>
          {provider ? (
            <div className="grid gap-5 md:grid-cols-[1fr_auto] md:items-start">
              <div>
                <p className="text-2xl font-light text-white">{provider.name}</p>
                <p className="mt-2 text-stone-300">
                  Signed in as {signedInEmail}. This editor is matched from your
                  account email or session, not from a public profile URL.
                </p>
                <div className="mt-4 flex flex-wrap gap-2 text-xs uppercase tracking-widest text-stone-300">
                  <span className="rounded-full border border-white/15 px-3 py-1">
                    {provider.status || "No status"}
                  </span>
                  {provider.primaryRole ? (
                    <span className="rounded-full border border-white/15 px-3 py-1">
                      {providerRoleLabel(provider.primaryRole)}
                    </span>
                  ) : null}
                  {submission?._updatedAt ? (
                    <span className="rounded-full border border-white/15 px-3 py-1">
                      Draft saved {formatUpdatedAt(submission._updatedAt)}
                    </span>
                  ) : null}
                </div>
              </div>
              {provider.slug?.current ? (
                <Link
                  href={`/providers/${provider.slug.current}`}
                  className="rounded-lg border border-white/15 px-4 py-3 text-center text-sm text-white transition hover:border-[#d6a85a] hover:text-[#d6a85a]"
                >
                  View public profile
                </Link>
              ) : null}
            </div>
          ) : (
            <p className="leading-relaxed text-stone-300">
              No provider profile matches your signed-in account yet.
            </p>
          )}
        </section>

        {params.saved ? (
          <div className="mb-8 rounded-lg border border-[#d6a85a]/40 bg-[#d6a85a]/10 p-4 text-[#f0d9aa]">
            Draft saved. Your public profile has not changed.
          </div>
        ) : null}

        {params.submitted ? (
          <div className="mb-8 rounded-lg border border-[#d6a85a]/40 bg-[#d6a85a]/10 p-4 text-[#f0d9aa]">
            Submitted for review. Your public profile has not changed yet.
          </div>
        ) : null}

        {params.error ? (
          <div className="mb-8 rounded-lg border border-red-300/40 bg-red-500/10 p-4 text-red-100">
            {params.error}
          </div>
        ) : null}

        {provider ? (
          <form
            action={saveProviderProfileDraft}
            encType="multipart/form-data"
            className="space-y-10"
          >
            <Section title="Basics">
              <label className="block">
                <span className={labelClass()}>Name</span>
                <input
                  name="name"
                  defaultValue={textFieldValue(submission, provider, "name")}
                  className={inputClass()}
                />
              </label>
            </Section>

            <Section title="Headlines">
              <div className="grid gap-4 md:grid-cols-3">
                {(["en", "pt", "nl"] as const).map((language) => (
                  <label key={language} className="block">
                    <span className={labelClass()}>
                      {language.toUpperCase()} headline
                    </span>
                    <input
                      name={`headline_${language}`}
                      defaultValue={textFieldValue(
                        submission,
                        provider,
                        `headline_${language}`,
                      )}
                      className={inputClass()}
                    />
                  </label>
                ))}
              </div>
            </Section>

            <Section title="Intro">
              <div className="grid gap-4 md:grid-cols-3">
                {(["en", "pt", "nl"] as const).map((language) => (
                  <label key={language} className="block">
                    <span className={labelClass()}>{language.toUpperCase()} intro</span>
                    <textarea
                      name={`intro_${language}`}
                      defaultValue={textFieldValue(
                        submission,
                        provider,
                        `intro_${language}`,
                      )}
                      rows={5}
                      className={inputClass("resize-y")}
                    />
                  </label>
                ))}
              </div>
            </Section>

            <Section title="About">
              <div className="grid gap-4 md:grid-cols-3">
                {(["en", "pt", "nl"] as const).map((language) => (
                  <label key={language} className="block">
                    <span className={labelClass()}>{language.toUpperCase()} about</span>
                    <textarea
                      name={`about_${language}`}
                      defaultValue={textFieldValue(
                        submission,
                        provider,
                        `about_${language}`,
                      )}
                      rows={9}
                      className={inputClass("resize-y")}
                    />
                  </label>
                ))}
              </div>
            </Section>

            <Section title="Contact Options">
              <div className="grid gap-4 md:grid-cols-2">
                <label className="block">
                  <span className={labelClass()}>Email</span>
                  <input
                    name="contact-email"
                    type="email"
                    defaultValue={contactOptions.email || ""}
                    className={inputClass()}
                  />
                </label>
                <label className="block">
                  <span className={labelClass()}>Phone</span>
                  <input
                    name="contact-phone"
                    defaultValue={contactOptions.phone || ""}
                    className={inputClass()}
                  />
                </label>
                <label className="block">
                  <span className={labelClass()}>WhatsApp link</span>
                  <input
                    name="contact-whatsapp"
                    type="url"
                    defaultValue={contactOptions.whatsapp || ""}
                    className={inputClass()}
                  />
                </label>
                <label className="block">
                  <span className={labelClass()}>Website</span>
                  <input
                    name="contact-website"
                    type="url"
                    defaultValue={contactOptions.website || ""}
                    className={inputClass()}
                  />
                </label>
                <label className="block md:col-span-2">
                  <span className={labelClass()}>Preferred contact</span>
                  <select
                    name="preferred-contact"
                    defaultValue={contactOptions.preferredContact || ""}
                    className={inputClass()}
                  >
                    {preferredContactOptions.map(([optionValue, label]) => (
                      <option key={optionValue} value={optionValue} className="text-black">
                        {label}
                      </option>
                    ))}
                  </select>
                </label>
              </div>
            </Section>

            <Section title="Languages">
              <div className="space-y-5">
                {Array.from({ length: 5 }).map((_, index) => {
                  const language = languages[index];
                  const rowName = `language-${index}`;

                  return (
                    <div
                      key={rowName}
                      className="grid gap-4 rounded-lg border border-white/10 bg-white/5 p-4 md:grid-cols-2"
                    >
                      <label className="block">
                        <span className={labelClass()}>Language</span>
                        <select
                          name={`${rowName}-code`}
                          defaultValue={language?.language || ""}
                          className={inputClass()}
                        >
                          {languageOptions.map(([optionValue, label]) => (
                            <option
                              key={optionValue}
                              value={optionValue}
                              className="text-black"
                            >
                              {label}
                            </option>
                          ))}
                        </select>
                      </label>
                      <label className="block">
                        <span className={labelClass()}>Level</span>
                        <select
                          name={`${rowName}-level`}
                          defaultValue={language?.level || ""}
                          className={inputClass()}
                        >
                          {languageLevels.map(([optionValue, label]) => (
                            <option
                              key={optionValue}
                              value={optionValue}
                              className="text-black"
                            >
                              {label}
                            </option>
                          ))}
                        </select>
                      </label>
                      <fieldset className="md:col-span-2">
                        <legend className={labelClass()}>Services</legend>
                        <div className="flex flex-wrap gap-3">
                          {languageServices.map(([serviceValue, label]) => (
                            <label
                              key={serviceValue}
                              className="flex items-center gap-2 rounded-lg border border-white/10 px-3 py-2 text-sm text-stone-200"
                            >
                              <input
                                type="checkbox"
                                name={`${rowName}-services`}
                                value={serviceValue}
                                defaultChecked={
                                  language?.services?.includes(serviceValue) || false
                                }
                              />
                              {label}
                            </label>
                          ))}
                        </div>
                      </fieldset>
                    </div>
                  );
                })}
              </div>
            </Section>

            <Section title="Cities">
              <div className="grid gap-3 md:grid-cols-2">
                {cities.map((city) => (
                  <label
                    key={city._id}
                    className="flex items-center gap-3 rounded-lg border border-white/10 bg-white/5 p-4 text-stone-200"
                  >
                    <input
                      type="checkbox"
                      name="cities"
                      value={city._id}
                      defaultChecked={selectedCityRefs.has(city._id)}
                    />
                    {cityLabel(city)}
                  </label>
                ))}
              </div>
            </Section>

            <Section title="Profile photo">
              <div className="grid gap-4 md:grid-cols-[180px_1fr] md:items-start">
                <div className="aspect-square overflow-hidden rounded-lg border border-white/10 bg-white/5">
                  {photo?.asset?.url ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={photo.asset.url}
                      alt={photo.alt || provider.name || "Provider photo"}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center px-5 text-center text-sm text-stone-400">
                      No photo uploaded
                    </div>
                  )}
                </div>
                <div className="space-y-4">
                  <label className="block">
                    <span className={labelClass()}>Profile photo</span>
                    <input
                      name="profile-photo"
                      type="file"
                      accept="image/*"
                      className="w-full rounded-lg border border-dashed border-white/15 bg-white/5 px-4 py-6 text-sm text-stone-300 file:mr-4 file:rounded-full file:border-0 file:bg-white file:px-4 file:py-2 file:text-sm file:font-medium file:text-[#1a1f2e]"
                    />
                  </label>
                  <label className="block">
                    <span className={labelClass()}>Photo alt text</span>
                    <input
                      name="main-photo-alt"
                      defaultValue={photo?.alt || ""}
                      className={inputClass()}
                    />
                  </label>
                  <p className="text-sm leading-relaxed text-stone-400">
                    Uploading a new photo saves it to your draft only. Your public
                    profile photo changes after review.
                  </p>
                </div>
              </div>
            </Section>

            <div className="flex flex-wrap justify-end gap-3 border-t border-white/10 pt-8">
              <button
                type="submit"
                className="rounded-lg border border-white/15 px-6 py-3 text-sm font-medium text-white transition hover:border-[#d6a85a] hover:text-[#d6a85a]"
              >
                Save draft
              </button>
              <button
                formAction={submitProviderProfileForReview}
                className="rounded-lg bg-[#d6a85a] px-6 py-3 text-sm font-medium text-[#1a1f2e] transition hover:bg-[#efc878]"
              >
                Submit for review
              </button>
            </div>
          </form>
        ) : null}
      </div>
    </div>
  );
}
