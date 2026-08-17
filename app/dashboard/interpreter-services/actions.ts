"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { activityFieldChanges } from "@/app/lib/activityChanges";
import { requireAdmin } from "@/app/lib/dashboard";
import { requireInterpreterServiceAccess } from "@/app/lib/interpreterServiceAccess";
import type { InterpreterLanguage } from "@/app/lib/interpreterTypes";
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

type AssignmentProvider = { _id: string; _rev: string; roles?: string[]; primaryRole?: string; cities?: Array<{ _key?: string; _ref?: string }> };

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

function servicePageInput(formData: FormData, allowAdvancedOverrides: boolean) {
  const editableFields = allowAdvancedOverrides
    ? scalarFields
    : scalarFields.filter((field) => !["seoTitle", "seoDescription", "eyebrow", "title"].includes(field));
  return {
    ...Object.fromEntries(
      languages.flatMap((language) =>
        editableFields.map((field) => [
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
  const editorPath = definition.citySlug
    ? `/dashboard/cities/${definition.citySlug}/interpreter`
    : `/dashboard/interpreter-services/${encodeURIComponent(definition.key)}`;
  assertSanityWriteToken();

  let saved: "updated" | "unchanged" = "unchanged";
  try {
    const existing = await client.fetch<ExistingServicePage | null>(
      `*[_type == "servicePage" && slug.current == $slug][0]`,
      { slug: definition.servicePageSlug },
    );
    const input = {
      ...servicePageInput(formData, context.isAdmin),
      ...(definition.cityId
        ? { kind: "cityInterpreter", city: { _type: "reference", _ref: definition.cityId } }
        : {}),
    };
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
      `${editorPath}?error=${encodeURIComponent(errorMessage(error))}`,
    );
  }
  redirect(`${editorPath}?saved=${saved}`);
}

function assignmentEditorPath(citySlug: string) { return `/dashboard/cities/${encodeURIComponent(citySlug)}/interpreter`; }

async function cityAssignmentInput(formData: FormData) {
  await requireAdmin("/dashboard/admin");
  const cityId = formString(formData, "cityId"); const citySlug = formString(formData, "citySlug"); const providerId = formString(formData, "providerId");
  if (!cityId || !citySlug || !providerId) throw new InterpreterServiceError("The interpreter assignment is incomplete.");
  const provider = await client.fetch<AssignmentProvider | null>(`*[_type == "provider" && _id == $providerId][0]{_id, _rev, roles, primaryRole, cities[]{_key, _ref}}`, { providerId });
  if (!provider || !(provider.primaryRole === "interpreter" || provider.roles?.includes("interpreter"))) throw new InterpreterServiceError("Only providers with the Interpreter role can be assigned here.");
  return { cityId, citySlug, providerId, provider };
}

export async function assignInterpreterToCityAction(formData: FormData) {
  const submittedCitySlug = formString(formData, "citySlug");
  try {
    const input = await cityAssignmentInput(formData);
    assertSanityWriteToken();
    if (!(input.provider.cities || []).some((city) => city._ref === input.cityId)) await writeClient.patch(input.providerId).ifRevisionId(input.provider._rev).set({ cities: [...(input.provider.cities || []), { _key: `city-${input.cityId}`, _type: "reference", _ref: input.cityId }] }).commit();
    revalidatePath(assignmentEditorPath(input.citySlug)); revalidatePath("/dashboard/interpreter-services"); revalidatePath(`/interpreter/${input.citySlug}`); revalidatePath(`/pt/interprete/${input.citySlug}`); revalidatePath(`/nl/tolk/${input.citySlug}`);
    redirect(`${assignmentEditorPath(input.citySlug)}?assignment=added`);
  } catch (error) { redirect(`${assignmentEditorPath(submittedCitySlug)}?error=${encodeURIComponent(errorMessage(error))}`); }
}

export async function removeInterpreterFromCityAction(formData: FormData) {
  const submittedCitySlug = formString(formData, "citySlug");
  try {
    const input = await cityAssignmentInput(formData);
    assertSanityWriteToken();
    const cities = (input.provider.cities || []).filter((city) => city._ref !== input.cityId);
    if (cities.length !== (input.provider.cities || []).length) await writeClient.patch(input.providerId).ifRevisionId(input.provider._rev).set({ cities }).commit();
    revalidatePath(assignmentEditorPath(input.citySlug)); revalidatePath("/dashboard/interpreter-services"); revalidatePath(`/interpreter/${input.citySlug}`); revalidatePath(`/pt/interprete/${input.citySlug}`); revalidatePath(`/nl/tolk/${input.citySlug}`);
    redirect(`${assignmentEditorPath(input.citySlug)}?assignment=removed`);
  } catch (error) { redirect(`${assignmentEditorPath(submittedCitySlug)}?error=${encodeURIComponent(errorMessage(error))}`); }
}
