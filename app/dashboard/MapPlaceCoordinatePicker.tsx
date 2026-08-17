"use client";

import "leaflet/dist/leaflet.css";

import L from "leaflet";
import { useCallback, useEffect, useMemo, useRef } from "react";
import { MapContainer, Marker, TileLayer, useMap } from "react-leaflet";

type Coordinates = {
  latitude: number;
  longitude: number;
};

type LeafletDefaultIconPrototype = L.Icon.Default & {
  _getIconUrl?: unknown;
};

delete (L.Icon.Default.prototype as LeafletDefaultIconPrototype)._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

function CenterOnCoordinates({ coordinates }: { coordinates: Coordinates }) {
  const map = useMap();

  useEffect(() => {
    map.panTo([coordinates.latitude, coordinates.longitude]);
  }, [coordinates.latitude, coordinates.longitude, map]);

  return null;
}

function DraggableMarker({
  coordinates,
  onCoordinatesChange,
}: {
  coordinates: Coordinates;
  onCoordinatesChange: (coordinates: Coordinates) => void;
}) {
  const markerRef = useRef<L.Marker | null>(null);

  useEffect(() => {
    markerRef.current?.setLatLng([coordinates.latitude, coordinates.longitude]);
  }, [coordinates.latitude, coordinates.longitude]);

  const eventHandlers = useMemo(
    () => ({
      dragend() {
        const position = markerRef.current?.getLatLng();
        if (!position) return;

        onCoordinatesChange({
          latitude: position.lat,
          longitude: position.lng,
        });
      },
    }),
    [onCoordinatesChange],
  );

  return (
    <Marker
      ref={markerRef}
      draggable
      position={[coordinates.latitude, coordinates.longitude]}
      eventHandlers={eventHandlers}
    />
  );
}

export function validMapPlaceCoordinates(
  latitude: string,
  longitude: string,
): Coordinates | null {
  const parsedLatitude = Number(latitude);
  const parsedLongitude = Number(longitude);

  if (
    !Number.isFinite(parsedLatitude) ||
    !Number.isFinite(parsedLongitude) ||
    parsedLatitude < -90 ||
    parsedLatitude > 90 ||
    parsedLongitude < -180 ||
    parsedLongitude > 180
  ) {
    return null;
  }

  return { latitude: parsedLatitude, longitude: parsedLongitude };
}

export default function MapPlaceCoordinatePicker({
  latitude,
  longitude,
  onCoordinatesChange,
}: {
  latitude: string;
  longitude: string;
  onCoordinatesChange: (coordinates: Coordinates) => void;
}) {
  const coordinates = validMapPlaceCoordinates(latitude, longitude);
  const handleCoordinatesChange = useCallback(
    (nextCoordinates: Coordinates) => onCoordinatesChange(nextCoordinates),
    [onCoordinatesChange],
  );

  if (!coordinates) return null;

  return (
    <div className="overflow-hidden rounded-xl border border-white/15" data-testid="map-place-coordinate-picker">
      <p className="border-b border-white/10 bg-black/10 px-4 py-3 text-sm text-stone-200">
        Drag the marker to fine-tune this place&apos;s location.
      </p>
      <MapContainer
        center={[coordinates.latitude, coordinates.longitude]}
        zoom={16}
        scrollWheelZoom={false}
        className="h-72 w-full touch-pan-y"
      >
        <TileLayer
          attribution="&copy; OpenStreetMap contributors"
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <DraggableMarker
          coordinates={coordinates}
          onCoordinatesChange={handleCoordinatesChange}
        />
        <CenterOnCoordinates coordinates={coordinates} />
      </MapContainer>
    </div>
  );
}
