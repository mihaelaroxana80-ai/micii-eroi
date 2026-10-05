"use client";

import Image from "next/image";
import { useState } from "react";
import { BLUR_DATA_URL } from "@/lib/config";
import { Lightbox } from "./Lightbox";

export function ProductGallery({ images: allImages, alt }: { images: string[]; alt: string }) {
  const images = [...new Set(allImages)];
  const [active, setActive] = useState(0);
  const [open, setOpen] = useState(false);

  return (
    <div className="min-w-0">
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label="Mărește imaginea"
        className="relative block aspect-[4/5] max-h-[500px] w-full cursor-zoom-in overflow-hidden rounded-2xl bg-white shadow-card"
      >
        <Image
          key={images[active]}
          src={images[active]}
          alt={alt}
          fill
          preload
          sizes="(min-width: 1024px) 50vw, 100vw"
          placeholder="blur"
          blurDataURL={BLUR_DATA_URL}
          className="object-contain p-2"
        />
      </button>

      {images.length > 1 && (
        // Scrolls sideways on its own, without moving the page.
        <div className="mt-4 flex gap-3 overflow-x-auto overscroll-x-contain pb-1">
          {images.map((src, i) => (
            <button
              key={src}
              type="button"
              onClick={() => setActive(i)}
              aria-label={`Imaginea ${i + 1}`}
              aria-current={i === active}
              className={`relative h-20 w-20 shrink-0 overflow-hidden rounded-xl border-2 bg-white transition duration-300 sm:h-24 sm:w-24 ${
                i === active ? "border-brand" : "border-line hover:border-brand-light"
              }`}
            >
              <Image src={src} alt="" fill sizes="96px" className="object-contain" />
            </button>
          ))}
        </div>
      )}

      {open && (
        <Lightbox images={images} index={active} alt={alt} onIndexChange={setActive} onClose={() => setOpen(false)} />
      )}
    </div>
  );
}
