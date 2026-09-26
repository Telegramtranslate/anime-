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
  const body = {
    fields: {
      favorites: { arrayValue: { values: data.favorites.slice(0, 500).map(favToV) } },
      history: { arrayValue: { values: data.history.slice(0, 50).map(histToV) } },
    },
  };
  try {
    const r = await fetch(docUrl(uid), {
      method: "PATCH",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(body),
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
          body: JSON.stringify(body),
          cache: "no-store",
          signal: AbortSignal.timeout(6000),
        },
      );
    }
  } catch {
    // сеть мигнула — коллекция сохранится в следующий раз
  }
}
