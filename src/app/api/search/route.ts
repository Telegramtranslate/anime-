import { searchAnime } from "@/lib/kodik";

export const dynamic = "force-dynamic";

/** Живые подсказки для поиска в шапке: короткие ответы, кэш на CDN/браузере. */
export async function GET(req: Request) {
  const q = new URL(req.url).searchParams.get("q")?.trim() ?? "";
  if (!q) return Response.json({ items: [] });
  try {
    const items = (await searchAnime(q)).slice(0, 8).map((a) => ({
      id: a.id,
      title: a.title,
      titleEn: a.titleEn,
      poster: a.poster,
      year: a.year,
      kind: a.kind,
    }));
    return Response.json(
      { items },
      {
        headers: {
          "Cache-Control": items.length
            ? "public, s-maxage=60, stale-while-revalidate=300"
            : "no-store",
        },
      },
    );
  } catch {
    return Response.json({ items: [] });
  }
}
