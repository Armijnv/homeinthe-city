"use client";

import type { ReactNode } from "react";

export type CityExperienceNavigationItem = {
  id: string;
  title: string;
  description?: string;
};

export type CityExperienceSection = {
  id: string;
  title: string;
  intro?: string;
  content?: ReactNode;
};

export default function CityExperienceLayout({
  hero,
  sideRail,
  navigationTitle,
  navigationItems,
  sections,
}: {
  hero: ReactNode;
  sideRail?: ReactNode;
  navigationTitle: string;
  navigationItems: CityExperienceNavigationItem[];
  sections: CityExperienceSection[];
}) {
  return (
    <div className="relative mx-auto max-w-6xl">
      <div className="grid grid-cols-1 gap-5 md:grid-cols-3 md:gap-8">
        <div className="space-y-4 md:col-span-2 md:space-y-8">{hero}</div>

        {sideRail ? (
          <aside className="space-y-6 md:pt-16 lg:pt-0">{sideRail}</aside>
        ) : null}
      </div>

      {navigationItems.length ? (
        <section
          aria-labelledby="city-experience-navigation-title"
          className="mt-8 rounded-3xl bg-white/97 p-6 shadow-xl shadow-black/10 backdrop-blur-md md:p-8"
        >
          <h2
            id="city-experience-navigation-title"
            className="text-2xl font-normal tracking-tight text-stone-950 md:text-3xl"
          >
            {navigationTitle}
          </h2>

          <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {navigationItems.map((item) => (
              <article
                key={item.id}
                className="flex min-h-32 flex-col justify-between rounded-2xl border border-stone-200 bg-stone-50 p-5 text-left"
              >
                <h3 className="text-lg font-medium text-stone-950">
                  {item.title}
                </h3>
                {item.description ? (
                  <p className="mt-3 text-sm leading-6 text-stone-600">
                    {item.description}
                  </p>
                ) : null}
              </article>
            ))}
          </div>
        </section>
      ) : null}

      <div className="mt-8 space-y-8">
        {sections.map((section) => (
          <section
            key={section.id}
            id={section.id}
            aria-labelledby={`${section.id}-title`}
            className="rounded-3xl bg-white/97 p-6 shadow-xl shadow-black/10 backdrop-blur-md md:p-8"
          >
            <h2
              id={`${section.id}-title`}
              className="text-3xl font-normal tracking-tight text-stone-950 md:text-4xl"
            >
              {section.title}
            </h2>

            {section.intro ? (
              <p className="mt-4 max-w-3xl leading-7 text-stone-600">
                {section.intro}
              </p>
            ) : null}

            {section.content ? (
              <div className="mt-6">{section.content}</div>
            ) : null}
          </section>
        ))}
      </div>
    </div>
  );
}
