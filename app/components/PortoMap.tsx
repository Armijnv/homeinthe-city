"use client";

import "leaflet/dist/leaflet.css";

import L from "leaflet";
import Image from "next/image";
import { MapContainer, Marker, Popup, TileLayer, useMap } from "react-leaflet";
import { useEffect, useRef, useState } from "react";

type Lang = "en" | "pt" | "nl";

type MapPlace = {
  name: string;
  category?: string;
  neighborhood?: string;
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
  video?: {
    asset?: {
      url?: string;
    };
  };
};

export default function PortoMap() { return null }