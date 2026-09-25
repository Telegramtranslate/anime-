import AnimeCard from "@/components/AnimeCard";
import { searchAnime, type Anime } from "@/lib/kodik";

export const dynamic = "force-dynamic";
export const metadata = { title: "Поиск" };

export default async function Search({ searchParams }: { searchParams: Promise<{ q?: string }> }) {
  const { q = "" } = await searchParams;
  let items: Anime[] = [];
  let error = false;
  if (q.trim()) {
    try {
      items = await searchAnime(q.trim());
    } catch {
      error = true;
    }
  }
  return (
    <div className="mx-auto max-w-[1500px] px-5 pt-28 md:px-10 md:pt-36">
      <form action="/search" className="glass flex items-center gap-3 rounded-3xl px-6 py-5 focus-within:border-accent/50">
        <svg viewBox="0 0 24 24" className="h-6 w-6 shrink-0 stroke-white/50" fill="none" strokeWidth="2"><circle cx="11" cy="11" r="7" /><path d="m20 20-3.5-3.5" /></svg>
        <input name="q" defaultValue={q} autoFocus placeholder="Название аниме на русском или английском" className="w-full bg-transparent font-display text-xl outline-none placeholder:text-white/30 md:text-2xl" />
        <button className="btn-primary shrink-0 rounded-full px-6 py-3 text-sm font-semibold">Найти</button>
      </form>
      {q && (
        <p className="mt-8 text-white/50">
          {error ? "Ошибка поиска, попробуйте позже." : <>Найдено <b className="text-white">{items.length}</b> по запросу «{q}»</>}
        </p>
      )}
      <div className="mt-8 grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-7">
        {items.map((a) => <AnimeCard key={a.id} a={a} />)}
      </div>
    </div>
  );
}
