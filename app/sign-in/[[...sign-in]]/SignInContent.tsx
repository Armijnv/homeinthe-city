"use client";

import { SignIn, SignOutButton, useAuth } from "@clerk/nextjs";
import Link from "next/link";

function LoadingCard() {
  return (
    <section className="w-full max-w-md rounded-lg border border-white/10 bg-white/10 p-6 text-center">
      <h1 className="text-2xl font-light">Loading sign in</h1>
    </section>
  );
}

function AlreadySignedInCard() {
  return (
    <section className="w-full max-w-md rounded-lg border border-white/10 bg-white/10 p-6 text-center">
      <h1 className="text-2xl font-light">Already signed in</h1>
      <p className="mt-3 text-sm leading-relaxed text-stone-300">
        Open your account, or sign out to use a different account.
      </p>
      <div className="mt-6 flex flex-wrap justify-center gap-3">
        <Link
          href="/account"
          prefetch={false}
          className="rounded-lg bg-[#d6a85a] px-5 py-3 text-sm font-medium text-[#1a1f2e] transition hover:bg-[#efc878]"
        >
          Go to account
        </Link>
        <SignOutButton redirectUrl="/sign-in">
          <button className="rounded-lg border border-white/15 px-5 py-3 text-sm font-medium text-white transition hover:border-[#d6a85a] hover:text-[#d6a85a]">
            Sign out
          </button>
        </SignOutButton>
      </div>
    </section>
  );
}

export default function SignInContent() {
  const { isLoaded, isSignedIn } = useAuth();

  if (!isLoaded) {
    return <LoadingCard />;
  }

  if (isSignedIn) {
    return <AlreadySignedInCard />;
  }

  return (
    <SignIn
      path="/sign-in"
      routing="path"
      signUpUrl="/sign-up"
      fallbackRedirectUrl="/account"
    />
  );
}
