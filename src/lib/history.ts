import { db } from "@/db";
import { history } from "@/db/schema";
import { fbEnabled, fbGet, fbSet } from "./firebase";

export type HistInput = { animeId: string; title: string; poster: string | null; translation?: string | null };

/** Пишет «продолжить просмотр» в Postgres (если есть) или в Firebase. */
export async function recordHistory(uid: string, b: HistInput) {
  if (db) {
    await db
      .insert(history)
      .values({
        uid,
        animeId: String(b.animeId),
        title: String(b.title).slice(0, 300),
        poster: b.poster ? String(b.poster) : null,
        translation: b.translation ? String(b.translation) : null,
      })
      .onConflictDoUpdate({
        target: [history.uid, history.animeId],
        set: { updatedAt: new Date(), translation: b.translation ? String(b.translation) : null },
      });
    return;
  }
  if (fbEnabled()) {
    const d = await fbGet(uid);
    const rest = d.history.filter((h) => h.animeId !== String(b.animeId));
    const next = [
      {
        animeId: String(b.animeId),
        title: String(b.title).slice(0, 300),
        poster: b.poster ? String(b.poster) : null,
        translation: b.translation ? String(b.translation) : null,
        updatedAt: Date.now(),
      },
      ...rest,
    ].slice(0, 50);
    await fbSet(uid, { favorites: d.favorites, history: next });
  }
}
