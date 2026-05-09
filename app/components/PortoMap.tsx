"use client";

import "leaflet/dist/leaflet.css";

import L from "leaflet";
import Image from "next/image";
import { MapContainer, Marker, TileLayer, useMap } from "react-leaflet";
import { useEffect, useState } from "react";

type Lang = "en" | "pt" | "nl";

type MapPlace = {
  name: string;
  category?: string;
  description_en?: string;
  description_pt?: string;
  description_nl?: string;
  detail_en?: string;
  detail_pt?: string;
  detail_nl?: string;
  latitude?: number;
  longitude?: number;
  googleMaps?: string;
  website?: string;
  favorite?: boolean;
  image?: {
    asset?: {
      url?: string;
    };
  };
};

/* ======================================================
   FIX LEAFLET DEFAULT ICONS
====================================================== */

delete (L.Icon.Default.prototype as any)._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

/* ======================================================
   MAP FLY TO PLACE
====================================================== */

function FlyToPlace({
  latitude,
  longitude,
}: {
  latitude?: number;
  longitude?: number;
}) {
  const map = useMap();

  useEffect(() => {
    if (!latitude || !longitude) return;

    map.flyTo([latitude, longitude], 15, {
      duration: 1.5,
    });
  }, [latitude, longitude, map]);

  return null;
}

/* ======================================================
   PORTO ALEGRE MAP
====================================================== */

export default function PortoMap({
  places = [],
  lang,
}: {
  places?: MapPlace[];
  lang: Lang;
}) {
  const [activeCategory, setActiveCategory] = useState("restaurant");
  const [selectedPlace, setSelectedPlace] = useState<MapPlace | null>(null);

  const categories = [
    { id: "restaurant", label: "Restaurants" },
    { id: "coffee", label: "Cafés" },
    { id: "museum", label: "Museums" },
    { id: "liveMusic", label: "Music" },
    { id: "business", label: "Business" },
    { id: "walk", label: "Walks" },
  ];

  const visiblePlaces = places
    .filter((place) => place.category === activeCategory)
    .slice(0, 5);

  return (
    <div className="relative z-0 rounded-3xl bg-white p-5 md:p-6">
      <div className="mb-5">
        <h2 className="text-2xl text-stone-800">Porto Alegre map</h2>

        <p className="text-sm text-stone-500">
          Choose a category, see five local picks, then use the map for the
          exact place.
        </p>
      </div>

      {/* ======================================================
          CATEGORY BUTTONS
      ====================================================== */}

      <div className="mb-5 flex gap-2 overflow-x-auto pb-1 md:flex-wrap md:overflow-visible">
        {categories.map((category) => (
          <button
            key={category.id}
            onClick={() => {
              setActiveCategory(category.id);
              setSelectedPlace(null);
            }}
            className={`shrink-0 rounded-full px-4 py-2 text-sm transition ${
              activeCategory === category.id
                ? "bg-[#1a1f2e] text-white"
                : "border border-stone-300 text-stone-700 hover:bg-stone-100"
            }`}
          >
            {category.label}
          </button>
        ))}
      </div>

      {/* ======================================================
          ACTIVE CATEGORY CARDS
      ====================================================== */}

      <div className="mb-5 grid gap-4 md:grid-cols-2">
        {visiblePlaces.map((place) => (
          <button
            key={place.name}
            onClick={() => setSelectedPlace(place)}
            className={`overflow-hidden rounded-2xl border text-left transition ${
              selectedPlace?.name === place.name
                ? "border-[#1a1f2e] bg-stone-100 shadow-md"
                : "border-stone-200 bg-white hover:bg-stone-50 hover:shadow-sm"
            }`}
          >
            {place.image?.asset?.url && (
              <div className="relative h-36 w-full bg-stone-100">
                <Image
                  src={place.image.asset.url}
                  alt={place.name}
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="object-cover"
                />
              </div>
            )}

            <div className="p-4">
              <div className="mb-1 flex flex-wrap items-center gap-2">
                <h3 className="font-medium text-stone-800">{place.name}</h3>

                {place.favorite && (
                  <span className="rounded-full bg-[#1a1f2e] px-3 py-1 text-xs text-white">
                    my pick
                  </span>
                )}
              </div>

              {(place[`detail_${lang}`] || place.detail_en) && (
                <p className="mb-1 text-xs uppercase tracking-widest text-stone-400">
                  {place[`detail_${lang}`] || place.detail_en}
                </p>
              )}

              <p className="line-clamp-2 text-sm text-stone-500">
                {place[`description_${lang}`] || place.description_en}
              </p>
            </div>
          </button>
        ))}
      </div>

      {/* ======================================================
          MAP
      ====================================================== */}

      <div className="relative z-0 overflow-hidden rounded-2xl">
        <MapContainer
          center={[-30.0346, -51.2177]}
          zoom={13}
          scrollWheelZoom={false}
          className="z-0 h-[420px] w-full md:h-[500px]"
        >
          <TileLayer
            attribution='&copy; OpenStreetMap contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          {visiblePlaces.map((place) => {
            if (!place.latitude || !place.longitude) return null;

            return (
              <Marker
                key={place.name}
                position={[place.latitude, place.longitude]}
                eventHandlers={{
                  click: () => setSelectedPlace(place),
                }}
              />
            );
          })}

          {selectedPlace && (
            <FlyToPlace
              latitude={selectedPlace.latitude}
              longitude={selectedPlace.longitude}
            />
          )}
        </MapContainer>
      </div>

      {/* ======================================================
          SELECTED PLACE INFO CARD
      ====================================================== */}

      {selectedPlace && (
        <div className="mt-4 overflow-hidden rounded-2xl border border-stone-200 bg-stone-50">
          {selectedPlace.image?.asset?.url && (
            <div className="relative h-44 w-full bg-stone-100">
              <Image
                src={selectedPlace.image.asset.url}
                alt={selectedPlace.name}
                fill
                sizes="100vw"
                className="object-cover"
              />
            </div>
          )}

          <div className="p-4">
            <div className="mb-2">
              <h3 className="text-lg font-semibold text-stone-800">
                {selectedPlace.name}
              </h3>

              <p className="text-xs uppercase tracking-widest text-stone-400">
                {selectedPlace.category}
              </p>
            </div>

            <p className="mb-4 text-sm text-stone-600">
              {selectedPlace[`description_${lang}`] ||
                selectedPlace.description_en}
            </p>

            <div className="flex flex-wrap gap-3">
              {selectedPlace.googleMaps && (
                <a
                  href={selectedPlace.googleMaps}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-full bg-[#1a1f2e] px-4 py-2 text-sm text-white hover:bg-stone-800"
                >
                  Google Maps
                </a>
              )}

              {selectedPlace.website && (
                <a
                  href={selectedPlace.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-full border border-stone-300 px-4 py-2 text-sm text-stone-700 hover:bg-stone-100"
                >
                  Website
                </a>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}