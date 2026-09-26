import Link from "next/link";
import type { Anime } from "@/lib/kodik";
import { KINDS } from "@/lib/kodik";
import Poster from "./Poster";

export default function AnimeCard({ a, rank }: { a: Anime; rank?: number }) {
  return (
    <Link href={`/anime/${a.id}`} className="group relative block">
      <div className="relative aspect-[2/3] overflow-hidden rounded-2xl bg-panel ring-1 ring-line transition duration-500 group-hover:-translate-y-1 group-hover:ring-accent/50 group-hover:shadow-[0_20px_60px_-15px_rgba(139,92,246,.5)]">
        <Poster src={a.poster} alt={a.title} className="h-full w-full object-cover transition duration-700 group-hover:scale-105" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/10 to-transparent opacity-80" />
        {a.rating ? (
          <div className="absolute left-2.5 top-2.5 flex items-center gap-1 rounded-lg bg-black/60 px-2 py-1 text-xs font-bold backdrop-blur-md">
            <span className="text-amber-400">★</span>{a.rating.toFixed(1)}
          </div>
        ) : null}
        {a.status === "ongoing" && (
          <div className="absolute right-2.5 top-2.5 rounded-lg bg-emerald-500/90 px-2 py-1 text-[10px] font-bold uppercase tracking-wider">Онгоинг</div>
        )}
        {rank !== undefined && (
          <div className="absolute -bottom-3 left-2 font-display text-7xl font-extrabold text-white/90 [-webkit-text-stroke:2px_rgba(0,0,0,.4)] drop-shadow-2xl">{rank}</div>
        )}
        <div className="absolute inset-0 grid place-items-center opacity-0 transition duration-300 group-hover:opacity-100">
          <span className="btn-primary grid h-14 w-14 scale-75 place-items-center rounded-full transition duration-300 group-hover:scale-100">
            <svg viewBox="0 0 24 24" className="ml-1 h-6 w-6 fill-white"><path d="M8 5v14l11-7z" /></svg>
          </span>
        </div>
        {a.episodesAired && a.kind !== "movie" ? (
          <div className="absolute bottom-2.5 right-2.5 rounded-md bg-white/10 px-2 py-0.5 text-[11px] font-semibold backdrop-blur-md">
            {a.episodesAired}{a.episodesTotal && a.episodesTotal !== a.episodesAired ? `/${a.episodesTotal}` : ""} эп.
          </div>
        ) : null}
      </div>
      <div className="mt-3 px-0.5">
        <h3 className="line-clamp-2 text-sm font-semibold leading-snug text-white/90 transition group-hover:text-white">{a.title}</h3>
        <p className="mt-1 text-xs text-white/40">
          {[a.year, a.kind ? KINDS[a.kind] ?? a.kind : null, a.genres[0]].filter(Boolean).join(" · ")}
        </p>
      </div>
    </Link>
  );
}
