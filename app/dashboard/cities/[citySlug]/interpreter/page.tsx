import { DashboardBackLink, DashboardShell, Pill } from "@/app/dashboard/dashboard-ui";
import InterpreterServiceForm from "@/app/dashboard/interpreter-services/InterpreterServiceForm";
import { updateInterpreterServicePageAction } from "@/app/dashboard/interpreter-services/actions";
import { requireInterpreterServiceAccess } from "@/app/lib/interpreterServiceAccess";
import type { InterpreterCmsPage } from "@/app/lib/interpreterPages";
import { interpreterServicePublicPath } from "@/app/lib/interpreterServicePages";
import { client } from "@/sanity/lib/client";
import { cityInterpreterCoverageBySlugQuery, servicePageQuery } from "@/sanity/lib/queries";
import { interpreterLanguages, type CityInterpreterCoverage } from "@/app/lib/cityInterpreterCoverage";
import Link from "next/link";

export default async function CityInterpreterEditor({
  params,
  searchParams,
}: {
  params: Promise<{ citySlug: string }>;
  searchParams: Promise<{ error?: string; saved?: string }>;
}) {
  const [{ citySlug }, { error, saved }] = await Promise.all([params, searchParams]);
  const { context, definition } = await requireInterpreterServiceAccess(`city:${citySlug}`);
  const stored = await client.fetch<InterpreterCmsPage | null>(servicePageQuery, {
    slug: definition.servicePageSlug,
  });
  const coverage = await client.fetch<CityInterpreterCoverage | null>(
    cityInterpreterCoverageBySlugQuery,
    { citySlug },
  );

  return (
    <DashboardShell
      eyebrow={context.isAdmin ? "Administrator city interpreter page" : "City interpreter page"}
      title={definition.title}
      intro="Edit the city-specific public interpreter content. Interpreter names, photos, and languages continue to come from provider profiles."
      side={<Pill>{stored ? "Published service-page content" : "No editorial content yet"}</Pill>}
    >
      <DashboardBackLink href={`/dashboard/cities/${citySlug}`} label="City dashboard" />
      {error ? <p className="mb-6 rounded-xl border border-red-300/40 bg-red-950/30 p-4 text-sm text-red-100">{error}</p> : null}
      {saved ? <p className="mb-6 rounded-xl border border-emerald-300/40 bg-emerald-950/30 p-4 text-sm text-emerald-100">{saved === "unchanged" ? "No interpreter-page changes to save." : "Interpreter page saved successfully."}</p> : null}
      <section className="mb-6 rounded-2xl border border-white/10 bg-white/5 p-4 sm:p-6">
        <h2 className="text-xl font-medium text-white">City interpreter coverage</h2>
        <p className="mt-1 text-sm leading-6 text-stone-400">Assignments come from published interpreter-role provider profiles that serve this city. Languages, names, and photos are read from those profiles.</p>
        <div className="mt-4 space-y-3">
          {(coverage?.interpreters || []).map((provider) => (
            <div key={provider._id} className="flex flex-col gap-2 rounded-xl border border-white/10 bg-black/10 p-3 sm:flex-row sm:items-center sm:justify-between">
              <div><p className="font-medium text-white">{provider.name || "Untitled provider"}</p><p className="text-sm text-stone-400">{interpreterLanguages(provider).join(" · ") || "No languages listed"}</p></div>
              {context.isAdmin ? <Link href={`/dashboard/admin/providers/${encodeURIComponent(provider._id)}`} className="inline-flex min-h-11 items-center text-sm text-[#d6a85a]">Manage provider city assignment</Link> : null}
            </div>
          ))}
          {!coverage?.interpreters?.length ? <p className="text-sm text-stone-400">No published interpreter profiles currently serve this city.</p> : null}
        </div>
      </section>
      <InterpreterServiceForm
        page={stored || {}}
        pageKey={definition.key}
        isGeneralPage={false}
        publicPath={interpreterServicePublicPath(definition)}
        action={updateInterpreterServicePageAction}
      />
    </DashboardShell>
  );
}
