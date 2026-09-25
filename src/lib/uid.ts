import { cookies } from "next/headers";

export async function getUid(create = false): Promise<string | null> {
  const store = await cookies();
  const v = store.get("uid")?.value;
  if (v) return v;
  if (!create) return null;
  const id = crypto.randomUUID();
  store.set("uid", id, { httpOnly: true, sameSite: "lax", path: "/", maxAge: 60 * 60 * 24 * 365 * 5 });
  return id;
}
