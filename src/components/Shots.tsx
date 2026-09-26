"use client";

import { useEffect, useRef, useState } from "react";

/** Горизонтальная лента кадров со стрелками для листания. */
export default function Shots({ items }: { items: string[] }) {
  const ref = useRef<HTMLDivElement>(null);
  const [canL, setCanL] = useState(false);
  const [canR, setCanR] = useState(false);

  const update = () => {
    const el = ref.current;
    if (!el) return;
    setCanL(el.scrollLeft > 4);
    setCanR(el.scrollLeft + el.clientWidth < el.scrollWidth - 4);
  };

  useEffect(() => {
    update();
    const el = ref.current;
    el?.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      el?.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, []);

  const scroll = (dir: number) => {
    const el = ref.current;
    if (!el) return;
    el.scrollBy({ left: dir * Math.min(el.clientWidth * 0.8, 820), behavior: "smooth" });
  };

  return (
    <div className="relative">
      <div ref={ref} className="no-scrollbar flex gap-4 overflow-x-auto pb-2">
        {items.map((s) => (
          // eslint-disable-next-line @next/next/no-img-element
          <img key={s} src={s} alt="" loading="lazy" onLoad={update} className="aspect-video w-72 shrink-0 rounded-2xl object-cover ring-1 ring-line md:w-96" />
        ))}
      </div>
      {canL && (
        <button
          onClick={() => scroll(-1)}
          aria-label="Предыдущие кадры"
          className="absolute -left-3 top-1/2 grid h-11 w-11 -translate-y-1/2 place-items-center rounded-full bg-black/75 ring-1 ring-line backdrop-blur transition hover:scale-105 hover:bg-black/95 md:-left-5"
        >
          <svg viewBox="0 0 24 24" className="h-5 w-5 stroke-white" fill="none" strokeWidth="2.5"><path d="m15 6-6 6 6 6" /></svg>
        </button>
      )}
      {canR && (
        <button
          onClick={() => scroll(1)}
          aria-label="Следующие кадры"
          className="absolute -right-3 top-1/2 grid h-11 w-11 -translate-y-1/2 place-items-center rounded-full bg-black/75 ring-1 ring-line backdrop-blur transition hover:scale-105 hover:bg-black/95 md:-right-5"
        >
          <svg viewBox="0 0 24 24" className="h-5 w-5 stroke-white" fill="none" strokeWidth="2.5"><path d="m9 6 6 6-6 6" /></svg>
        </button>
      )}
    </div>
  );
}
