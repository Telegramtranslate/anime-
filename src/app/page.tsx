import Link from "next/link";
import Hero from "@/components/Hero";
import Row from "@/components/Row";
import { safeGenres, safeList } from "@/lib/kodik";

export const revalidate = 60; // страница кэшируется на 60 секунд (ISR)

export default async function Home() {
  const [ongoing, fresh, top, movies, newest] = await Promise.all([
    safeList({ anime_status: "ongoing", sort: "shikimori_rating", types: "anime-serial" }),
    safeList({ sort: "updated_at" }),
    safeList({ sort: "shikimori_rating", anime_status: "released" }),
    safeList({ anime_kind: "movie", sort: "shikimori_rating", types: "anime" }),
    safeList({ sort: "year", types: "anime-serial" }),
  ]);

  const genres = await safeGenres();
  const heroItems = ongoing.items.filter((a) => a.backdrop && a.description).slice(0, 6);
  const topRated = top.items.filter((a) => (a.votes ?? 0) > 5000).slice(0, 10);

  return (
    <>
      <Hero items={heroItems.length ? heroItems : top.items.slice(0, 6)} />
      <div className="relative -mt-16">
        <Row title="Новые серии" subtitle="Свежие обновления озвучек" items={fresh.items.slice(0, 24)} href="/catalog?sort=updated_at" />
        <Row title="Топ-10 всех времён" subtitle="Лучшее по версии Shikimori" items={topRated} ranked href="/catalog?sort=shikimori_rating" />
        <Row title="Популярные онгоинги" subtitle="Сейчас выходит" items={ongoing.items.slice(0, 24)} href="/catalog?status=ongoing" />

        <section className="mx-auto mt-16 max-w-[1500px] px-5 md:px-10">
          <h2 className="mb-5 font-display text-xl font-bold md:text-2xl">Жанры</h2>
          <div className="flex flex-wrap gap-2.5">
            {genres.map((g, i) => (
              <Link
                key={g}
                href={`/catalog?genre=${encodeURIComponent(g)}`}
                className="glass rounded-2xl px-5 py-3 text-sm font-semibold text-white/80 transition hover:-translate-y-0.5 hover:border-accent/50 hover:text-white"
                style={{ backgroundImage: `linear-gradient(135deg, hsla(${(i * 37) % 360},80%,60%,.12), transparent)` }}
              >
                {g}
              </Link>
            ))}
          </div>
        </section>

        <Row title="Лучшие фильмы" items={movies.items.slice(0, 24)} href="/catalog?kind=movie" />
        <Row title="Недавно вышедшие" items={newest.items.slice(0, 24)} href="/catalog?sort=year" />
      </div>
    </>
  );
}
