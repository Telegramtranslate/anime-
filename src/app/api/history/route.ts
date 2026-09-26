import { db, dbAvailable } from "@/db";
import { history } from "@/db/schema";
import { fbEnabled, fbGet, fbSet } from "@/lib/firebase";
import { getUid } from "@/lib/uid";
import { and, eq } from "drizzle-orm";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  try {
    const uid = (await getUid(true))!;
    const b = await req.json();
    if (!b?.animeId || !b?.title) return Response.json({ error: "bad request" }, { status: 400 });
    if (db) {
      await db
        .insert(history)
        .values({
          uid,
          animeId: String(b.animeId),
          title: String(b.title).slice(0, 300),
          poster: b.poster ? String(b.poster) : null,
          translation: b.translation ? String(b.translation) : null,
        })
        .onConflictDoUpdate({
          target: [history.uid, history.animeId],
          set: { updatedAt: new Date(), translation: b.translation ? String(b.translation) : null },
        });
      return Response.json({ ok: true });
    }
    if (fbEnabled()) {
      const d = await fbGet(uid);
      const rest = d.history.filter((h) => h.animeId !== String(b.animeId));
      const next = [
        {
          animeId: String(b.animeId),
          title: String(b.title).slice(0, 300),
          poster: b.poster ? String(b.poster) : null,
          translation: b.translation ? String(b.translation) : null,
          updatedAt: Date.now(),
        },
        ...rest,
      ].slice(0, 50);
      await fbSet(uid, { favorites: d.favorites, history: next });
      return Response.json({ ok: true });
    }
    return Response.json({ ok: true, available: false });
  } catch {
    return Response.json({ ok: true, available: dbAvailable });
  }
}

export async function DELETE(req: Request) {
  try {
    const uid = await getUid();
    const animeId = new URL(req.url).searchParams.get("animeId");
    if (!uid) return Response.json({ ok: true });
    if (db) {
      if (animeId) await db.delete(history).where(and(eq(history.uid, uid), eq(history.animeId, animeId)));
      else await db.delete(history).where(eq(history.uid, uid));
      return Response.json({ ok: true });
    }
    if (fbEnabled()) {
      const d = await fbGet(uid);
      const next = animeId ? d.history.filter((h) => h.animeId !== animeId) : [];
      await fbSet(uid, { favorites: d.favorites, history: next });
    }
    return Response.json({ ok: true });
  } catch {
    return Response.json({ ok: true });
  }
}
