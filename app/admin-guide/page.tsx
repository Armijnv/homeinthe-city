import type { Metadata } from "next";

type GuideSection = {
  title: string;
  body: string[];
};

const sections: GuideSection[] = [
  {
    title: "Public website",
    body: [
      "The public website presents Home in the City, destination pages, host pages, and provider profile pages.",
      "Published provider records in Sanity are shown publicly. Draft submissions are not public content.",
    ],
  },
  {
    title: "Sanity Studio",
    body: [
      "Sanity Studio is available at /studio for managing site content.",
      "Provider records are the published profiles. Provider submissions are draft or review records created from provider account edits.",
    ],
  },
  {
    title: "Provider accounts",
    body: [
      "Providers sign in with Clerk and open /account.",
      "The account page matches the signed-in email to a provider record by ownership contact email.",
    ],
  },
  {
    title: "How Luciana logs in",
    body: [
      "Luciana uses the normal /sign-in page.",
      "After signing in, she opens /account. If her email matches a provider record, she can open the provider edit page.",
    ],
  },
  {
    title: "How provider edits work",
    body: [
      "Providers edit their profile from /account/profile/edit.",
      "Saving creates or updates a provider submission in draft status. Submitting moves the draft to review status.",
    ],
  },
  {
    title: "How to approve changes",
    body: [
      "Open Sanity Studio and review provider submissions with review status.",
      "Use the approval workflow to approve or reject the submission. Approved changes can then be applied to the public provider profile.",
    ],
  },
  {
    title: "How to create a new provider",
    body: [
      "Create a provider record in Sanity Studio.",
      "Set the provider status, public profile details, slug, locale visibility, and ownership contact email.",
      "The ownership contact email must match the provider's Clerk login email for /account access.",
    ],
  },
];

const workingItems = [
  "login",
  "account page",
  "edit page",
  "save draft",
  "submit for review",
  "approval workflow",
];

const untestedItems = [
  "Luciana end-to-end flow",
  "image upload",
  "locale visibility",
  "provider invitation process",
];

export const metadata: Metadata = {
  title: "Admin guide",
};

export default function AdminGuidePage() {
  return (
    <div className="min-h-screen bg-[#1a1f2e] px-6 pt-28 pb-16 text-white">
      <div className="mx-auto max-w-3xl">
        <p className="mb-4 text-sm uppercase tracking-widest text-stone-400">
          Internal guide
        </p>
        <h1 className="mb-6 text-4xl font-light leading-tight md:text-6xl">
          Provider system
        </h1>
        <p className="mb-10 max-w-2xl leading-relaxed text-stone-300">
          Current notes for managing Home in the City provider accounts,
          profile edits, and review workflow.
        </p>

        <div className="space-y-5">
          {sections.map((section) => (
            <section
              key={section.title}
              className="rounded-lg border border-white/10 bg-white/10 p-6"
            >
              <h2 className="mb-3 text-2xl font-light">{section.title}</h2>
              <div className="space-y-3 text-sm leading-relaxed text-stone-300">
                {section.body.map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
              </div>
            </section>
          ))}

          <section className="rounded-lg border border-white/10 bg-white/10 p-6">
            <h2 className="mb-4 text-2xl font-light">Provider status</h2>

            <div className="grid gap-6 md:grid-cols-2">
              <div>
                <h3 className="mb-3 text-sm uppercase tracking-widest text-stone-400">
                  Working
                </h3>
                <ul className="space-y-2 text-sm text-stone-300">
                  {workingItems.map((item) => (
                    <li key={item}>- {item}</li>
                  ))}
                </ul>
              </div>

              <div>
                <h3 className="mb-3 text-sm uppercase tracking-widest text-stone-400">
                  Not fully tested
                </h3>
                <ul className="space-y-2 text-sm text-stone-300">
                  {untestedItems.map((item) => (
                    <li key={item}>- {item}</li>
                  ))}
                </ul>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
