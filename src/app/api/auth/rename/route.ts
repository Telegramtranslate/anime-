import { cookies } from "next/headers";
import { fbSetNickname } from "@/lib/firebase";

export const dynamic = "force-dynamic";

/** POST {name} — сменить никнейм (не чаще раза в 7 дней). */
export async function POST(req: Request) {
  try {
    const store = await cookies();
    const fuid = store.get("fuid")?.value;
    if (!fuid) return Response.json({ ok: false, error: "auth" }, { status: 401 });

    const name = String((await req.json())?.name ?? "").trim().replace(/\s+/g, " ").slice(0, 30);
    if (name.length < 2) return Response.json({ ok: false, error: "short" }, { status: 400 });

    const r = await fbSetNickname(fuid, name);
    if (!r.ok) return Response.json({ ok: false, error: r.error, nextAt: r.nextAt }, { status: 429 });

    store.set("fname", encodeURIComponent(name), {
      httpOnly: true,
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 365,
    });
    return Response.json({ ok: true, name });
  } catch {
    return Response.json({ ok: false, error: "fail" }, { status: 500 });
  }
}
