import { cookies } from "next/headers";
import { NICK_COOLDOWN, fbGetProfile } from "@/lib/firebase";

export const dynamic = "force-dynamic";

export async function GET() {
  const store = await cookies();
  const fuid = store.get("fuid")?.value;
  if (!fuid) return Response.json({ name: null, canChange: false });
  const p = await fbGetProfile(fuid);
  const now = Date.now();
  const canChange = !p.changedAt || now - p.changedAt >= NICK_COOLDOWN;
  return Response.json({ ...p, canChange, nextAt: p.changedAt ? p.changedAt + NICK_COOLDOWN : null });
}
