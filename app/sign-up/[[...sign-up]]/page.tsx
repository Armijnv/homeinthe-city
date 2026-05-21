import { SignUp } from "@clerk/nextjs";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sign up | Home in the City",
};

export default function Page() {
  return (
    <div className="min-h-screen bg-[#1a1f2e] px-6 pt-28 pb-16 text-white">
      <div className="mx-auto flex max-w-4xl justify-center">
        <SignUp
          path="/sign-up"
          routing="path"
          signInUrl="/sign-in"
          fallbackRedirectUrl="/account"
        />
      </div>
    </div>
  );
}
