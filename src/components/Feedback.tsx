"use client";

import { useState } from "react";
import AuthModal from "./AuthModal";

export type CommentItem = { uid: string; name: string; picture: string | null; text: string; createdAt: number };

type Props = {
  animeId: string;
  loggedIn: boolean;
  initialAvg: number | null;
  initialCount: number;
  initialMine: number | null;
  initialComments: CommentItem[];
};

const fmtDate = (t: number) =>
  new Date(t).toLocaleDateString("ru-RU", { day: "numeric", month: "short", year: "numeric" });

/** Пользовательская оценка (отдельно от Shikimori/IMDb/KP) и комментарии. */
export default function Feedback(p: Props) {
  const [avg, setAvg] = useState(p.initialAvg);
  const [count, setCount] = useState(p.initialCount);
  const [mine, setMine] = useState(p.initialMine);
  const [comments, setComments] = useState(p.initialComments);
  const [text, setText] = useState("");
  const [busy, setBusy] = useState(false);
  const [authOpen, setAuthOpen] = useState(false);
  const [err, setErr] = useState("");

  const rate = async (s: number) => {
    if (!p.loggedIn) return setAuthOpen(true);
    setErr("");
    const r = await fetch("/api/rate", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ animeId: p.animeId, score: s }),
    });
    if (r.status === 401) return setAuthOpen(true);
    const d = await r.json();
    if (d.ok) {
      setAvg(d.avg);
      setCount(d.count);
      setMine(d.mine);
    } else {
      setErr("Не удалось сохранить оценку. Проверь Rules в Firebase (нужны коллекции ratings и animes).");
    }
  };

  const send = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!p.loggedIn) return setAuthOpen(true);
    const t = text.trim();
    if (!t || busy) return;
    setBusy(true);
    const r = await fetch("/api/comments", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ animeId: p.animeId, text: t }),
    });
    if (r.status === 401) setAuthOpen(true);
    const d = await r.json();
    if (d.ok) {
      setComments(d.comments);
      setText("");
    }
    setBusy(false);
  };

  return (
    <section className="mx-auto mt-14 max-w-[1500px] px-5 md:px-10">
      <h2 className="mb-5 font-display text-xl font-bold md:text-2xl">Оценка и комментарии</h2>

      <div className="glass rounded-3xl p-6">
        <div className="flex flex-wrap items-center gap-6">
          <div className="min-w-[120px]">
            <p className="font-display text-4xl font-extrabold">
              {avg != null ? avg.toFixed(1) : "—"}
              <span className="text-lg text-white/40"> / 10</span>
            </p>
            <p className="mt-1 text-xs text-white/40">
              оценка зрителей · {count} {count === 1 ? "голос" : count < 5 ? "голоса" : "голосов"}
            </p>
          </div>
          <div className="min-w-0 flex-1">
            <p className="mb-2 text-sm font-semibold text-white/70">Твоя оценка:</p>
            <div className="flex flex-wrap gap-1.5">
              {Array.from({ length: 10 }, (_, i) => i + 1).map((s) => (
                <button
                  key={s}
                  onClick={() => rate(s)}
                  className={`h-9 w-9 rounded-xl text-sm font-bold transition hover:scale-110 ${
                    mine === s ? "btn-primary" : "glass text-white/70 hover:bg-white/10 hover:text-white"
                  }`}
                  aria-label={`Оценка ${s}`}
                >
                  {s}
                </button>
              ))}
            </div>
            {err && <p className="mt-2 text-xs font-semibold text-red-400">{err}</p>}
          </div>
        </div>
      </div>

      <div className="mt-8 space-y-4">
        {comments.length === 0 && <p className="text-sm text-white/40">Комментариев пока нет — будь первым!</p>}
        {comments.map((c, i) => (
          <div key={`${c.uid}-${c.createdAt}-${i}`} className="glass rounded-2xl p-4">
            <div className="flex items-center gap-3">
              {c.picture ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={c.picture} alt="" className="h-9 w-9 rounded-full object-cover ring-1 ring-line" referrerPolicy="no-referrer" />
              ) : (
                <span className="btn-primary grid h-9 w-9 place-items-center rounded-full text-sm font-bold">{c.name?.[0]?.toUpperCase() ?? "А"}</span>
              )}
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold">{c.name}</p>
                <p className="text-xs text-white/40">{fmtDate(c.createdAt)}</p>
              </div>
            </div>
            <p className="mt-3 whitespace-pre-wrap break-words text-sm leading-relaxed text-white/80">{c.text}</p>
          </div>
        ))}

        {p.loggedIn ? (
          <form onSubmit={send} className="glass rounded-2xl p-4">
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              maxLength={1000}
              rows={3}
              placeholder="Написать комментарий…"
              className="w-full resize-none bg-transparent text-sm outline-none placeholder:text-white/40"
            />
            <div className="mt-2 flex items-center justify-between">
              <span className="text-xs text-white/30">{text.length}/1000</span>
              <button type="submit" disabled={busy || !text.trim()} className="btn-primary rounded-full px-6 py-2.5 text-sm font-semibold transition hover:scale-[1.03] disabled:opacity-50">
                {busy ? "Отправка…" : "Отправить"}
              </button>
            </div>
          </form>
        ) : (
          <div className="glass flex flex-wrap items-center justify-between gap-3 rounded-2xl p-4">
            <p className="text-sm text-white/50">Войди, чтобы поставить оценку и написать комментарий.</p>
            <button onClick={() => setAuthOpen(true)} className="btn-primary rounded-full px-6 py-2.5 text-sm font-semibold transition hover:scale-[1.03]">
              Войти
            </button>
          </div>
        )}
      </div>

      {authOpen && (
        <AuthModal
          onClose={() => setAuthOpen(false)}
          onDone={() => {
            setAuthOpen(false);
            window.location.reload();
          }}
        />
      )}
    </section>
  );
}
