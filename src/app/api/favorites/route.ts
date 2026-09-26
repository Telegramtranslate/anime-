import { db, dbAvailable } from "@/db";
import { favorites } from "@/db/schema";
import { fbEnabled, fbGet, fbSet } from "@/lib/firebase";
import { getUid } from "@/lib/uid";
import { and, eq } from "drizzle-orm";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  try {
    const uid = await getUid();
    const animeId = new URL(req.url).searchParams.get("animeId");
    if (!uid || !animeId) return Response.json({ favorite: false });
    if (db) {
      const r = await db.select({ id: favorites.id }).from(favorites).where(and(eq(favorites.uid, uid), eq(favorites.animeId, animeId)));
      return Response.json({ favorite: r.length > 0 });
    }
    if (fbEnabled()) {
      const d = await fbGet(uid);
      return Response.json({ favorite: d.favorites.some((f) => f.animeId === animeId) });
    }
    return Response.json({ favorite: false });
  } catch {
    return Response.json({ favorite: false, available: dbAvailable });
  }
}

export async function POST(req: Request) {
  try {
    const uid = (await getUid(true))!;
    const b = await req.json();
    if (!b?.animeId || !b?.title) return Response.json({ error: "bad request" }, { status: 400 });
    if (db) {
      const existing = await db.select({ id: favorites.id }).from(favorites).where(and(eq(favorites.uid, uid), eq(favorites.animeId, String(b.animeId))));
      if (existing.length) {
        await db.delete(favorites).where(eq(favorites.id, existing[0].id));
        return Response.json({ favorite: false });
      }
      await db.insert(favorites).values({
        uid,
        animeId: String(b.animeId),
        title: String(b.title).slice(0, 300),
        poster: b.poster ? String(b.poster) : null,
        year: typeof b.year === "number" ? b.year : null,
        kind: b.kind ? String(b.kind) : null,
      });
      return Response.json({ favorite: true });
    }
    if (fbEnabled()) {
      const d = await fbGet(uid);
      const has = d.favorites.some((f) => f.animeId === String(b.animeId));
      const next = has
        ? d.favorites.filter((f) => f.animeId !== String(b.animeId))
        : [
            {
              animeId: String(b.animeId),
              title: String(b.title).slice(0, 300),
              poster: b.poster ? String(b.poster) : null,
              year: typeof b.year === "number" ? b.year : null,
              kind: b.kind ? String(b.kind) : null,
              createdAt: Date.now(),
            },
            ...d.favorites,
          ];
      await fbSet(uid, { favorites: next, history: d.history });
      return Response.json({ favorite: !has });
    }
    return Response.json({ favorite: false, available: false });
  } catch {
    return Response.json({ favorite: false, available: dbAvailable });
  }
}
