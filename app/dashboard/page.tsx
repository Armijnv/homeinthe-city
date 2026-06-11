import { SignOutButton } from "@clerk/nextjs";
import { currentUser } from "@clerk/nextjs/server";
import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { client } from "@/sanity/lib/client";

type DashboardCity = {
  _id?: string;
  name_en?: string;
  name_pt?: string;
  name_nl?: string;
  slug?: {
    current?: string;
  };
};

type DashboardProvider = {
  _id: string;
  name?: string;
  slug?: {
    current?: string;
  };
  status?: string;
  roles?: string[];
  primaryRole?: string;
  cities?: DashboardCity[];
  ownership?: {
    contactEmail?: string;
    ownerUserId?: string;
    ownershipStatus?: string;
    selfEditEnabled?: boolean;
  };
};

type DashboardCard = {
  title: string;
  text: string;
  href?: string;
  action?: string;
  status?: string;
};

const matchedProviderForDashboardQuery = `
  *[
    _type == "provider" &&
    (
      ownership.ownerUserId == $userId ||
      lower(ownership.contactEmail) in $emails
    )
  ][0]{
    _id,
    name,
    slug,
    status,
    roles,
    primaryRole,
    cities[]->{
      _id,
      name_en,
      name_pt,
      name_nl,
      slug
    },
    ownership{
      contactEmail,
      ownerUserId,
      ownershipStatus,
      selfEditEnabled
    }
  }
`;

export const metadata: Metadata = {
  title: "Provider Dashboard",
};

function roleLabel(role?: string) {
  const labels: Record<string, string> = {
    host: "City host",
    interpreter: "Interpreter",
    translator: "Translator",
    guide: "Guide",
    specialist: "Specialist",
    realtor: "Real estate agent",
  };

  return role ? labels[role] || role : "Provider";
}

function cityName(city: DashboardCity) {
  return city.name_en || city.name_pt || city.name_nl || "Untitled city";
}

function accessLevel(provider: DashboardProvider | null, isAdmin: boolean) {
  if (isAdmin) return "Admin";
  if (provider?.roles?.includes("host")) return "City host";
  if (provider) return "Provider";
  return "Unmatched account";
}

function Card({ card }: { card: DashboardCard }) {
  return (
    <section className="rounded-2xl border border-white/10 bg-white/10 p-6 shadow-xl shadow-black/10">
      {card.status ? (
        <p className="mb-3 text-xs uppercase tracking-widest text-[#d6a85a]">
          {card.status}
        </p>
      ) : null}

      <h2 className="text-xl font-medium text-white">{card.title}</h2>
      <p className="mt-3 text-sm leading-6 text-stone-300">{card.text}</p>

      {card.href && card.action ? (
        <Link
          href={card.href}
          className="mt-5 inline-flex rounded-lg border border-white/15 px-4 py-3 text-sm text-white transition hover:border-[#d6a85a] hover:text-[#d6a85a]"
        >
          {card.action}
        </Link>
      ) : null}
    </section>
  );
}

export default async function DashboardPage() {
  const user = await currentUser({ treatPendingAsSignedOut: false });

  if (!user?.id) {
    redirect("/sign-in?redirect_url=/dashboard");
  }

  const emails = user.emailAddresses
    .map((email) => email.emailAddress.toLowerCase())
    .filter(Boolean);
  const signedInEmail = user.primaryEmailAddress?.emailAddress || emails[0] || "";
  const isAdmin = user.publicMetadata?.role === "admin";
  const provider = emails.length
    ? await client.fetch<DashboardProvider | null>(matchedProviderForDashboardQuery, {
        userId: user.id,
        emails,
      })
    : null;
  const providerSlug = provider?.slug?.current;
  const cityNames = provider?.cities?.map(cityName).filter(Boolean) || [];
  const cards: DashboardCard[] = [
    {
      title: "Provider profile",
      text: provider
        ? "Update your public provider profile through the existing draft-and-review workflow."
        : "No provider profile is connected to this signed-in email yet. An admin can connect your account from the provider document.",
      href: provider ? "/account/profile/edit" : undefined,
      action: provider ? "Edit profile draft" : undefined,
      status: provider ? "Available now" : "Needs admin setup",
    },
    {
      title: "Public profile",
      text: providerSlug
        ? "Open the current public version of your provider profile."
        : "A public profile link appears here after your account is matched to a provider document.",
      href: providerSlug ? `/providers/${providerSlug}` : undefined,
      action: providerSlug ? "View public profile" : undefined,
      status: providerSlug ? "Published view" : "Pending",
    },
    {
      title: "City host tools",
      text:
        cityNames.length > 0
          ? `Future city-host tools will start here for ${cityNames.join(", ")}: city copy, recommendations, and map locations.`
          : "Future city-host tools will appear here for assigned city hosts.",
      status: provider?.roles?.includes("host") ? "Prepared for phase 2" : "City hosts only",
    },
    {
      title: "Admin workspace",
      text:
        "Admins will keep full access through Sanity Studio and can later get moderation shortcuts here.",
      href: isAdmin ? "/studio" : undefined,
      action: isAdmin ? "Open Studio" : undefined,
      status: isAdmin ? "Admin" : "Admin only",
    },
  ];

  return (
    <div className="min-h-screen bg-[#1a1f2e] px-6 pt-28 pb-16 text-white">
      <div className="mx-auto max-w-6xl">
        <div className="mb-10 grid gap-6 lg:grid-cols-[1.4fr_0.8fr] lg:items-end">
          <div>
            <p className="mb-4 text-sm uppercase tracking-widest text-stone-400">
              Provider dashboard
            </p>
            <h1 className="text-4xl font-light leading-tight md:text-6xl">
              Private workspace
            </h1>
            <p className="mt-5 max-w-3xl leading-relaxed text-stone-300">
              A single entry point for providers and city hosts. Phase 1 connects
              login, account matching, and the existing provider profile editor.
            </p>
          </div>

          <section className="rounded-2xl border border-white/10 bg-white/10 p-5">
            <p className="text-xs uppercase tracking-widest text-stone-400">
              Signed in
            </p>
            <p className="mt-2 text-lg text-white">{signedInEmail || user.id}</p>
            <div className="mt-4 flex flex-wrap gap-2 text-xs uppercase tracking-widest text-stone-300">
              <span className="rounded-full border border-white/15 px-3 py-1">
                {accessLevel(provider, isAdmin)}
              </span>
              {provider?.status ? (
                <span className="rounded-full border border-white/15 px-3 py-1">
                  {provider.status}
                </span>
              ) : null}
              {provider?.primaryRole ? (
                <span className="rounded-full border border-white/15 px-3 py-1">
                  {roleLabel(provider.primaryRole)}
                </span>
              ) : null}
            </div>

            <SignOutButton redirectUrl="/sign-in">
              <button
                type="button"
                className="mt-5 inline-flex rounded-lg border border-white/15 px-4 py-3 text-sm text-white transition hover:border-[#d6a85a] hover:text-[#d6a85a]"
              >
                Sign out
              </button>
            </SignOutButton>
          </section>
        </div>

        {provider?.name ? (
          <section className="mb-8 rounded-2xl border border-white/10 bg-white/10 p-6">
            <p className="text-xs uppercase tracking-widest text-stone-400">
              Matched provider
            </p>
            <h2 className="mt-3 text-2xl font-light text-white">{provider.name}</h2>
            <p className="mt-3 leading-relaxed text-stone-300">
              This match uses the provider document ownership fields:
              owner user id first, then contact email.
            </p>
          </section>
        ) : null}

        <div className="grid gap-5 md:grid-cols-2">
          {cards.map((card) => (
            <Card key={card.title} card={card} />
          ))}
        </div>
      </div>
    </div>
  );
}
