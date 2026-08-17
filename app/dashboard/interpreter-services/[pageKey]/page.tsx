import { permanentRedirect } from "next/navigation";
import { DashboardBackLink, DashboardShell, Pill } from "@/app/dashboard/dashboard-ui";
import InterpreterServiceForm from "@/app/dashboard/interpreter-services/InterpreterServiceForm";
import { updateInterpreterServicePageAction } from "@/app/dashboard/interpreter-services/actions";
import { interpreterHubContent } from "@/app/components/InterpreterHubPage";
import { requireInterpreterServiceAccess } from "@/app/lib/interpreterServiceAccess";
import { interpreterHubSeo } from "@/app/lib/interpreterHub";
import type { InterpreterCmsPage, InterpreterLanguage } from "@/app/lib/interpreterTypes";
import { interpreterServicePublicPath } from "@/app/lib/interpreterServicePages";
import { client } from "@/sanity/lib/client";
import { servicePageQuery } from "@/sanity/lib/queries";

const languages: InterpreterLanguage[] = ["en", "pt", "nl"];

function citySlugForLegacyPageKey(pageKey: string) {
  return pageKey.startsWith("city:") ? pageKey.slice(5) : pageKey;
}

function effectiveHubPage(stored: InterpreterCmsPage | null): InterpreterCmsPage {
  const fallback: InterpreterCmsPage = {};

  languages.forEach((language) => {
    const content = interpreterHubContent[language];
    fallback[`seoTitle_${language}`] = interpreterHubSeo[language].title;
    fallback[`seoDescription_${language}`] = interpreterHubSeo[language].description;
    fallback[`eyebrow_${language}`] = content.eyebrow;
    fallback[`title_${language}`] = content.title;
    fallback[`intro_${language}`] = content.intro;
    fallback[`ctaTitle_${language}`] = content.finalTitle;
    fallback[`ctaText_${language}`] = content.finalText;
    fallback[`button_${language}`] = content.finalButton;
  });

  return { ...fallback, ...stored };
}

export default async function EditInterpreterServicePage({
  params,
  searchParams,
}: {
  params: Promise<{ pageKey: string }>;
  searchParams: Promise<{ error?: string; saved?: string }>;
}) {
  const [{ pageKey }, { error, saved }] = await Promise.all([params, searchParams]);
  if (pageKey !== "brazil") {
    permanentRedirect(
      `/dashboard/cities/${encodeURIComponent(citySlugForLegacyPageKey(pageKey))}/interpreter`,
    );
  }

  const { context, definition } = await requireInterpreterServiceAccess("brazil");
  const stored = await client.fetch<InterpreterCmsPage | null>(servicePageQuery, {
    slug: definition.servicePageSlug,
  });

  return (
    <DashboardShell
      eyebrow={context.isAdmin ? "Administrator service page" : "Interpreter service page"}
      title={definition.title}
      intro="Edit the public Brazil-wide interpreter hub. City editorial content is managed from the matching city workspace."
      side={<Pill>{stored ? "Sanity content" : "Code fallback"}</Pill>}
    >
      <DashboardBackLink href="/dashboard/interpreter-services" label="Interpreter pages" />
      {error ? <p className="mb-6 rounded-xl border border-red-300/40 bg-red-950/30 p-4 text-sm text-red-100">{error}</p> : null}
      {saved ? <p className="mb-6 rounded-xl border border-emerald-300/40 bg-emerald-950/30 p-4 text-sm text-emerald-100">{saved === "unchanged" ? "No interpreter-page changes to save." : "Interpreter page saved successfully."}</p> : null}
      <InterpreterServiceForm
        page={effectiveHubPage(stored)}
        pageKey={definition.key}
        isGeneralPage
        publicPath={interpreterServicePublicPath(definition)}
        action={updateInterpreterServicePageAction}
      />
    </DashboardShell>
  );
}
