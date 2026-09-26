import Link from "next/link";
import { Suspense } from "react";
import AnimeCard from "@/components/AnimeCard";
import CatalogSearch from "@/components/CatalogSearch";
import Filters from "@/components/Filters";
import { FILTER_KINDS, GENRES, MIN_YEAR, PAGE_SIZE, STATUSES, safePagedList, type ListParams } from "@/lib/kodik";

export const dynamic = "force-dynamic";
export const metadata = { title: "Каталог аниме" };

type SP = Promise<Record<string, string | undefined>>;
const SORTS: Record<string, { sort: ListParams["sort"]; order: "asc" | "desc" }> = {
  updated: { sort: "updated_at", order: "desc" },
  year_new: { sort: "year", order: "desc" },
  year_old: { sort: "year", order: "asc" },
};

export default async function Catalog({ searchParams }: { searchParams: SP }) {
  const sp = await searchParams;
  const sortConf = SORTS[sp.sort ?? ""] ?? { sort: "shikimori_rating", order: "desc" };
  const kind = sp.kind && FILTER_KINDS[sp.kind] ? sp.kind : undefined;
  const { items, next, total, page } = await safePagedList({
    sort: sortConf.sort,
    order: sortConf.order,
    anime_kind: kind,
    anime_status: sp.status && STATUSES[sp.status] ? sp.status : undefined,
    anime_genres: sp.genre,
    year: sp.year && /^\d{4}$/.test(sp.year) ? sp.year : undefined,
    types: kind === "movie" ? "anime" : undefined,
    next: sp.next,
  });

  const totalPages = total ? Math.ceil(total / PAGE_SIZE) : 0;
  const now = new Date().getFullYear();
  const years = Array.from({ length: now - MIN_YEAR }, (_, i) => now - i);
  const nextParams = new URLSearchParams(Object.entries(sp).filter(([, v]) => v) as [string, string][]);
  if (next) nextParams.set("next", next);

  const heading = sp.status === "ongoing" ? "Онгоинги" : kind === "movie" ? "Аниме-фильмы" : sp.genre ? sp.genre : "Каталог";

  return (
    <div className="mx-auto max-w-[1500px] px-5 pt-28 md:px-10 md:pt-36">
      <div className="absolute left-1/2 top-0 -z-10 h-80 w-[60%] -translate-x-1/2 rounded-full bg-accent/15 blur-[120px]" />
      <h1 className="font-display text-3xl font-extrabold md:text-5xl">{heading}</h1>
      <p className="mt-2 text-white/40">
        {total
          ? `${total.toLocaleString("ru")} релизов в базе · страниц: ${totalPages.toLocaleString("ru")}`
          : "Подборка аниме"}
      </p>
      <div className="mt-8">
        <CatalogSearch />
      </div>
      <div className="mt-6">
        <Suspense>
          <Filters
            kinds={Object.entries(FILTER_KINDS).map(([value, label]) => ({ value, label }))}
            statuses={Object.entries(STATUSES).map(([value, label]) => ({ value, label }))}
            genres={GENRES}
            years={years}
          />
        </Suspense>
      </div>

      {items.length ? (
        <div className="mt-10 grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-7">
          {items.map((a) => <AnimeCard key={a.id} a={a} />)}
        </div>
      ) : (
        <div className="glass mt-10 rounded-3xl p-16 text-center text-white/50">Ничего не найдено. Попробуйте изменить фильтры.</div>
      )}

      <div className="mt-14 flex justify-center gap-3">
        {sp.next && (
          <Link href={`/catalog?${new URLSearchParams(Object.entries(sp).filter(([k, v]) => v && k !== "next") as [string, string][])}`} className="glass rounded-full px-7 py-3.5 font-semibold hover:bg-white/10">
            ← В начало
          </Link>
        )}
        {totalPages > 0 && (
          <span className="glass self-center rounded-full px-6 py-3.5 font-semibold text-white/70">
            Страница {page.toLocaleString("ru")} из {totalPages.toLocaleString("ru")}
          </span>
        )}
        {next && (
          <Link href={`/catalog?${nextParams}`} className="btn-primary rounded-full px-8 py-3.5 font-semibold transition hover:scale-[1.03]">
            Следующая страница →
          </Link>
        )}
      </div>
    </div>
  );
}
