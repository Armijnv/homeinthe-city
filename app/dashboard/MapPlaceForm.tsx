"use client";

import Image from "next/image";
import { useState, type ReactNode } from "react";
import { mapCategoryForPlace, mapCategoryPresets } from "@/app/lib/mapCategories";

export type EditableMapPlace = {
  _key?: string;
  name?: string;
  name_en?: string;
  name_pt?: string;
  name_nl?: string;
  categoryPreset?: string;
  category?: string;
  categoryLabel_en?: string;
  categoryLabel_pt?: string;
  categoryLabel_nl?: string;
  neighborhood?: string;
  latitude?: number | null;
  longitude?: number | null;
  detail_en?: string;
  detail_pt?: string;
  detail_nl?: string;
  description_en?: string;
  description_pt?: string;
  description_nl?: string;
  website?: string;
  image?: {
    alt?: string;
    asset?: {
      url?: string;
    };
  };
};

type MapPlaceFormProps = {
  action: (formData: FormData) => void | Promise<void>;
  place?: EditableMapPlace;
  submitLabel?: string;
};

function Field({
  label,
  children,
}: {
  label: string;
  children: ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-2 block text-xs uppercase tracking-widest text-stone-400">
        {label}
      </span>
      {children}
    </label>
  );
}

function FormSection({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <section className="space-y-4 border-t border-white/10 pt-5 first:border-t-0 first:pt-0">
      <h3 className="text-sm font-medium uppercase tracking-widest text-[#d6a85a]">
        {title}
      </h3>
      {children}
    </section>
  );
}

const inputClass =
  "w-full rounded-lg border border-white/15 bg-white/10 px-4 py-3 text-sm text-white placeholder:text-stone-400";

const fileInputClass =
  "w-full rounded-lg border border-white/15 bg-white/10 px-4 py-3 text-sm text-stone-200 file:mr-4 file:rounded-md file:border-0 file:bg-[#d6a85a] file:px-3 file:py-2 file:text-sm file:font-medium file:text-[#1a1f2e]";

function textValue(...values: Array<string | undefined>) {
  return values.find((value) => value && value.trim()) || "";
}

export default function MapPlaceForm({
  action,
  place,
  submitLabel = "Add Map Place",
}: MapPlaceFormProps) {
  const resolvedCategory = place ? mapCategoryForPlace(place, "en") : null;
  const initialPreset =
    place?.categoryPreset ||
    (resolvedCategory?.id.startsWith("custom-") ? "custom" : resolvedCategory?.id) ||
    "restaurant";
  const [categoryPreset, setCategoryPreset] = useState(initialPreset);
  const [latitude, setLatitude] = useState(
    typeof place?.latitude === "number" ? String(place.latitude) : "",
  );
  const [longitude, setLongitude] = useState(
    typeof place?.longitude === "number" ? String(place.longitude) : "",
  );
  const [locationMessage, setLocationMessage] = useState("");
  const isCustom = categoryPreset === "custom";
  const imageUrl = place?.image?.asset?.url;

  function useDeviceLocation() {
    if (!navigator.geolocation) {
      setLocationMessage("Location is not available in this browser.");
      return;
    }

    setLocationMessage("Getting location...");
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLatitude(position.coords.latitude.toFixed(6));
        setLongitude(position.coords.longitude.toFixed(6));
        setLocationMessage("Location added.");
      },
      () => setLocationMessage("Could not get location."),
      { enableHighAccuracy: true, timeout: 10000 },
    );
  }

  return (
    <form action={action} className="space-y-6 rounded-2xl border border-white/10 bg-white/10 p-5 md:p-6">
      {place?._key ? <input type="hidden" name="placeKey" value={place._key} /> : null}

      <FormSection title="Basic details">
        <div className="grid gap-4 md:grid-cols-3">
          <Field label="English / default name">
            <input
              name="name_en"
              required
              className={inputClass}
              placeholder="Place name"
              defaultValue={textValue(place?.name_en, place?.name)}
            />
          </Field>
          <Field label="Portuguese name">
            <input
              name="name_pt"
              className={inputClass}
              placeholder="Nome em português"
              defaultValue={place?.name_pt || ""}
            />
          </Field>
          <Field label="Dutch name">
            <input
              name="name_nl"
              className={inputClass}
              placeholder="Nederlandse naam"
              defaultValue={place?.name_nl || ""}
            />
          </Field>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <Field label="Neighborhood">
            <input
              name="neighborhood"
              className={inputClass}
              placeholder="Area"
              defaultValue={place?.neighborhood || ""}
            />
          </Field>
          <Field label="Website / Instagram">
            <input
              name="website"
              className={inputClass}
              placeholder="instagram.com/place"
              defaultValue={place?.website || ""}
            />
          </Field>
        </div>
      </FormSection>

      <FormSection title="Category">
        <Field label="Category preset">
          <select
            name="categoryPreset"
            value={categoryPreset}
            onChange={(event) => setCategoryPreset(event.target.value)}
            className={inputClass}
          >
            {mapCategoryPresets.map((category) => (
              <option key={category.id} value={category.id} className="text-stone-900">
                {category.labels.en}
              </option>
            ))}
            <option value="custom" className="text-stone-900">
              Custom category
            </option>
          </select>
        </Field>

        {isCustom ? (
          <div className="grid gap-4 md:grid-cols-2">
            <Field label="Custom key">
              <input
                name="customCategory"
                className={inputClass}
                placeholder="repair shop"
                defaultValue={place?.category || ""}
              />
            </Field>
            <Field label="English label">
              <input
                name="categoryLabel_en"
                className={inputClass}
                placeholder="Repair shop"
                defaultValue={place?.categoryLabel_en || ""}
              />
            </Field>
            <Field label="Portuguese label">
              <input
                name="categoryLabel_pt"
                className={inputClass}
                placeholder="Oficina de conserto"
                defaultValue={place?.categoryLabel_pt || ""}
              />
            </Field>
            <Field label="Dutch label">
              <input
                name="categoryLabel_nl"
                className={inputClass}
                placeholder="Reparatiewinkel"
                defaultValue={place?.categoryLabel_nl || ""}
              />
            </Field>
          </div>
        ) : null}
      </FormSection>

      <FormSection title="Coordinates">
        <div className="grid gap-4 md:grid-cols-[1fr_1fr_auto] md:items-end">
          <Field label="Latitude">
            <input
              name="latitude"
              required
              value={latitude}
              onChange={(event) => setLatitude(event.target.value)}
              className={inputClass}
              inputMode="decimal"
              placeholder="-30.0346"
            />
          </Field>
          <Field label="Longitude">
            <input
              name="longitude"
              required
              value={longitude}
              onChange={(event) => setLongitude(event.target.value)}
              className={inputClass}
              inputMode="decimal"
              placeholder="-51.2177"
            />
          </Field>
          <button
            type="button"
            onClick={useDeviceLocation}
            className="rounded-lg border border-white/15 px-4 py-3 text-sm text-white transition hover:border-[#d6a85a] hover:text-[#d6a85a]"
          >
            Use my location
          </button>
        </div>

        {locationMessage ? (
          <p className="text-sm text-stone-300">{locationMessage}</p>
        ) : null}
      </FormSection>

      <FormSection title="Descriptions">
        <div className="grid gap-4 md:grid-cols-3">
          <Field label="English short description">
            <textarea
              name="detail_en"
              className={inputClass}
              rows={3}
              placeholder="One-line card detail"
              defaultValue={textValue(place?.detail_en, place?.description_en)}
            />
          </Field>
          <Field label="Portuguese short description">
            <textarea
              name="detail_pt"
              className={inputClass}
              rows={3}
              placeholder="Resumo curto"
              defaultValue={place?.detail_pt || ""}
            />
          </Field>
          <Field label="Dutch short description">
            <textarea
              name="detail_nl"
              className={inputClass}
              rows={3}
              placeholder="Korte omschrijving"
              defaultValue={place?.detail_nl || ""}
            />
          </Field>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <Field label="English long description">
            <textarea
              name="description_en"
              className={inputClass}
              rows={5}
              placeholder="Useful context for the public city guide"
              defaultValue={place?.description_en || ""}
            />
          </Field>
          <Field label="Portuguese long description">
            <textarea
              name="description_pt"
              className={inputClass}
              rows={5}
              placeholder="Contexto para o guia público"
              defaultValue={place?.description_pt || ""}
            />
          </Field>
          <Field label="Dutch long description">
            <textarea
              name="description_nl"
              className={inputClass}
              rows={5}
              placeholder="Context voor de publieke stadsgids"
              defaultValue={place?.description_nl || ""}
            />
          </Field>
        </div>
      </FormSection>

      <FormSection title="Photo">
        <div className="grid gap-4 md:grid-cols-[220px_1fr] md:items-start">
          {imageUrl ? (
            <div className="space-y-3">
              <div className="relative aspect-[4/3] overflow-hidden rounded-xl border border-white/10 bg-black/20">
                <Image
                  src={imageUrl}
                  alt={place?.image?.alt || place?.name || "Map place photo"}
                  fill
                  sizes="220px"
                  className="object-cover"
                />
              </div>
              <label className="flex items-center gap-2 text-sm text-stone-300">
                <input type="checkbox" name="removeImage" className="size-4 accent-[#d6a85a]" />
                Remove current photo
              </label>
            </div>
          ) : (
            <div className="rounded-xl border border-dashed border-white/15 p-4 text-sm text-stone-400">
              No photo yet.
            </div>
          )}

          <div className="space-y-4">
            <Field label={imageUrl ? "Replace photo" : "Upload photo"}>
              <input name="image" type="file" accept="image/*" className={fileInputClass} />
            </Field>
            <Field label="Photo alt text">
              <input
                name="imageAlt"
                className={inputClass}
                placeholder="Short description of the photo"
                defaultValue={place?.image?.alt || textValue(place?.name_en, place?.name)}
              />
            </Field>
            <p className="text-sm leading-6 text-stone-400">
              One main image only. Uploading a new image replaces the current photo.
            </p>
          </div>
        </div>
      </FormSection>

      <button
        type="submit"
        className="rounded-lg bg-[#d6a85a] px-5 py-3 text-sm font-medium text-[#1a1f2e] transition hover:bg-white"
      >
        {submitLabel}
      </button>
    </form>
  );
}
