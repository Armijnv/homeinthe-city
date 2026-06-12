"use client";

import { useState, type ReactNode } from "react";
import { mapCategoryForPlace, mapCategoryPresets } from "@/app/lib/mapCategories";

export type EditableMapPlace = {
  _key?: string;
  name?: string;
  categoryPreset?: string;
  category?: string;
  categoryLabel_en?: string;
  categoryLabel_pt?: string;
  categoryLabel_nl?: string;
  neighborhood?: string;
  latitude?: number | null;
  longitude?: number | null;
  detail_en?: string;
  description_en?: string;
  website?: string;
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

const inputClass =
  "w-full rounded-lg border border-white/15 bg-white/10 px-4 py-3 text-sm text-white placeholder:text-stone-400";

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
    <form action={action} className="space-y-4 rounded-2xl border border-white/10 bg-white/10 p-6">
      {place?._key ? <input type="hidden" name="placeKey" value={place._key} /> : null}

      <div className="grid gap-4 md:grid-cols-2">
        <Field label="Name">
          <input
            name="name"
            required
            className={inputClass}
            placeholder="Place name"
            defaultValue={place?.name || ""}
          />
        </Field>

        <Field label="Category">
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
      </div>

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

      <Field label="Short description">
        <textarea
          name="detail"
          className={inputClass}
          rows={3}
          placeholder="Why this place should be on the guide"
          defaultValue={place?.detail_en || place?.description_en || ""}
        />
      </Field>

      <button
        type="submit"
        className="rounded-lg bg-[#d6a85a] px-5 py-3 text-sm font-medium text-[#1a1f2e] transition hover:bg-white"
      >
        {submitLabel}
      </button>
    </form>
  );
}
