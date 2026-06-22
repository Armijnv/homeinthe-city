"use client";

import "leaflet/dist/leaflet.css";

import L from "leaflet";
import Image from "next/image";
import Link from "next/link";
import { MapContainer, Marker, Popup, TileLayer, useMap } from "react-leaflet";
import { useEffect, useMemo, useRef, useState } from "react";

type Lang = "en" | "pt" | "nl";

export type CityMapEntry = {
  id: string;
  sourceType: "place" | "property";
  categoryId: string;
  categoryLabel: string;
  title: string;
  subtitle?: string;
  detail?: string;
  description?: string;
  latitude: number;
  longitude: number;
  googleMaps?: string;
  website?: string;
  href?: string;
  actionLabel?: string;
  favorite?: boolean;
  badge?: string;
  image?: {
    url?: string;
    alt?: string;
  };
  videoUrl?: string;
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

function FlyToEntry({ latitude, longitude }: { latitude?: number; longitude?: number }) {
  const map = useMap();

  useEffect(() => {
    if (typeof latitude !== "number" || typeof longitude !== "number") return;
    map.flyTo([latitude, longitude], 15, { duration: 1.5 });
  }, [latitude, longitude, map]);

  return null;
}

function isInternalHref(href: string) {
  return href.startsWith("/");
}

function ActionLink({
  href,
  label,
  primary = false,
}: {
  href: string;
  label: string;
  primary?: boolean;
}) {
  const className = primary
    ? "rounded-full bg-[#1a1f2e] px-4 py-2 text-sm text-white hover:bg-stone-800"
    : "rounded-full border border-stone-300 px-4 py-2 text-sm text-stone-700 hover:bg-stone-100";

  if (isInternalHref(href)) {
    return (
      <Link href={href} className={className}>
        {label}
      </Link>
    );
  }

  return (
    <a href={href} target="_blank" rel="noopener noreferrer" className={className}>
      {label}
    </a>
  );
}

export default function CityMap({
  entries,
  lang,
  cityName = "City",
  cityCenter,
}: {
  entries: CityMapEntry[];
  lang: Lang;
  cityName?: string;
  cityCenter?: {
    latitude?: number;
    longitude?: number;
  };
}) {
  const categories = useMemo(() => {
    const grouped = new Map<string, { id: string; label: string; entries: CityMapEntry[] }>();

    entries.forEach((entry) => {
      const current = grouped.get(entry.categoryId);

      if (current) {
        current.entries.push(entry);
        return;
      }

      grouped.set(entry.categoryId, {
        id: entry.categoryId,
        label: entry.categoryLabel,
        entries: [entry],
      });
    });

    return Array.from(grouped.values());
  }, [entries]);
  const [activeCategory, setActiveCategory] = useState(categories[0]?.id || "");
  const [selectedEntry, setSelectedEntry] = useState<CityMapEntry | null>(null);
  const mapSectionRef = useRef<HTMLDivElement | null>(null);
  const handledHashRef = useRef("");
  const activeGroup =
    categories.find((category) => category.id === activeCategory) || categories[0];
  const visibleEntries = activeGroup?.entries || [];
  const mapCenter = visibleEntries[0] || entries[0];
  const centerLatitude = mapCenter?.latitude ?? cityCenter?.latitude ?? 0;
  const centerLongitude = mapCenter?.longitude ?? cityCenter?.longitude ?? 0;

  useEffect(() => {
    function selectHashEntry() {
      const hashId = decodeURIComponent(window.location.hash.slice(1));
      if (!hashId) return;
      if (handledHashRef.current === hashId) return;

      const entry = entries.find((candidate) => candidate.id === hashId);
      if (!entry) {
        handledHashRef.current = "";
        return;
      }

      handledHashRef.current = hashId;
      setActiveCategory(entry.categoryId);
      setSelectedEntry(entry);
      window.setTimeout(() => {
        document.getElementById(entry.id)?.scrollIntoView({
          behavior: "smooth",
          block: "center",
        });
      }, 120);
    }

    selectHashEntry();
    window.addEventListener("hashchange", selectHashEntry);
    return () => window.removeEventListener("hashchange", selectHashEntry);
  }, [entries]);

  function selectEntry(entry: CityMapEntry, shouldScroll = true) {
    setSelectedEntry(entry);
    if (!shouldScroll) return;
    window.setTimeout(() => {
      mapSectionRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 80);
  }

  const mapText = {
    en: "Choose a category, explore local places, then open the preview below the map.",
    pt: "Escolha uma categoria, explore lugares locais e abra a prévia abaixo do mapa.",
    nl: "Kies een categorie, verken lokale plekken en open daarna de preview onder de kaart.",
  };

  const favoriteLabel = {
    en: "my pick",
    pt: "minha escolha",
    nl: "mijn tip",
  };

  if (!categories.length) return null;

  return (
    <div className="relative z-0 rounded-3xl bg-white p-5 md:p-6">
      <div className="mb-5">
        <h2 className="text-2xl text-stone-800">{cityName} map</h2>
        <p className="text-sm text-stone-500">{mapText[lang]}</p>
      </div>

      <div className="mb-5 flex flex-col gap-3 md:flex-row md:flex-wrap">
        <select
          value={activeGroup?.id || ""}
          onChange={(event) => {
            setActiveCategory(event.target.value);
            setSelectedEntry(null);
          }}
          className="rounded-full border border-stone-300 bg-white px-4 py-2 text-sm text-stone-700 md:hidden"
        >
          {categories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.label}
            </option>
          ))}
        </select>

        {categories.map((category) => (
          <button
            key={category.id}
            onClick={() => {
              setActiveCategory(category.id);
              setSelectedEntry(null);
            }}
            className={`hidden shrink-0 rounded-full px-4 py-2 text-sm transition md:inline-block ${
              activeGroup?.id === category.id
                ? "bg-[#1a1f2e] text-white"
                : "border border-stone-300 text-stone-700 hover:bg-stone-100"
            }`}
          >
            {category.label}
          </button>
        ))}
      </div>

      <div className="mb-5 grid gap-4 md:grid-cols-2">
        {visibleEntries.map((entry) => (
          <button
            key={entry.id}
            id={entry.sourceType === "place" ? entry.id : undefined}
            onClick={() => selectEntry(entry)}
            className={`scroll-mt-28 rounded-2xl border p-4 text-left transition ${
              selectedEntry?.id === entry.id
                ? "border-[#1a1f2e] bg-stone-100 shadow-md"
                : "border-stone-200 bg-white hover:bg-stone-50 hover:shadow-sm"
            }`}
          >
            <div className="mb-2 flex items-start justify-between gap-2">
              <h3 className="font-medium text-stone-800">
                {entry.title}
                {entry.subtitle && (
                  <span className="font-normal text-stone-400"> · {entry.subtitle}</span>
                )}
              </h3>

              {(entry.badge || entry.favorite) && (
                <span className="shrink-0 rounded-full bg-[#1a1f2e] px-3 py-1 text-xs text-white">
                  {entry.badge || favoriteLabel[lang]}
                </span>
              )}
            </div>

            {entry.detail && (
              <p className="text-xs uppercase tracking-widest text-stone-400">
                {entry.detail}
              </p>
            )}
          </button>
        ))}
      </div>

      <div ref={mapSectionRef} className="relative z-0 scroll-mt-28 overflow-hidden rounded-2xl">
        <MapContainer
          center={[centerLatitude, centerLongitude]}
          zoom={13}
          scrollWheelZoom={false}
          className="z-0 h-[420px] w-full md:h-[500px]"
        >
          <TileLayer
            attribution="&copy; OpenStreetMap contributors"
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          {visibleEntries.map((entry) => (
            <Marker
              key={entry.id}
              position={[entry.latitude, entry.longitude]}
              eventHandlers={{ click: () => selectEntry(entry, false) }}
            >
              <Popup>
                <div className="min-w-[150px]">
                  <p className="font-medium text-stone-900">{entry.title}</p>
                  {entry.subtitle && <p className="text-xs text-stone-500">{entry.subtitle}</p>}
                  {entry.href && (
                    <Link href={entry.href} className="mt-2 inline-block text-xs text-stone-900 underline">
                      {entry.actionLabel}
                    </Link>
                  )}
                </div>
              </Popup>
            </Marker>
          ))}

          {selectedEntry && (
            <FlyToEntry latitude={selectedEntry.latitude} longitude={selectedEntry.longitude} />
          )}
        </MapContainer>
      </div>

      {selectedEntry && (
        <div className="mt-4 overflow-hidden rounded-2xl border border-stone-200 bg-stone-50 shadow-sm">
          <div className="grid gap-0 md:grid-cols-[1fr_240px] lg:grid-cols-[1fr_280px]">
            <div className="p-4 md:p-6">
              <div className="mb-3">
                <h3 className="text-xl font-semibold text-stone-800">
                  {selectedEntry.title}
                  {selectedEntry.subtitle && (
                    <span className="font-normal text-stone-400"> · {selectedEntry.subtitle}</span>
                  )}
                </h3>
                <p className="mt-1 text-xs uppercase tracking-widest text-stone-400">
                  {selectedEntry.categoryLabel}
                </p>
              </div>

              {selectedEntry.description && (
                <p className="mb-5 leading-relaxed text-stone-600">
                  {selectedEntry.description}
                </p>
              )}

              <div className="flex flex-wrap gap-3">
                {selectedEntry.href && selectedEntry.actionLabel && (
                  <ActionLink href={selectedEntry.href} label={selectedEntry.actionLabel} primary />
                )}

                {selectedEntry.googleMaps && (
                  <ActionLink href={selectedEntry.googleMaps} label="Google Maps" primary={!selectedEntry.href} />
                )}

                {selectedEntry.website && (
                  <ActionLink href={selectedEntry.website} label="Website" />
                )}
              </div>
            </div>

            {selectedEntry.videoUrl ? (
              <div className="relative order-first h-56 w-full overflow-hidden bg-stone-100 md:order-last md:h-full md:min-h-[260px]">
                <video
                  src={selectedEntry.videoUrl}
                  autoPlay
                  muted
                  loop
                  playsInline
                  className="h-full w-full object-cover"
                />
              </div>
            ) : (
              selectedEntry.image?.url && (
                <div className="relative order-first h-56 w-full bg-stone-100 md:order-last md:h-full md:min-h-[260px]">
                  <Image
                    src={selectedEntry.image.url}
                    alt={selectedEntry.image.alt || selectedEntry.title}
                    fill
                    sizes="(max-width: 768px) 100vw, 280px"
                    className="object-cover"
                  />
                </div>
              )
            )}
          </div>
        </div>
      )}
    </div>
  );
}
