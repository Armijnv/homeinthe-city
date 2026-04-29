"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";

const Globe = dynamic(() => import("react-globe.gl"), { ssr: false });

const portoAlegre = [
  {
    lat: -30.0346,
    lng: -51.2177,
    name: "Porto Alegre",
  },
];

export default function GlobeComponent() {
  const globeRef = useRef<any>(null);
  const [supported, setSupported] = useState(true);

  useEffect(() => {
    try {
      const canvas = document.createElement("canvas");
      const gl =
        canvas.getContext("webgl") ||
        canvas.getContext("experimental-webgl");

      if (!gl) setSupported(false);
    } catch {
      setSupported(false);
    }
  }, []);

  function goToPortoAlegre() {
    window.location.href = "/brazil/porto-alegre";
  }

  function focusOnPortoAlegre() {
    if (!globeRef.current) return;

    globeRef.current.pointOfView(
      { lat: -30.0346, lng: -51.2177, altitude: 1.8 },
      1000
    );

    globeRef.current.controls().autoRotate = true;
    globeRef.current.controls().autoRotateSpeed = 0.2;
  }

  if (!supported) {
    return (
      <a
        href="/brazil/porto-alegre"
        className="flex h-[700px] w-[700px] items-center justify-center rounded-full bg-gradient-to-br from-blue-950 via-slate-900 to-black text-center text-white shadow-2xl"
      >
        <div>
          <div className="mx-auto mb-4 h-4 w-4 rounded-full bg-white shadow-[0_0_25px_rgba(255,255,255,0.9)]" />
          <p className="text-sm uppercase tracking-widest text-white/70">
            Porto Alegre
          </p>
        </div>
      </a>
    );
  }

  return (
    <div className="w-full h-full">
      <Globe
        ref={globeRef}
        width={700}
        height={700}
        globeImageUrl="//unpkg.com/three-globe/example/img/earth-blue-marble.jpg"
        backgroundColor="rgba(0,0,0,0)"
        atmosphereColor="#3a7bd5"
        atmosphereAltitude={0.25}
        onGlobeReady={focusOnPortoAlegre}
        pointsData={portoAlegre}
        pointLat="lat"
        pointLng="lng"
        pointAltitude={0.08}
        pointRadius={2.2}
        pointResolution={32}
        pointColor={() => "#ffffff"}
        onPointClick={goToPortoAlegre}
        labelsData={portoAlegre}
        labelLat="lat"
        labelLng="lng"
        labelText={() => "●"}
        labelSize={1.1}
        labelColor={() => "#ffffff"}
        onLabelClick={goToPortoAlegre}
        ringsData={portoAlegre}
        ringLat="lat"
        ringLng="lng"
        ringColor={() => "#f5d76e"}
        ringMaxRadius={6}
        ringPropagationSpeed={1.2}
        ringRepeatPeriod={1200}
      />
    </div>
  );
}