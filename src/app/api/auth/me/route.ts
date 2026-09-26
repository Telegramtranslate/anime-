import { cookies } from "next/headers";

export const dynamic = "force-dynamic";

export async function GET() {
  const store = await cookies();
  const fuid = store.get("fuid")?.value;
  if (!fuid) return Response.json({ user: null });
  return Response.json({
    user: {
      name: decodeURIComponent(store.get("fname")?.value ?? ""),
      picture: decodeURIComponent(store.get("fpic")?.value ?? ""),
    },
  });
}
