import { db, dbAvailable } from "@/db";
import { favorites } from "@/db/schema";
import { getUid } from "@/lib/uid";
import { and, eq } from "drizzle-orm";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  try {
    const uid = await getUid();
    const animeId = new URL(req.url).searchParams.get("animeId");
    if (!db || !uid || !animeId) return Response.json({ favorite: false });
    const r = await db.select({ id: favorites.id }).from(favorites).where(and(eq(favorites.uid, uid), eq(favorites.animeId, animeId)));
    return Response.json({ favorite: r.length > 0 });
  } catch {
    return Response.json({ favorite: false, available: dbAvailable });
  }
}

export async function POST(req: Request) {
  try {
    const uid = (await getUid(true))!;
    const b = await req.json();
    if (!b?.animeId || !b?.title) return Response.json({ error: "bad request" }, { status: 400 });
    if (!db) return Response.json({ favorite: false, available: false });
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
  } catch {
    return Response.json({ favorite: false, available: dbAvailable });
  }
}
