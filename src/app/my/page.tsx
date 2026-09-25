import Link from "next/link";
import { desc, eq } from "drizzle-orm";
import { db } from "@/db";
import { favorites, history } from "@/db/schema";
import { getUid } from "@/lib/uid";

type Fav = (typeof favorites.$inferSelect);
type Hist = (typeof history.$inferSelect);

async function loadCollection(uid: string | null): Promise<[Fav[], Hist[]]> {
  if (!uid || !db) return [[], []];
  try {
    const [favs, hist] = await Promise.all([
      db.select().from(favorites).where(eq(favorites.uid, uid)).orderBy(desc(favorites.createdAt)),
      db.select().from(history).where(eq(history.uid, uid)).orderBy(desc(history.updatedAt)).limit(30),
    ]);
    return [favs, hist];
  } catch {
    return [[], []];
  }
}

export const dynamic = "force-dynamic";
export const metadata = { title: "Моя коллекция" };

type Item = { animeId: string; title: string; poster: string | null; sub?: string | null };

function Grid({ items, empty }: { items: Item[]; empty: string }) {
  if (!items.length)
    return (
      <div className="glass rounded-3xl p-12 text-center text-white/50">
        {empty}{" "}
        <Link href="/catalog" className="grad-text font-semibold">Открыть каталог →</Link>
      </div>
    );
  return (
    <div className="grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 2xl:grid-cols-7">
      {items.map((i) => (
        <Link key={i.animeId} href={`/anime/${i.animeId}`} className="group">
          <div className="aspect-[2/3] overflow-hidden rounded-2xl bg-panel ring-1 ring-line transition group-hover:-translate-y-1 group-hover:ring-accent/50">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            {i.poster && <img src={i.poster} alt={i.title} className="h-full w-full object-cover transition duration-700 group-hover:scale-105" />}
          </div>
          <h3 className="mt-3 line-clamp-2 text-sm font-semibold">{i.title}</h3>
          {i.sub && <p className="mt-1 text-xs text-white/40">{i.sub}</p>}
        </Link>
      ))}
    </div>
  );
}

export default async function My() {
  const uid = await getUid();
  const [favs, hist] = await loadCollection(uid);

  return (
    <div className="mx-auto max-w-[1500px] px-5 pt-28 md:px-10 md:pt-36">
      <h1 className="font-display text-3xl font-extrabold md:text-5xl">Моя <span className="grad-text">коллекция</span></h1>
      <p className="mt-2 text-white/40">Сохраняется автоматически в этом браузере — без регистрации.</p>

      <h2 className="mb-5 mt-12 font-display text-xl font-bold">Продолжить просмотр</h2>
      <Grid items={hist.map((h) => ({ ...h, sub: h.translation ? `Озвучка: ${h.translation}` : null }))} empty="Вы ещё ничего не смотрели." />

      <h2 className="mb-5 mt-14 font-display text-xl font-bold">Избранное · {favs.length}</h2>
      <Grid items={favs.map((f) => ({ ...f, sub: f.year ? String(f.year) : null }))} empty="Добавляйте аниме в коллекцию кнопкой ♥." />
    </div>
  );
}
