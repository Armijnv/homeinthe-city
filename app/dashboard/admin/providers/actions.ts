"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireAdmin } from "@/app/lib/dashboard";
import { client } from "@/sanity/lib/client";
import { assertSanityWriteToken, writeClient } from "@/sanity/lib/writeClient";
import { publishedId } from "@/sanity/lib/providerSubmissionApproval";

type ManagedCityReference = {
  _key?: string;
  _ref?: string;
};

type ProviderManagedCitiesForAction = {
  _id: string;
  managedCities?: ManagedCityReference[];
};

function formString(formData: FormData, key: string) {
  return String(formData.get(key) || "").trim();
}

function cleanDocumentId(value: string) {
  const id = publishedId(value);
  return id && /^[A-Za-z0-9_.-]+$/.test(id) ? id : "";
}

function referenceKey(cityId: string, index: number) {
  const key = cityId.replace(/[^A-Za-z0-9_-]+/g, "-");
  return `managed-${key || index}`;
}

function normalizedReference(ref: ManagedCityReference, index: number) {
  if (!ref._ref) return null;

  return {
    _key: ref._key || referenceKey(ref._ref, index),
    _type: "reference",
    _ref: ref._ref,
  };
}

async function providerManagedCities(providerId: string) {
  return client.fetch<ProviderManagedCitiesForAction | null>(
    `*[_type == "provider" && _id == $providerId][0]{
      _id,
      managedCities[]{_key, _ref}
    }`,
    { providerId },
  );
}

async function cityExists(cityId: string) {
  const id = await client.fetch<string | null>(
    `*[_type == "city" && _id == $cityId][0]._id`,
    { cityId },
  );

  return Boolean(id);
}

function revalidateProviderManagement() {
  revalidatePath("/dashboard");
  revalidatePath("/dashboard/cities");
  revalidatePath("/dashboard/admin/providers");
}

export async function assignManagedCityAction(formData: FormData) {
  await requireAdmin("/dashboard/admin/providers");
  assertSanityWriteToken();

  const providerId = cleanDocumentId(formString(formData, "providerId"));
  const cityId = cleanDocumentId(formString(formData, "cityId"));

  if (!providerId || !cityId) {
    redirect("/dashboard/admin/providers");
  }

  const [provider, hasCity] = await Promise.all([
    providerManagedCities(providerId),
    cityExists(cityId),
  ]);

  if (!provider || !hasCity) {
    redirect("/dashboard/admin/providers");
  }

  const existingRefs = (provider.managedCities || [])
    .map(normalizedReference)
    .filter((ref): ref is NonNullable<typeof ref> => Boolean(ref));

  if (!existingRefs.some((ref) => ref._ref === cityId)) {
    await writeClient
      .patch(providerId)
      .set({
        managedCities: [
          ...existingRefs,
          {
            _key: referenceKey(cityId, existingRefs.length),
            _type: "reference",
            _ref: cityId,
          },
        ],
      })
      .commit();
  }

  revalidateProviderManagement();
  redirect("/dashboard/admin/providers");
}

export async function removeManagedCityAction(formData: FormData) {
  await requireAdmin("/dashboard/admin/providers");
  assertSanityWriteToken();

  const providerId = cleanDocumentId(formString(formData, "providerId"));
  const cityId = cleanDocumentId(formString(formData, "cityId"));

  if (!providerId || !cityId) {
    redirect("/dashboard/admin/providers");
  }

  const provider = await providerManagedCities(providerId);

  if (!provider) {
    redirect("/dashboard/admin/providers");
  }

  const nextRefs = (provider.managedCities || [])
    .filter((ref) => ref._ref && ref._ref !== cityId)
    .map(normalizedReference)
    .filter((ref): ref is NonNullable<typeof ref> => Boolean(ref));

  await writeClient.patch(providerId).set({ managedCities: nextRefs }).commit();

  revalidateProviderManagement();
  redirect("/dashboard/admin/providers");
}
