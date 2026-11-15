"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import items from "@/data/gallery.json";
import { SectionHeading } from "./SectionHeading";

const spanClass: Record<string, string> = {
  wide: "col-span-2",
  tall: "row-span-2",
  "": "",
};

export function Gallery() {
  const [open, setOpen] = useState<number | null>(null);
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const d = dialogRef.current;
    if (!d) return;
    if (open !== null && !d.open) d.showModal();
    if (open === null && d.open) d.close();
  }, [open]);

  const move = (dir: number) =>
    setOpen((i) => (i === null ? i : (i + dir + items.length) % items.length));

  const current = open !== null ? items[open] : null;

  return (
    <section id="gallery" aria-labelledby="gallery-title" className="py-16 md:py-24">
      <div className="mx-auto max-w-6xl px-4">
        <SectionHeading
          id="gallery-title"
          eyebrow="From the Shop"
          title="Gallery"
          intro="Chairs, tools and a few fresh cuts. Tap a photo to see it full screen."
        />

        <ul className="grid auto-rows-[9.5rem] grid-flow-dense grid-cols-2 gap-2 sm:auto-rows-[12rem] md:grid-cols-4 md:gap-3">
          {items.map((it, i) => (
            <li key={it.src} className={spanClass[it.span]}>
              <button
                type="button"
                onClick={() => setOpen(i)}
                aria-label={`${it.caption}. ${it.alt}. Open full screen`}
                className="group relative block size-full overflow-hidden border-2 border-ink"
              >
                <Image
                  src={it.src}
                  alt=""
                  fill
                  quality={65}
                  sizes={it.span === "wide" ? "(min-width:768px) 50vw, 100vw" : "(min-width:768px) 25vw, 50vw"}
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <span className="absolute bottom-0 left-0 bg-cream px-2 py-1 font-sign text-[.7rem] uppercase tracking-[.16em]">
                  {it.caption}
                </span>
              </button>
            </li>
          ))}
        </ul>
      </div>

      <dialog
        ref={dialogRef}
        aria-label="Photo viewer"
        onClose={() => setOpen(null)}
        onKeyDown={(e) => {
          if (e.key === "ArrowRight") move(1);
          if (e.key === "ArrowLeft") move(-1);
        }}
        className="dark-zone m-0 h-dvh max-h-none w-dvw max-w-none bg-transparent p-0 text-cream backdrop:bg-board/95"
      >
        {current ? (
          <div
            className="relative flex size-full flex-col items-center justify-center gap-3 p-4 pb-6"
            onClick={(e) => {
              if (e.target === e.currentTarget) setOpen(null);
            }}
          >
            <Image
              key={current.src}
              src={current.src}
              alt={current.alt}
              width={current.w}
              height={current.h}
              quality={80}
              sizes="100vw"
              className="border-2 border-brass object-contain"
              style={{ width: "auto", height: "auto", maxWidth: "100%", maxHeight: "76dvh" }}
            />
            <p className="text-center font-sign text-sm uppercase tracking-[.18em]">
              {current.caption} <span className="text-brass-light">· {(open ?? 0) + 1} / {items.length}</span>
            </p>

            <button
              type="button"
              onClick={() => setOpen(null)}
              aria-label="Close viewer"
              className="absolute right-3 top-3 inline-flex size-12 items-center justify-center border-2 border-cream hover:bg-cream hover:text-ink"
            >
              <svg viewBox="0 0 24 24" className="size-6" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" aria-hidden="true">
                <path d="M5 5 L19 19 M19 5 L5 19" />
              </svg>
            </button>
            <button
              type="button"
              onClick={() => move(-1)}
              aria-label="Previous photo"
              className="absolute left-2 top-1/2 inline-flex size-12 -translate-y-1/2 items-center justify-center border-2 border-cream bg-board/80 hover:bg-cream hover:text-ink"
            >
              <svg viewBox="0 0 24 24" className="size-6" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M15 5 L8 12 L15 19" />
              </svg>
            </button>
            <button
              type="button"
              onClick={() => move(1)}
              aria-label="Next photo"
              className="absolute right-2 top-1/2 inline-flex size-12 -translate-y-1/2 items-center justify-center border-2 border-cream bg-board/80 hover:bg-cream hover:text-ink"
            >
              <svg viewBox="0 0 24 24" className="size-6" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M9 5 L16 12 L9 19" />
              </svg>
            </button>
          </div>
        ) : null}
      </dialog>
    </section>
  );
}
