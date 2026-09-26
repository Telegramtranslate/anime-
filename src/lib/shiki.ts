import type { Anime } from "./kodik";

const SHIKI = "https://shikimori.one";

const cache = new Map<string, { at: number; data: Anime[] }>();
const TTL = 10 * 60_000;

type ShikiRaw = {
  id: number;
  name: string;
  russian: string | null;
  image?: string | null;
  kind?: string | null;
  status?: string | null;
  score?: number | null;
  episodes?: number | null;
  episodes_aired?: number | null;
  aired_on?: string | null;
};

function toAnime(x: ShikiRaw): Anime {
  const poster = x.image ? (x.image.startsWith("http") ? x.image : `${SHIKI}${x.image}`) : null;
  return {
    id: String(x.id),
    kodikId: "",
    title: x.russian || x.name,
    titleEn: x.name,
    titleJp: null,
    poster,
    backdrop: poster,
    description: null,
    year: x.aired_on ? Number(x.aired_on.slice(0, 4)) || null : null,
    kind: x.kind ?? null,
    status: x.status ?? null,
    genres: [],
    studios: [],
    rating: x.score ?? null,
    votes: null,
    imdb: null,
    kp: null,
    episodesTotal: x.episodes ?? null,
    episodesAired: x.episodes_aired ?? null,
    lastEpisode: x.episodes_aired ?? null,
    screenshots: [],
    duration: null,
    mpaa: null,
    minimalAge: null,
    airedAt: x.aired_on ?? null,
    link: "",
    type: "anime",
  };
}

/**
 * Поиск Shikimori: понимает запрос с первых букв («чёр» → «Чёрный клевер»),
 * в отличие от поиска Kodik, которому нужно почти полное название.
 * Используется как основной источник подсказок и запасной для страницы поиска.
 */
export async function shikiSearch(q: string, limit = 12): Promise<Anime[]> {
  const key = q.toLowerCase();
  const hit = cache.get(key);
  if (hit && Date.now() - hit.at < TTL) return hit.data;

  const r = await fetch(`${SHIKI}/api/animes?search=${encodeURIComponent(q)}&limit=${limit}&censored=true`, {
    headers: { "User-Agent": "Aniverse (personal anime catalog)" },
    cache: "no-store",
    signal: AbortSignal.timeout(6000),
  });
  if (!r.ok) throw new Error(`Shikimori HTTP ${r.status}`);
  const arr: ShikiRaw[] = await r.json();
  const data = (Array.isArray(arr) ? arr : []).map(toAnime);

  cache.set(key, { at: Date.now(), data });
  if (cache.size > 300) cache.delete(cache.keys().next().value!);
  return data;
}

/* ---------- живой рейтинг Shikimori для карточек ---------- */

const scoreCache = new Map<string, { at: number; v: number | null }>();

/** Текущий score тайтла на Shikimori (или null, если id не шикиморный/сеть недоступна). */
export async function shikiScore(shikiId: string): Promise<number | null> {
  if (!/^\d+$/.test(shikiId)) return null;
  const hit = scoreCache.get(shikiId);
  if (hit && Date.now() - hit.at < TTL) return hit.v;
  try {
    const r = await fetch(`${SHIKI}/api/animes/${shikiId}`, {
      headers: { "User-Agent": "Aniverse (personal anime catalog)" },
      cache: "no-store",
      signal: AbortSignal.timeout(5000),
    });
    if (!r.ok) throw new Error(String(r.status));
    const j = await r.json();
    const raw = j?.score != null && j.score !== "" ? Number(j.score) : null;
    const v = raw != null && !Number.isNaN(raw) && raw > 0 ? raw : null;
    scoreCache.set(shikiId, { at: Date.now(), v });
    return v;
  } catch {
    scoreCache.set(shikiId, { at: Date.now(), v: null });
    return null;
  }
}
