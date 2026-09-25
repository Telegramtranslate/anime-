import { drizzle } from "drizzle-orm/node-postgres";
import type { NodePgDatabase } from "drizzle-orm/node-postgres";
import { Pool } from "pg";

const databaseUrl = process.env.DATABASE_URL;

/**
 * База данных — опциональная часть сайта (избранное и история просмотров).
 * Без DATABASE_URL сайт продолжает работать на 100%: каталог, поиск, страницы
 * аниме и плеер не зависят от БД; просто кнопки «В коллекцию» и «Продолжить
 * просмотр» ведут себя как пустые.
 */
export const dbAvailable = Boolean(databaseUrl);

const globalForDb = globalThis as typeof globalThis & {
  __arenaNextJsPostgresqlPool?: Pool;
};

function createDb(): NodePgDatabase | null {
  if (!databaseUrl) return null;
  const pool =
    globalForDb.__arenaNextJsPostgresqlPool ??
    new Pool({
      connectionString: databaseUrl,
    });
  if (process.env.NODE_ENV !== "production") {
    globalForDb.__arenaNextJsPostgresqlPool = pool;
  }
  return drizzle(pool);
}

export const db = createDb();
