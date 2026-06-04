"use client";

import Image from "next/image";
import { useCallback, useEffect, useMemo, useState } from "react";

export type PropertyMediaImage = {
  url: string;
  alt: string;
};

type Badge = {
  label: string;
  tone?: "light" | "solid";
};

export default function PropertyListingMedia({
  images,
  title,
  eyebrow,
  badges,
  shortDescription,
  price,
  galleryLabel,
  openGalleryLabel,
  closeLabel,
  previousLabel,
  nextLabel,
}: {
  images: PropertyMediaImage[];
  title: string;
  eyebrow: string;
  badges: Badge[];
  shortDescription: string;
  price: string;
  galleryLabel: string;
  openGalleryLabel: string;
  closeLabel: string;
  previousLabel: string;
  nextLabel: string;
}) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [touchStartX, setTouchStartX] = useState<number | null>(null);
  const hasImages = images.length > 0;
  const heroImage = images[0];
  const visibleGallery = useMemo(() => images.slice(1), [images]);

  const openGallery = (index: number) => setActiveIndex(index);
  const closeGallery = () => setActiveIndex(null);
  const showPrevious = useCallback(() => {
    setActiveIndex((index) =>
      index === null ? index : (index - 1 + images.length) % images.length,
    );
  }, [images.length]);
  const showNext = useCallback(() => {
    setActiveIndex((index) =>
      index === null ? index : (index + 1) % images.length,
    );
  }, [images.length]);

  useEffect(() => {
    if (activeIndex === null) return;

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") closeGallery();
      if (event.key === "ArrowLeft") showPrevious();
      if (event.key === "ArrowRight") showNext();
    }

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [activeIndex, showNext, showPrevious]);

  function handleTouchEnd(clientX: number) {
    if (touchStartX === null) return;
    const delta = clientX - touchStartX;
    setTouchStartX(null);

    if (Math.abs(delta) < 40) return;
    if (delta > 0) showPrevious();
    else showNext();
  }

  return (
    <>
      <section className="relative min-h-[92svh] overflow-hidden bg-[#111419] text-white">
        {hasImages ? (
          <button
            type="button"
            onClick={() => openGallery(0)}
            className="absolute inset-0 cursor-zoom-in"
            aria-label={openGalleryLabel}
          >
            <Image
              src={heroImage.url}
              alt={heroImage.alt}
              fill
              priority
              className="object-cover"
              sizes="100vw"
            />
          </button>
        ) : (
          <div className="absolute inset-0 bg-[#17202a]" />
        )}

        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/85 via-black/35 to-black/10" />
        <div className="pointer-events-none relative z-10 flex min-h-[92svh] flex-col justify-end px-5 pb-12 pt-28 sm:px-8 lg:px-14">
          <div className="max-w-5xl">
            <p className="text-sm uppercase tracking-widest text-stone-200">
              {eyebrow}
            </p>
            <div className="mt-5 flex flex-wrap gap-3 text-sm">
              {badges.map((badge) => (
                <span
                  key={badge.label}
                  className={
                    badge.tone === "solid"
                      ? "rounded-full bg-white px-4 py-2 text-[#17202a]"
                      : "rounded-full border border-white/35 px-4 py-2 text-white"
                  }
                >
                  {badge.label}
                </span>
              ))}
            </div>
            <h1 className="mt-6 max-w-4xl text-4xl font-semibold leading-tight sm:text-6xl lg:text-7xl">
              {title}
            </h1>
            <div className="mt-6 flex flex-col gap-5 text-lg text-stone-100 sm:flex-row sm:items-end sm:justify-between">
              <p className="max-w-2xl leading-8">{shortDescription}</p>
              {price ? (
                <p className="text-3xl font-semibold sm:text-right">{price}</p>
              ) : null}
            </div>
          </div>
        </div>
      </section>

      {visibleGallery.length ? (
        <section className="px-5 py-12 sm:px-8 lg:px-14">
          <div className="mx-auto max-w-6xl">
            <div className="mb-5 flex items-end justify-between gap-4">
              <h2 className="text-2xl font-semibold text-[#17202a]">
                {galleryLabel}
              </h2>
              <button
                type="button"
                onClick={() => openGallery(0)}
                className="hidden border border-[#17202a] px-4 py-2 text-sm font-semibold text-[#17202a] sm:inline-flex"
              >
                {openGalleryLabel}
              </button>
            </div>

            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {visibleGallery.map((image, index) => (
                <button
                  key={`${image.url}-${index}`}
                  type="button"
                  onClick={() => openGallery(index + 1)}
                  className={`relative overflow-hidden bg-stone-200 ${
                    index === 0 ? "aspect-[4/3] lg:col-span-2 lg:row-span-2" : "aspect-[4/3]"
                  }`}
                  aria-label={`${openGalleryLabel}: ${index + 2}`}
                >
                  <Image
                    src={image.url}
                    alt={image.alt}
                    fill
                    className="object-cover transition duration-300 hover:scale-105"
                    sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
                  />
                </button>
              ))}
            </div>
          </div>
        </section>
      ) : null}

      {activeIndex !== null && hasImages ? (
        <div
          className="fixed inset-0 z-[100] bg-black text-white"
          onTouchStart={(event) => setTouchStartX(event.touches[0]?.clientX ?? null)}
          onTouchEnd={(event) =>
            handleTouchEnd(event.changedTouches[0]?.clientX ?? touchStartX ?? 0)
          }
        >
          <div className="absolute left-0 right-0 top-0 z-10 flex items-center justify-between px-4 py-4 sm:px-6">
            <p className="text-sm text-white/80">
              {activeIndex + 1} / {images.length}
            </p>
            <button
              type="button"
              onClick={closeGallery}
              className="rounded-full bg-white px-4 py-2 text-sm font-semibold text-black"
            >
              {closeLabel}
            </button>
          </div>

          <button
            type="button"
            onClick={showPrevious}
            className="absolute left-4 top-1/2 z-10 hidden h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-white/15 text-3xl backdrop-blur transition hover:bg-white/25 sm:flex"
            aria-label={previousLabel}
          >
            ‹
          </button>
          <button
            type="button"
            onClick={showNext}
            className="absolute right-4 top-1/2 z-10 hidden h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-white/15 text-3xl backdrop-blur transition hover:bg-white/25 sm:flex"
            aria-label={nextLabel}
          >
            ›
          </button>

          <div className="relative h-full w-full px-3 py-20 sm:px-16">
            <Image
              src={images[activeIndex].url}
              alt={images[activeIndex].alt}
              fill
              className="object-contain"
              sizes="100vw"
              priority
            />
          </div>
        </div>
      ) : null}
    </>
  );
}
