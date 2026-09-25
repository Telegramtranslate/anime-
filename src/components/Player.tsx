"use client";

import { useEffect, useMemo, useState } from "react";
import type { Translation } from "@/lib/kodik";

type Meta = { animeId: string; title: string; poster: string | null };

export default function Player({ translations, meta }: { translations: Translation[]; meta: Meta }) {
  const storeKey = `tr:${meta.animeId}`;
  const [sel, setSel] = useState<number>(translations[0]?.id ?? 0);
  const [tab, setTab] = useState<"voice" | "subtitles">("voice");
  const [started, setStarted] = useState(false);

  useEffect(() => {
    const saved = Number(localStorage.getItem(storeKey));
    const t = translations.find((x) => x.id === saved);
    if (t) {
      setSel(t.id);
      setTab(t.type === "subtitles" ? "subtitles" : "voice");
    }
  }, [storeKey, translations]);

  const current = translations.find((t) => t.id === sel) ?? translations[0];
  const shown = useMemo(() => translations.filter((t) => (tab === "voice" ? t.type !== "subtitles" : t.type === "subtitles")), [translations, tab]);
  const hasSubs = translations.some((t) => t.type === "subtitles");

  const choose = (t: Translation) => {
    setSel(t.id);
    localStorage.setItem(storeKey, String(t.id));
    track(t.title);
  };

  const track = (tr?: string) => {
    fetch("/api/history", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ ...meta, translation: tr ?? current?.title }),
    }).catch(() => {});
  };

  if (!current) return <div className="glass grid aspect-video place-items-center rounded-3xl text-white/50">Видео недоступно</div>;
  const src = (current.link.startsWith("//") ? "https:" : "") + current.link;

  return (
    <div className="grid gap-5 lg:grid-cols-[1fr_320px]">
      <div className="relative aspect-video overflow-hidden rounded-3xl bg-black ring-1 ring-line shadow-[0_30px_120px_-30px_rgba(139,92,246,.45)]">
        {started ? (
          <iframe key={src} src={src} className="absolute inset-0 h-full w-full" allow="autoplay *; fullscreen *" allowFullScreen />
        ) : (
          <button
            onClick={() => { setStarted(true); track(); }}
            className="group absolute inset-0 grid place-items-center"
            style={{ backgroundImage: meta.poster ? `url(${meta.poster})` : undefined, backgroundSize: "cover", backgroundPosition: "center" }}
          >
            <span className="absolute inset-0 bg-black/60 backdrop-blur-md" />
            <span className="relative flex flex-col items-center gap-4">
              <span className="btn-primary grid h-20 w-20 place-items-center rounded-full transition group-hover:scale-110">
                <svg viewBox="0 0 24 24" className="ml-1 h-8 w-8 fill-white"><path d="M8 5v14l11-7z" /></svg>
              </span>
              <span className="font-semibold">Смотреть в озвучке {current.title}</span>
            </span>
          </button>
        )}
      </div>

      <aside className="glass flex max-h-[520px] flex-col rounded-3xl p-4 lg:max-h-none">
        <div className="mb-3 flex items-center justify-between px-1">
          <h3 className="font-display text-sm font-bold">Озвучка</h3>
          <span className="text-xs text-white/40">{translations.length} вариантов</span>
        </div>
        {hasSubs && (
          <div className="mb-3 grid grid-cols-2 gap-1 rounded-xl bg-black/30 p-1 text-xs font-semibold">
            {(["voice", "subtitles"] as const).map((t) => (
              <button key={t} onClick={() => setTab(t)} className={`rounded-lg py-2 transition ${tab === t ? "bg-white/10 text-white" : "text-white/50"}`}>
                {t === "voice" ? "Озвучка" : "Субтитры"}
              </button>
            ))}
          </div>
        )}
        <div className="no-scrollbar -mx-1 flex-1 space-y-1 overflow-y-auto px-1 lg:max-h-[440px]">
          {shown.map((t) => (
            <button
              key={t.id}
              onClick={() => choose(t)}
              className={`flex w-full items-center justify-between rounded-xl px-3.5 py-3 text-left text-sm transition ${
                t.id === current.id ? "bg-gradient-to-r from-accent/30 to-accent2/20 ring-1 ring-accent/50" : "hover:bg-white/5"
              }`}
            >
              <span className="truncate font-medium">{t.title}</span>
              {t.episodes ? <span className="ml-2 shrink-0 text-xs text-white/40">{t.episodes} эп.</span> : null}
            </button>
          ))}
        </div>
      </aside>
    </div>
  );
}
