import { cookies } from "next/headers";
import { fbAddComment, fbEnabled, fbGetComments } from "@/lib/firebase";
import { getUid } from "@/lib/uid";

export const dynamic = "force-dynamic";

/** POST {animeId, text} — написать комментарий (нужен вход). */
export async function POST(req: Request) {
  try {
    const store = await cookies();
    const fuid = store.get("fuid")?.value;
    if (!fuid || !fbEnabled()) return Response.json({ error: "auth" }, { status: 401 });
    const { animeId, text } = await req.json();
    const t = String(text ?? "").trim().slice(0, 1000);
    if (!animeId || !t) return Response.json({ error: "bad request" }, { status: 400 });

    const name = decodeURIComponent(store.get("fname")?.value ?? "") || "Аноним";
    const picture = decodeURIComponent(store.get("fpic")?.value ?? "") || null;

    const list = await fbAddComment(String(animeId), {
      uid: fuid,
      name: name.slice(0, 80),
      picture,
      text: t,
      createdAt: Date.now(),
    });
    return Response.json({ ok: true, comments: list });
  } catch {
    return Response.json({ error: "fail" }, { status: 500 });
  }
}

export async function GET(req: Request) {
  const animeId = new URL(req.url).searchParams.get("animeId");
  if (!animeId) return Response.json({ comments: [] });
  return Response.json({ comments: await fbGetComments(animeId) });
}
