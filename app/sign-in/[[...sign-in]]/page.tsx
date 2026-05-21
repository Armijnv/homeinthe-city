import { SignIn } from "@clerk/nextjs";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sign in | Home in the City",
};

export default function Page() {
  return (
    <div className="min-h-screen bg-[#1a1f2e] px-6 pt-28 pb-16 text-white">
      <div className="mx-auto flex max-w-4xl justify-center">
        <SignIn
          path="/sign-in"
          routing="path"
          signUpUrl="/sign-up"
          fallbackRedirectUrl="/account"
        />
      </div>
    </div>
  );
}
