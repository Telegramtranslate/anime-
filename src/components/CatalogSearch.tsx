"use client";

import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

type Sugg = { id: string; title: string; titleEn: string | null; poster: string | null; year: number | null };

/** Живой поиск в каталоге: варианты появляются уже во время набора. */
export default function CatalogSearch() {
  const [q, setQ] = useState("");
  const [items, setItems] = useState<Sugg[]>([]);
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const boxRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const t = q.trim();
    if (!t) {
      setItems([]);
      setOpen(false);
      return;
    }
    const h = setTimeout(() => {
      fetch(`/api/search?q=${encodeURIComponent(t)}`)
        .then((r) => r.json())
        .then((j) => {
          setItems(j.items ?? []);
          setOpen(true);
        })
        .catch(() => setItems([]));
    }, 250);
    return () => clearTimeout(h);
  }, [q]);

  useEffect(() => {
    const on = (e: MouseEvent) => {
      if (!boxRef.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", on);
    return () => document.removeEventListener("mousedown", on);
  }, []);

  const go = (id: string) => {
    setOpen(false);
    setQ("");
    router.push(`/anime/${id}`);
  };

  const showAll = () => {
    if (!q.trim()) return;
    setOpen(false);
    router.push(`/search?q=${encodeURIComponent(q.trim())}`);
  };

  return (
    <div ref={boxRef} className="relative max-w-xl">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          showAll();
        }}
        className="glass flex w-full items-center gap-3 rounded-full px-5 py-3.5 transition focus-within:border-accent/60"
      >
        <svg viewBox="0 0 24 24" className="h-5 w-5 shrink-0 stroke-white/50" fill="none" strokeWidth="2"><circle cx="11" cy="11" r="7" /><path d="m20 20-3.5-3.5" /></svg>
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Поиск аниме: начните писать название…"
          className="w-full bg-transparent text-base outline-none placeholder:text-white/40"
        />
      </form>

      {open && items.length > 0 && (
        <div className="glass absolute inset-x-0 top-full z-40 mt-2 max-h-[60vh] overflow-y-auto rounded-2xl p-2 shadow-2xl shadow-black/60">
          {items.map((s) => (
            <button key={s.id} onClick={() => go(s.id)} className="flex w-full items-center gap-3 rounded-xl px-2 py-2 text-left transition hover:bg-white/10">
              {s.poster ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={s.poster} alt="" className="h-14 w-10 shrink-0 rounded-lg object-cover" />
              ) : (
                <span className="h-14 w-10 shrink-0 rounded-lg bg-white/10" />
              )}
              <span className="min-w-0">
                <span className="block truncate text-sm font-semibold">{s.title}</span>
                <span className="block text-xs text-white/50">{s.year ?? ""}</span>
              </span>
            </button>
          ))}
          <button onClick={showAll} className="mt-1 w-full rounded-xl px-3 py-2 text-left text-xs font-semibold text-white/60 transition hover:bg-white/10 hover:text-white">
            Показать все результаты →
          </button>
        </div>
      )}
    </div>
  );
}
