"use client";

import "leaflet/dist/leaflet.css";

import L from "leaflet";
import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";

type Lang = "en" | "pt" | "nl";

type MapPlace = {
  name: string;
  category?: string;
  description_en?: string;
  description_pt?: string;
  description_nl?: string;
  latitude?: number;
  longitude?: number;
  googleMaps?: string;
  website?: string;
  favorite?: boolean;
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
   PORTO ALEGRE MAP
====================================================== */

export default function PortoMap({
  places = [],
  lang,
}: {
  places?: MapPlace[];
  lang: Lang;
}) {
  return (
    <div className="rounded-3xl bg-white p-6">
      <div className="mb-4">
        <h2 className="text-2xl text-stone-800">Porto Alegre map</h2>

        <p className="text-sm text-stone-500">
          Restaurants, museums, coffee and local places around the city.
        </p>
      </div>

      <div className="overflow-hidden rounded-2xl">
        <MapContainer
          center={[-30.0346, -51.2177]}
          zoom={13}
          scrollWheelZoom={false}
          className="h-[500px] w-full"
        >
          <TileLayer
            attribution='&copy; OpenStreetMap contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          {places.map((place) => {
            if (!place.latitude || !place.longitude) return null;

            return (
              <Marker
                key={place.name}
                position={[place.latitude, place.longitude]}
              >
                <Popup>
                  <div className="space-y-2">
                    <div>
                      <h3 className="font-semibold">{place.name}</h3>

                      <p className="text-xs uppercase text-stone-500">
                        {place.category}
                      </p>
                    </div>

                    <p className="text-sm">
                      {place[`description_${lang}`] ||
                        place.description_en}
                    </p>

                    {place.googleMaps && (
                      <a
                        href={place.googleMaps}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-blue-600 underline"
                      >
                        Open in Google Maps
                      </a>
                    )}
                  </div>
                </Popup>
              </Marker>
            );
          })}
        </MapContainer>
      </div>
    </div>
  );
}