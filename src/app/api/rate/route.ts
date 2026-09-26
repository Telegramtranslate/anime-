import { cookies } from "next/headers";
import { fbEnabled, fbGetRating, fbSetRating } from "@/lib/firebase";

export const dynamic = "force-dynamic";

/** POST {animeId, score: 1..10} — поставить свою оценку (нужен вход). */
export async function POST(req: Request) {
  try {
    const store = await cookies();
    const fuid = store.get("fuid")?.value ?? null;
    const { animeId, score } = await req.json();
    const s = Number(score);
    if (!animeId || !Number.isInteger(s) || s < 1 || s > 10) {
      return Response.json({ error: "bad request" }, { status: 400 });
    }
    if (!fuid || !fbEnabled()) {
      return Response.json({ error: "auth" }, { status: 401 });
    }
    const r = await fbSetRating(fuid, String(animeId), s);
    if (!r.saved) return Response.json({ error: "db" }, { status: 500 });
    return Response.json({ ok: true, avg: r.avg, count: r.count, mine: s });
  } catch {
    return Response.json({ error: "fail" }, { status: 500 });
  }
}

export async function GET(req: Request) {
  const animeId = new URL(req.url).searchParams.get("animeId");
  if (!animeId) return Response.json({ avg: null, count: 0 });
  return Response.json(await fbGetRating(animeId));
}
