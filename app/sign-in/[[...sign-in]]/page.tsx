import type { Metadata } from "next";
import SignInContent from "./SignInContent";
import { noindexRobots } from "@/app/lib/noindexMetadata";

export const metadata: Metadata = {
  title: "Sign in",
  robots: noindexRobots,
};

export default function Page() {
  return (
    <div className="min-h-screen bg-[#1a1f2e] px-6 pt-28 pb-16 text-white">
      <div className="mx-auto flex max-w-4xl justify-center">
        <SignInContent />
      </div>
    </div>
  );
}
