"use client";

import { useState, type ChangeEventHandler } from "react";
import type { DashboardPropertyListing } from "@/app/lib/propertyDashboard";
import {
  prepareDashboardImageInput,
  selectedDashboardImageError,
} from "@/app/lib/dashboardImageSelection";

type Option = { _id: string; name: string };

const inputClass =
  "min-h-11 w-full rounded-lg border border-white/15 bg-white/10 px-3 py-2.5 text-sm text-white outline-none transition placeholder:text-stone-500 focus:border-[#d6a85a]";
const labelClass = "mb-1.5 block text-xs font-medium uppercase tracking-widest text-stone-400";

const amenityGroups = [
  {
    name: "building-amenities",
    title: "Building",
    values: ["elevator", "security24h", "concierge", "gym", "pool", "partyRoom", "coworkingSpace"],
  },
  {
    name: "apartment-amenities",
    title: "Apartment",
    values: [
      "airConditioning",
      "highSpeedInternet",
      "balcony",
      "bbq",
      "washer",
      "dryer",
      "dishwasher",
      "homeOffice",
      "smartTv",
      "fullyEquippedKitchen",
    ],
  },
  {
    name: "parking-amenities",
    title: "Parking",
    values: ["parkingSpace", "coveredParking", "visitorParking"],
  },
  {
    name: "lifestyle-amenities",
    title: "Lifestyle",
    values: [
      "parkView",
      "cityView",
      "petFriendly",
      "familyFriendly",
      "quietStreet",
      "walkableNeighborhood",
    ],
  },
] as const;

function Section({
  title,
  description,
  children,
}: {
  title: string;
  description?: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-xl border border-white/10 bg-white/5 p-4 sm:p-5">
      <div className="mb-4">
        <h2 className="text-lg font-medium text-white">{title}</h2>
        {description ? <p className="mt-1 text-sm text-stone-400">{description}</p> : null}
      </div>
      {children}
    </section>
  );
}

function Field({
  label,
  name,
  defaultValue,
  type = "text",
  required,
  multiple,
  accept,
  onChange,
}: {
  label: string;
  name: string;
  defaultValue?: string | number;
  type?: string;
  required?: boolean;
  multiple?: boolean;
  accept?: string;
  onChange?: ChangeEventHandler<HTMLInputElement>;
}) {
  return (
    <label className="block">
      <span className={labelClass}>{label}</span>
      <input
        className={inputClass}
        name={name}
        type={type}
        defaultValue={defaultValue}
        required={required}
        multiple={multiple}
        accept={accept}
        onChange={onChange}
        data-dashboard-image={type === "file" ? true : undefined}
      />
    </label>
  );
}

function TextArea({
  label,
  name,
  defaultValue,
  rows = 4,
  hint,
}: {
  label: string;
  name: string;
  defaultValue?: string;
  rows?: number;
  hint?: string;
}) {
  return (
    <label className="block">
      <span className={labelClass}>{label}</span>
      <textarea
        className={`${inputClass} resize-y`}
        name={name}
        defaultValue={defaultValue}
        rows={rows}
      />
      {hint ? <span className="mt-1 block text-xs text-stone-500">{hint}</span> : null}
    </label>
  );
}

function Check({
  name,
  label,
  defaultChecked,
  value,
}: {
  name: string;
  label: string;
  defaultChecked?: boolean;
  value?: string;
}) {
  return (
    <label className="flex min-h-11 items-center gap-3 rounded-lg border border-white/10 px-3 py-2 text-sm text-stone-200">
      <input
        type="checkbox"
        name={name}
        value={value}
        defaultChecked={defaultChecked}
        className="h-4 w-4 accent-[#d6a85a]"
      />
      {label}
    </label>
  );
}

function value(property: DashboardPropertyListing | undefined, key: keyof DashboardPropertyListing) {
  const entry = property?.[key];
  return typeof entry === "string" || typeof entry === "number" ? entry : undefined;
}

function list(property: DashboardPropertyListing | undefined, key: keyof DashboardPropertyListing) {
  const entry = property?.[key];
  return Array.isArray(entry) ? entry.filter((item): item is string => typeof item === "string") : [];
}

function optionLabel(value: string) {
  return value
    .replace(/([a-z])([A-Z])/g, "$1 $2")
    .replace(/^./, (letter) => letter.toUpperCase());
}

export function PropertyListingForm({
  action,
  property,
  cities,
  realtors,
  isAdmin,
}: {
  action: (formData: FormData) => void | Promise<void>;
  property?: DashboardPropertyListing;
  cities: Option[];
  realtors: Option[];
  isAdmin: boolean;
}) {
  const [imageError, setImageError] = useState("");
  const prepareImageSelection: ChangeEventHandler<HTMLInputElement> = async (event) => {
    const input = event.currentTarget;
    const label = input.name === "gallery-images" ? "Gallery image" : "Main image";
    const { files, error: preparationError } = await prepareDashboardImageInput(input, label);
    const error = preparationError || files.map((file) => selectedDashboardImageError(file, label)).find(Boolean) || "";
    input.setCustomValidity(error);
    setImageError(error);
  };

  return (
    <form action={action} encType="multipart/form-data" className="space-y-4">
      <Section title="Basics" description="The English title creates the URL for a new listing.">
        <div className="grid gap-4 md:grid-cols-3">
          <Field label="English title" name="title-en" defaultValue={property?.title_en} required />
          <Field label="Portuguese title" name="title-pt" defaultValue={property?.title_pt} />
          <Field label="Dutch title" name="title-nl" defaultValue={property?.title_nl} />
          <label className="block">
            <span className={labelClass}>Listing type</span>
            <select className={inputClass} name="listing-type" defaultValue={property?.listingType || "rent"}>
              <option className="text-black" value="rent">Rent</option>
              <option className="text-black" value="sale">Sale</option>
            </select>
          </label>
          <Field label="Neighborhood" name="neighborhood" defaultValue={property?.neighborhood} />
        </div>
      </Section>

      <Section title="City and address">
        <div className="grid gap-4 md:grid-cols-2">
          <label className="block">
            <span className={labelClass}>City</span>
            <select className={inputClass} name="city" defaultValue={property?.city?._ref || ""} required>
              <option className="text-black" value="">Choose city</option>
              {cities.map((city) => (
                <option key={city._id} value={city._id} className="text-black">{city.name}</option>
              ))}
            </select>
          </label>
          <label className="block">
            <span className={labelClass}>Address visibility</span>
            <select className={inputClass} name="address-visibility" defaultValue={property?.addressVisibility || "neighborhood"}>
              <option className="text-black" value="hidden">Hidden</option>
              <option className="text-black" value="neighborhood">Neighborhood only</option>
              <option className="text-black" value="full">Full address</option>
            </select>
          </label>
          <div className="md:col-span-2">
            <Field label="Address" name="address" defaultValue={property?.address} />
          </div>
          <Field label="Latitude" name="latitude" type="number" defaultValue={property?.mapCoordinates?.lat} />
          <Field label="Longitude" name="longitude" type="number" defaultValue={property?.mapCoordinates?.lng} />
        </div>
      </Section>

      <Section title="Price and property details">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Field label="Price" name="price" type="number" defaultValue={property?.price} />
          <label className="block">
            <span className={labelClass}>Currency</span>
            <select className={inputClass} name="currency" defaultValue={property?.currency || "BRL"}>
              {['BRL', 'EUR', 'USD'].map((currency) => <option className="text-black" key={currency}>{currency}</option>)}
            </select>
          </label>
          <Field label="Condo fee" name="monthly-condo-fee" type="number" defaultValue={property?.monthlyCondoFee} />
          <Field label="Property tax" name="property-tax" type="number" defaultValue={property?.propertyTax} />
          <Field label="Bedrooms" name="bedrooms" type="number" defaultValue={property?.bedrooms} />
          <Field label="Bathrooms" name="bathrooms" type="number" defaultValue={property?.bathrooms} />
          <Field label="Parking spaces" name="parking-spaces" type="number" defaultValue={property?.parkingSpaces} />
          <Field label="Area (m²)" name="area-m2" type="number" defaultValue={property?.areaM2} />
          <Field label="Floor" name="floor" type="number" defaultValue={property?.floor} />
          <Field label="Minimum stay" name="minimum-stay" defaultValue={property?.minimumStay} />
          <Field label="Maximum guests" name="maximum-guests" type="number" defaultValue={property?.maximumGuests} />
          <Field label="Available from" name="available-from" type="date" defaultValue={property?.availableFrom} />
          <Field label="Year built" name="year-built" type="number" defaultValue={property?.yearBuilt} />
          <label className="block">
            <span className={labelClass}>Occupancy</span>
            <select className={inputClass} name="occupancy-status" defaultValue={property?.occupancyStatus || ""}>
              <option className="text-black" value="">Not specified</option>
              <option className="text-black" value="vacant">Vacant</option>
              <option className="text-black" value="occupied">Occupied</option>
            </select>
          </label>
        </div>
        <div className="mt-4 grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
          <Check name="furnished" label="Furnished" defaultChecked={property?.furnished} />
          <Check name="utilities-included" label="Utilities included" defaultChecked={property?.utilitiesIncluded} />
          <Check name="internet-included" label="Internet included" defaultChecked={property?.internetIncluded} />
          <Check name="cleaning-included" label="Cleaning included" defaultChecked={property?.cleaningIncluded} />
          <Check name="pets-allowed" label="Pets allowed" defaultChecked={property?.petsAllowed} />
          <Check name="financing-possible" label="Financing possible" defaultChecked={property?.financingPossible} />
        </div>
      </Section>

      <Section title="Description" description="Use the languages that are ready; untranslated fields may stay empty.">
        <div className="grid gap-4 lg:grid-cols-3">
          {(["en", "pt", "nl"] as const).map((language) => (
            <div key={language} className="space-y-4">
              <TextArea label={`${language.toUpperCase()} short description`} name={`short-description-${language}`} defaultValue={property?.[`shortDescription_${language}`]} />
              <TextArea label={`${language.toUpperCase()} full description`} name={`long-description-${language}`} defaultValue={property?.[`longDescription_${language}`]} rows={8} />
              <TextArea label={`${language.toUpperCase()} features`} name={`features-${language}`} defaultValue={list(property, `features_${language}`).join("\n")} hint="One feature per line" />
              <TextArea label={`${language.toUpperCase()} neighborhood`} name={`neighborhood-description-${language}`} defaultValue={property?.[`neighborhoodDescription_${language}`]} />
              <TextArea label={`${language.toUpperCase()} nearby highlights`} name={`nearby-highlights-${language}`} defaultValue={list(property, `nearbyHighlights_${language}`).join("\n")} hint="One highlight per line" />
            </div>
          ))}
        </div>
      </Section>

      <Section title="Amenities and features">
        <div className="grid gap-5 md:grid-cols-2">
          {amenityGroups.map((group) => {
            const selected = new Set(list(property, group.name.replace(/-([a-z])/g, (_, letter) => letter.toUpperCase()) as keyof DashboardPropertyListing));
            return (
              <div key={group.name}>
                <h3 className="mb-2 text-sm font-medium text-white">{group.title}</h3>
                <div className="grid gap-2 sm:grid-cols-2">
                  {group.values.map((item) => (
                    <Check key={item} name={group.name} value={item} label={optionLabel(item)} defaultChecked={selected.has(item)} />
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </Section>

      <Section title="Images" description="Images are prepared automatically for a fast web upload.">
        <div className="grid gap-4 md:grid-cols-2">
          <Field label="Main image" name="main-image" type="file" accept="image/jpeg,image/png,image/webp,image/gif,image/heic,image/heif" onChange={prepareImageSelection} />
          <Field label="Main image alt text" name="main-image-alt" defaultValue={property?.mainImage?.alt} />
          <Field label="Add gallery images" name="gallery-images" type="file" multiple accept="image/jpeg,image/png,image/webp,image/gif,image/heic,image/heif" onChange={prepareImageSelection} />
          <Field label="Gallery alt text" name="gallery-alt" />
        </div>
        {imageError ? <p className="mt-3 text-sm text-red-200">{imageError}</p> : null}
        {property?.gallery?.length ? (
          <div className="mt-4">
            <p className="mb-2 text-xs uppercase tracking-widest text-stone-400">Existing gallery</p>
            <div className="grid gap-2 sm:grid-cols-2">
              {property.gallery.map((image, index) =>
                image._key ? (
                  <Check
                    key={image._key}
                    name="keep-gallery"
                    value={image._key}
                    defaultChecked
                    label={`Keep ${image.alt || `image ${index + 1}`}`}
                  />
                ) : (
                  <p key={`gallery-${index}`} className="rounded-lg border border-white/10 px-3 py-2 text-sm text-stone-400">
                    {image.alt || `Image ${index + 1}`} will be kept
                  </p>
                ),
              )}
            </div>
          </div>
        ) : null}
      </Section>

      <Section title="Contact">
        <div className="grid gap-4 md:grid-cols-2">
          <Field label="WhatsApp link" name="contact-whatsapp" type="url" defaultValue={property?.contact?.whatsapp} />
          <Field label="Contact email" name="contact-email" type="email" defaultValue={property?.contact?.email} />
          <div className="md:col-span-2">
            <Field label="Video tour URL" name="video-url" type="url" defaultValue={property?.videoUrl} />
          </div>
        </div>
      </Section>

      <Section title="Search preview">
        <div className="grid gap-4 lg:grid-cols-3">
          {(["en", "pt", "nl"] as const).map((language) => (
            <div key={language} className="space-y-4">
              <Field label={`${language.toUpperCase()} SEO title`} name={`seo-title-${language}`} defaultValue={value(property, `seoTitle_${language}`)} />
              <TextArea label={`${language.toUpperCase()} SEO description`} name={`seo-description-${language}`} defaultValue={property?.[`seoDescription_${language}`]} />
            </div>
          ))}
        </div>
      </Section>

      <Section title="Publication" description={isAdmin ? "Administrators control availability and listing ownership." : "New listings start unavailable. An administrator publishes them after review."}>
        {isAdmin ? (
          <div className="grid gap-4 md:grid-cols-2">
            <label className="block">
              <span className={labelClass}>Status</span>
              <select className={inputClass} name="status" defaultValue={property?.status || "hidden"}>
                {['hidden', 'available', 'reserved', 'sold', 'rented', 'archived'].map((status) => <option className="text-black" key={status} value={status}>{optionLabel(status)}</option>)}
              </select>
            </label>
            <label className="block">
              <span className={labelClass}>Assigned realtor / listing owner</span>
              <select className={inputClass} name="linked-realtor" defaultValue={property?.linkedRealtor?._ref || ""}>
                <option className="text-black" value="">No Provider</option>
                {realtors.map((realtor) => <option className="text-black" key={realtor._id} value={realtor._id}>{realtor.name}</option>)}
              </select>
            </label>
          </div>
        ) : (
          <p className="text-sm text-stone-300">Current status: <span className="font-medium text-white">{property?.status || "Hidden until administrator review"}</span></p>
        )}
      </Section>

      <button type="submit" className="min-h-11 w-full rounded-lg bg-[#d6a85a] px-5 py-3 text-sm font-semibold text-[#1a1f2e] transition hover:bg-[#e5bd74] sm:w-auto">
        {property ? "Save property" : "Create property"}
      </button>
    </form>
  );
}
