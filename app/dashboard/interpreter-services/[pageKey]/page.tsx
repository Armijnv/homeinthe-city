import type { Metadata } from "next";
import { DashboardBackLink, DashboardShell, Pill } from "@/app/dashboard/dashboard-ui";
import InterpreterServiceForm from "@/app/dashboard/interpreter-services/InterpreterServiceForm";
import { updateInterpreterServicePageAction } from "@/app/dashboard/interpreter-services/actions";
import { interpreterHubContent } from "@/app/components/InterpreterHubPage";
import { requireInterpreterServiceAccess } from "@/app/lib/interpreterServiceAccess";
import {
  interpreterCities,
  interpreterHubSeo,
  type InterpreterCmsPage,
  type InterpreterLanguage,
} from "@/app/lib/interpreterPages";
import { interpreterServicePublicPath } from "@/app/lib/interpreterServicePages";
import { client } from "@/sanity/lib/client";
import { servicePageQuery } from "@/sanity/lib/queries";

type PageProps = {
  params: Promise<{ pageKey: string }>;
  searchParams: Promise<{ error?: string; saved?: string }>;
};

export const metadata: Metadata = { title: "Edit Interpreter Service Page" };

const languages: InterpreterLanguage[] = ["en", "pt", "nl"];

function effectivePage(
  pageKey: string,
  stored: InterpreterCmsPage | null,
): InterpreterCmsPage {
  const fallback: InterpreterCmsPage = {};

  languages.forEach((language) => {
    if (pageKey === "brazil") {
      const content = interpreterHubContent[language];
      fallback[`seoTitle_${language}`] = interpreterHubSeo[language].title;
      fallback[`seoDescription_${language}`] = interpreterHubSeo[language].description;
      fallback[`eyebrow_${language}`] = content.eyebrow;
      fallback[`title_${language}`] = content.title;
      fallback[`intro_${language}`] = content.intro;
      fallback[`ctaTitle_${language}`] = content.finalTitle;
      fallback[`ctaText_${language}`] = content.finalText;
      fallback[`button_${language}`] = content.finalButton;
      return;
    }

    const city = interpreterCities[pageKey as keyof typeof interpreterCities];
    const content = city?.content[language];
    const seo = city?.seo[language];
    fallback[`seoTitle_${language}`] = seo?.title || "";
    fallback[`seoDescription_${language}`] = seo?.description || "";
    fallback[`eyebrow_${language}`] = content?.eyebrow || "";
    fallback[`title_${language}`] = content?.title || "";
    fallback[`intro_${language}`] = content?.intro || "";
    fallback[`pricingTitle_${language}`] = content?.pricingTitle || "";
    fallback[`ctaTitle_${language}`] = content?.ctaTitle || "";
    fallback[`ctaText_${language}`] = content?.ctaText || "";
    fallback[`button_${language}`] = content?.ctaButton || "";
  });

  const merged = { ...fallback, ...stored };
  languages.forEach((language) => {
    [
      "seoTitle",
      "seoDescription",
      "eyebrow",
      "title",
      "intro",
      "pricingTitle",
      "ctaTitle",
      "ctaText",
      "button",
    ].forEach((field) => {
      const key = `${field}_${language}` as keyof InterpreterCmsPage;
      if (!merged[key]) Object.assign(merged, { [key]: fallback[key] });
    });
  });
  return merged;
}

export default async function EditInterpreterServicePage({
  params,
  searchParams,
}: PageProps) {
  const [{ pageKey }, { error, saved }] = await Promise.all([params, searchParams]);
  const { context, definition } = await requireInterpreterServiceAccess(pageKey);
  const stored = await client.fetch<InterpreterCmsPage | null>(servicePageQuery, {
    slug: definition.servicePageSlug,
  });
  const page = effectivePage(definition.key, stored);
  const publicPath = interpreterServicePublicPath(definition);

  return (
    <DashboardShell
      eyebrow={context.isAdmin ? "Administrator service page" : "Interpreter service page"}
      title={definition.title}
      intro="Edit the public service-page content. Authorized saves publish directly and appear in Administrator Activity."
      side={
        <div className="flex flex-wrap gap-2">
          <Pill>Public route live</Pill>
          <Pill>{stored ? "Sanity content" : "Code fallback"}</Pill>
        </div>
      }
    >
      <DashboardBackLink href="/dashboard/interpreter-services" label="Interpreter pages" />
      {error ? (
        <p className="mb-6 rounded-xl border border-red-300/40 bg-red-950/30 p-4 text-sm text-red-100">
          {error}
        </p>
      ) : null}
      {saved ? (
        <p className="mb-6 rounded-xl border border-emerald-300/40 bg-emerald-950/30 p-4 text-sm text-emerald-100">
          {saved === "unchanged"
            ? "No interpreter-page changes to save."
            : "Interpreter page saved successfully."}
        </p>
      ) : null}
      <InterpreterServiceForm
        page={page}
        pageKey={definition.key}
        isGeneralPage={!definition.citySlug}
        publicPath={publicPath}
        action={updateInterpreterServicePageAction}
      />
    </DashboardShell>
  );
}
