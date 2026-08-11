"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { activityFieldChanges } from "@/app/lib/activityChanges";
import { requireInterpreterServiceAccess } from "@/app/lib/interpreterServiceAccess";
import type { InterpreterLanguage } from "@/app/lib/interpreterPages";
import { servicePageChangeLogDocument } from "@/app/lib/servicePageChangeLog";
import { client } from "@/sanity/lib/client";
import { assertSanityWriteToken, writeClient } from "@/sanity/lib/writeClient";

const languages: InterpreterLanguage[] = ["en", "pt", "nl"];
const scalarFields = [
  "seoTitle",
  "seoDescription",
  "eyebrow",
  "title",
  "intro",
  "pricingTitle",
  "ctaTitle",
  "ctaText",
  "button",
] as const;

type ExistingServicePage = Record<string, unknown> & {
  _id: string;
  _rev: string;
};

class InterpreterServiceError extends Error {}

function formString(formData: FormData, field: string) {
  return String(formData.get(field) || "").trim();
}

function safeKey(value: unknown, prefix: string, index: number) {
  const requested = typeof value === "string" ? value : "";
  return (
    requested.replace(/[^A-Za-z0-9_-]+/g, "-") ||
    `${prefix}-${Date.now()}-${index}`
  );
}

function localizedArray(
  formData: FormData,
  field: "sectionsJson" | "pricingItemsJson",
) {
  const source = formString(formData, field);
  if (!source) return [];

  let parsed: unknown;
  try {
    parsed = JSON.parse(source);
  } catch {
    throw new InterpreterServiceError("The repeated page content could not be read.");
  }

  if (!Array.isArray(parsed) || parsed.length > 30) {
    throw new InterpreterServiceError("The repeated page content is invalid.");
  }

  const isSection = field === "sectionsJson";
  const names = isSection ? (["title", "text"] as const) : (["label", "detail"] as const);

  return parsed.flatMap((entry, index) => {
    if (!entry || typeof entry !== "object") return [];
    const sourceEntry = entry as Record<string, unknown>;
    const localized = Object.fromEntries(
      languages.flatMap((language) =>
        names.map((name) => {
          const value = sourceEntry[`${name}_${language}`];
          return [
            `${name}_${language}`,
            typeof value === "string" ? value.trim() : "",
          ];
        }),
      ),
    );

    if (!Object.values(localized).some(Boolean)) return [];

    return [
      {
        _type: "object",
        _key: safeKey(sourceEntry._key, isSection ? "section" : "price", index),
        ...localized,
      },
    ];
  });
}

function servicePageInput(formData: FormData) {
  return {
    ...Object.fromEntries(
      languages.flatMap((language) =>
        scalarFields.map((field) => [
          `${field}_${language}`,
          formString(formData, `${field}_${language}`),
        ]),
      ),
    ),
    sections: localizedArray(formData, "sectionsJson"),
    pricingItems: localizedArray(formData, "pricingItemsJson"),
  };
}

function errorMessage(error: unknown) {
  if (error instanceof InterpreterServiceError) return error.message;
  if (error instanceof Error && error.message.includes("SANITY_API_WRITE_TOKEN")) {
    return "Interpreter-page saving is not configured. Check the Sanity write token.";
  }
  return "The interpreter page could not be saved. Please review the fields and try again.";
}

function revalidateServicePage(paths: string[]) {
  paths.forEach((path) => revalidatePath(path));
  revalidatePath("/dashboard");
  revalidatePath("/dashboard/provider");
  revalidatePath("/dashboard/interpreter-services");
  revalidatePath("/dashboard/interpreter-services/[pageKey]", "page");
  revalidatePath("/dashboard/admin");
  revalidatePath("/dashboard/admin/activity");
}

export async function updateInterpreterServicePageAction(formData: FormData) {
  const pageKey = formString(formData, "pageKey");
  const { context, definition } = await requireInterpreterServiceAccess(pageKey);
  assertSanityWriteToken();

  let saved: "updated" | "unchanged" = "unchanged";
  try {
    const existing = await client.fetch<ExistingServicePage | null>(
      `*[_type == "servicePage" && slug.current == $slug][0]`,
      { slug: definition.servicePageSlug },
    );
    const input = servicePageInput(formData);
    const changes = activityFieldChanges(existing || {}, input, ["_type", "_key"]);

    if (changes.length) {
      saved = "updated";
      const servicePageId =
        existing?._id || `service-page-${definition.servicePageSlug}`;
      const transaction = writeClient.transaction();

      if (existing) {
        transaction.patch(existing._id, (patch) =>
          patch.ifRevisionId(existing._rev).set(input),
        );
      } else {
        transaction.createIfNotExists({
          _id: servicePageId,
          _type: "servicePage",
          name: definition.title,
          slug: { _type: "slug", current: definition.servicePageSlug },
          ...input,
        });
      }

      transaction.create(
        servicePageChangeLogDocument({
          context,
          definition,
          servicePageId,
          changeType: existing ? "servicePageEdited" : "servicePageCreated",
          changes,
        }),
      );
      await transaction.commit();
    }

    revalidateServicePage(
      Object.values(definition.paths).filter(
        (path): path is string => Boolean(path),
      ),
    );
  } catch (error) {
    redirect(
      `/dashboard/interpreter-services/${encodeURIComponent(pageKey)}?error=${encodeURIComponent(errorMessage(error))}`,
    );
  }
  redirect(`/dashboard/interpreter-services/${definition.key}?saved=${saved}`);
}
