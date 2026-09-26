"use client";

import { useState } from "react";

export type Me = { name: string; picture: string };

const ERRORS: Record<string, string> = {
  "auth/email-already-in-use": "Этот email уже зарегистрирован — войдите.",
  "auth/invalid-credential": "Неверный email или пароль.",
  "auth/wrong-password": "Неверный email или пароль.",
  "auth/user-not-found": "Неверный email или пароль.",
  "auth/weak-password": "Пароль слишком простой — минимум 6 символов.",
  "auth/invalid-email": "Похоже, в email опечатка.",
  "auth/too-many-requests": "Слишком много попыток — подождите минуту.",
  "auth/network-request-failed": "Нет соединения с сервером.",
  "auth/popup-closed-by-user": "Окно входа было закрыто.",
  "auth/unauthorized-domain": "Домен не добавлен в Firebase → Authentication → Settings → Authorized domains.",
};

function ruErr(code?: string) {
  return (code && ERRORS[code]) || "Не получилось. Проверьте данные и попробуйте ещё раз.";
}

export async function loadAuth() {
  const [fb, { auth }] = await Promise.all([import("firebase/auth"), import("@/lib/fbClient")]);
  return { fb, auth };
}

/** Модальное окно входа и регистрации (email+пароль и Google). */
export default function AuthModal({ onClose, onDone }: { onClose: () => void; onDone: (u: Me) => void }) {
  const [mode, setMode] = useState<"login" | "register">("login");
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const [err, setErr] = useState("");
  const [busy, setBusy] = useState(false);

  const finish = async (idToken: string) => {
    const r = await fetch("/api/auth/session", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ idToken }),
    });
    const d = await r.json();
    if (!d.ok) throw new Error("session");
    onDone(d.user);
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setErr("");
    try {
      const { fb, auth } = await loadAuth();
      const cred =
        mode === "register"
          ? await fb.createUserWithEmailAndPassword(auth, email.trim(), pass)
          : await fb.signInWithEmailAndPassword(auth, email.trim(), pass);
      await finish(await cred.user.getIdToken());
    } catch (ex) {
      setErr(ruErr((ex as { code?: string })?.code));
    } finally {
      setBusy(false);
    }
  };

  const google = async () => {
    setBusy(true);
    setErr("");
    try {
      const { fb, auth } = await loadAuth();
      const cred = await fb.signInWithPopup(auth, new fb.GoogleAuthProvider());
      await finish(await cred.user.getIdToken());
    } catch (ex) {
      setErr(ruErr((ex as { code?: string })?.code));
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] grid place-items-center bg-black/70 p-4 backdrop-blur-sm" onClick={onClose}>
      <div
        className="fade-up w-full max-w-sm rounded-3xl border border-line bg-ink/95 p-6 shadow-2xl shadow-black/70 backdrop-blur-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-5 flex items-center justify-between">
          <span className="font-display text-lg font-bold tracking-tight">
            ANI<span className="grad-text">VERSE</span>
          </span>
          <button onClick={onClose} aria-label="Закрыть" className="grid h-8 w-8 place-items-center rounded-xl glass transition hover:bg-white/10">
            <svg viewBox="0 0 24 24" className="h-4 w-4 stroke-white" fill="none" strokeWidth="2"><path d="M6 6l12 12M18 6 6 18" /></svg>
          </button>
        </div>

        <div className="glass mb-5 grid grid-cols-2 rounded-full p-1 text-sm font-semibold">
          <button
            onClick={() => { setMode("login"); setErr(""); }}
            className={`rounded-full py-2 transition ${mode === "login" ? "btn-primary" : "text-white/60 hover:text-white"}`}
          >
            Вход
          </button>
          <button
            onClick={() => { setMode("register"); setErr(""); }}
            className={`rounded-full py-2 transition ${mode === "register" ? "btn-primary" : "text-white/60 hover:text-white"}`}
          >
            Регистрация
          </button>
        </div>

        <form onSubmit={submit} className="space-y-3">
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            className="glass w-full rounded-xl px-4 py-3 text-sm outline-none transition placeholder:text-white/40 focus:border-accent/60"
          />
          <input
            type="password"
            required
            minLength={6}
            value={pass}
            onChange={(e) => setPass(e.target.value)}
            placeholder="Пароль (минимум 6 символов)"
            className="glass w-full rounded-xl px-4 py-3 text-sm outline-none transition placeholder:text-white/40 focus:border-accent/60"
          />
          {err && <p className="text-xs font-semibold text-red-400">{err}</p>}
          <button type="submit" disabled={busy} className="btn-primary w-full rounded-xl py-3 text-sm font-semibold transition hover:scale-[1.02]">
            {busy ? "Секунду…" : mode === "register" ? "Создать аккаунт" : "Войти"}
          </button>
        </form>

        <div className="my-4 flex items-center gap-3 text-[11px] uppercase tracking-widest text-white/30">
          <span className="h-px flex-1 bg-line" /> или <span className="h-px flex-1 bg-line" />
        </div>

        <button onClick={google} disabled={busy} className="glass flex w-full items-center justify-center gap-2 rounded-xl py-3 text-sm font-semibold transition hover:bg-white/10">
          <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden>
            <path fill="#EA4335" d="M12 5.4c1.6 0 3 .55 4.1 1.62l3.07-3.07C17.3 2.19 14.87 1.2 12 1.2 7.78 1.2 4.13 3.62 2.35 7.16l3.58 2.78C6.78 7.32 9.16 5.4 12 5.4z" />
            <path fill="#4285F4" d="M23.49 12.27c0-.79-.07-1.55-.2-2.28H12v4.51h6.44c-.28 1.48-1.12 2.73-2.4 3.58l3.7 2.87c2.16-2 3.75-4.94 3.75-8.68z" />
            <path fill="#FBBC05" d="M5.93 14.06a6.6 6.6 0 0 1 0-4.12L2.35 7.16a10.8 10.8 0 0 0 0 9.68l3.58-2.78z" />
            <path fill="#34A853" d="M12 22.8c2.87 0 5.28-.95 7.04-2.57l-3.7-2.87c-1.02.69-2.33 1.1-3.34 1.1-2.84 0-5.22-1.92-6.07-4.5l-3.58 2.78C4.13 20.38 7.78 22.8 12 22.8z" />
          </svg>
          Продолжить с Google
        </button>
      </div>
    </div>
  );
}
