import type { Metadata } from "next";
import {
  BackToDashboard,
  DashboardActionRow,
  DashboardPanel,
  DashboardShell,
  Pill,
} from "@/app/dashboard/dashboard-ui";
import { getDashboardContext } from "@/app/lib/dashboard";
import {
  interpreterServicePages,
  interpreterServicePublicPath,
} from "@/app/lib/interpreterServicePages";
import { canEditInterpreterServicePage } from "@/app/lib/interpreterServicePolicy";
import { client } from "@/sanity/lib/client";

export const metadata: Metadata = { title: "Interpreter Service Pages" };

type SavedServicePage = {
  _id: string;
  slug?: { current?: string };
  _updatedAt?: string;
};

export default async function InterpreterServicesDashboardPage() {
  const context = await getDashboardContext("/dashboard/interpreter-services");
  const pages = interpreterServicePages.filter((page) =>
    canEditInterpreterServicePage({
      provider: context.provider,
      isAdmin: context.isAdmin,
      citySlug: page.citySlug,
    }),
  );

  const savedPages = await client.fetch<SavedServicePage[]>(
    `*[_type == "servicePage" && slug.current in $slugs]{_id, _updatedAt, slug}`,
    { slugs: pages.map((page) => page.servicePageSlug) },
  );
  const savedBySlug = new Map(
    savedPages.map((page) => [page.slug?.current, page]),
  );

  return (
    <DashboardShell
      eyebrow={context.isAdmin ? "Administrator" : "Interpreter"}
      title="Interpreter service pages"
      intro={
        context.isAdmin
          ? "Manage the general Brazil interpreter page and every configured city interpreter page."
          : "Manage the interpreter pages for cities where your provider profile is assigned as an interpreter."
      }
    >
      <BackToDashboard />
      <div className="grid gap-4 lg:grid-cols-2">
        {pages.map((page) => {
          const saved = savedBySlug.get(page.servicePageSlug);
          return (
            <DashboardPanel
              key={page.key}
              title={page.title}
              eyebrow={page.citySlug ? "City interpreter page" : "General page"}
            >
              <div className="flex flex-wrap items-center gap-2 py-3 first:pt-0">
                <Pill>Public route live</Pill>
                <Pill>{saved ? "Dashboard content saved" : "Code fallback active"}</Pill>
              </div>
              <DashboardActionRow
                title="Edit interpreter page"
                detail={page.detail}
                href={`/dashboard/interpreter-services/${page.key}`}
              />
              <DashboardActionRow
                title="View public page"
                detail={interpreterServicePublicPath(page)}
                href={interpreterServicePublicPath(page)}
              />
              {saved?._updatedAt ? (
                <p className="py-3 text-xs text-stone-500">
                  Dashboard content last saved {new Intl.DateTimeFormat("en", {
                    dateStyle: "medium",
                    timeStyle: "short",
                  }).format(new Date(saved._updatedAt))}
                </p>
              ) : null}
            </DashboardPanel>
          );
        })}
      </div>
      {!pages.length ? (
        <p className="rounded-xl border border-white/10 bg-white/5 p-5 text-stone-300">
          No interpreter service page is assigned to this provider account.
        </p>
      ) : null}
      {context.isAdmin ? (
        <p className="mt-6 text-sm leading-6 text-stone-400">
          The Sanity Studio Service Pages tool remains available as an advanced fallback.
          Routine page updates can be made here.
        </p>
      ) : null}
    </DashboardShell>
  );
}
