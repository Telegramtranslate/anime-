"use client";

import { useEffect, useState } from "react";

const fmt = (t: number) =>
  new Date(t).toLocaleDateString("ru-RU", { day: "numeric", month: "long", year: "numeric" });

/** Смена никнейма — не чаще одного раза в 7 дней. */
export default function NicknameModal({ onClose, onDone }: { onClose: () => void; onDone: (name: string) => void }) {
  const [name, setName] = useState("");
  const [canChange, setCanChange] = useState(true);
  const [nextAt, setNextAt] = useState<number | null>(null);
  const [err, setErr] = useState("");
  const [busy, setBusy] = useState(false);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    fetch("/api/auth/profile")
      .then((r) => r.json())
      .then((d) => {
        setName(d.name ?? "");
        setCanChange(!!d.canChange);
        setNextAt(d.nextAt ?? null);
        setLoaded(true);
      })
      .catch(() => setLoaded(true));
  }, []);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setErr("");
    try {
      const r = await fetch("/api/auth/rename", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ name }),
      });
      const d = await r.json();
      if (d.ok) onDone(d.name);
      else if (d.error === "soon") {
        setCanChange(false);
        setNextAt(d.nextAt ?? null);
        setErr("Сменить ник можно раз в 7 дней.");
      } else if (d.error === "short") setErr("Минимум 2 символа.");
      else setErr("Не получилось сохранить, попробуй позже.");
    } catch {
      setErr("Не получилось сохранить, попробуй позже.");
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
          <span className="font-display text-lg font-bold tracking-tight">Смена никнейма</span>
          <button onClick={onClose} aria-label="Закрыть" className="grid h-8 w-8 place-items-center rounded-xl glass transition hover:bg-white/10">
            <svg viewBox="0 0 24 24" className="h-4 w-4 stroke-white" fill="none" strokeWidth="2"><path d="M6 6l12 12M18 6 6 18" /></svg>
          </button>
        </div>

        <form onSubmit={submit} className="space-y-3">
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            maxLength={30}
            minLength={2}
            required
            disabled={!canChange || busy}
            placeholder="Новый никнейм"
            className="glass w-full rounded-xl px-4 py-3 text-sm outline-none transition placeholder:text-white/40 focus:border-accent/60 disabled:opacity-50"
          />
          <p className="text-xs text-white/40">
            {canChange
              ? "Менять никнейм можно не чаще одного раза в 7 дней."
              : nextAt
                ? `Следующая смена доступна ${fmt(nextAt)}.`
                : "Смена временно недоступна."}
          </p>
          {err && <p className="text-xs font-semibold text-red-400">{err}</p>}
          <button type="submit" disabled={busy || !canChange || !loaded} className="btn-primary w-full rounded-xl py-3 text-sm font-semibold transition hover:scale-[1.02] disabled:opacity-50">
            {busy ? "Секунду…" : "Сохранить"}
          </button>
        </form>
      </div>
    </div>
  );
}
