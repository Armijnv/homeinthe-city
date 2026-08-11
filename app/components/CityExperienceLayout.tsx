"use client";

import { useRef, useState, type KeyboardEvent, type ReactNode } from "react";

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
  navigationItems,
  sections,
}: {
  hero: ReactNode;
  navigationItems: CityExperienceNavigationItem[];
  sections: CityExperienceSection[];
}) {
  const [activeTab, setActiveTab] = useState(navigationItems[0]?.id || "");
  const tabRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const availableItems = navigationItems.filter((item) =>
    sections.some((section) => section.id === item.id),
  );
  const activeSection =
    sections.find((section) => section.id === activeTab) || sections[0];

  function handleTabKeyDown(
    event: KeyboardEvent<HTMLButtonElement>,
    currentIndex: number,
  ) {
    if (!["ArrowLeft", "ArrowRight", "Home", "End"].includes(event.key)) {
      return;
    }

    event.preventDefault();
    const lastIndex = availableItems.length - 1;
    const nextIndex =
      event.key === "Home"
        ? 0
        : event.key === "End"
          ? lastIndex
          : event.key === "ArrowRight"
            ? (currentIndex + 1) % availableItems.length
            : (currentIndex - 1 + availableItems.length) % availableItems.length;

    setActiveTab(availableItems[nextIndex].id);
    tabRefs.current[nextIndex]?.focus();
  }

  return (
    <div className="relative mx-auto max-w-6xl">
      {hero}

      <div
        role="tablist"
        aria-label="City guide sections"
        className="mt-4 grid grid-cols-2 gap-2 rounded-2xl bg-white/95 p-2 shadow-lg shadow-black/10 backdrop-blur-md md:mt-6 md:grid-cols-4 md:gap-3 md:rounded-3xl md:p-3"
      >
        {availableItems.map((item, index) => {
          const isActive = item.id === activeSection?.id;

          return (
            <button
              key={item.id}
              ref={(element) => {
                tabRefs.current[index] = element;
              }}
              id={`${item.id}-tab`}
              type="button"
              role="tab"
              aria-selected={isActive}
              aria-controls={`${item.id}-panel`}
              tabIndex={isActive ? 0 : -1}
              title={item.description}
              onClick={() => setActiveTab(item.id)}
              onKeyDown={(event) => handleTabKeyDown(event, index)}
              className={`min-h-12 rounded-xl px-2.5 py-2 text-sm font-medium leading-tight transition focus:outline-none focus:ring-2 focus:ring-[#b99455] focus:ring-offset-2 md:min-h-14 md:rounded-2xl md:px-4 md:text-base ${
                isActive
                  ? "bg-[#1a1f2e] text-white shadow-sm"
                  : "bg-stone-50 text-stone-700 hover:bg-stone-100"
              }`}
            >
              {item.title}
            </button>
          );
        })}
      </div>

      {activeSection ? (
        <section
          id={`${activeSection.id}-panel`}
          role="tabpanel"
          aria-labelledby={`${activeSection.id}-tab`}
          tabIndex={0}
          className="mt-4 rounded-2xl bg-white/97 p-4 shadow-xl shadow-black/10 backdrop-blur-md focus:outline-none md:mt-6 md:rounded-3xl md:p-8"
        >
          <h2 className="text-2xl font-normal tracking-tight text-stone-950 md:text-4xl">
            {activeSection.title}
          </h2>

          {activeSection.intro ? (
            <p className="mt-3 max-w-3xl leading-7 text-stone-600 md:mt-4">
              {activeSection.intro}
            </p>
          ) : null}

          {activeSection.content ? (
            <div className="mt-5 md:mt-6">{activeSection.content}</div>
          ) : null}
        </section>
      ) : null}
    </div>
  );
}
