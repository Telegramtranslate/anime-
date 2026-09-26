"use client";

import Link from "next/link";
import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";
import type { Me } from "./AuthModal";

// firebase подгружается отдельным чанком только при открытии модалок входа/никнейма
const AuthModal = dynamic(() => import("./AuthModal"), { ssr: false });
const NicknameModal = dynamic(() => import("./NicknameModal"), { ssr: false });

/** Кнопка входа / меню аккаунта в шапке. */
export default function AuthButton() {
  const [me, setMe] = useState<Me | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [modal, setModal] = useState(false);
  const [nickOpen, setNickOpen] = useState(false);
  const boxRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetch("/api/auth/me")
      .then((r) => r.json())
      .then((d) => d.user && setMe(d.user))
      .catch(() => {});
  }, []);

  useEffect(() => {
    const on = (e: MouseEvent) => {
      if (!boxRef.current?.contains(e.target as Node)) setMenuOpen(false);
    };
    document.addEventListener("mousedown", on);
    return () => document.removeEventListener("mousedown", on);
  }, []);

  const logout = async () => {
    setMenuOpen(false);
    const { fb, auth } = await import("./AuthModal").then((m) => m.loadAuth());
    await fetch("/api/auth/logout", { method: "POST" });
    await fb.signOut(auth).catch(() => {});
    setMe(null);
    window.location.reload();
  };

  if (me) {
    return (
      <>
      <div ref={boxRef} className="relative">
        <button onClick={() => setMenuOpen((o) => !o)} className="flex items-center" aria-label="Меню аккаунта">
          {me.picture ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={me.picture} alt="" className="h-8 w-8 rounded-full object-cover ring-1 ring-line" referrerPolicy="no-referrer" />
          ) : (
            <span className="btn-primary grid h-8 w-8 place-items-center rounded-full text-sm font-bold">{me.name?.[0]?.toUpperCase() ?? "A"}</span>
          )}
        </button>
        {menuOpen && (
          <div className="absolute right-0 top-full z-50 mt-2 w-64 rounded-2xl border border-line bg-ink/95 p-2 shadow-2xl shadow-black/60 backdrop-blur-xl">
            <p className="truncate px-3 py-2 text-xs text-white/60">{me.name || "Мой аккаунт"}</p>
            <Link href="/my" onClick={() => setMenuOpen(false)} className="flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm font-semibold transition hover:bg-white/10">
              <svg viewBox="0 0 24 24" className="h-4 w-4 fill-pink-400"><path d="M12 21s-7.5-4.6-9.5-9.3C1 8 3.4 4.5 7 4.5c2 0 3.5 1 5 3 1.5-2 3-3 5-3 3.6 0 6 3.5 4.5 7.2C19.5 16.4 12 21 12 21z" /></svg>
              Моя коллекция
            </Link>
            <button
              onClick={() => { setMenuOpen(false); setNickOpen(true); }}
              className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm font-semibold transition hover:bg-white/10"
            >
              <svg viewBox="0 0 24 24" className="h-4 w-4 stroke-sky-300" fill="none" strokeWidth="2"><path d="M17 3a2.8 2.8 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" /></svg>
              Сменить никнейм
            </button>
            <div className="my-1 h-px bg-line" />
            <button onClick={logout} className="w-full rounded-xl px-3 py-2.5 text-left text-sm font-semibold transition hover:bg-white/10">
              Выйти
            </button>
          </div>
        )}
      </div>
      {nickOpen && (
        <NicknameModal
          onClose={() => setNickOpen(false)}
          onDone={() => {
            setNickOpen(false);
            window.location.reload();
          }}
        />
      )}
      </>
    );
  }

  return (
    <>
      <button onClick={() => setModal(true)} aria-label="Войти" className="glass flex items-center gap-2 rounded-full px-2.5 py-2 text-sm font-semibold transition hover:bg-white/10 min-[400px]:px-4">
        <svg viewBox="0 0 24 24" className="h-4 w-4 stroke-white/70" fill="none" strokeWidth="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>
        <span className="hidden min-[400px]:inline">Войти</span>
      </button>
      {modal && (
        <AuthModal
          onClose={() => setModal(false)}
          onDone={(u: Me) => {
            setModal(false);
            setMe(u);
            window.location.reload();
          }}
        />
      )}
    </>
  );
}
