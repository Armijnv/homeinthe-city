"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import type { MutableRefObject } from "react";
import type { GlobeMethods } from "react-globe.gl";

const Globe = dynamic(() => import("react-globe.gl"), { ssr: false });

type GlobeCity = {
  lat: number;
  lng: number;
  name: string;
  status: "live" | "next";
  href: string;
  ariaLabel: string;
};

const cities: GlobeCity[] = [
  {
    lat: -30.0346,
    lng: -51.2177,
    name: "Porto Alegre",
    status: "live",
    href: "/brazil/porto-alegre",
    ariaLabel: "Open Porto Alegre city guide",
  },
  {
    lat: -27.5949,
    lng: -48.5482,
    name: "Florianópolis",
    status: "next",
    href: "/real-estate/florianopolis",
    ariaLabel: "Open Florianópolis real estate preview",
  },
];

function browserSupportsWebGL() {
  try {
    const canvas = document.createElement("canvas");
    const gl =
      canvas.getContext("webgl") ||
      canvas.getContext("experimental-webgl");

    return !!gl;
  } catch {
    return false;
  }
}

export default function GlobeComponent() {
  const globeRef = useRef<GlobeMethods | undefined>(undefined) as MutableRefObject<
    GlobeMethods | undefined
  >;
  const [supported, setSupported] = useState(false);
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    const id = window.setTimeout(() => {
      setSupported(browserSupportsWebGL());
      setChecked(true);
    }, 0);

    return () => window.clearTimeout(id);
  }, []);

  function focusOnSouthernBrazil() {
    if (!globeRef.current) return;

    globeRef.current.pointOfView(
      { lat: -30, lng: -51, altitude: 2 },
      2000
    );

    globeRef.current.controls().autoRotate = true;
    globeRef.current.controls().autoRotateSpeed = 0.2;
  }

  if (!checked) {
    return null;
  }

  if (!supported) {
    return (
      <div className="flex h-[420px] w-[420px] flex-col items-center justify-center gap-2 rounded-full border border-white/10 bg-white/5 text-center text-sm text-stone-400">
        <Link href="/brazil/porto-alegre" className="hover:text-white">
          Porto Alegre is live
        </Link>
        <Link href="/real-estate/florianopolis" className="text-xs hover:text-white">
          Florianópolis coming soon
        </Link>
      </div>
    );
  }

  function createCityMarker(city: GlobeCity) {
    const marker = document.createElement("button");
    marker.type = "button";
    marker.setAttribute("aria-label", city.ariaLabel);
    marker.className =
      "group pointer-events-auto flex -translate-x-1/2 -translate-y-1/2 items-center gap-2 rounded-full border border-white/25 bg-[#1a1f2e]/90 px-3 py-2 text-left text-white shadow-2xl shadow-black/40 backdrop-blur-md transition hover:border-white/60 hover:bg-[#253047] focus:outline-none focus:ring-2 focus:ring-[#d7b46a]";

    const dot = document.createElement("span");
    dot.className =
      city.status === "live"
        ? "block h-2.5 w-2.5 rounded-full bg-[#d7b46a] shadow-[0_0_18px_rgba(215,180,106,0.8)]"
        : "block h-2.5 w-2.5 rounded-full border border-[#d7b46a] bg-transparent";

    const label = document.createElement("span");
    label.className = "grid leading-tight";

    const name = document.createElement("span");
    name.className = "text-[11px] font-medium";
    name.textContent = city.name;

    const status = document.createElement("span");
    status.className = "text-[9px] uppercase tracking-widest text-stone-300";
    status.textContent = city.status === "live" ? "Live" : "Coming soon";

    label.append(name, status);
    marker.append(dot, label);
    marker.addEventListener("click", () => {
      window.location.href = city.href;
    });

    return marker;
  }

  return (
    <div className="h-full w-full">
      <Globe
        ref={globeRef}
        width={700}
        height={700}
        globeImageUrl="//unpkg.com/three-globe/example/img/earth-blue-marble.jpg"
        backgroundColor="rgba(0,0,0,0)"
        atmosphereColor="#3a7bd5"
        atmosphereAltitude={0.25}
        onGlobeReady={focusOnSouthernBrazil}
        htmlElementsData={cities}
        htmlLat="lat"
        htmlLng="lng"
        htmlAltitude={0.08}
        htmlElement={(city) => createCityMarker(city as GlobeCity)}
        htmlElementVisibilityModifier={(element, isVisible) => {
          element.style.opacity = isVisible ? "1" : "0.18";
          element.style.pointerEvents = isVisible ? "auto" : "none";
        }}
        ringsData={cities}
        ringLat="lat"
        ringLng="lng"
        ringMaxRadius={(city) => ((city as GlobeCity).status === "live" ? 6 : 4)}
        ringPropagationSpeed={1.2}
        ringRepeatPeriod={(city) => ((city as GlobeCity).status === "live" ? 1200 : 2200)}
      />
    </div>
  );
}
