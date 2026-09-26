import { cookies } from "next/headers";
import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import Feedback from "@/components/Feedback";
import Player from "@/components/Player";
import FavoriteButton from "@/components/FavoriteButton";
import Row from "@/components/Row";
import Shots from "@/components/Shots";
import { fbGetComments, fbGetMyRating, fbGetRating } from "@/lib/firebase";
import { recordHistory } from "@/lib/history";
import { KINDS, STATUSES, getAnime, safeList } from "@/lib/kodik";
import { shikiScore } from "@/lib/shiki";
import { getUid } from "@/lib/uid";

export const dynamic = "force-dynamic";

async function load(id: string) {
  try {
    return await getAnime(decodeURIComponent(id));
  } catch {
    return null;
  }
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const d = await load(id);
  return d ? { title: `${d.anime.title} — смотреть онлайн`, description: d.anime.description?.slice(0, 160) } : { title: "Не найдено" };
}

export default async function AnimePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const data = await load(id);
  if (!data) notFound();
  const { anime: a, translations } = data;
  const store = await cookies();
  const fuid = store.get("fuid")?.value ?? null;
  const uid = await getUid();
  const [rating, myScore, comments, shikiLive] = await Promise.all([
    fbGetRating(a.id),
    fbGetMyRating(fuid, a.id),
    fbGetComments(a.id),
    shikiScore(a.id),
    // «Продолжить просмотр»: тайтл попадает в историю уже при открытии страницы
    uid ? recordHistory(uid, { animeId: a.id, title: a.title, poster: a.poster }).catch(() => {}) : Promise.resolve(),
  ]);
  const similar = a.genres[0]
    ? (await safeList({ anime_genres: a.genres[0], sort: "shikimori_rating" })).items.filter((x) => x.id !== a.id).slice(0, 20)
    : [];

  const facts: [string, string | null][] = [
    ["Тип", a.kind ? KINDS[a.kind] ?? a.kind : null],
    ["Статус", a.status ? STATUSES[a.status] ?? a.status : null],
    ["Эпизоды", a.kind === "movie" ? null : a.episodesTotal ? `${a.episodesAired ?? "?"} / ${a.episodesTotal}` : a.episodesAired ? String(a.episodesAired) : null],
    ["Длительность", a.duration ? `${a.duration} мин.` : null],
    ["Год", a.year ? String(a.year) : null],
    ["Студия", a.studios.join(", ") || null],
    ["Возраст", a.minimalAge ? `${a.minimalAge}+` : a.mpaa ? a.mpaa.toUpperCase() : null],
  ];

  return (
    <div>
      <section className="relative overflow-hidden">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        {a.backdrop && <img src={a.backdrop} alt="" className="absolute inset-0 h-full w-full object-cover opacity-40 blur-sm scale-110" />}
        <div className="absolute inset-0 bg-gradient-to-b from-ink/40 via-ink/80 to-ink" />
        <div className="absolute inset-0 bg-gradient-to-r from-ink via-transparent to-ink/60" />

        <div className="relative mx-auto grid max-w-[1500px] gap-10 px-5 pb-12 pt-28 md:grid-cols-[280px_1fr] md:px-10 md:pt-36">
          <div className="fade-up mx-auto w-56 md:w-full">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            {a.poster && <img src={a.poster} alt={a.title} className="aspect-[2/3] w-full rounded-3xl object-cover shadow-2xl ring-1 ring-white/10" />}
          </div>
          <div className="fade-up">
            <div className="flex flex-wrap gap-2 text-xs font-semibold">
              {a.status === "ongoing" && <span className="rounded-full bg-emerald-500/20 px-3 py-1 text-emerald-300 ring-1 ring-emerald-400/40">● Онгоинг</span>}
              {a.genres.map((g) => (
                <Link key={g} href={`/catalog?genre=${encodeURIComponent(g)}`} className="glass rounded-full px-3 py-1 text-white/70 hover:text-white">{g}</Link>
              ))}
            </div>
            <h1 className="mt-5 font-display text-3xl font-extrabold leading-tight md:text-5xl">{a.title}</h1>
            <p className="mt-2 text-white/50">{[a.titleEn, a.titleJp].filter(Boolean).join(" · ")}</p>

            <div className="mt-6 flex flex-wrap gap-3">
              {[["Shikimori", shikiLive ?? a.rating], ["IMDb", a.imdb], ["Кинопоиск", a.kp]].map(([n, v]) =>
                v ? (
                  <div key={n as string} className="glass rounded-2xl px-5 py-3">
                    <div className="text-[10px] uppercase tracking-wider text-white/40">{n}</div>
                    <div className="font-display text-xl font-bold"><span className="text-amber-400">★</span> {Number(v).toFixed(1)}</div>
                  </div>
                ) : null,
              )}
              {rating.avg != null && (
                <div className="rounded-2xl border border-accent/40 bg-accent/15 px-5 py-3">
                  <div className="text-[10px] uppercase tracking-wider text-violet-200/70">Aniverse · {rating.count}</div>
                  <div className="font-display text-xl font-bold">
                    <span className="grad-text">★</span> {rating.avg.toFixed(1)}
                  </div>
                </div>
              )}
            </div>

            {a.description && <p className="mt-6 max-w-3xl whitespace-pre-line leading-relaxed text-white/70">{a.description}</p>}

            <dl className="mt-6 grid max-w-3xl grid-cols-2 gap-x-8 gap-y-3 text-sm sm:grid-cols-3">
              {facts.filter(([, v]) => v).map(([k, v]) => (
                <div key={k}>
                  <dt className="text-white/40">{k}</dt>
                  <dd className="font-semibold">{v}</dd>
                </div>
              ))}
            </dl>

            <div className="mt-8 flex flex-wrap gap-3">
              <a href="#player" className="btn-primary flex items-center gap-2 rounded-full px-7 py-4 font-semibold transition hover:scale-[1.03]">
                <svg viewBox="0 0 24 24" className="h-5 w-5 fill-white"><path d="M8 5v14l11-7z" /></svg>Смотреть
              </a>
              <FavoriteButton animeId={a.id} title={a.title} poster={a.poster} year={a.year} kind={a.kind} />
            </div>
          </div>
        </div>
      </section>

      <section id="player" className="mx-auto max-w-[1500px] scroll-mt-24 px-5 md:px-10">
        <Player translations={translations} meta={{ animeId: a.id, title: a.title, poster: a.poster }} />
      </section>

      {a.screenshots.length > 1 && (
        <section className="mx-auto mt-14 max-w-[1500px] px-5 md:px-10">
          <h2 className="mb-5 font-display text-xl font-bold md:text-2xl">Кадры</h2>
          <Shots items={a.screenshots.slice(0, 12)} />
        </section>
      )}

      <Feedback
        animeId={a.id}
        loggedIn={Boolean(fuid)}
        initialAvg={rating.avg}
        initialCount={rating.count}
        initialMine={myScore}
        initialComments={comments}
      />

      <Row title="Похожее" items={similar} />
    </div>
  );
}
