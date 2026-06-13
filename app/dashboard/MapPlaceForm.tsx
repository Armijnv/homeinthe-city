"use client";

import Image from "next/image";
import {
  useActionState,
  useState,
  type ChangeEvent,
  type FormEvent,
  type ReactNode,
} from "react";
import { useFormStatus } from "react-dom";
import {
  initialMapPlaceActionState,
  type MapPlaceActionState,
} from "@/app/dashboard/map-place-action-state";
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
  action: (
    previousState: MapPlaceActionState,
    formData: FormData,
  ) => Promise<MapPlaceActionState>;
  place?: EditableMapPlace;
  returnPath: string;
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
const maxMapPlaceImageSize = 10 * 1024 * 1024;
const heicImageTypes = new Set([
  "image/heic",
  "image/heif",
  "image/heic-sequence",
  "image/heif-sequence",
]);
const supportedImageExtensions = new Set(["jpg", "jpeg", "png", "webp", "gif"]);

function textValue(...values: Array<string | undefined>) {
  return values.find((value) => value && value.trim()) || "";
}

function fileExtension(filename: string) {
  return filename.split(".").pop()?.toLowerCase() || "";
}

function selectedImageError(file: File) {
  const extension = fileExtension(file.name);
  const type = file.type.toLowerCase();

  if (file.size > maxMapPlaceImageSize) {
    return "Map place photo must be smaller than 10 MB.";
  }

  if (heicImageTypes.has(type) || extension === "heic" || extension === "heif") {
    return "iPhone HEIC/HEIF photos are not accepted yet. Please choose a JPG, PNG, WebP or GIF image.";
  }

  if (type && !type.startsWith("image/")) {
    return "Please choose an image file.";
  }

  if (!type && extension && !supportedImageExtensions.has(extension)) {
    return "Please choose a JPG, PNG, WebP or GIF image.";
  }

  return "";
}

function SubmitButton({ label }: { label: string }) {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className="rounded-lg bg-[#d6a85a] px-5 py-3 text-sm font-medium text-[#1a1f2e] transition hover:bg-white disabled:cursor-wait disabled:opacity-70"
    >
      {pending ? "Saving..." : label}
    </button>
  );
}

export default function MapPlaceForm({
  action,
  place,
  returnPath,
  submitLabel = "Add Map Place",
}: MapPlaceFormProps) {
  const [state, formAction] = useActionState(action, initialMapPlaceActionState);

  return (
    <MapPlaceFormFields
      key={state.submittedAt || place?._key || "new-map-place"}
      place={place}
      returnPath={returnPath}
      submitLabel={submitLabel}
      state={state}
      formAction={formAction}
    />
  );
}

function MapPlaceFormFields({
  place,
  returnPath,
  submitLabel = "Add Map Place",
  state,
  formAction,
}: Omit<MapPlaceFormProps, "action"> & {
  state: MapPlaceActionState;
  formAction: (formData: FormData) => void;
}) {
  const stateValues = state.values || {};
  const resolvedCategory = place ? mapCategoryForPlace(place, "en") : null;
  const initialPreset =
    stateValues.categoryPreset ||
    place?.categoryPreset ||
    (resolvedCategory?.id.startsWith("custom-") ? "custom" : resolvedCategory?.id) ||
    "restaurant";
  const [categoryPreset, setCategoryPreset] = useState(initialPreset);
  const [latitude, setLatitude] = useState(
    stateValues.latitude ||
      (typeof place?.latitude === "number" ? String(place.latitude) : ""),
  );
  const [longitude, setLongitude] = useState(
    stateValues.longitude ||
      (typeof place?.longitude === "number" ? String(place.longitude) : ""),
  );
  const [locationMessage, setLocationMessage] = useState("");
  const [photoError, setPhotoError] = useState("");
  const [selectedImageMeta, setSelectedImageMeta] = useState({
    selected: "",
    name: "",
    type: "",
    size: "",
  });
  const isCustom = categoryPreset === "custom";
  const imageUrl = place?.image?.asset?.url;

  function fieldValue(field: string, fallback = "") {
    return stateValues[field] ?? fallback;
  }

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

  function handleImageChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];

    if (!file) {
      setSelectedImageMeta({ selected: "", name: "", type: "", size: "" });
      setPhotoError("");
      return;
    }

    setSelectedImageMeta({
      selected: "1",
      name: file.name,
      type: file.type,
      size: String(file.size),
    });
    setPhotoError(selectedImageError(file));
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    if (photoError) {
      event.preventDefault();
    }
  }

  return (
    <form
      action={formAction}
      onSubmit={handleSubmit}
      className="space-y-6 rounded-2xl border border-white/10 bg-white/10 p-5 md:p-6"
    >
      {place?._key ? <input type="hidden" name="placeKey" value={place._key} /> : null}
      <input type="hidden" name="returnPath" value={returnPath} />
      <input type="hidden" name="imageSelected" value={selectedImageMeta.selected} />
      <input type="hidden" name="imageName" value={selectedImageMeta.name} />
      <input type="hidden" name="imageType" value={selectedImageMeta.type} />
      <input type="hidden" name="imageSize" value={selectedImageMeta.size} />

      {state.status === "error" && state.message ? (
        <div className="rounded-xl border border-red-300/40 bg-red-950/30 p-4 text-sm leading-6 text-red-100">
          {state.message}
        </div>
      ) : null}

      <FormSection title="Basic details">
        <div className="grid gap-4 md:grid-cols-3">
          <Field label="English / default name">
            <input
              name="name_en"
              required
              className={inputClass}
              placeholder="Place name"
              defaultValue={fieldValue("name_en", textValue(place?.name_en, place?.name))}
            />
          </Field>
          <Field label="Portuguese name">
            <input
              name="name_pt"
              className={inputClass}
              placeholder="Nome em português"
              defaultValue={fieldValue("name_pt", place?.name_pt || "")}
            />
          </Field>
          <Field label="Dutch name">
            <input
              name="name_nl"
              className={inputClass}
              placeholder="Nederlandse naam"
              defaultValue={fieldValue("name_nl", place?.name_nl || "")}
            />
          </Field>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <Field label="Neighborhood">
            <input
              name="neighborhood"
              className={inputClass}
              placeholder="Area"
              defaultValue={fieldValue("neighborhood", place?.neighborhood || "")}
            />
          </Field>
          <Field label="Website / Instagram">
            <input
              name="website"
              className={inputClass}
              placeholder="instagram.com/place"
              defaultValue={fieldValue("website", place?.website || "")}
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
                defaultValue={fieldValue("customCategory", place?.category || "")}
              />
            </Field>
            <Field label="English label">
              <input
                name="categoryLabel_en"
                className={inputClass}
                placeholder="Repair shop"
                defaultValue={fieldValue("categoryLabel_en", place?.categoryLabel_en || "")}
              />
            </Field>
            <Field label="Portuguese label">
              <input
                name="categoryLabel_pt"
                className={inputClass}
                placeholder="Oficina de conserto"
                defaultValue={fieldValue("categoryLabel_pt", place?.categoryLabel_pt || "")}
              />
            </Field>
            <Field label="Dutch label">
              <input
                name="categoryLabel_nl"
                className={inputClass}
                placeholder="Reparatiewinkel"
                defaultValue={fieldValue("categoryLabel_nl", place?.categoryLabel_nl || "")}
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
              defaultValue={fieldValue(
                "detail_en",
                textValue(place?.detail_en, place?.description_en),
              )}
            />
          </Field>
          <Field label="Portuguese short description">
            <textarea
              name="detail_pt"
              className={inputClass}
              rows={3}
              placeholder="Resumo curto"
              defaultValue={fieldValue("detail_pt", place?.detail_pt || "")}
            />
          </Field>
          <Field label="Dutch short description">
            <textarea
              name="detail_nl"
              className={inputClass}
              rows={3}
              placeholder="Korte omschrijving"
              defaultValue={fieldValue("detail_nl", place?.detail_nl || "")}
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
              defaultValue={fieldValue("description_en", place?.description_en || "")}
            />
          </Field>
          <Field label="Portuguese long description">
            <textarea
              name="description_pt"
              className={inputClass}
              rows={5}
              placeholder="Contexto para o guia público"
              defaultValue={fieldValue("description_pt", place?.description_pt || "")}
            />
          </Field>
          <Field label="Dutch long description">
            <textarea
              name="description_nl"
              className={inputClass}
              rows={5}
              placeholder="Context voor de publieke stadsgids"
              defaultValue={fieldValue("description_nl", place?.description_nl || "")}
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
              <input
                name="image"
                type="file"
                accept="image/*,.jpg,.jpeg,.png,.webp,.gif,.heic,.heif"
                className={fileInputClass}
                onChange={handleImageChange}
              />
            </Field>
            {photoError ? (
              <p className="rounded-lg border border-red-300/40 bg-red-950/30 px-3 py-2 text-sm leading-6 text-red-100">
                {photoError}
              </p>
            ) : null}
            <Field label="Photo alt text">
              <input
                name="imageAlt"
                className={inputClass}
                placeholder="Short description of the photo"
                defaultValue={fieldValue(
                  "imageAlt",
                  place?.image?.alt || textValue(place?.name_en, place?.name),
                )}
              />
            </Field>
            <p className="text-sm leading-6 text-stone-400">
              One main image only. JPG, PNG, WebP or GIF, up to 10 MB. Uploading a
              new image replaces the current photo. iPhone HEIC/HEIF photos need to
              be converted before uploading.
            </p>
          </div>
        </div>
      </FormSection>

      <SubmitButton label={submitLabel} />
    </form>
  );
}
