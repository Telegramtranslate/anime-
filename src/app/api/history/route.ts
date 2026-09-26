import { db } from "@/db";
import { history } from "@/db/schema";
import { fbEnabled, fbGet, fbSet } from "@/lib/firebase";
import { recordHistory } from "@/lib/history";
import { getUid } from "@/lib/uid";
import { and, eq } from "drizzle-orm";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  try {
    const uid = (await getUid(true))!;
    const b = await req.json();
    if (!b?.animeId || !b?.title) return Response.json({ error: "bad request" }, { status: 400 });
    await recordHistory(uid, b);
    return Response.json({ ok: true });
  } catch {
    return Response.json({ ok: true });
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
