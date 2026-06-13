"use client";

import MapPlaceForm, { type EditableMapPlace } from "@/app/dashboard/MapPlaceForm";
import type { MapPlaceActionState } from "@/app/dashboard/map-place-action-state";
import { mapCategoryForPlace } from "@/app/lib/mapCategories";

export type MapPlaceProperty = {
  _id: string;
  title_en?: string;
  title_pt?: string;
  title_nl?: string;
  listingType?: string;
  status?: string;
  mapCoordinates?: {
    lat?: number | null;
    lng?: number | null;
  };
};

type MapPlaceManagementProps = {
  places: EditableMapPlace[];
  properties: MapPlaceProperty[];
  addAction: (
    previousState: MapPlaceActionState,
    formData: FormData,
  ) => Promise<MapPlaceActionState>;
  updateAction: (
    previousState: MapPlaceActionState,
    formData: FormData,
  ) => Promise<MapPlaceActionState>;
  deleteAction: (formData: FormData) => void | Promise<void>;
  returnPath: string;
  successMessage?: string;
};

function hasCoordinatePair(latitude?: number | null, longitude?: number | null) {
  return (
    typeof latitude === "number" &&
    Number.isFinite(latitude) &&
    typeof longitude === "number" &&
    Number.isFinite(longitude)
  );
}

function coordinatesText(latitude?: number | null, longitude?: number | null) {
  return hasCoordinatePair(latitude, longitude) ? `${latitude}, ${longitude}` : "Missing";
}

function propertyTitle(property: MapPlaceProperty) {
  return property.title_en || property.title_pt || property.title_nl || "Untitled listing";
}

function placeTitle(place: EditableMapPlace) {
  return place.name_en || place.name || place.name_pt || place.name_nl || "Untitled place";
}

function DeleteButton() {
  return (
    <button
      type="submit"
      className="rounded-lg border border-red-300/40 px-3 py-2 text-sm text-red-100 transition hover:border-red-200 hover:text-white"
    >
      Delete
    </button>
  );
}

export default function MapPlaceManagement({
  places,
  properties,
  addAction,
  updateAction,
  deleteAction,
  returnPath,
  successMessage,
}: MapPlaceManagementProps) {
  return (
    <div className="space-y-10">
      {successMessage ? (
        <div className="rounded-2xl border border-emerald-300/40 bg-emerald-950/30 p-4 text-sm leading-6 text-emerald-100">
          {successMessage}
        </div>
      ) : null}

      <section>
        <h2 className="mb-5 text-2xl font-light text-white">Add Map Place</h2>
        <MapPlaceForm action={addAction} returnPath={returnPath} />
      </section>

      <section>
        <h2 className="mb-5 text-2xl font-light text-white">Existing map places</h2>
        <div className="overflow-hidden rounded-2xl border border-white/10 bg-white/10">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-white/10 text-left text-sm">
              <thead className="bg-black/10 text-xs uppercase tracking-widest text-stone-400">
                <tr>
                  <th className="px-5 py-4 font-medium">Name</th>
                  <th className="px-5 py-4 font-medium">Category</th>
                  <th className="px-5 py-4 font-medium">Neighborhood</th>
                  <th className="px-5 py-4 font-medium">Coordinates</th>
                  <th className="px-5 py-4 font-medium">Photo</th>
                  <th className="px-5 py-4 font-medium">Edit</th>
                  <th className="px-5 py-4 font-medium">Delete</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/10 text-stone-200">
                {places.map((place, index) => {
                  const category = mapCategoryForPlace(place, "en");
                  const key = place._key || `${place.name}-${index}`;

                  return (
                    <tr key={key}>
                      <td className="px-5 py-4 font-medium text-white">
                        {placeTitle(place)}
                      </td>
                      <td className="px-5 py-4">
                        <div>{category.label}</div>
                        <div className="mt-1 text-xs text-stone-400">
                          {place.categoryPreset && place.categoryPreset !== "custom"
                            ? `Preset: ${place.categoryPreset}`
                            : `Key: ${place.category || "No key"}`}
                        </div>
                      </td>
                      <td className="px-5 py-4">{place.neighborhood || "No area"}</td>
                      <td className="px-5 py-4">
                        {coordinatesText(place.latitude, place.longitude)}
                      </td>
                      <td className="px-5 py-4">
                        {place.image?.asset?.url ? (
                          <span className="text-stone-200">Added</span>
                        ) : (
                          <span className="text-stone-400">None</span>
                        )}
                      </td>
                      <td className="px-5 py-4">
                        <details className="min-w-[280px]">
                          <summary className="cursor-pointer rounded-lg border border-white/15 px-3 py-2 text-sm text-white transition hover:border-[#d6a85a] hover:text-[#d6a85a]">
                            Edit
                          </summary>
                          <div className="mt-4 min-w-[320px]">
                            <MapPlaceForm
                              action={updateAction}
                              place={place}
                              returnPath={returnPath}
                              submitLabel="Save Map Place"
                            />
                          </div>
                        </details>
                      </td>
                      <td className="px-5 py-4">
                        {place._key ? (
                          <form
                            action={deleteAction}
                            onSubmit={(event) => {
                              if (!window.confirm(`Delete ${placeTitle(place)}?`)) {
                                event.preventDefault();
                              }
                            }}
                          >
                            <input type="hidden" name="placeKey" value={place._key} />
                            <input type="hidden" name="returnPath" value={returnPath} />
                            <DeleteButton />
                          </form>
                        ) : (
                          "Missing key"
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <section>
        <h2 className="mb-5 text-2xl font-light text-white">Property listings</h2>
        <div className="overflow-hidden rounded-2xl border border-white/10 bg-white/10">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-white/10 text-left text-sm">
              <thead className="bg-black/10 text-xs uppercase tracking-widest text-stone-400">
                <tr>
                  <th className="px-5 py-4 font-medium">Name</th>
                  <th className="px-5 py-4 font-medium">Type</th>
                  <th className="px-5 py-4 font-medium">Status</th>
                  <th className="px-5 py-4 font-medium">Coordinates</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/10 text-stone-200">
                {properties.map((property) => (
                  <tr key={property._id}>
                    <td className="px-5 py-4 font-medium text-white">
                      {propertyTitle(property)}
                    </td>
                    <td className="px-5 py-4">{property.listingType || "Unknown"}</td>
                    <td className="px-5 py-4">{property.status || "hidden"}</td>
                    <td className="px-5 py-4">
                      {coordinatesText(
                        property.mapCoordinates?.lat,
                        property.mapCoordinates?.lng,
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>
    </div>
  );
}
