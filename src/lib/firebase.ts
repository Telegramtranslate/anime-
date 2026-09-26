/**
 * Бесплатное облачное хранилище на Firebase (Firestore, тариф Spark).
 * Подключается переменными окружения FIREBASE_PROJECT_ID и FIREBASE_API_KEY.
 * Работает через REST API Firestore, без SDK. Все данные одного посетителя
 * лежат в одном документе users/{uid}: массивы favorites и history.
 */

const PID = process.env.FIREBASE_PROJECT_ID || "animee-1d7de";
const KEY = process.env.FIREBASE_API_KEY || "AIzaSyAX2az15_r4IwgKZX3_omhrhwqRe27gu8Q";

export function fbEnabled() {
  return Boolean(PID && KEY);
}

type V = {
  stringValue?: string;
  integerValue?: string;
  nullValue?: null;
  mapValue?: { fields: Record<string, V> };
  arrayValue?: { values?: V[] };
};

export type FavItem = {
  animeId: string;
  title: string;
  poster: string | null;
  year: number | null;
  kind: string | null;
  createdAt: number;
};

export type HistItem = {
  animeId: string;
  title: string;
  poster: string | null;
  translation: string | null;
  updatedAt: number;
};

const sv = (s: string): V => ({ stringValue: s });
const iv = (n: number): V => ({ integerValue: String(n) });
const nl = (): V => ({ nullValue: null });
const str = (v: V | undefined): string | null => v?.stringValue ?? null;
const num = (v: V | undefined): number | null => (v?.integerValue != null ? Number(v.integerValue) : null);

function favToV(f: FavItem): V {
  return {
    mapValue: {
      fields: {
        animeId: sv(f.animeId),
        title: sv(f.title),
        poster: f.poster ? sv(f.poster) : nl(),
        year: f.year != null ? iv(f.year) : nl(),
        kind: f.kind ? sv(f.kind) : nl(),
        createdAt: iv(f.createdAt),
      },
    },
  };
}

function vToFav(v: V): FavItem {
  const f = v.mapValue?.fields ?? {};
  return {
    animeId: str(f.animeId) ?? "",
    title: str(f.title) ?? "",
    poster: str(f.poster),
    year: num(f.year),
    kind: str(f.kind),
    createdAt: num(f.createdAt) ?? 0,
  };
}

function histToV(h: HistItem): V {
  return {
    mapValue: {
      fields: {
        animeId: sv(h.animeId),
        title: sv(h.title),
        poster: h.poster ? sv(h.poster) : nl(),
        translation: h.translation ? sv(h.translation) : nl(),
        updatedAt: iv(h.updatedAt),
      },
    },
  };
}

function vToHist(v: V): HistItem {
  const f = v.mapValue?.fields ?? {};
  return {
    animeId: str(f.animeId) ?? "",
    title: str(f.title) ?? "",
    poster: str(f.poster),
    translation: str(f.translation),
    updatedAt: num(f.updatedAt) ?? 0,
  };
}

function docUrl(uid: string) {
  return `https://firestore.googleapis.com/v1/projects/${PID}/databases/(default)/documents/users/${encodeURIComponent(uid)}?key=${KEY}`;
}

export async function fbGet(uid: string): Promise<{ favorites: FavItem[]; history: HistItem[] }> {
  const empty = { favorites: [], history: [] };
  if (!fbEnabled()) return empty;
  try {
    const r = await fetch(docUrl(uid), { cache: "no-store", signal: AbortSignal.timeout(6000) });
    if (r.status === 404 || !r.ok) return empty;
    const j = await r.json();
    const favorites = (j?.fields?.favorites?.arrayValue?.values ?? []).map(vToFav).filter((x: FavItem) => x.animeId);
    const history = (j?.fields?.history?.arrayValue?.values ?? []).map(vToHist).filter((x: HistItem) => x.animeId);
    return { favorites, history };
  } catch {
    return empty;
  }
}

export async function fbSet(uid: string, data: { favorites: FavItem[]; history: HistItem[] }) {
  if (!fbEnabled()) return;
  try {
    // читаем текущие поля, чтобы не затереть profile/ratings при перезаписи
    const existing = (await getDoc(docUrl(uid))) ?? {};
    const body = JSON.stringify({
      fields: {
        ...existing,
        favorites: { arrayValue: { values: data.favorites.slice(0, 500).map(favToV) } },
        history: { arrayValue: { values: data.history.slice(0, 50).map(histToV) } },
      },
    });
    const r = await fetch(docUrl(uid), {
      method: "PATCH",
      headers: { "content-type": "application/json" },
      body,
      cache: "no-store",
      signal: AbortSignal.timeout(6000),
    });
    if (r.status === 404) {
      // документа ещё нет — создаём его с нашим id
      await fetch(
        `https://firestore.googleapis.com/v1/projects/${PID}/databases/(default)/documents/users?documentId=${encodeURIComponent(uid)}&key=${KEY}`,
        {
          method: "POST",
          headers: { "content-type": "application/json" },
          body,
          cache: "no-store",
          signal: AbortSignal.timeout(6000),
        },
      );
    }
  } catch {
    // сеть мигнула — коллекция сохранится в следующий раз
  }
}

/* ---------- пользовательские оценки и комментарии ---------- */

export type CommentItem = {
  uid: string;
  name: string;
  picture: string | null;
  text: string;
  createdAt: number;
};

function collUrl(coll: string, doc: string) {
  return `https://firestore.googleapis.com/v1/projects/${PID}/databases/(default)/documents/${coll}/${encodeURIComponent(doc)}?key=${KEY}`;
}

async function getDoc(url: string): Promise<Record<string, V> | null> {
  try {
    const r = await fetch(url, { cache: "no-store", signal: AbortSignal.timeout(6000) });
    if (!r.ok) return null;
    const j = await r.json();
    return (j?.fields as Record<string, V>) ?? null;
  } catch {
    return null;
  }
}

async function setDoc(url: string, fields: Record<string, V>): Promise<boolean> {
  const body = JSON.stringify({ fields });
  const opts = { headers: { "content-type": "application/json" }, body, cache: "no-store" as const, signal: AbortSignal.timeout(6000) };
  let r = await fetch(url, { ...opts, method: "PATCH" }).catch(() => null);
  if (r?.status === 404) {
    // документа ещё нет — создаём с тем же id
    const m = url.match(/\/documents\/([^/]+)\/([^?]+)\?/);
    if (m) {
      const postUrl = `https://firestore.googleapis.com/v1/projects/${PID}/databases/(default)/documents/${m[1]}?documentId=${encodeURIComponent(m[2])}&key=${KEY}`;
      r = await fetch(postUrl, { ...opts, method: "POST" }).catch(() => null);
    }
  }
  return Boolean(r?.ok);
}

/** Средняя пользовательская оценка тайтла. */
export async function fbGetRating(animeId: string): Promise<{ avg: number | null; count: number }> {
  if (!fbEnabled()) return { avg: null, count: 0 };
  const f = await getDoc(collUrl("ratings", animeId));
  const sum = num(f?.sum) ?? 0;
  const count = num(f?.count) ?? 0;
  return { avg: count > 0 ? Math.round((sum / count) * 10) / 10 : null, count };
}

/** Оценка текущего пользователя (из его документа). */
export async function fbGetMyRating(uid: string | null, animeId: string): Promise<number | null> {
  if (!fbEnabled() || !uid) return null;
  const f = await getDoc(collUrl("users", uid));
  const list = (f?.ratings?.arrayValue?.values ?? []).map((v) => {
    const m = v.mapValue?.fields ?? {};
    return { animeId: str(m.animeId), score: num(m.score) };
  });
  const mine = list.find((x) => x.animeId === animeId);
  return mine?.score ?? null;
}

/** Ставит/меняет оценку: обновляет документ юзера и агрегат тайтла. */
export async function fbSetRating(uid: string, animeId: string, score: number) {
  if (!fbEnabled()) return { avg: null, count: 0, saved: false };
  const userFields = (await getDoc(collUrl("users", uid))) ?? {};
  const all = (userFields.ratings?.arrayValue?.values ?? [])
    .map((v) => {
      const m = v.mapValue?.fields ?? {};
      return { animeId: str(m.animeId) ?? "", score: num(m.score) ?? 0 };
    })
    .filter((x) => x.animeId);
  const prev = all.find((x) => x.animeId === animeId)?.score ?? null;
  const ratings = all.filter((x) => x.animeId !== animeId);

  const agg = await getDoc(collUrl("ratings", animeId));
  let sum = num(agg?.sum) ?? 0;
  let count = num(agg?.count) ?? 0;
  if (prev != null) {
    sum = sum - prev + score;
  } else {
    sum += score;
    count += 1;
  }

  ratings.push({ animeId, score });
  const ok1 = await setDoc(collUrl("users", uid), {
    ...userFields,
    ratings: { arrayValue: { values: ratings.slice(0, 500).map((r) => ({ mapValue: { fields: { animeId: sv(r.animeId), score: iv(r.score) } } })) } },
  });
  const ok2 = await setDoc(collUrl("ratings", animeId), { sum: iv(sum), count: iv(count) });
  return { avg: count > 0 ? Math.round((sum / count) * 10) / 10 : null, count, saved: ok1 && ok2 };
}

/** Комментарии тайтла (новые в конце). */
export async function fbGetComments(animeId: string): Promise<CommentItem[]> {
  if (!fbEnabled()) return [];
  const f = await getDoc(collUrl("animes", animeId));
  return (f?.comments?.arrayValue?.values ?? [])
    .map((v) => {
      const m = v.mapValue?.fields ?? {};
      return {
        uid: str(m.uid) ?? "",
        name: str(m.name) ?? "",
        picture: str(m.picture),
        text: str(m.text) ?? "",
        createdAt: num(m.createdAt) ?? 0,
      };
    })
    .filter((c) => c.text);
}

/** Добавляет комментарий, возвращает свежий список. */
export async function fbAddComment(animeId: string, c: CommentItem): Promise<CommentItem[]> {
  if (!fbEnabled()) return [];
  const url = collUrl("animes", animeId);
  const f = (await getDoc(url)) ?? {};
  const list = [...fbParseComments(f), c].slice(-100);
  await setDoc(url, {
    ...f,
    comments: {
      arrayValue: {
        values: list.map((x) => ({
          mapValue: {
            fields: {
              uid: sv(x.uid),
              name: sv(x.name),
              picture: x.picture ? sv(x.picture) : nl(),
              text: sv(x.text),
              createdAt: iv(x.createdAt),
            },
          },
        })),
      },
    },
  });
  return list;
}

function fbParseComments(f: Record<string, V>): CommentItem[] {
  return (f?.comments?.arrayValue?.values ?? [])
    .map((v) => {
      const m = v.mapValue?.fields ?? {};
      return {
        uid: str(m.uid) ?? "",
        name: str(m.name) ?? "",
        picture: str(m.picture),
        text: str(m.text) ?? "",
        createdAt: num(m.createdAt) ?? 0,
      };
    })
    .filter((c) => c.text);
}

/* ---------- профиль: смена никнейма раз в 7 дней ---------- */

export const NICK_COOLDOWN = 7 * 24 * 3600 * 1000;

export type Profile = { name: string | null; changedAt: number | null };

export async function fbGetProfile(uid: string): Promise<Profile> {
  if (!fbEnabled()) return { name: null, changedAt: null };
  const f = await getDoc(collUrl("users", uid));
  const p = f?.profile?.mapValue?.fields ?? {};
  return { name: str(p.name), changedAt: num(p.changedAt) };
}

export async function fbSetNickname(
  uid: string,
  name: string,
): Promise<{ ok: boolean; error?: string; nextAt?: number }> {
  if (!fbEnabled()) return { ok: false, error: "no-db" };
  const f = (await getDoc(collUrl("users", uid))) ?? {};
  const p = f.profile?.mapValue?.fields ?? {};
  const changedAt = num(p.changedAt);
  const now = Date.now();
  if (changedAt && now - changedAt < NICK_COOLDOWN) {
    return { ok: false, error: "soon", nextAt: changedAt + NICK_COOLDOWN };
  }
  await setDoc(collUrl("users", uid), {
    ...f,
    profile: { mapValue: { fields: { name: sv(name), changedAt: iv(now) } } },
  });
  return { ok: true };
}

/* ---------- анти-спам: не чаще комментария раз в 10 секунд ---------- */

export const COMMENT_COOLDOWN = 10_000;

export async function fbCommentGate(uid: string): Promise<{ ok: boolean; wait?: number }> {
  if (!fbEnabled()) return { ok: true };
  const f = await getDoc(collUrl("users", uid));
  const last = num(f?.profile?.mapValue?.fields?.commentAt) ?? 0;
  const diff = Date.now() - last;
  if (diff < COMMENT_COOLDOWN) return { ok: false, wait: Math.ceil((COMMENT_COOLDOWN - diff) / 1000) };
  return { ok: true };
}

export async function fbStampComment(uid: string) {
  if (!fbEnabled()) return;
  const f = (await getDoc(collUrl("users", uid))) ?? {};
  const prof = f.profile?.mapValue?.fields ?? {};
  await setDoc(collUrl("users", uid), {
    ...f,
    profile: { mapValue: { fields: { ...prof, commentAt: iv(Date.now()) } } },
  });
}
