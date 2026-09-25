"use client";

import { useEffect, useState } from "react";

type Props = { animeId: string; title: string; poster: string | null; year: number | null; kind: string | null };

export default function FavoriteButton(props: Props) {
  const [fav, setFav] = useState(false);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    fetch(`/api/favorites?animeId=${encodeURIComponent(props.animeId)}`)
      .then((r) => r.json())
      .then((d) => setFav(!!d.favorite))
      .catch(() => {});
  }, [props.animeId]);

  const toggle = async () => {
    setBusy(true);
    setFav((f) => !f);
    try {
      const r = await fetch("/api/favorites", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(props) });
      const d = await r.json();
      setFav(!!d.favorite);
    } finally {
      setBusy(false);
    }
  };

  return (
    <button onClick={toggle} disabled={busy} className={`glass flex items-center gap-2 rounded-full px-6 py-4 font-semibold transition hover:bg-white/10 ${fav ? "border-pink-400/50 text-pink-300" : ""}`}>
      <svg viewBox="0 0 24 24" className={`h-5 w-5 ${fav ? "fill-pink-400" : "fill-none"} stroke-current`} strokeWidth="2">
        <path d="M12 21s-7.5-4.6-9.5-9.3C1 8 3.4 4.5 7 4.5c2 0 3.5 1 5 3 1.5-2 3-3 5-3 3.6 0 6 3.5 4.5 7.2C19.5 16.4 12 21 12 21z" />
      </svg>
      {fav ? "В коллекции" : "В коллекцию"}
    </button>
  );
}
