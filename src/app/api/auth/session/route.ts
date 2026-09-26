import { cookies } from "next/headers";
import { fbEnabled, fbGet, fbSet } from "@/lib/firebase";

export const dynamic = "force-dynamic";

const KEY = process.env.FIREBASE_API_KEY || "AIzaSyAX2az15_r4IwgKZX3_omhrhwqRe27gu8Q";

/** Проверяет idToken от клиента и открывает сессию (куки fuid/fname/fpic). */
export async function POST(req: Request) {
  try {
    const { idToken } = await req.json();
    if (!idToken) return Response.json({ ok: false }, { status: 400 });

    const r = await fetch(`https://identitytoolkit.googleapis.com/v1/accounts:lookup?key=${KEY}`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ idToken }),
      cache: "no-store",
      signal: AbortSignal.timeout(8000),
    });
    if (!r.ok) return Response.json({ ok: false }, { status: 401 });
    const j = await r.json();
    const u = j?.users?.[0];
    if (!u?.localId) return Response.json({ ok: false }, { status: 401 });

    const store = await cookies();
    const anon = store.get("uid")?.value ?? null;
    const fuid = String(u.localId);

    // переносим «анонимную» коллекцию в аккаунт, чтобы ничего не пропало
    if (fbEnabled() && anon && anon !== fuid) {
      const [a, b] = await Promise.all([fbGet(anon), fbGet(fuid)]);
      if (a.favorites.length || a.history.length) {
        const favMap = new Map(b.favorites.map((f) => [f.animeId, f]));
        for (const f of a.favorites) if (!favMap.has(f.animeId)) favMap.set(f.animeId, f);
        const histMap = new Map(b.history.map((h) => [h.animeId, h]));
        for (const h of a.history) if (!histMap.has(h.animeId)) histMap.set(h.animeId, h);
        await fbSet(fuid, {
          favorites: [...favMap.values()].sort((x, y) => y.createdAt - x.createdAt),
          history: [...histMap.values()].sort((x, y) => y.updatedAt - x.updatedAt).slice(0, 50),
        });
      }
    }

    const name = String(u.displayName ?? u.email ?? "");
    const picture = String(u.photoUrl ?? "");
    const opts = { httpOnly: true, sameSite: "lax" as const, path: "/", maxAge: 60 * 60 * 24 * 365 };
    store.set("fuid", fuid, opts);
    store.set("fname", encodeURIComponent(name).slice(0, 200), opts);
    store.set("fpic", encodeURIComponent(picture).slice(0, 500), opts);

    return Response.json({ ok: true, user: { name, picture } });
  } catch {
    return Response.json({ ok: false }, { status: 500 });
  }
}
