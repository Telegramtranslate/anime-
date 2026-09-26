import type { MetadataRoute } from "next";
import { listAnime } from "@/lib/kodik";

const BASE = "https://ani-verse228.vercel.app";

// карта сайта обновляется раз в час
export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const pages: MetadataRoute.Sitemap = [
    { url: BASE, changeFrequency: "daily", priority: 1 },
    { url: `${BASE}/catalog`, changeFrequency: "daily", priority: 0.9 },
    { url: `${BASE}/catalog?status=ongoing`, changeFrequency: "daily", priority: 0.8 },
    { url: `${BASE}/catalog?kind=movie`, changeFrequency: "weekly", priority: 0.7 },
    { url: `${BASE}/my`, changeFrequency: "monthly", priority: 0.3 },
  ];

  try {
    // топовые тайтлы + свежие онгоинги — самые частые поисковые запросы
    const [top, ongoing] = await Promise.all([
      listAnime({ sort: "shikimori_rating", order: "desc", limit: 400 }),
      listAnime({ anime_status: "ongoing", sort: "updated_at", limit: 200 }),
    ]);
    const seen = new Set<string>();
    for (const a of [...top.items, ...ongoing.items]) {
      if (seen.has(a.id)) continue;
      seen.add(a.id);
      pages.push({ url: `${BASE}/anime/${a.id}`, changeFrequency: a.status === "ongoing" ? "daily" : "monthly", priority: 0.8 });
    }
  } catch {
    // Kodik недоступен — отдаём хотя бы статические страницы
  }
  return pages;
}
