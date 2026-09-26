import { cookies } from "next/headers";

export const dynamic = "force-dynamic";

export async function POST() {
  const store = await cookies();
  for (const k of ["fuid", "fname", "fpic"]) store.delete(k);
  return Response.json({ ok: true });
}
