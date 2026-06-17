import Link from "next/link";

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

export type ProviderAdminFormData = {
  _id?: string;
  name?: string;
  slug?: { current?: string };
  status?: string;
  roles?: string[];
  primaryRole?: string;
  languages?: ProviderAdminLanguage[];
  cities?: Array<{ _id?: string }>;
  managedCities?: Array<{ _id?: string }>;
  ownership?: {
    contactEmail?: string;
    ownerUserId?: string;
    ownershipStatus?: string;
  };
  contactOptions?: {
    email?: string;
    whatsapp?: string;
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

const inputClass =
  "w-full rounded-lg border border-white/15 bg-[#1a1f2e] px-4 py-3 text-sm text-white placeholder:text-stone-500";

function cityName(city: ProviderAdminCityOption) {
  return city.name_en || city.name_pt || city.name_nl || "Untitled city";
}

function selectedIds(values?: Array<{ _id?: string }>) {
  return new Set(values?.map((value) => value._id).filter(Boolean));
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
  const selectedRoles = new Set(provider?.roles || []);
  const servedCityIds = selectedIds(provider?.cities);
  const managedCityIds = selectedIds(provider?.managedCities);
  const languageValues = new Map(
    provider?.languages
      ?.filter((entry) => entry.language)
      .map((entry) => [entry.language || "", entry]) || [],
  );

  return (
    <form action={action} className="space-y-8">
      {provider?._id ? (
        <input type="hidden" name="providerId" value={provider._id} />
      ) : null}

      <section className="rounded-2xl border border-white/10 bg-white/10 p-6">
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

      <section className="rounded-2xl border border-white/10 bg-white/10 p-6">
        <h2 className="text-2xl font-light text-white">Contact and account matching</h2>
        <p className="mt-3 max-w-3xl text-sm leading-6 text-stone-300">
          Creating a provider does not send a Clerk invitation. The email is stored
          for the existing account-matching flow and can be present before the
          provider has logged in.
        </p>
        <div className="mt-6 grid gap-5 md:grid-cols-2">
          <label>
            <span className="mb-2 block text-xs uppercase tracking-widest text-stone-400">
              Contact / account email
            </span>
            <input
              name="contactEmail"
              type="email"
              className={inputClass}
              defaultValue={
                provider?.ownership?.contactEmail ||
                provider?.contactOptions?.email ||
                ""
              }
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
        </div>
        {provider?.ownership?.ownerUserId ? (
          <p className="mt-4 text-sm text-stone-300">
            Connected Clerk user: {provider.ownership.ownerUserId}
          </p>
        ) : (
          <p className="mt-4 text-sm text-[#d6a85a]">
            Account status: {provider?.ownership?.ownershipStatus || "unclaimed"}
          </p>
        )}
      </section>

      <section className="rounded-2xl border border-white/10 bg-white/10 p-6">
        <h2 className="text-2xl font-light text-white">Roles</h2>
        <div className="mt-5 flex flex-wrap gap-5">
          {roles.map(([value, label]) => (
            <label key={value} className="flex items-center gap-2 text-sm">
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

      <section className="rounded-2xl border border-white/10 bg-white/10 p-6">
        <h2 className="text-2xl font-light text-white">Languages</h2>
        <div className="mt-5 grid gap-4 lg:grid-cols-2">
          {languages.map(([code, label]) => {
            const language = languageValues.get(code);
            const services = new Set(language?.services || []);

            return (
              <div key={code} className="rounded-xl border border-white/10 bg-black/10 p-4">
                <label className="flex items-center gap-2 font-medium text-white">
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
                    <label key={value} className="flex items-center gap-2 text-xs text-stone-300">
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
        <div className="rounded-2xl border border-white/10 bg-white/10 p-6">
          <h2 className="text-2xl font-light text-white">Cities served</h2>
          <p className="mt-2 text-sm text-stone-300">Shown on the public provider profile.</p>
          <div className="mt-5 space-y-3">
            {cities.map((city) => (
              <label key={city._id} className="flex items-center gap-2 text-sm">
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

        <div className="rounded-2xl border border-white/10 bg-white/10 p-6">
          <h2 className="text-2xl font-light text-white">Managed cities</h2>
          <p className="mt-2 text-sm text-stone-300">
            Grants city-host dashboard access. It does not change public coverage.
          </p>
          <div className="mt-5 space-y-3">
            {cities.map((city) => (
              <label key={city._id} className="flex items-center gap-2 text-sm">
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

      <div className="flex flex-wrap gap-3">
        <button
          type="submit"
          className="rounded-lg bg-[#d6a85a] px-5 py-3 text-sm font-medium text-[#1a1f2e] transition hover:bg-white"
        >
          {submitLabel}
        </button>
        <Link
          href="/dashboard/admin/providers"
          className="rounded-lg border border-white/15 px-5 py-3 text-sm text-white transition hover:border-[#d6a85a] hover:text-[#d6a85a]"
        >
          Cancel
        </Link>
      </div>
    </form>
  );
}
