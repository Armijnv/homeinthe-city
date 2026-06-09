"use client";

import Image from "next/image";
import { useCallback, useEffect, useState } from "react";

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
  const [currentIndex, setCurrentIndex] = useState(0);
  const [touchStartX, setTouchStartX] = useState<number | null>(null);
  const hasImages = images.length > 0;
  const hasMultipleImages = images.length > 1;
  const selectedIndex = hasImages ? Math.min(currentIndex, images.length - 1) : 0;
  const currentImage = images[selectedIndex];

  const openGallery = (index: number) => setActiveIndex(index);
  const closeGallery = () => setActiveIndex(null);
  const showPreviousImage = useCallback(() => {
    setCurrentIndex((index) => (index - 1 + images.length) % images.length);
  }, [images.length]);
  const showNextImage = useCallback(() => {
    setCurrentIndex((index) => (index + 1) % images.length);
  }, [images.length]);
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

  function handleTouchEnd(clientX: number, onPrevious: () => void, onNext: () => void) {
    if (touchStartX === null) return;
    const delta = clientX - touchStartX;
    setTouchStartX(null);

    if (Math.abs(delta) < 40) return;
    if (delta > 0) onPrevious();
    else onNext();
  }

  return (
    <>
      <section className="relative overflow-hidden bg-[#111419] px-5 pb-8 pt-28 text-white sm:px-8 lg:px-14 lg:pb-12">
        <div className="mx-auto max-w-6xl">
          <div className="max-w-5xl pb-7">
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
            <div className="mt-5 flex flex-col gap-4 text-base text-stone-100 sm:flex-row sm:items-end sm:justify-between sm:text-lg">
              <p className="max-w-2xl leading-8">{shortDescription}</p>
              {price ? (
                <p className="text-3xl font-semibold sm:text-right">{price}</p>
              ) : null}
            </div>
          </div>

          <div
            className="relative aspect-[4/3] overflow-hidden rounded-2xl bg-[#17202a] shadow-2xl shadow-black/35 sm:aspect-[16/10] lg:aspect-[16/9]"
            onTouchStart={(event) => setTouchStartX(event.touches[0]?.clientX ?? null)}
            onTouchEnd={(event) =>
              handleTouchEnd(
                event.changedTouches[0]?.clientX ?? touchStartX ?? 0,
                showPreviousImage,
                showNextImage,
              )
            }
          >
            {hasImages && currentImage && hasMultipleImages ? (
              <button
                type="button"
                onClick={() => openGallery(selectedIndex)}
                className="absolute inset-0 cursor-zoom-in"
                aria-label={openGalleryLabel}
              >
                <Image
                  src={currentImage.url}
                  alt={currentImage.alt}
                  fill
                  priority
                  className="object-cover"
                  sizes="(min-width: 1024px) 1152px, 100vw"
                />
              </button>
            ) : hasImages && currentImage ? (
              <Image
                src={currentImage.url}
                alt={currentImage.alt}
                fill
                priority
                className="object-cover"
                sizes="(min-width: 1024px) 1152px, 100vw"
              />
            ) : (
              <div className="absolute inset-0 bg-[#17202a]" />
            )}

            {hasMultipleImages ? (
              <div className="pointer-events-none absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-black/70 to-transparent" />
            ) : null}

            {hasMultipleImages ? (
              <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between gap-3">
                <button
                  type="button"
                  onClick={() => openGallery(currentIndex)}
                  className="rounded-full bg-white/95 px-4 py-2 text-sm font-semibold text-[#17202a] shadow-lg transition hover:bg-white"
                >
                  {openGalleryLabel}
                </button>

                <p className="rounded-full bg-black/55 px-3 py-1.5 text-sm font-medium text-white backdrop-blur">
                  {selectedIndex + 1} / {images.length}
                </p>
              </div>
            ) : null}

            {hasMultipleImages ? (
              <>
                <button
                  type="button"
                  onClick={showPreviousImage}
                  className="absolute left-3 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-black/45 text-3xl text-white backdrop-blur transition hover:bg-black/60 sm:left-4 sm:h-12 sm:w-12"
                  aria-label={previousLabel}
                >
                  ‹
                </button>
                <button
                  type="button"
                  onClick={showNextImage}
                  className="absolute right-3 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-black/45 text-3xl text-white backdrop-blur transition hover:bg-black/60 sm:right-4 sm:h-12 sm:w-12"
                  aria-label={nextLabel}
                >
                  ›
                </button>
              </>
            ) : null}
          </div>

          {hasMultipleImages ? (
            <div className="mt-4 flex gap-3 overflow-x-auto pb-2">
              {images.map((image, index) => (
                <button
                  key={`${image.url}-${index}`}
                  type="button"
                  onClick={() => setCurrentIndex(index)}
                  className={`relative h-16 w-24 shrink-0 overflow-hidden rounded-lg border transition sm:h-20 sm:w-32 ${
                    index === selectedIndex
                      ? "border-white"
                      : "border-white/20 opacity-70 hover:opacity-100"
                  }`}
                  aria-label={`${galleryLabel}: ${index + 1}`}
                >
                  <Image
                    src={image.url}
                    alt={image.alt}
                    fill
                    className="object-cover"
                    sizes="128px"
                  />
                </button>
              ))}
            </div>
          ) : null}
        </div>
      </section>

      {activeIndex !== null && hasImages ? (
        <div
          className="fixed inset-0 z-[100] bg-black text-white"
          onTouchStart={(event) => setTouchStartX(event.touches[0]?.clientX ?? null)}
          onTouchEnd={(event) =>
            handleTouchEnd(
              event.changedTouches[0]?.clientX ?? touchStartX ?? 0,
              showPrevious,
              showNext,
            )
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

          {hasMultipleImages ? (
            <>
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
            </>
          ) : null}

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
