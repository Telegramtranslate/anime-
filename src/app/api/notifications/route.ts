import { cookies } from "next/headers";
import {
  NOTIF_CHECK_INTERVAL,
  fbGetWithNotifs,
  fbMarkNotifsSeen,
  fbSaveNotifState,
  type NotifItem,
} from "@/lib/firebase";
import { listAnime } from "@/lib/kodik";

export const dynamic = "force-dynamic";

/**
 * GET — уведомления о новых сериях для избранного.
 * Сверяем избранное с лентой недавно обновившихся тайтлов Kodik:
 * если серий стало больше, чем было при сохранении — создаём уведомление.
 */
export async function GET() {
  try {
    const store = await cookies();
    const fuid = store.get("fuid")?.value;
    if (!fuid) return Response.json({ items: [], unread: 0 });

    const state = await fbGetWithNotifs(fuid);
    const now = Date.now();

    if (now - state.lastCheck >= NOTIF_CHECK_INTERVAL && state.favorites.length) {
      // лента свежих обновлений Kodik (два окна по 100)
      const feed = new Map<string, { episodes: number | null }>();
      try {
        const w1 = await listAnime({ sort: "updated_at", order: "desc", limit: 100 });
        for (const a of w1.items) feed.set(a.id, { episodes: a.episodesAired });
        if (w1.next) {
          const w2 = await listAnime({ sort: "updated_at", order: "desc", limit: 100, next: w1.next });
          for (const a of w2.items) if (!feed.has(a.id)) feed.set(a.id, { episodes: a.episodesAired });
        }
      } catch {
        // Kodik недоступен — вернём сохранённые уведомления как есть
      }

      const fresh: NotifItem[] = [];
      const favorites = state.favorites.map((f) => {
        const u = feed.get(f.animeId);
        if (!u || u.episodes == null) return f;
        if (f.episodes == null) return { ...f, episodes: u.episodes }; // первая синхронизация — без уведомления
        if (u.episodes > f.episodes) {
          fresh.push({ animeId: f.animeId, title: f.title, poster: f.poster, episode: u.episodes, createdAt: now });
          return { ...f, episodes: u.episodes };
        }
        return f;
      });

      const notifications = [...fresh, ...state.notifications].slice(0, 30);
      await fbSaveNotifState(fuid, { favorites, notifications, lastCheck: now });
      return Response.json({ items: notifications, unread: notifications.filter((n) => n.createdAt > state.lastSeen).length });
    }

    return Response.json({
      items: state.notifications,
      unread: state.notifications.filter((n) => n.createdAt > state.lastSeen).length,
    });
  } catch {
    return Response.json({ items: [], unread: 0 });
  }
}

/** POST — отметить уведомления прочитанными. */
export async function POST() {
  const store = await cookies();
  const fuid = store.get("fuid")?.value;
  if (!fuid) return Response.json({ ok: false }, { status: 401 });
  await fbMarkNotifsSeen(fuid);
  return Response.json({ ok: true });
}
