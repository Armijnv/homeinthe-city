import { currentUser } from "@clerk/nextjs/server";
import type { Metadata } from "next";
import Link from "next/link";
import { client } from "@/sanity/lib/client";

type MatchedProvider = {
  name?: string;
  slug?: {
    current?: string;
  };
};

const matchedProviderQuery = `
  *[_type == "provider" && ownership.contactEmail == $email][0]{
    name,
    slug
  }
`;

export const metadata: Metadata = {
  title: "Account | Home in the City",
};

export default async function Page() {
  const user = await currentUser({ treatPendingAsSignedOut: false });
  const email = user?.primaryEmailAddress?.emailAddress || "";
  const provider = email
    ? await client.fetch<MatchedProvider | null>(matchedProviderQuery, { email })
    : null;

  return (
    <div className="min-h-screen bg-[#1a1f2e] px-6 pt-28 pb-16 text-white">
      <div className="mx-auto max-w-3xl">
        <p className="mb-4 text-sm uppercase tracking-widest text-stone-400">
          Provider account
        </p>
        <h1 className="mb-6 text-4xl font-light leading-tight md:text-6xl">
          Account
        </h1>

        <section className="rounded-3xl border border-white/10 bg-white/10 p-6">
          <div className="mb-5">
            <p className="mb-2 text-xs uppercase tracking-widest text-stone-400">
              Signed-in email
            </p>
            <p className="text-lg text-white">{email || "No email found"}</p>
          </div>

          <div>
            <p className="mb-2 text-xs uppercase tracking-widest text-stone-400">
              Matched provider
            </p>
            {provider?.name ? (
              <div>
                <p className="text-lg text-white">{provider.name}</p>
                <Link
                  href="/account/profile/edit"
                  className="mt-4 inline-flex rounded-lg border border-white/15 px-4 py-3 text-sm text-white transition hover:border-[#d6a85a] hover:text-[#d6a85a]"
                >
                  Edit provider profile
                </Link>
              </div>
            ) : (
              <p className="leading-relaxed text-stone-300">
                No provider profile matches this email yet.
              </p>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}
