"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";

type Notif = { animeId: string; title: string; poster: string | null; episode: number; createdAt: number };

const fmt = (t: number) => {
  const d = Date.now() - t;
  if (d < 3600_000) return `${Math.max(1, Math.round(d / 60000))} мин назад`;
  if (d < 86400_000) return `${Math.round(d / 3600_000)} ч назад`;
  return new Date(t).toLocaleDateString("ru-RU", { day: "numeric", month: "short" });
};

/** Колокольчик: уведомления о новых сериях для аниме из избранного. */
export default function NotificationCenter() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [items, setItems] = useState<Notif[]>([]);
  const [unread, setUnread] = useState(0);
  const [open, setOpen] = useState(false);
  const boxRef = useRef<HTMLDivElement>(null);

  const load = useCallback(async () => {
    try {
      const r = await fetch("/api/notifications");
      const d = await r.json();
      setItems(d.items ?? []);
      setUnread(d.unread ?? 0);
    } catch {}
  }, []);

  useEffect(() => {
    fetch("/api/auth/me")
      .then((r) => r.json())
      .then((d) => {
        if (d.user) {
          setLoggedIn(true);
          load();
        }
      })
      .catch(() => {});
  }, [load]);

  useEffect(() => {
    const on = (e: MouseEvent) => {
      if (!boxRef.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", on);
    return () => document.removeEventListener("mousedown", on);
  }, []);

  const toggle = async () => {
    const next = !open;
    setOpen(next);
    if (next) {
      await load();
      if (unread > 0) {
        setUnread(0);
        fetch("/api/notifications", { method: "POST" }).catch(() => {});
      }
    }
  };

  if (!loggedIn) return null;

  return (
    <div ref={boxRef} className="relative">
      <button onClick={toggle} aria-label="Уведомления" className="glass relative grid h-9 w-9 place-items-center rounded-full transition hover:bg-white/10">
        <svg viewBox="0 0 24 24" className="h-4.5 w-4.5 h-[18px] w-[18px] stroke-white/80" fill="none" strokeWidth="2">
          <path d="M18 8a6 6 0 0 0-12 0c0 7-3 9-3 9h18s-3-2-3-9" />
          <path d="M13.7 21a2 2 0 0 1-3.4 0" />
        </svg>
        {unread > 0 && (
          <span className="absolute -right-0.5 -top-0.5 grid h-4 min-w-4 place-items-center rounded-full bg-pink-500 px-1 text-[10px] font-bold text-white">
            {unread > 9 ? "9+" : unread}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 top-full z-50 mt-2 max-h-[70vh] w-80 max-w-[calc(100vw-2rem)] overflow-y-auto rounded-2xl border border-line bg-ink/95 p-2 shadow-2xl shadow-black/60 backdrop-blur-xl">
          <p className="px-3 py-2 text-xs font-semibold uppercase tracking-wider text-white/40">Уведомления</p>
          {items.length === 0 && <p className="px-3 pb-3 text-sm text-white/40">Пока пусто. Добавляй аниме в коллекцию — и узнавай о новых сериях первым.</p>}
          {items.map((n) => (
            <Link key={`${n.animeId}-${n.createdAt}`} href={`/anime/${n.animeId}`} onClick={() => setOpen(false)} className="flex items-center gap-3 rounded-xl px-2 py-2 transition hover:bg-white/10">
              {n.poster ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={n.poster} alt="" className="h-14 w-10 shrink-0 rounded-lg object-cover" />
              ) : (
                <span className="h-14 w-10 shrink-0 rounded-lg bg-white/10" />
              )}
              <span className="min-w-0">
                <span className="block truncate text-sm font-semibold">{n.title}</span>
                <span className="block text-xs text-emerald-300">Вышла {n.episode} серия</span>
                <span className="block text-[11px] text-white/40">{fmt(n.createdAt)}</span>
              </span>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
