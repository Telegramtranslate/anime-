"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

const NAV = [
  { href: "/", label: "Главная" },
  { href: "/catalog", label: "Каталог" },
  { href: "/catalog?status=ongoing", label: "Онгоинги" },
  { href: "/catalog?kind=movie", label: "Фильмы" },
  { href: "/my", label: "Коллекция" },
];

type Sugg = { id: string; title: string; titleEn: string | null; poster: string | null; year: number | null };

/** Поиск с живыми подсказками: варианты появляются уже во время набора. */
function SearchBox({ className }: { className?: string }) {
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
    <div ref={boxRef} className={`relative ${className ?? ""}`}>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          showAll();
        }}
        className="glass flex w-full items-center gap-2 rounded-full px-4 py-2.5 transition focus-within:border-accent/60"
      >
        <svg viewBox="0 0 24 24" className="h-4 w-4 shrink-0 stroke-white/50" fill="none" strokeWidth="2"><circle cx="11" cy="11" r="7" /><path d="m20 20-3.5-3.5" /></svg>
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Найти аниме…"
          className="w-full bg-transparent text-sm outline-none placeholder:text-white/40"
        />
      </form>

      {open && items.length > 0 && (
        <div className="glass absolute inset-x-0 top-full z-50 mt-2 max-h-[70vh] overflow-y-auto rounded-2xl p-2 shadow-2xl shadow-black/60">
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

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const path = usePathname();

  useEffect(() => {
    const on = () => setScrolled(window.scrollY > 20);
    on();
    window.addEventListener("scroll", on, { passive: true });
    return () => window.removeEventListener("scroll", on);
  }, []);

  useEffect(() => setOpen(false), [path]);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
        scrolled ? "border-b border-line bg-ink/75 backdrop-blur-xl" : "bg-gradient-to-b from-black/70 to-transparent"
      }`}
    >
      <div className="mx-auto flex h-16 max-w-[1500px] items-center gap-6 px-5 md:h-20 md:px-10">
        <Link href="/" className="flex items-center gap-2.5">
          <span className="btn-primary grid h-9 w-9 place-items-center rounded-xl">
            <svg viewBox="0 0 24 24" className="h-4 w-4 fill-white"><path d="M8 5v14l11-7z" /></svg>
          </span>
          <span className="font-display text-lg font-bold tracking-tight">
            ANI<span className="grad-text">VERSE</span>
          </span>
        </Link>
        <nav className="hidden items-center gap-1 lg:flex">
          {NAV.map((n) => (
            <Link key={n.href} href={n.href} className="rounded-full px-4 py-2 text-sm font-medium text-white/70 transition hover:bg-white/5 hover:text-white">
              {n.label}
            </Link>
          ))}
        </nav>
        <SearchBox className="ml-auto hidden w-72 transition-all duration-300 focus-within:w-96 md:block" />
        <button onClick={() => setOpen(!open)} className="ml-auto grid h-10 w-10 place-items-center rounded-xl glass md:ml-0 lg:hidden" aria-label="Меню">
          <svg viewBox="0 0 24 24" className="h-5 w-5 stroke-white" fill="none" strokeWidth="2"><path d={open ? "M6 6l12 12M18 6 6 18" : "M4 7h16M4 12h16M4 17h16"} /></svg>
        </button>
      </div>
      {open && (
        <div className="border-t border-line bg-ink/95 px-5 pb-6 pt-4 backdrop-blur-xl lg:hidden">
          <SearchBox className="mb-4 md:hidden" />
          {NAV.map((n) => (
            <Link key={n.href} href={n.href} className="block rounded-xl px-3 py-3 text-white/80 hover:bg-white/5">{n.label}</Link>
          ))}
        </div>
      )}
    </header>
  );
}
