const API = "https://kodik-api.com";
const TOKENS_URL =
  "https://raw.githubusercontent.com/YaNesyTortiK/AnimeParsers/main/kdk_tokns/tokens.json";

export type Anime = {
  id: string;
  kodikId: string;
  title: string;
  titleEn: string | null;
  titleJp: string | null;
  poster: string | null;
  backdrop: string | null;
  description: string | null;
  year: number | null;
  kind: string | null;
  status: string | null;
  genres: string[];
  studios: string[];
  rating: number | null;
  votes: number | null;
  imdb: number | null;
  kp: number | null;
  episodesTotal: number | null;
  episodesAired: number | null;
  lastEpisode: number | null;
  screenshots: string[];
  duration: number | null;
  mpaa: string | null;
  minimalAge: number | null;
  airedAt: string | null;
  link: string;
  type: string;
};

export type Translation = { id: number; title: string; type: string; link: string; episodes: number | null };

type Raw = any;

let tokenCache: { token: string; at: number } | null = null;

function decrypt(t: string) {
  const h = Math.floor(t.length / 2);
  const d = (s: string) => Buffer.from(s.split("").reverse().join(""), "base64").toString("utf8");
  return d(t.slice(h)) + d(t.slice(0, h));
}

async function testToken(token: string) {
  try {
    const r = await fetch(`${API}/list?token=${token}&limit=1`, { method: "POST", cache: "no-store" });
    if (!r.ok) return false;
    const j = await r.json();
    return Array.isArray(j.results);
  } catch {
    return false;
  }
}

async function getToken(force = false): Promise<string> {
  if (process.env.KODIK_TOKEN) return process.env.KODIK_TOKEN;
  if (!force && tokenCache && Date.now() - tokenCache.at < 6 * 3600_000) return tokenCache.token;
  const r = await fetch(TOKENS_URL, { cache: "no-store" });
  const j = await r.json();
  const list: string[] = [...(j.stable ?? []), ...(j.unstable ?? [])].map((x: Raw) => decrypt(x.tokn));
  for (const t of list) {
    if (await testToken(t)) {
      tokenCache = { token: t, at: Date.now() };
      return t;
    }
  }
  throw new Error("Нет рабочего токена Kodik");
}

const cache = new Map<string, { at: number; data: Raw }>();
const TTL = 10 * 60_000;

/** Сетевая ли ошибка (в отличие от логической ошибки API). */
function isNetworkError(e: unknown) {
  if (e instanceof TypeError) return true; // fetch failed / DNS / обрыв соединения
  const s = String((e as Error)?.message ?? e);
  return /ECONNRESET|ECONNREFUSED|ENOTFOUND|EAI_AGAIN|ETIMEDOUT|timeout|abort|network|socket|fetch failed|нет рабочего токена|недоступен|unavailable|invalid url/i.test(s);
}

/** Демо-режим с локальным снапшотом базы. Включается принудительно через ANIVERSE_DEMO=1. */
function demoForced() {
  return process.env.ANIVERSE_DEMO === "1" || process.env.ANIVERSE_DEMO === "force";
}

function demoAllowed() {
  return process.env.ANIVERSE_DEMO !== "0" && process.env.ANIVERSE_DEMO !== "off";
}

async function call(endpoint: "list" | "search" | "genres" | "years" | "countries" | "qualities/v2" | "translations/v2", params: Record<string, string | number | undefined>): Promise<Raw> {
  const qs = new URLSearchParams();
  for (const [k, v] of Object.entries(params)) if (v !== undefined && v !== "") qs.set(k, String(v));
  const key = endpoint + "?" + qs.toString();
  const hit = cache.get(key);
  if (hit && Date.now() - hit.at < TTL) return hit.data;

  let lastError: unknown = null;
  for (let attempt = 0; attempt < 2; attempt++) {
    const token = await getToken(attempt > 0);
    try {
      const r = await fetch(`${API}/${endpoint}?token=${token}&${qs}`, {
        method: "POST",
        cache: "no-store",
        signal: AbortSignal.timeout(8000),
      });
      if (r.status === 401 || r.status === 403) continue;
      const data = await r.json();
      if (data.error) {
        if (String(data.error).toLowerCase().includes("token")) continue;
        throw new Error(data.error);
      }
      cache.set(key, { at: Date.now(), data });
      if (cache.size > 500) cache.delete(cache.keys().next().value!);
      return data;
    } catch (e) {
      lastError = e;
      if (!isNetworkError(e) && attempt === 1) throw e;
    }
  }
  throw lastError ?? new Error("Kodik API недоступен");
}

const BANNED = ["Хентай", "Эротика", "Яой", "Юри"];

/** Ключ уникальности тайтла: shikimori_id, а при его отсутствии — название+год. */
function hashMark(s: string): number {
  // FNV-1a, сдвинут в диапазон > 1e9, чтобы не пересекаться с shikimori_id
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return 1_000_000_000 + ((h >>> 0) % 1_000_000_000);
}

function markOf(r: Raw, key: string): number {
  return r.shikimori_id ? Number(r.shikimori_id) : hashMark(key);
}

function keyOf(r: Raw): string {
  if (r.shikimori_id) return `s${r.shikimori_id}`;
  const m = r.material_data ?? {};
  const t = (m.anime_title || m.title || r.title || "").toLowerCase().trim();
  return `t${t}:${m.year ?? r.year ?? ""}`;
}

function isSafe(r: Raw) {
  const m = r.material_data ?? {};
  if (m.rating_mpaa === "rx") return false;
  const g: string[] = m.anime_genres ?? m.genres ?? [];
  return !g.some((x) => BANNED.includes(x));
}

/** Kodik/Shikimori иногда отдают постеры относительным путём — дополняем до полного URL. */
function absUrl(u: string | null | undefined): string | null {
  if (!u) return null;
  if (/^https?:\/\//.test(u)) return u;
  if (u.startsWith("//")) return `https:${u}`;
  if (u.startsWith("/")) return `https://i.shikimori.one${u}`;
  return u;
}

function normalize(r: Raw): Anime {
  const m = r.material_data ?? {};
  const shots: string[] = (m.screenshots?.length ? m.screenshots : r.screenshots) ?? [];
  return {
    id: r.shikimori_id ? String(r.shikimori_id) : r.id,
    kodikId: r.id,
    title: m.anime_title || m.title || r.title,
    titleEn: m.title_en || r.title_orig || null,
    titleJp: m.other_titles_jp?.[0] ?? null,
    // постер: Shikimori -> Кинопоиск -> первый скриншот, чтобы тайтл не выпадал из каталога
    poster: absUrl(m.anime_poster_url || m.poster_url || shots[0] || null),
    backdrop: absUrl(shots[0] ?? m.anime_poster_url ?? null),
    description: m.anime_description || m.description || null,
    year: m.year ?? r.year ?? null,
    kind: m.anime_kind ?? null,
    status: m.anime_status ?? m.all_status ?? null,
    genres: m.anime_genres ?? m.genres ?? [],
    studios: m.anime_studios ?? [],
    rating: m.shikimori_rating ?? null,
    votes: m.shikimori_votes ?? null,
    imdb: m.imdb_rating ?? null,
    kp: m.kinopoisk_rating ?? null,
    episodesTotal: m.episodes_total ?? r.episodes_count ?? null,
    episodesAired: m.episodes_aired ?? r.last_episode ?? null,
    lastEpisode: r.last_episode ?? null,
    screenshots: shots.map((x) => absUrl(x)).filter((x): x is string => Boolean(x)),
    duration: m.duration ?? null,
    mpaa: m.rating_mpaa ?? null,
    minimalAge: m.minimal_age ?? null,
    airedAt: m.aired_at ?? null,
    link: r.link,
    type: r.type,
  };
}

function materialScore(r: Raw) {
  const m = r.material_data;
  if (!m) return 0;
  let s = Object.keys(m).length;
  if (m.anime_poster_url || m.poster_url) s += 10;
  if (m.anime_title) s += 5;
  if (m.shikimori_rating) s += 2;
  return s;
}

/**
 * Схлопывает разные озвучки одного тайтла в одну карточку.
 * Раньше бралась первая попавшаяся запись — если у неё не было метаданных
 * (постера/описания), тайтл целиком пропадал из каталога. Теперь для каждого
 * тайтла сохраняется запись с самыми полными метаданными, а позиция в выдаче
 * остаётся от первой встречи (серверная сортировка не ломается).
 */
function dedupe(results: Raw[]): Anime[] {
  const best = new Map<string, Raw>();
  const order: string[] = [];
  for (const r of results) {
    if (!isSafe(r)) continue;
    const id = keyOf(r);
    const cur = best.get(id);
    if (!cur) {
      best.set(id, r);
      order.push(id);
    } else if (materialScore(r) > materialScore(cur)) {
      best.set(id, r);
    }
  }
  return order.map((id) => normalize(best.get(id)!));
}

/** Столько карточек каталог показывает на одной странице — не больше и не меньше. */
export const PAGE_SIZE = 14;

type PagedCursor = { c: string | null; skip: number; pg: number; seen?: number[] };
const SEEN_CAP = 800; // щит показанных id в курсоре (~8КБ URL — безопасно)

function decodeCursor(next?: string): PagedCursor {
  if (!next) return { c: null, skip: 0, pg: 1 };
  try {
    const j = JSON.parse(Buffer.from(next, "base64url").toString("utf8"));
    if (j && typeof j === "object") {
      return {
        c: typeof j.c === "string" ? j.c : null,
        skip: Math.max(0, Number(j.skip) || 0),
        pg: Math.max(1, Number(j.pg) || 1),
        seen: Array.isArray(j.seen) ? (j.seen as unknown[]).map(Number).filter((n) => Number.isFinite(n) && n > 0).slice(0, SEEN_CAP) : [],
      };
    }
  } catch {}
  // старая ссылка с «сырым» курсором Kodik
  return { c: next, skip: 0, pg: 1 };
}

function encodeCursor(cur: PagedCursor): string {
  return Buffer.from(JSON.stringify(cur), "utf8").toString("base64url");
}

/**
 * Пейджинг каталога с фиксированным размером страницы (PAGE_SIZE).
 * Kodik отдаёт по несколько озвучек одного тайтла, а dedupe/isSafe часть
 * записей схлопывает или отбрасывает — поэтому окна по 50 записей
 * дочитываются, пока не наберётся ровно PAGE_SIZE уникальных тайтлов.
 * Курсор следующей страницы запоминает окно и смещение внутри него,
 * чтобы карточки не терялись и не повторялись.
 */
export async function pagedList(p: ListParams = {}) {
  if (demoForced()) {
    const { demoList } = await import("./demo");
    const r = demoList(p, dedupe);
    return { items: r.items.slice(0, PAGE_SIZE), next: null, total: r.total, page: 1 };
  }
  const start = decodeCursor(p.next);
  const seen = new Set<string>();
  const shield = new Set(start.seen ?? []);
  const collected: number[] = [];
  const out: Anime[] = [];
  let cur: string | null = start.c;
  let skip = start.skip;
  let nextCursor: string | null = null;
  let total = 0;

  for (let guard = 0; out.length < PAGE_SIZE && guard < 6; guard++) {
    const data = await call("list", {
      types: p.types ?? "anime-serial,anime",
      with_material_data: "true",
      limit: 50,
      sort: p.sort ?? "updated_at",
      order: p.order ?? "desc",
      anime_kind: p.anime_kind,
      anime_status: p.anime_status,
      anime_genres: p.anime_genres,
      year: p.year,
      next: cur ?? undefined,
    });
    total = (data.total as number) ?? total;
    const raw: Raw[] = data.results ?? [];
    let winNext: string | null = null;
    if (data.next_page) {
      try {
        winNext = new URL(data.next_page).searchParams.get("next");
      } catch {}
    }

    let idx = skip;
    for (const r of raw.slice(skip)) {
      idx++;
      if (!isSafe(r)) continue;
      const key = keyOf(r);
      const mark = markOf(r, key);
      if (seen.has(key) || shield.has(mark)) continue;
      seen.add(key);
      collected.push(mark);
      out.push(normalize(r));
      if (out.length === PAGE_SIZE) break;
    }

    if (out.length === PAGE_SIZE) {
      const seenNext = [...shield, ...collected].slice(-SEEN_CAP);
      nextCursor = encodeCursor(
        idx < raw.length
          ? { c: cur, skip: idx, pg: start.pg + 1, seen: seenNext }
          : { c: winNext, skip: 0, pg: start.pg + 1, seen: seenNext },
      );
      break;
    }
    if (!winNext || !raw.length) break; // конец выдачи
    cur = winNext;
    skip = 0;
  }

  return { items: out, next: nextCursor, total, page: start.pg };
}

/**
 * Честное число уникальных тайтлов под текущие фильтры: Kodik в `total`
 * считает записи по озвучкам, а каталог показывает схлопнутые карточки.
 * Проходим выдачу курсорами (небольшие выборки) и считаем уникалы. Кэш 10 мин.
 */
const uniqCache = new Map<string, { n: number; at: number }>();

export async function countUniqueTitles(p: ListParams = {}): Promise<number | null> {
  if (demoForced()) return null;
  const key = JSON.stringify([p.types, p.sort, p.order, p.anime_kind, p.anime_status, p.anime_genres, p.year]);
  const hit = uniqCache.get(key);
  if (hit && Date.now() - hit.at < 10 * 60 * 1000) return hit.n;
  try {
    const seen = new Set<string>();
    let cur: string | null = null;
    for (let guard = 0; guard < 40; guard++) {
      const data = await call("list", {
        types: p.types ?? "anime-serial,anime",
        with_material_data: "true",
        limit: 100,
        sort: p.sort ?? "updated_at",
        order: p.order ?? "desc",
        anime_kind: p.anime_kind,
        anime_status: p.anime_status,
        anime_genres: p.anime_genres,
        year: p.year,
        next: cur ?? undefined,
      });
      const raw: Raw[] = data.results ?? [];
      for (const r of raw) {
        if (!isSafe(r)) continue;
        seen.add(keyOf(r));
      }
      let winNext: string | null = null;
      if (data.next_page) {
        try { winNext = new URL(data.next_page).searchParams.get("next"); } catch {}
      }
      if (!winNext || !raw.length) break;
      cur = winNext;
    }
    uniqCache.set(key, { n: seen.size, at: Date.now() });
    return seen.size;
  } catch {
    return null;
  }
}

export async function safePagedList(p: ListParams = {}) {
  try {
    const r = await pagedList(p);
    const uniqueTotal = r.total > 0 && r.total <= 4000 ? await countUniqueTitles(p) : null;
    return { ...r, uniqueTotal };
  } catch (e) {
    if (!demoAllowed() || !isNetworkError(e)) {
      console.error(e);
      return { items: [] as Anime[], next: null, total: 0, page: 1, uniqueTotal: null };
    }
    const { demoList } = await import("./demo");
    const r = demoList(p, dedupe);
    return { items: r.items.slice(0, PAGE_SIZE), next: null, total: r.total, page: 1, uniqueTotal: null };
  }
}

export type ListParams = {
  sort?: "shikimori_rating" | "updated_at" | "created_at" | "year" | "kinopoisk_rating" | "imdb_rating";
  order?: "asc" | "desc";
  anime_kind?: string;
  anime_status?: string;
  anime_genres?: string;
  year?: string | number;
  types?: string;
  limit?: number;
  next?: string;
};

export async function listAnime(p: ListParams = {}) {
  try {
    if (demoForced()) {
      const { demoList } = await import("./demo");
      return demoList(p, dedupe);
    }
    const data = await call("list", {
      types: p.types ?? "anime-serial,anime",
      with_material_data: "true",
      limit: p.limit ?? 100,
      sort: p.sort ?? "updated_at",
      order: p.order ?? "desc",
      anime_kind: p.anime_kind,
      anime_status: p.anime_status,
      anime_genres: p.anime_genres,
      year: p.year,
      next: p.next,
    });
    let next: string | null = null;
    if (data.next_page) {
      try {
        next = new URL(data.next_page).searchParams.get("next");
      } catch {}
    }
    return { items: dedupe(data.results ?? []), next, total: data.total as number };
  } catch (e) {
    if (!demoAllowed() || !isNetworkError(e)) throw e;
    const { demoList } = await import("./demo");
    return demoList(p, dedupe);
  }
}

export async function safeList(p: ListParams = {}) {
  try {
    return await listAnime(p);
  } catch (e) {
    console.error(e);
    return { items: [] as Anime[], next: null, total: 0 };
  }
}

export async function searchAnime(q: string) {
  if (demoForced()) {
    const { demoSearch } = await import("./demo");
    return dedupe(demoSearch(q));
  }

  // Kodik ищет только почти полное название, Shikimori — с первых букв.
  // Берём оба источника: Kodik даёт полные карточки, Shikimori — точные попадания.
  // параллельно и с таймаутом: медленный источник не топит весь поиск
  const [kRes, sRes] = await Promise.allSettled([
    call("search", { title: q, types: "anime-serial,anime", with_material_data: "true", limit: 100 }).then(
      (d) => dedupe((d.results ?? []) as Raw[]),
    ),
    import("./shiki").then((m) => m.shikiSearch(q)),
  ]);
  const kodikItems = kRes.status === "fulfilled" ? kRes.value : [];
  const kodikErr = kRes.status === "rejected" ? kRes.reason : null;
  const shikiItems = sRes.status === "fulfilled" ? sRes.value : [];
  const shikiErr = sRes.status === "rejected" ? sRes.reason : null;

  if (!kodikItems.length && !shikiItems.length) {
    if (demoAllowed() && (isNetworkError(kodikErr) || isNetworkError(shikiErr))) {
      const { demoSearch } = await import("./demo");
      return dedupe(demoSearch(q));
    }
    return [];
  }

  const seen = new Set(kodikItems.map((a) => a.id));
  return [...kodikItems, ...shikiItems.filter((s) => !seen.has(s.id))];
}

export async function getAnime(id: string): Promise<{ anime: Anime; translations: Translation[] } | null> {
  try {
    if (demoForced()) {
      const { demoRawById } = await import("./demo");
      return shapeAnime(demoRawById(id));
    }
    const params: Record<string, string> = /^\d+$/.test(id) ? { shikimori_id: id } : { id };
    const data = await call("search", { ...params, with_material_data: "true", limit: 100 });
    return shapeAnime(data.results ?? []);
  } catch (e) {
    if (!demoAllowed() || !isNetworkError(e)) throw e;
    const { demoRawById } = await import("./demo");
    return shapeAnime(demoRawById(id));
  }
}

function shapeAnime(rawResults: Raw[]): { anime: Anime; translations: Translation[] } | null {
  const results: Raw[] = rawResults.filter(isSafe);
  if (!results.length) return null;
  const best = [...results].sort((a, b) => materialScore(b) - materialScore(a))[0];
  const anime = normalize(best);
  const seen = new Set<number>();
  const translations: Translation[] = [];
  for (const r of results) {
    const t = r.translation;
    if (!t || seen.has(t.id)) continue;
    seen.add(t.id);
    translations.push({ id: t.id, title: t.title, type: t.type, link: r.link, episodes: r.episodes_count ?? r.last_episode ?? null });
  }
  translations.sort((a, b) => (a.type === b.type ? (b.episodes ?? 0) - (a.episodes ?? 0) : a.type === "voice" ? -1 : 1));
  return { anime, translations };
}

export const KINDS: Record<string, string> = {
  tv: "ТВ-сериал",
  movie: "Фильм",
  ova: "OVA",
  ona: "ONA",
  special: "Спешл",
  tv_special: "ТВ-спешл",
  music: "Клип",
};

/**
 * Значения, которые реально принимает фильтр anime_kind у Kodik.
 * `tv_special` встречается в метаданных тайтлов и остался в KINDS (для
 * отображения), но списочный эндпоинт его игнорирует и возвращает всю базу —
 * поэтому из фильтров каталога он исключён.
 */
export const FILTER_KINDS: Record<string, string> = {
  tv: "ТВ-сериал",
  movie: "Фильм",
  ova: "OVA",
  ona: "ONA",
  special: "Спешл",
  music: "Клип",
};

export const STATUSES: Record<string, string> = { ongoing: "Онгоинг", released: "Вышло", anons: "Анонс" };

/**
 * Названия жанров сверены с реальным словарём Kodik (поле anime_genres).
 * Фильтр чувствителен к написанию: например, в базе «Исэкай» через «э»
 * (2 500+ тайтлов), а «Исекай» не находит ничего.
 */
export const GENRES = [
  "Экшен", "Приключения", "Комедия", "Драма", "Романтика", "Фэнтези", "Фантастика", "Повседневность",
  "Сверхъестественное", "Психологическое", "Триллер", "Детектив", "Школа", "Спорт", "Музыка", "Меха",
  "Исторический", "Военное", "Сёнен", "Сёдзё", "Сэйнэн", "Исэкай", "Ужасы", "Самураи", "Боевые искусства",
];

/** Самый ранний тайтл в базе Kodik — «Паук и тюльпан» (1943). */
export const MIN_YEAR = 1940;
