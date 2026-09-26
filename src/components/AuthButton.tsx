"use client";

import { useEffect, useRef, useState } from "react";

type Me = { name: string; picture: string };

/** Вход через Google (Firebase Auth). Коллекция привязывается к аккаунту. */
export default function AuthButton() {
  const [me, setMe] = useState<Me | null>(null);
  const [open, setOpen] = useState(false);
  const [busy, setBusy] = useState(false);
  const boxRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetch("/api/auth/me")
      .then((r) => r.json())
      .then((d) => d.user && setMe(d.user))
      .catch(() => {});
  }, []);

  useEffect(() => {
    const on = (e: MouseEvent) => {
      if (!boxRef.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", on);
    return () => document.removeEventListener("mousedown", on);
  }, []);

  const login = async () => {
    setBusy(true);
    try {
      const [{ GoogleAuthProvider, signInWithPopup }, { auth }] = await Promise.all([
        import("firebase/auth"),
        import("@/lib/fbClient"),
      ]);
      const cred = await signInWithPopup(auth, new GoogleAuthProvider());
      const idToken = await cred.user.getIdToken();
      const r = await fetch("/api/auth/session", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ idToken }),
      });
      const d = await r.json();
      if (d.ok) {
        setMe(d.user);
        window.location.reload();
      }
    } catch {
      // закрыли окно входа или домен не авторизован в Firebase
    } finally {
      setBusy(false);
    }
  };

  const logout = async () => {
    setOpen(false);
    const [{ signOut }, { auth }] = await Promise.all([import("firebase/auth"), import("@/lib/fbClient")]);
    await fetch("/api/auth/logout", { method: "POST" });
    await signOut(auth).catch(() => {});
    setMe(null);
    window.location.reload();
  };

  if (me) {
    return (
      <div ref={boxRef} className="relative">
        <button onClick={() => setOpen((o) => !o)} className="flex items-center" aria-label="Профиль">
          {me.picture ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={me.picture} alt="" className="h-8 w-8 rounded-full object-cover ring-1 ring-line" referrerPolicy="no-referrer" />
          ) : (
            <span className="btn-primary grid h-8 w-8 place-items-center rounded-full text-sm font-bold">{me.name?.[0]?.toUpperCase() ?? "A"}</span>
          )}
        </button>
        {open && (
          <div className="absolute right-0 top-full z-50 mt-2 w-56 rounded-2xl border border-line bg-ink/95 p-2 shadow-2xl shadow-black/60 backdrop-blur-xl">
            <p className="truncate px-3 py-2 text-xs text-white/60">{me.name || "Аккаунт Google"}</p>
            <button onClick={logout} className="w-full rounded-xl px-3 py-2 text-left text-sm font-semibold transition hover:bg-white/10">
              Выйти
            </button>
          </div>
        )}
      </div>
    );
  }

  return (
    <button
      onClick={login}
      disabled={busy}
      className="glass flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold transition hover:bg-white/10"
    >
      <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden>
        <path fill="#EA4335" d="M12 5.4c1.6 0 3 .55 4.1 1.62l3.07-3.07C17.3 2.19 14.87 1.2 12 1.2 7.78 1.2 4.13 3.62 2.35 7.16l3.58 2.78C6.78 7.32 9.16 5.4 12 5.4z" />
        <path fill="#4285F4" d="M23.49 12.27c0-.79-.07-1.55-.2-2.28H12v4.51h6.44c-.28 1.48-1.12 2.73-2.4 3.58l3.7 2.87c2.16-2 3.75-4.94 3.75-8.68z" />
        <path fill="#FBBC05" d="M5.93 14.06a6.6 6.6 0 0 1 0-4.12L2.35 7.16a10.8 10.8 0 0 0 0 9.68l3.58-2.78z" />
        <path fill="#34A853" d="M12 22.8c2.87 0 5.28-.95 7.04-2.57l-3.7-2.87c-1.02.69-2.33 1.1-3.34 1.1-2.84 0-5.22-1.92-6.07-4.5l-3.58 2.78C4.13 20.38 7.78 22.8 12 22.8z" />
      </svg>
      {busy ? "Секунду…" : "Войти"}
    </button>
  );
}
