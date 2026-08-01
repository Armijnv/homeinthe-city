import type { Metadata } from "next";
import Link from "next/link";
import { createCityAction } from "@/app/dashboard/admin/cities/actions";
import { DashboardBackLink, DashboardShell } from "@/app/dashboard/dashboard-ui";
import { requireAdmin } from "@/app/lib/dashboard";
import { client } from "@/sanity/lib/client";

type PageProps = {
  searchParams: Promise<{ error?: string }>;
};

type HostOption = {
  _id: string;
  name?: string;
};

const publishedHostsQuery = `
  *[
    _type == "provider" &&
    status == "published" &&
    (primaryRole == "host" || "host" in roles)
  ] | order(name asc){_id, name}
`;

const inputClass =
  "w-full rounded-lg border border-white/15 bg-[#1a1f2e] px-4 py-3 text-sm text-white placeholder:text-stone-500";

export const metadata: Metadata = {
  title: "Create City",
};

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label>
      <span className="mb-2 block text-xs uppercase tracking-widest text-stone-400">
        {label}
      </span>
      {children}
    </label>
  );
}

export default async function NewCityPage({ searchParams }: PageProps) {
  await requireAdmin("/dashboard/admin/cities/new");
  const [{ error }, hosts] = await Promise.all([
    searchParams,
    client.fetch<HostOption[]>(publishedHostsQuery),
  ]);

  return (
    <DashboardShell
      eyebrow="Admin city"
      title="Create city"
      intro="Start a city guide in a safe hidden state, then continue filling it in with the existing city dashboard editors."
    >
      <DashboardBackLink href="/dashboard/admin/cities" label="Cities" />

      {error ? (
        <p className="mb-6 rounded-xl border border-red-300/40 bg-red-950/30 p-4 text-sm text-red-100">
          {error}
        </p>
      ) : null}

      <form action={createCityAction} className="space-y-8">
        <section className="rounded-2xl border border-white/10 bg-white/10 p-6">
          <h2 className="text-2xl font-light text-white">Identity and visibility</h2>
          <p className="mt-3 max-w-3xl text-sm leading-6 text-stone-300">
            Hidden is the safest starting point. A city is only public when its
            status, content, host, and language settings all satisfy the existing
            publication rules.
          </p>
          <div className="mt-6 grid gap-5 md:grid-cols-2">
            <Field label="City name (English / default)">
              <input
                name="name_en"
                required
                placeholder="São Paulo"
                className={inputClass}
              />
            </Field>
            <Field label="Slug">
              <input
                name="slug"
                required
                pattern="[a-z0-9]+(?:-[a-z0-9]+)*"
                placeholder="sao-paulo"
                className={inputClass}
              />
            </Field>
            <Field label="Country / region">
              <input name="country" defaultValue="Brazil" className={inputClass} />
            </Field>
            <Field label="Status / visibility">
              <select name="guideStatus" defaultValue="hidden" className={inputClass}>
                <option value="hidden">Hidden — not public</option>
                <option value="comingSoon">Coming soon — marketing only</option>
              </select>
            </Field>
            <Field label="Primary host (optional)">
              <select name="primaryHostId" defaultValue="" className={inputClass}>
                <option value="">No primary host yet</option>
                {hosts.map((host) => (
                  <option key={host._id} value={host._id}>
                    {host.name || "Unnamed host"}
                  </option>
                ))}
              </select>
            </Field>
          </div>
        </section>

        <section className="rounded-2xl border border-white/10 bg-white/10 p-6">
          <h2 className="text-2xl font-light text-white">Globe coordinates</h2>
          <p className="mt-3 max-w-3xl text-sm leading-6 text-stone-300">
            Globe pins require both latitude and longitude. You can leave both fields
            empty while the city is being prepared, but it will not appear as a pin
            until coordinates are saved.
          </p>
          <div className="mt-6 grid gap-5 md:grid-cols-2">
            <Field label="Latitude">
              <input
                type="number"
                name="latitude"
                min="-90"
                max="90"
                step="any"
                inputMode="decimal"
                placeholder="-23.5505"
                className={inputClass}
              />
            </Field>
            <Field label="Longitude">
              <input
                type="number"
                name="longitude"
                min="-180"
                max="180"
                step="any"
                inputMode="decimal"
                placeholder="-46.6333"
                className={inputClass}
              />
            </Field>
          </div>
          {/* TODO: Add automatic city coordinate lookup when a vetted geocoding service is configured. */}
          <p className="mt-4 text-sm text-stone-400">
            Automatic coordinate lookup is not configured yet. Copy the city-center
            coordinates from a trusted map source.
          </p>
        </section>

        <section className="rounded-2xl border border-white/10 bg-white/10 p-6">
          <h2 className="text-2xl font-light text-white">Localized names</h2>
          <div className="mt-6 grid gap-5 md:grid-cols-2">
            <Field label="Portuguese name">
              <input name="name_pt" placeholder="São Paulo" className={inputClass} />
            </Field>
            <Field label="Dutch name">
              <input name="name_nl" placeholder="São Paulo" className={inputClass} />
            </Field>
          </div>
        </section>

        <section className="rounded-2xl border border-white/10 bg-white/10 p-6">
          <h2 className="text-2xl font-light text-white">Basic guide content</h2>
          <p className="mt-3 text-sm leading-6 text-stone-300">
            These fields are optional here. The full city editor opens after creation.
          </p>
          <div className="mt-6 space-y-6">
            {[
              ["en", "English"],
              ["pt", "Portuguese"],
              ["nl", "Dutch"],
            ].map(([code, label]) => (
              <div key={code} className="grid gap-5 md:grid-cols-2">
                <Field label={`Headline (${label})`}>
                  <input name={`headline_${code}`} className={inputClass} />
                </Field>
                <Field label={`Intro (${label})`}>
                  <textarea
                    name={`intro_${code}`}
                    rows={3}
                    className={inputClass}
                  />
                </Field>
              </div>
            ))}
          </div>
        </section>

        <fieldset className="rounded-2xl border border-white/10 bg-white/10 p-6">
          <legend className="px-2 text-2xl font-light text-white">
            Language override (optional)
          </legend>
          <p className="mt-2 text-sm leading-6 text-stone-300">
            Leave all unchecked to inherit languages from the primary host.
          </p>
          <div className="mt-5 flex flex-wrap gap-5">
            {[
              ["en", "English"],
              ["pt", "Portuguese"],
              ["nl", "Dutch"],
            ].map(([value, label]) => (
              <label key={value} className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  name="enabledLanguages"
                  value={value}
                  className="size-4 accent-[#d6a85a]"
                />
                {label}
              </label>
            ))}
          </div>
        </fieldset>

        <div className="flex flex-wrap gap-3">
          <button
            type="submit"
            className="rounded-lg bg-[#d6a85a] px-5 py-3 text-sm font-medium text-[#1a1f2e] transition hover:bg-white"
          >
            Create city
          </button>
          <Link
            href="/dashboard/admin/cities"
            className="rounded-lg border border-white/15 px-5 py-3 text-sm text-white transition hover:border-[#d6a85a] hover:text-[#d6a85a]"
          >
            Cancel
          </Link>
        </div>
      </form>
    </DashboardShell>
  );
}
