"use client";

import { useState, type ReactNode } from "react";
import { mapCategoryPresets } from "@/app/lib/mapCategories";

type MapPlaceFormProps = {
  action: (formData: FormData) => void | Promise<void>;
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

export default function MapPlaceForm({ action }: MapPlaceFormProps) {
  const [categoryPreset, setCategoryPreset] = useState("restaurant");
  const [latitude, setLatitude] = useState("");
  const [longitude, setLongitude] = useState("");
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
      <div className="grid gap-4 md:grid-cols-2">
        <Field label="Name">
          <input name="name" required className={inputClass} placeholder="Place name" />
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
            />
          </Field>
          <Field label="English label">
            <input
              name="categoryLabel_en"
              className={inputClass}
              placeholder="Repair shop"
            />
          </Field>
          <Field label="Portuguese label">
            <input
              name="categoryLabel_pt"
              className={inputClass}
              placeholder="Oficina de conserto"
            />
          </Field>
          <Field label="Dutch label">
            <input
              name="categoryLabel_nl"
              className={inputClass}
              placeholder="Reparatiewinkel"
            />
          </Field>
        </div>
      ) : null}

      <div className="grid gap-4 md:grid-cols-2">
        <Field label="Neighborhood">
          <input name="neighborhood" className={inputClass} placeholder="Area" />
        </Field>
        <Field label="Website / Instagram">
          <input name="website" className={inputClass} placeholder="instagram.com/place" />
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
        />
      </Field>

      <button
        type="submit"
        className="rounded-lg bg-[#d6a85a] px-5 py-3 text-sm font-medium text-[#1a1f2e] transition hover:bg-white"
      >
        Add Map Place
      </button>
    </form>
  );
}
