import Link from "next/link";
import type { Anime } from "@/lib/kodik";
import AnimeCard from "./AnimeCard";

export default function Row({ title, subtitle, items, href, ranked }: { title: string; subtitle?: string; items: Anime[]; href?: string; ranked?: boolean }) {
  if (!items.length) return null;
  return (
    <section className="mx-auto mt-14 max-w-[1500px]">
      <div className="mb-5 flex items-end justify-between px-5 md:px-10">
        <div>
          <h2 className="font-display text-xl font-bold md:text-2xl">{title}</h2>
          {subtitle && <p className="mt-1 text-sm text-white/40">{subtitle}</p>}
        </div>
        {href && (
          <Link href={href} className="group flex items-center gap-1 text-sm font-medium text-white/50 transition hover:text-white">
            Все <span className="transition group-hover:translate-x-1">→</span>
          </Link>
        )}
      </div>
      <div className="no-scrollbar flex snap-x gap-4 overflow-x-auto scroll-smooth px-5 pb-4 md:gap-5 md:px-10">
        {items.map((a, i) => (
          <div key={a.id} className={`shrink-0 snap-start ${ranked ? "w-44 md:w-52 pl-6" : "w-36 md:w-48"}`}>
            <AnimeCard a={a} rank={ranked ? i + 1 : undefined} />
          </div>
        ))}
      </div>
    </section>
  );
}
