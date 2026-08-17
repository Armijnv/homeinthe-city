import { DashboardBackLink, DashboardShell, Pill } from "@/app/dashboard/dashboard-ui";
import InterpreterServiceForm from "@/app/dashboard/interpreter-services/InterpreterServiceForm";
import { assignInterpreterToCityAction, removeInterpreterFromCityAction, updateInterpreterServicePageAction } from "@/app/dashboard/interpreter-services/actions";
import { requireInterpreterServiceAccess } from "@/app/lib/interpreterServiceAccess";
import type { InterpreterCmsPage } from "@/app/lib/interpreterTypes";
import { interpreterServicePublicPath } from "@/app/lib/interpreterServicePages";
import { client } from "@/sanity/lib/client";
import { cityInterpreterCoverageBySlugQuery, servicePageQuery } from "@/sanity/lib/queries";
import { interpreterLanguages, type CityInterpreterCoverage } from "@/app/lib/cityInterpreterCoverage";
import Image from "next/image";
import StudioDraftNotice from "@/app/dashboard/StudioDraftNotice";

export default async function CityInterpreterEditor({
  params,
  searchParams,
}: {
  params: Promise<{ citySlug: string }>;
  searchParams: Promise<{ error?: string; saved?: string; assignment?: string }>;
}) {
  const [{ citySlug }, { error, saved, assignment }] = await Promise.all([params, searchParams]);
  const { context, definition } = await requireInterpreterServiceAccess(`city:${citySlug}`);
  const stored = await client.fetch<InterpreterCmsPage | null>(servicePageQuery, {
    slug: definition.servicePageSlug,
  });
  const coverage = await client.fetch<CityInterpreterCoverage | null>(
    cityInterpreterCoverageBySlugQuery,
    { citySlug },
  );
  const availableInterpreters = context.isAdmin ? await client.fetch<Array<{ _id: string; name?: string }>>(
    `*[_type == "provider" && status == "published" && (primaryRole == "interpreter" || "interpreter" in roles) && !(_id in $assigned)] | order(name asc){_id, name}`,
    { assigned: (coverage?.interpreters || []).map((provider) => provider._id) },
  ) : [];

  return (
    <DashboardShell
      eyebrow={context.isAdmin ? "Administrator city interpreter page" : "City interpreter page"}
      title={definition.title}
      intro="Edit the city-specific public interpreter content. Interpreter names, photos, and languages continue to come from provider profiles."
      side={<Pill>{stored ? "Published service-page content" : "No editorial content yet"}</Pill>}
    >
      <DashboardBackLink href={`/dashboard/cities/${citySlug}`} label="City dashboard" />
      <StudioDraftNotice documentId={stored?._id} />
      {error ? <p className="mb-6 rounded-xl border border-red-300/40 bg-red-950/30 p-4 text-sm text-red-100">{error}</p> : null}
      {saved ? <p className="mb-6 rounded-xl border border-emerald-300/40 bg-emerald-950/30 p-4 text-sm text-emerald-100">{saved === "unchanged" ? "No interpreter-page changes to save." : "Interpreter page saved successfully."}</p> : null}
      {assignment ? <p className="mb-6 rounded-xl border border-emerald-300/40 bg-emerald-950/30 p-4 text-sm text-emerald-100">Interpreter {assignment}.</p> : null}
      <section className="mb-6 rounded-2xl border border-white/10 bg-white/5 p-4 sm:p-6">
        <h2 className="text-xl font-medium text-white">Interpreters in this city</h2>
        <p className="mt-1 text-sm leading-6 text-stone-400">Names, photos, languages, and roles come from provider profiles. {context.isAdmin ? "You can manage who serves this city below." : "Only an administrator can change assignments."}</p>
        <div className="mt-4 space-y-3">
          {(coverage?.interpreters || []).map((provider) => (
            <div key={provider._id} className="flex flex-col gap-2 rounded-xl border border-white/10 bg-black/10 p-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-3">{provider.mainPhoto?.asset?.url ? <Image src={provider.mainPhoto.asset.url} alt="" width={44} height={44} className="h-11 w-11 rounded-full object-cover" /> : null}<div><p className="font-medium text-white">{provider.name || "Untitled provider"}{coverage?.primaryHost?._id === provider._id ? <span className="ml-2 text-xs text-[#f0d6a2]">Primary city host</span> : null}</p><p className="text-sm text-stone-400">Interpreter · {interpreterLanguages(provider).join(" · ") || "No languages listed"}</p></div></div>
              {context.isAdmin ? <form action={removeInterpreterFromCityAction}><input type="hidden" name="cityId" value={coverage?._id || ""} /><input type="hidden" name="citySlug" value={citySlug} /><input type="hidden" name="providerId" value={provider._id} /><button className="inline-flex min-h-11 items-center text-sm text-red-200">Remove from city</button></form> : null}
            </div>
          ))}
          {!coverage?.interpreters?.length ? <p className="text-sm text-stone-400">No published interpreter profiles currently serve this city.</p> : null}
        </div>
        {context.isAdmin ? <form action={assignInterpreterToCityAction} className="mt-5 flex flex-col gap-3 border-t border-white/10 pt-5 sm:flex-row"><input type="hidden" name="cityId" value={coverage?._id || ""} /><input type="hidden" name="citySlug" value={citySlug} /><select name="providerId" className="min-h-11 flex-1 rounded-lg border border-white/15 bg-[#1a1f2e] px-3 text-sm text-white" defaultValue="" disabled={!availableInterpreters.length}><option value="" disabled>{availableInterpreters.length ? "Add an interpreter provider" : "No unassigned interpreter providers"}</option>{availableInterpreters.map((provider) => <option key={provider._id} value={provider._id}>{provider.name || "Untitled provider"}</option>)}</select><button type="submit" disabled={!availableInterpreters.length} className="min-h-11 rounded-lg bg-[#d6a85a] px-4 text-sm font-medium text-[#1a1f2e] disabled:opacity-50">Add interpreter</button></form> : null}
      </section>
      <InterpreterServiceForm
        page={stored || {}}
        pageKey={definition.key}
        isGeneralPage={false}
        isAdmin={context.isAdmin}
        publicPath={interpreterServicePublicPath(definition)}
        action={updateInterpreterServicePageAction}
      />
    </DashboardShell>
  );
}
