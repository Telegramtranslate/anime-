-- Таблицы «Избранного» и «Истории просмотров».
-- Применить: psql "$DATABASE_URL" -f db/schema.sql
-- (или: npx drizzle-kit push)

CREATE TABLE IF NOT EXISTS favorites (
  id SERIAL PRIMARY KEY,
  uid TEXT NOT NULL,
  anime_id TEXT NOT NULL,
  title TEXT NOT NULL,
  poster TEXT,
  year INTEGER,
  kind TEXT,
  created_at TIMESTAMP DEFAULT now() NOT NULL
);

CREATE UNIQUE INDEX IF NOT EXISTS fav_uid_anime ON favorites (uid, anime_id);

CREATE TABLE IF NOT EXISTS history (
  id SERIAL PRIMARY KEY,
  uid TEXT NOT NULL,
  anime_id TEXT NOT NULL,
  title TEXT NOT NULL,
  poster TEXT,
  translation TEXT,
  updated_at TIMESTAMP DEFAULT now() NOT NULL
);

CREATE UNIQUE INDEX IF NOT EXISTS hist_uid_anime ON history (uid, anime_id);
