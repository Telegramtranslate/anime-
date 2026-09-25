import { pgTable, serial, text, integer, timestamp, uniqueIndex } from "drizzle-orm/pg-core";

export const favorites = pgTable(
  "favorites",
  {
    id: serial("id").primaryKey(),
    uid: text("uid").notNull(),
    animeId: text("anime_id").notNull(),
    title: text("title").notNull(),
    poster: text("poster"),
    year: integer("year"),
    kind: text("kind"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (t) => [uniqueIndex("fav_uid_anime").on(t.uid, t.animeId)],
);

export const history = pgTable(
  "history",
  {
    id: serial("id").primaryKey(),
    uid: text("uid").notNull(),
    animeId: text("anime_id").notNull(),
    title: text("title").notNull(),
    poster: text("poster"),
    translation: text("translation"),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (t) => [uniqueIndex("hist_uid_anime").on(t.uid, t.animeId)],
);
