"use client";

import Image from "next/image";
import { useEffect, useEffectEvent, useRef } from "react";

type Props = {
  images: string[];
  index: number;
  alt: string;
  onIndexChange: (index: number) => void;
  onClose: () => void;
};

const SWIPE_THRESHOLD = 50;

export function Lightbox({ images, index, alt, onIndexChange, onClose }: Props) {
  const touchStartX = useRef<number | null>(null);
  const many = images.length > 1;
  const prev = () => onIndexChange((index - 1 + images.length) % images.length);
  const next = () => onIndexChange((index + 1) % images.length);

  const onKey = useEffectEvent((e: KeyboardEvent) => {
    if (e.key === "Escape") onClose();
    else if (many && e.key === "ArrowLeft") prev();
    else if (many && e.key === "ArrowRight") next();
  });
  useEffect(() => {
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  // Lock page scroll while open.
  useEffect(() => {
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, []);

  function onTouchEnd(e: React.TouchEvent) {
    if (touchStartX.current === null || !many) return;
    const dx = e.changedTouches[0].clientX - touchStartX.current;
    touchStartX.current = null;
    if (dx > SWIPE_THRESHOLD) prev();
    else if (dx < -SWIPE_THRESHOLD) next();
  }

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={`${alt} – galerie`}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/90"
      onClick={onClose}
      onTouchStart={(e) => (touchStartX.current = e.touches[0].clientX)}
      onTouchEnd={onTouchEnd}
    >
      <div className="relative h-[90vh] w-[90vw]" onClick={(e) => e.stopPropagation()}>
        <Image src={images[index]} alt={alt} fill sizes="90vw" className="object-contain" />
      </div>

      <button
        type="button"
        autoFocus
        onClick={onClose}
        aria-label="Închide"
        className="absolute top-4 right-4 flex h-12 w-12 items-center justify-center rounded-full bg-white/10 text-white transition hover:bg-white/25"
      >
        <svg aria-hidden width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
          <path d="M6 6l12 12M18 6 6 18" />
        </svg>
      </button>

      {many && (
        <>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              prev();
            }}
            aria-label="Imaginea anterioară"
            className="absolute left-3 flex h-12 w-12 items-center justify-center rounded-full bg-white/10 text-white transition hover:bg-white/25 sm:left-6"
          >
            <svg aria-hidden width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <path d="m15 18-6-6 6-6" />
            </svg>
          </button>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              next();
            }}
            aria-label="Imaginea următoare"
            className="absolute right-3 flex h-12 w-12 items-center justify-center rounded-full bg-white/10 text-white transition hover:bg-white/25 sm:right-6"
          >
            <svg aria-hidden width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <path d="m9 18 6-6-6-6" />
            </svg>
          </button>
          <p className="absolute bottom-5 left-1/2 -translate-x-1/2 rounded-full bg-white/10 px-4 py-1.5 text-base font-semibold text-white">
            {index + 1} / {images.length}
          </p>
        </>
      )}
    </div>
  );
}
