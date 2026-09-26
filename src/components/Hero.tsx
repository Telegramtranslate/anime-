"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import type { Anime } from "@/lib/kodik";

const KIND: Record<string, string> = { tv: "ТВ-сериал", movie: "Фильм", ova: "OVA", ona: "ONA", special: "Спешл" };

export default function Hero({ items }: { items: Anime[] }) {
  const [i, setI] = useState(0);
  useEffect(() => {
    if (items.length < 2) return;
    const t = setInterval(() => setI((x) => (x + 1) % items.length), 8000);
    return () => clearInterval(t);
  }, [items.length, i]);
  if (!items.length) return <div className="h-[70vh]" />;
  const a = items[i];

  return (
    <section className="relative h-[88vh] min-h-[620px] w-full overflow-hidden">
      {items.map((x, k) => (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          key={x.id}
          src={x.backdrop ?? x.poster ?? ""}
          alt=""
          loading={k === 0 ? "eager" : "lazy"}
          fetchPriority={k === 0 ? "high" : "auto"}
          decoding="async"
          className={`absolute inset-0 h-full w-full object-cover transition-all duration-[1500ms] ${k === i ? "scale-105 opacity-100" : "scale-100 opacity-0"}`}
        />
      ))}
      <div className="absolute inset-0 bg-gradient-to-r from-ink via-ink/70 to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-t from-ink via-transparent to-ink/30" />
      <div className="absolute -left-40 top-1/3 h-[500px] w-[500px] rounded-full bg-accent/20 blur-[140px]" />

      <div className="relative mx-auto flex h-full max-w-[1500px] items-end px-5 pb-28 md:items-center md:px-10 md:pb-0">
        <div key={a.id} className="fade-up max-w-2xl">
          <div className="mb-5 flex flex-wrap items-center gap-2 text-xs font-semibold">
            <span className="rounded-full bg-accent/20 px-3 py-1 text-violet-200 ring-1 ring-accent/40">
              {a.status === "ongoing" ? "● Сейчас выходит" : "Рекомендуем"}
            </span>
            {a.rating && <span className="glass rounded-full px-3 py-1"><span className="text-amber-400">★</span> {a.rating.toFixed(2)}</span>}
            {a.year && <span className="glass rounded-full px-3 py-1">{a.year}</span>}
            {a.kind && <span className="glass rounded-full px-3 py-1">{KIND[a.kind] ?? a.kind}</span>}
          </div>
          <h1 className="font-display line-clamp-3 text-4xl font-extrabold leading-[1.05] tracking-tight md:text-6xl lg:text-7xl">{a.title}</h1>
          {a.titleEn && <p className="mt-3 text-lg text-white/50">{a.titleEn}</p>}
          {a.description && <p className="mt-5 line-clamp-3 max-w-xl text-base leading-relaxed text-white/70">{a.description}</p>}
          <div className="mt-4 flex flex-wrap gap-2 text-sm text-white/50">
            {a.genres.slice(0, 4).map((g) => <span key={g}>#{g}</span>)}
          </div>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link href={`/anime/${a.id}#player`} className="btn-primary flex items-center gap-2 rounded-full px-7 py-4 font-semibold transition hover:scale-[1.03]">
              <svg viewBox="0 0 24 24" className="h-5 w-5 fill-white"><path d="M8 5v14l11-7z" /></svg>
              Смотреть
            </Link>
            <Link href={`/anime/${a.id}`} className="glass rounded-full px-7 py-4 font-semibold transition hover:bg-white/10">Подробнее</Link>
          </div>
        </div>
      </div>

      <div className="absolute bottom-10 right-5 hidden gap-3 md:right-10 md:flex">
        {items.map((x, k) => (
          <button
            key={x.id}
            onClick={() => setI(k)}
            className={`relative h-24 w-16 overflow-hidden rounded-xl ring-2 transition-all duration-300 ${k === i ? "ring-white scale-110" : "ring-transparent opacity-50 hover:opacity-100"}`}
            aria-label={x.title}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={x.poster ?? ""} alt="" loading="lazy" decoding="async" className="h-full w-full object-cover" />
          </button>
        ))}
      </div>
    </section>
  );
}
