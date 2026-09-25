import { db, dbAvailable } from "@/db";
import { sql } from "drizzle-orm";

export const dynamic = "force-dynamic";

export async function GET() {
  if (!db) return Response.json({ ok: true, db: "not configured" });
  try {
    await db.execute(sql`select 1`);
    return Response.json({ ok: true, db: dbAvailable ? "up" : "down" });
  } catch {
    return Response.json({ ok: false, db: "down" }, { status: 500 });
  }
}
