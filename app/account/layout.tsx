import type { Metadata } from "next";
import { noindexRobots } from "@/app/lib/noindexMetadata";

export const metadata: Metadata = {
  robots: noindexRobots,
};

export default function AccountLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}

