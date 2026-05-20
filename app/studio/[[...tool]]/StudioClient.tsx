"use client";

import nextDynamic from "next/dynamic";
import type { ComponentProps } from "react";
import type { NextStudio } from "next-sanity/studio";

const ClientOnlyStudio = nextDynamic(
  () => import("next-sanity/studio").then((mod) => mod.NextStudio),
  { ssr: false }
);

type StudioClientProps = ComponentProps<typeof NextStudio>;

export default function StudioClient(props: StudioClientProps) {
  return <ClientOnlyStudio {...props} />;
}
