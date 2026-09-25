/**
 * Демо-снапшот базы Kodik.
 *
 * Используется ТОЛЬКО когда сервер не может достучаться до kodik-api.com
 * (нет исходящего интернета) или когда задан ANIVERSE_DEMO=1. В обычном
 * деплое код всегда ходит в живой API Kodik, а этот файл лежит мёртвым грузом.
 *
 * Все записи ниже — реальные ответы Kodik API (ids, ссылки плееров, постеры
 * Shikimori/Кинопоиска, рейтинги, жанры), снятые 25.09.2026.
 */

type Raw = any;

export type DemoListParams = {
  sort?: string;
  order?: "asc" | "desc";
  anime_kind?: string;
  anime_status?: string;
  anime_genres?: string;
  year?: string | number;
  types?: string;
  limit?: number;
  next?: string;
};

const S = (n: string) => `https://shikimori.io/system/screenshots/original/${n}.jpg`;
const K = (kind: "seria" | "video", n: number) => `https://i.kodikres.com/screenshots/${kind}/${n}/1.jpg`;

export const DEMO_ITEMS: Raw[] = [
  // ─── Провожающая в последний путь Фрирен (4 озвучки) ───────────────────────
  {
    id: "serial-77320", type: "anime-serial", shikimori_id: "52991", year: 2023,
    link: "//kodikplayer.com/serial/77320/76e929ef885f84a0247bbffd62cb301d/720p",
    title: "Фрирен [ТВ-1]", title_orig: "Sousou no Frieren",
    other_title: "Провожающая в последний путь Фрирен / Frieren: Beyond Journey's End",
    translation: { id: 3150, title: "WinMedia", type: "voice" },
    last_season: 1, last_episode: 28, episodes_count: 28,
    created_at: "2026-07-22T19:23:51Z", updated_at: "2026-07-22T20:25:10Z",
    screenshots: [K("seria", 1646334)],
    material_data: {
      anime_title: "Провожающая в последний путь Фрирен", title: "Фрирен, провожающая в последний путь",
      title_en: "Sousou no Frieren", other_titles_jp: ["葬送のフリーレン"],
      anime_kind: "tv", anime_status: "released", all_status: "released", year: 2023,
      anime_description: "Одержав победу над Королём демонов, отряд героя Химмеля вернулся домой. Приключение, растянувшееся на десятилетие, подошло к завершению. Волшебница-эльф Фрирен и её отважные товарищи принесли людям мир и разошлись в разные стороны. Для эльфов время течёт иначе, и Фрирен вынуждена видеть, как её спутники один за другим уходят из жизни. Она отправляется в новое путешествие, чтобы понять, что значит жизнь для окружающих её людей.",
      poster_url: "https://st.kp.yandex.net/images/film_big/5401195.jpg",
      anime_poster_url: "https://shikimori.io/uploads/poster/animes/52991/dc841cc9fce2aa1e9907a4b61c5d1d92.jpeg",
      screenshots: [S("b8a37b9a2b5e01e581f3313278a4e38bee9a1527"), S("de4d563c7524eb560351c6a166078f0a5f44407c"), S("a222e9ed6510a0b8cb0bc9e9d2291beb306e4b5c")],
      duration: 24, anime_genres: ["Драма", "Приключения", "Сёнен", "Удостоено наград", "Фэнтези"],
      anime_studios: ["Madhouse"], kinopoisk_rating: 8.7, imdb_rating: 8.9,
      shikimori_rating: 9.25, shikimori_votes: 71155, rating_mpaa: "PG-13", minimal_age: 18,
      aired_at: "2023-09-29", episodes_total: 28, episodes_aired: 28,
    },
  },
  {
    id: "serial-73518", type: "anime-serial", shikimori_id: "52991", year: 2023,
    link: "//kodikplayer.com/serial/73518/6ebbf15fdcfa0da1340cafa4f5ed8357/720p",
    title: "Фрирен [ТВ-1]", title_orig: "Sousou no Frieren",
    translation: { id: 3142, title: "AniLot", type: "voice" },
    last_episode: 28, episodes_count: 28,
    created_at: "2026-03-01T12:54:09Z", updated_at: "2026-04-06T15:14:26Z",
    screenshots: [K("seria", 1577440)],
  },
  {
    id: "serial-71229", type: "anime-serial", shikimori_id: "52991", year: 2023,
    link: "//kodikplayer.com/serial/71229/aa29cdb10b996b61bec3cf0c1eabb3d9/720p",
    title: "Фрирен [ТВ-1]", title_orig: "Sousou no Frieren",
    translation: { id: 3470, title: "Kitsune Studio", type: "voice" },
    last_episode: 28, episodes_count: 28,
    created_at: "2025-10-30T11:17:03Z", updated_at: "2026-01-13T20:23:20Z",
    screenshots: [K("seria", 1527700)],
  },
  {
    id: "serial-56942", type: "anime-serial", shikimori_id: "52991", year: 2023,
    link: "//kodikplayer.com/serial/56942/f75277615ae831aad0a812a290a914ad/720p",
    title: "Фрирен [ТВ-1]", title_orig: "Sousou no Frieren",
    translation: { id: 1720, title: "LampStudio", type: "voice" },
    last_episode: 28, episodes_count: 28,
    created_at: "2024-01-17T20:32:22Z", updated_at: "2024-04-14T16:45:32Z",
    screenshots: [K("seria", 1052947)],
  },

  // ─── Фрирен 2 (онгоинг, 2 озвучки) ──────────────────────────────────────────
  {
    id: "serial-72932", type: "anime-serial", shikimori_id: "59978", year: 2026,
    link: "//kodikplayer.com/serial/72932/738627ae3c8f6c32ad5b9b7df2ebbe60/720p",
    title: "Фрирен [ТВ-2]", title_orig: "Sousou no Frieren (2026)",
    other_title: "Провожающая в последний путь Фрирен 2",
    translation: { id: 1863, title: "КОМНАТА ДИДИ", type: "voice" },
    last_season: 2, last_episode: 10, episodes_count: 10,
    created_at: "2026-01-16T16:19:01Z", updated_at: "2026-04-07T08:45:03Z",
    screenshots: [K("seria", 1560013)],
    material_data: { anime_status: "ongoing", all_status: "ongoing", year: 2026 },
  },
  {
    id: "serial-72933", type: "anime-serial", shikimori_id: "59978", year: 2026,
    link: "//kodikplayer.com/serial/72933/b61fd931a112e2681b3f3e74afe0afee/720p",
    title: "Фрирен [ТВ-2]", title_orig: "Sousou no Frieren (2026)",
    translation: { id: 1811, title: "OnWave", type: "voice" },
    last_episode: 10, episodes_count: 10,
    created_at: "2026-01-16T16:24:53Z", updated_at: "2026-03-27T14:14:45Z",
    screenshots: [K("seria", 1560014)],
  },

  // ─── О моём перерождении в слизь 4 (онгоинг, 3 озвучки) ───────────────────
  {
    id: "serial-73966", type: "anime-serial", shikimori_id: "59970", year: 2026,
    link: "//kodikplayer.com/serial/73966/89a34c222698021834904b05a8a02bf2/720p",
    title: "О моём перерождении в слизь [ТВ-4]", title_orig: "Tensei Shitara Slime Datta Ken (2026)",
    other_title: "О моём перерождении в слизь 4 / Tensura 4",
    translation: { id: 923, title: "AnimeVost", type: "voice" },
    last_season: 4, last_episode: 24, episodes_count: 24,
    created_at: "2026-04-03T16:51:56Z", updated_at: "2026-09-25T17:08:44Z",
    screenshots: [K("seria", 1587975)],
    material_data: {
      anime_title: "О моём перерождении в слизь 4", title: "О моём перерождении в слизь",
      title_en: "Tensei Shitara Slime Datta Ken", other_titles_jp: ["転生したらスライムだった件 第4期"],
      anime_kind: "tv", anime_status: "ongoing", all_status: "ongoing", year: 2026,
      anime_description: "Благодаря упорству, мудрости и дипломатическому таланту Римуру удалось завоевать доверие соседних государств и превратить своё поселение в процветающее королевство. Но чем сильнее становится его влияние, тем больше врагов и вызовов возникает на его пути. Тени прошлого возвращаются, а на другой стороне континента просыпается древняя угроза.",
      poster_url: "https://st.kp.yandex.net/images/film_big/1224030.jpg",
      anime_poster_url: "https://shikimori.io/uploads/poster/animes/59970/e0b5e96d704552aae4a76fa45b307de1.jpeg",
      screenshots: [S("aea4fcbd3deaa654c22aaf3ef3d6bc8843c051f2"), S("129c4b38b5508675c0a9e2a5dec7a3fb8e282f42"), S("662a48d083b6fb1bd530a2730871560e7d0c7ad5")],
      duration: 24, anime_genres: ["Исэкай", "Комедия", "Реинкарнация", "Сёнен", "Фэнтези", "Экшен"],
      anime_studios: ["8bit"], kinopoisk_rating: 8.4, imdb_rating: 8.0,
      shikimori_rating: 8.2, shikimori_votes: 2880, rating_mpaa: "PG-13", minimal_age: 18,
      aired_at: "2026-04-03", episodes_total: 24, episodes_aired: 23,
    },
  },
  {
    id: "serial-73959", type: "anime-serial", shikimori_id: "59970", year: 2026,
    link: "//kodikplayer.com/serial/73959/68e2e57cb95f7fb93655637acaca26c2/720p",
    title: "О моём перерождении в слизь [ТВ-4]", title_orig: "Tensei Shitara Slime Datta Ken (2026)",
    translation: { id: 3759, title: "AniStar & DEEP", type: "voice" },
    last_episode: 24, episodes_count: 24,
    created_at: "2026-04-03T15:32:31Z", updated_at: "2026-09-25T15:34:40Z",
    screenshots: [K("seria", 1587951)],
  },
  {
    id: "serial-73960", type: "anime-serial", shikimori_id: "59970", year: 2026,
    link: "//kodikplayer.com/serial/73960/781362bf34bd9033043e6b0a5b1c5c25/720p",
    title: "О моём перерождении в слизь [ТВ-4]", title_orig: "Tensei Shitara Slime Datta Ken (2026)",
    translation: { id: 2023, title: "РуАниме / DEEP", type: "voice" },
    last_episode: 24, episodes_count: 24,
    created_at: "2026-04-03T15:36:25Z", updated_at: "2026-09-25T15:34:56Z",
    screenshots: [K("seria", 1587952)],
  },

  // ─── Адский режим 2 (онгоинг) ──────────────────────────────────────────────
  {
    id: "serial-76524", type: "anime-serial", shikimori_id: "63817", year: 2026,
    link: "//kodikplayer.com/serial/76524/74c787c55fc15e2e4d335d163170b8d2/720p",
    title: "Адский режим [ТВ-2]", title_orig: "Hell Mode: Yarikomizuki no Gamer wa Hai Settei no Isekai de Musou suru 2",
    translation: { id: 643, title: "Studio Band", type: "voice" },
    last_season: 2, last_episode: 13, episodes_count: 13,
    created_at: "2026-07-03T17:01:41Z", updated_at: "2026-09-25T16:51:30Z",
    screenshots: [K("seria", 1638707)],
    material_data: {
      anime_title: "Адский уровень: Хардкорный геймер на самой высокой сложности в другом мире",
      title_en: "Hell Mode: Yarikomizuki no Gamer wa Hai Settei no Isekai de Musou suru",
      anime_kind: "tv", anime_status: "ongoing", all_status: "ongoing", year: 2026,
      anime_description: "Кэнъити Ямада — обычный офисный работник, который каждую свободную минуту проводит в онлайн-играх. После закрытия серверов любимой игры ему на глаза попадается сайт, который ведёт его в игру с «адским режимом». Запустив его, парень внезапно попадает в новый мир, где перевоплощается в раба по имени Аллен.",
      anime_genres: ["Исэкай", "Приключения", "Фэнтези", "Экшен"],
    },
  },

  // ─── Стальной алхимик: Братство ────────────────────────────────────────────
  {
    id: "serial-10015", type: "anime-serial", shikimori_id: "5114", year: 2009,
    link: "//kodikplayer.com/serial/10015/43d8c68777a985339ef086457a72f06a/720p",
    title: "Стальной алхимик [ТВ-2]", title_orig: "Hagane no Renkinjutsushi (2009)",
    other_title: "Стальной Алхимик: Братство",
    translation: { id: 641, title: "STEPonee", type: "voice" },
    last_season: 2, last_episode: 68, episodes_count: 68,
    created_at: "2018-04-09T05:39:18Z", updated_at: "2023-07-28T04:55:45Z",
    screenshots: [K("seria", 268563)],
    material_data: {
      anime_title: "Стальной алхимик: Братство", title: "Стальной алхимик: Братство",
      title_en: "Fullmetal Alchemist: Brotherhood", other_titles_jp: ["鋼の錬金術師 FULLMETAL ALCHEMIST"],
      anime_kind: "tv", anime_status: "released", all_status: "released", year: 2009,
      anime_description: "В этом мире существуют алхимики — люди, владеющие искусством манипулировать материей. Все они ограничены основным Законом алхимии: нельзя получить что-то, не пожертвовав чем-то равноценным. Братья Эдвард и Альфонс Элрики попытались вернуть к жизни мать и жестоко поплатились. Спустя годы они отправляются на поиски философского камня, чтобы вернуть утраченное.",
      poster_url: "https://st.kp.yandex.net/images/film_big/452838.jpg",
      anime_poster_url: "https://shikimori.io/uploads/poster/animes/5114/40c4cba552dc60ebf02f8fc373b9a503.jpeg",
      screenshots: [S("310a02881106ec96e84f797e41679adb4030005f"), S("ad32bcbc65d75fb05d6d7a492d41f9f0c8536b8b"), S("3f0de9d01e05b3112eab2b18c196a4c01c279fc8")],
      duration: 24, anime_genres: ["Военное", "Драма", "Приключения", "Сёнен", "Фэнтези", "Экшен"],
      anime_studios: ["Bones"], kinopoisk_rating: 8.6, imdb_rating: 9.1,
      shikimori_rating: 9.11, shikimori_votes: 94882, rating_mpaa: "R", minimal_age: 12,
      aired_at: "2009-04-05", episodes_total: 64, episodes_aired: 64,
    },
  },

  // ─── Атака титанов: Финал ──────────────────────────────────────────────────
  {
    id: "serial-40646", type: "anime-serial", shikimori_id: "40028", year: 2020,
    link: "//kodikplayer.com/serial/40646/986edaf0cc3b8e3338abe83b87f5c62e/720p",
    title: "Атака титанов [ТВ-4, часть 1]", title_orig: "Shingeki no Kyojin: The Final Season",
    other_title: "Атака титанов: Финал",
    translation: { id: 704, title: "Дублированный", type: "voice" },
    last_season: 4, last_episode: 16, episodes_count: 16,
    created_at: "2022-02-06T17:28:43Z", updated_at: "2022-02-06T18:00:01Z",
    screenshots: [K("seria", 957457)],
    material_data: {
      anime_title: "Атака титанов: Финал", title: "Атака титанов",
      title_en: "Shingeki no kyojin", other_titles_jp: ["進撃の巨人 The Final Season"],
      anime_kind: "tv", anime_status: "released", all_status: "released", year: 2020,
      anime_description: "Минуло три года с тех пор, как члены Разведкорпуса достигли моря. Из дневников Гриши Йегера люди узнали, что всё это время противостояли не только титанам, но и другой нации. За морем Марлия заканчивает длительную войну и осознаёт, что теряет первенство из-за развития оружия, способного противостоять титанам. Ей необходима сила титана Основателя.",
      poster_url: "https://st.kp.yandex.net/images/film_big/749374.jpg",
      anime_poster_url: "https://shikimori.io/uploads/poster/animes/40028/a8ef5365595d684a594b3a65b02e01fc.jpeg",
      screenshots: [S("658cadd65c75c5b85863ee76fa1dd89be6c24cfb"), S("40646c1878315ce8c7bdf5d69433b6743df9687d"), S("ec04d5faa6cc76a35932a15597faa5c02f909646")],
      duration: 23, anime_genres: ["Военное", "Выживание", "Драма", "Жестокость", "Сёнен", "Триллер", "Экшен"],
      anime_studios: ["MAPPA"], kinopoisk_rating: 8.7, imdb_rating: 9.1,
      shikimori_rating: 8.79, shikimori_votes: 80481, rating_mpaa: "R", minimal_age: 18,
      aired_at: "2020-12-07", episodes_total: 16, episodes_aired: 16,
    },
  },

  // ─── Врата Штейна ──────────────────────────────────────────────────────────
  {
    id: "serial-10114", type: "anime-serial", shikimori_id: "30484", year: 2018,
    link: "//kodikplayer.com/serial/10114/b596d247ddf55bbf1ab334bb4fc33eaf/720p",
    title: "Врата Штейна 0", title_orig: "Steins;Gate 0",
    other_title: "Врата Штейна: Ноль",
    translation: { id: 643, title: "Studio Band", type: "voice" },
    last_season: 1, last_episode: 23, episodes_count: 24,
    created_at: "2018-04-14T13:45:44Z", updated_at: "2020-03-09T01:06:30Z",
    screenshots: [K("seria", 270028)],
    material_data: {
      anime_title: "Врата Штейна 0", title: "Врата Штейна: Ноль",
      title_en: "Steins;Gate 0", other_titles_jp: ["シュタインズ・ゲート ゼロ"],
      anime_kind: "tv", anime_status: "released", all_status: "released", year: 2018,
      anime_description: "Действие берёт начало в декабре 2010 года и разворачивается в поле аттрактора β. Впавший в отчаяние Ринтаро Окабэ пытается оправиться от последней неудачной попытки изменить будущее и забросить своё второе «я» в лице безумного учёного. Внезапно он встречает Махо Хиядзё, знакомую Курису Макисэ, которая рассказывает об изобретении, способном хранить память человека.",
      poster_url: "https://st.kp.yandex.net/images/film_big/1048100.jpg",
      anime_poster_url: "https://shikimori.io/uploads/poster/animes/30484/e3ae8c09312cb6e87b3d36d7d7f2d6b7.jpeg",
      screenshots: [S("df9b64fd437cee5e2f66ee40ff41b308b1876124"), S("10a08c15c147b226294fb4ec09803f5b822ad0cc"), S("e7d6785f8e8f0c198146f15bdbe2b46344599a1e")],
      duration: 23, anime_genres: ["Драма", "Путешествие во времени", "Триллер", "Фантастика"],
      anime_studios: ["White Fox"], kinopoisk_rating: 8.1, imdb_rating: 8.4,
      shikimori_rating: 8.56, shikimori_votes: 41956, rating_mpaa: "PG-13", minimal_age: 18,
      aired_at: "2018-04-12", episodes_total: 23, episodes_aired: 23,
    },
  },
  {
    id: "movie-3969", type: "anime", shikimori_id: "11577", year: 2013,
    link: "//kodikplayer.com/video/3969/20249e5fbde4cc864a3d93da8d3e6a5a/720p",
    title: "Врата Штейна: Дежавю", title_orig: "Steins;Gate Movie: Fuka Ryouiki no Deja vu",
    translation: { id: 767, title: "SHIZA Project", type: "voice" },
    created_at: "2014-12-21T22:28:42Z", updated_at: "2019-11-19T20:59:26Z",
    screenshots: [K("video", 3969)],
  },
  {
    id: "movie-20557", type: "anime", shikimori_id: "11577", year: 2013,
    link: "//kodikplayer.com/video/20557/82311913135640b736d05a065bf8194a/720p",
    title: "Врата Штейна: Дежавю", title_orig: "Steins;Gate Movie: Fuka Ryouiki no Deja vu",
    translation: { id: 610, title: "AniLibria.TV", type: "voice" },
    created_at: "2018-01-20T16:41:53Z", updated_at: "2020-05-22T05:23:29Z",
    screenshots: [K("video", 20557)],
  },
  {
    id: "movie-20558", type: "anime", shikimori_id: "11577", year: 2013,
    link: "//kodikplayer.com/video/20558/192ab547809a58d6c067ba6a3dd5ed21/720p",
    title: "Врата Штейна: Дежавю", title_orig: "Steins;Gate Movie: Fuka Ryouiki no Deja vu",
    translation: { id: 609, title: "AniDUB", type: "voice" },
    created_at: "2018-01-20T16:42:39Z", updated_at: "2020-05-22T05:49:44Z",
    screenshots: [K("video", 20558)],
  },

  // ─── Твоё имя ──────────────────────────────────────────────────────────────
  {
    id: "movie-34204", type: "anime", shikimori_id: "32281", year: 2016,
    link: "//kodikplayer.com/video/34204/89e3a2101a462afdb31f28d133a32880/720p",
    title: "Твоё имя", title_orig: "Kimi no na wa.",
    other_title: "Your Name",
    translation: { id: 704, title: "Дублированный", type: "voice" },
    created_at: "2019-03-28T23:00:14Z", updated_at: "2019-03-28T23:00:14Z",
    screenshots: [K("video", 34204)],
    material_data: {
      anime_title: "Твоё имя", title: "Твоё имя",
      title_en: "Kimi no na wa.", other_titles_jp: ["君の名は。"],
      anime_kind: "movie", anime_status: "released", all_status: "released", year: 2016,
      anime_description: "Мицуха — обычная девушка, уставшая от жизни в провинции, а Таки — старшеклассник из Токио. Однажды они обнаруживают, что между ними существует странная связь: во сне они меняются телами и проживают жизни друг друга. Но однажды эта способность исчезает так же внезапно, как появилась, и Таки решает во что бы то ни стало отыскать Мицуху.",
      poster_url: "https://st.kp.yandex.net/images/film_big/958722.jpg",
      anime_poster_url: "https://shikimori.io/uploads/poster/animes/32281/279580fb7589fe16df042f043f4bc6f3.jpeg",
      screenshots: [S("47f12ef34fa2bec6a039fc992be5f9834c59517d"), S("f247a65b1cbe13700e17aaad8a759f51e23c4a3c"), S("6adb4f1f174d7bf3efe3f1bf50053f61e2c988b8")],
      duration: 110, anime_genres: ["Драма", "Романтика", "Удостоено наград"],
      anime_studios: ["CoMix Wave Films"], kinopoisk_rating: 8.4, imdb_rating: 8.4,
      shikimori_rating: 8.82, shikimori_votes: 146197, rating_mpaa: "pg", minimal_age: 12,
      aired_at: "2016-08-26", episodes_total: 1, episodes_aired: 1,
    },
  },

  // ─── Унесённые призраками ──────────────────────────────────────────────────
  {
    id: "movie-726", type: "anime", shikimori_id: "199", year: 2001,
    link: "//kodikplayer.com/video/726/041d96e0573412e4db1de4a8e425ff91/720p",
    title: "Унесённые призраками", title_orig: "Sen to Chihiro no kamikakushi",
    other_title: "Spirited Away",
    translation: { id: 805, title: "Невафильм", type: "voice" },
    created_at: "2014-07-20T13:35:16Z", updated_at: "2024-05-29T20:09:46Z",
    screenshots: [K("video", 726)],
    material_data: {
      anime_title: "Унесённые призраками", title: "Унесённые призраками",
      title_en: "Sen to Chihiro no kamikakushi", other_titles_jp: ["千と千尋の神隠し"],
      anime_kind: "movie", anime_status: "released", all_status: "released", year: 2001,
      anime_description: "Десятилетняя Тихиро вместе с родителями переезжает в новый дом. Срезав путь, они оказываются в заброшенном городке, где родители девочки превращаются в свиней. Хаку объясняет Тихиро, что они в волшебном мире, где правит колдунья Юбаба. Чтобы вернуть родителей, Тихиро нужно попросить у колдуньи работу.",
      poster_url: "https://st.kp.yandex.net/images/film_big/370.jpg",
      anime_poster_url: "https://shikimori.io/uploads/poster/animes/199/8fffb098b0dfa011cd8431d46425d989.jpeg",
      screenshots: [S("9037d4886b92dc572c020c0fd1ca2d6f3481adc3"), S("df5ae1684d419b2a1eaa06ce5259621c1529d5c3"), S("51e680f65f5e19bb47b7f5f9c55a8f0a8270a7d5")],
      duration: 124, anime_genres: ["Мифология", "Приключения", "Удостоено наград", "Фэнтези"],
      anime_studios: ["Studio Ghibli"], kinopoisk_rating: 8.6, imdb_rating: 8.6,
      shikimori_rating: 8.77, shikimori_votes: 120626, rating_mpaa: "pg", minimal_age: 12,
      aired_at: "2001-07-20", episodes_total: 1, episodes_aired: 1,
    },
  },

  // ─── Вайолет Эвергарден ────────────────────────────────────────────────────
  {
    id: "serial-8634", type: "anime-serial", shikimori_id: "33352", year: 2018,
    link: "//kodikplayer.com/serial/8634/fa2dc94ed30801d4966509996a69ccf5/720p",
    title: "Вайолет Эвергарден", title_orig: "Violet Evergarden",
    translation: { id: 610, title: "AniLibria.TV", type: "voice" },
    last_season: 1, last_episode: 13, episodes_count: 14,
    created_at: "2018-01-11T17:30:58Z", updated_at: "2020-02-05T21:50:56Z",
    screenshots: [K("seria", 223426)],
    material_data: {
      anime_title: "Вайолет Эвергарден", title: "Вайолет Эвергарден",
      title_en: "Violet Evergarden", other_titles_jp: ["ヴァイオレット・エヴァーガーデン"],
      anime_kind: "tv", anime_status: "released", all_status: "released", year: 2018,
      anime_description: "Вайолет Эвергарден, молодая девушка, чья жизнь была войной, после тяжёлых увечий покидает поле боя. Её берёт под опеку Клаудия Ходжинс, основатель почтовой службы, предоставляющей услуги «автозапоминающих кукол» — девушек, пишущих письма за неграмотных. Тронутая их работой, Вайолет решает узнать судьбу майора Гилберта и смысл его последних слов.",
      poster_url: "https://st.kp.yandex.net/images/film_big/1097392.jpg",
      anime_poster_url: "https://shikimori.io/uploads/poster/animes/33352/ca7dab80729f41d67712d5a1f0f95a43.jpeg",
      screenshots: [S("9a6b9eb01358a84226ff89623b4ab6347a8ab9d4"), S("0cac34d42b355eb8f55866ca9bac746c4f531abb"), S("ab7f8bd4a066287b67236c00d2de21481b580a1d")],
      duration: 24, anime_genres: ["Драма"],
      anime_studios: ["Kyoto Animation"], kinopoisk_rating: 8.1, imdb_rating: 8.4,
      shikimori_rating: 8.69, shikimori_votes: 78153, rating_mpaa: "PG-13", minimal_age: 16,
      aired_at: "2018-01-11", episodes_total: 13, episodes_aired: 13,
    },
  },

  // ─── Клинок, рассекающий демонов: Бесконечный замок ───────────────────────
  {
    id: "movie-112243", type: "anime", shikimori_id: "59192", year: 2025,
    link: "//kodikplayer.com/video/112243/af15313a8349fc8d2e10df9a86fbea08/720p",
    title: "Клинок, рассекающий демонов: Бесконечный замок", title_orig: "Gekijouban Kimetsu no Yaiba: Mugen-jou Hen",
    other_title: "Истребитель демонов: Бесконечная крепость",
    translation: { id: 910, title: "AniStar", type: "voice" },
    created_at: "2025-07-20T15:30:11Z", updated_at: "2026-01-03T16:01:20Z",
    screenshots: [K("video", 112243)],
    material_data: {
      anime_title: "Клинок, рассекающий демонов: Бесконечный замок — Возвращение Акадзы",
      title: "Истребитель демонов: Бесконечная крепость",
      title_en: "Kimetsu no Yaiba Movie: Mugen Jou-hen",
      anime_kind: "movie", anime_status: "released", all_status: "released", year: 2025,
      anime_description: "Тысячу лет японцев терзают демоны. И только одна организация охотников защищает людей и пытается уничтожить прародителя монстров — Кибуцудзи Мудзана. Тренировки со столпами завершились, и пришла пора продемонстрировать мощь охотников. Но Мудзан переносит истребителей в Замок бесконечности.",
      poster_url: "https://st.kp.yandex.net/images/film_big/7436042.jpg",
      anime_poster_url: "https://shikimori.io/uploads/poster/animes/59192/36c9a5ae5f3804919ca26a0f8f60c5d9.jpeg",
      screenshots: [S("ca5a22e342b4d9636197781d16c782e7c6650ebc"), S("611911606a31db896432808e1eccdba920eba152"), S("ba0039797079629ff2d5a8f8926a9011e652acd7")],
      duration: 150, anime_genres: ["Исторический", "Сверхъестественное", "Сёнен", "Удостоено наград", "Экшен"],
      anime_studios: ["ufotable"], kinopoisk_rating: 8.3, imdb_rating: 8.4,
      shikimori_rating: 8.65, shikimori_votes: 15901, rating_mpaa: "r", minimal_age: 18,
      aired_at: "2025-07-18", episodes_total: 1, episodes_aired: 1,
    },
  },

  // ─── Тетрадь смерти: Перезапись ────────────────────────────────────────────
  {
    id: "movie-58075", type: "anime", shikimori_id: "2994", year: 2008,
    link: "//kodikplayer.com/video/58075/886817667ceaf0f0d2e97679b89683b8/720p",
    title: "Тетрадь смерти: Наследники L", title_orig: "Death Note Rewrite: L o Tsugu Mono",
    other_title: "Тетрадь смерти: Перезапись",
    translation: { id: 1293, title: "UNDERGROUND VOICE", type: "voice" },
    created_at: "2020-07-22T17:31:40Z", updated_at: "2020-07-22T17:31:40Z",
    screenshots: [K("video", 58075)],
    material_data: {
      anime_title: "Тетрадь смерти: Перезапись", title: "Тетрадь смерти: Перезапись. Наследники L",
      title_en: "Death Note: R2 - L o Tsugu Mono",
      anime_kind: "tv_special", anime_status: "released", all_status: "released", year: 2008,
      anime_description: "Произведение покажет оригинальную историю с позиции Рюка — с того момента, как он уронил тетрадь смерти в мир людей, и до того, как Лайт Ягами добился своей цели. Старшеклассник, мечтающий искоренить всё зло, забывает важную деталь: зло — неотъемлемая часть добра.",
      poster_url: "https://st.kp.yandex.net/images/film_big/811653.jpg",
      anime_poster_url: "https://shikimori.io/uploads/poster/animes/2994/f8338be45af179c2f577b6c56d28515e.jpeg",
      screenshots: [S("148a6370ad3ea869ba883622321d3e4eb1ab4c59"), S("41042755b68ca87ac713f575ff743e005b85c780"), S("3b4c6be9fb248587278e6e3df021032d72071194")],
      duration: 94, anime_genres: ["Психологическое", "Сверхъестественное", "Сёнен", "Триллер"],
      anime_studios: ["Madhouse"], kinopoisk_rating: 6.8, imdb_rating: 7.1,
      shikimori_rating: 7.73, shikimori_votes: 12220, rating_mpaa: "R", minimal_age: 18,
      aired_at: "2008-08-22", episodes_total: 2, episodes_aired: 2,
    },
  },

  // ─── Ванпанчмен OVA ────────────────────────────────────────────────────────
  {
    id: "movie-9953", type: "anime", shikimori_id: "31704", year: 2015,
    link: "//kodikplayer.com/video/9953/98ad4427971d04a4b6aa9fd77b02d8af/720p",
    title: "Ванпанчмен: Путь становления героя (OVA)", title_orig: "One Punch Man: Road to Hero (OVA)",
    translation: { id: 609, title: "AniDUB", type: "voice" },
    created_at: "2016-09-01T17:27:10Z", updated_at: "2019-11-15T14:46:25Z",
    screenshots: [K("video", 9953)],
    material_data: {
      anime_title: "Ванпанчмен: Путь к становлению героем", title: "Ванпанчмен: Путь становления героя",
      title_en: "One Punch Man: Road to Hero",
      anime_kind: "ova", anime_status: "released", all_status: "released", year: 2015,
      anime_description: "Дополнительный эпизод, идущий в комплекте с десятым томом манги. В начале своего тернистого пути к становлению полноценным героем Сайтаме приходилось нелегко: после каждой стычки его костюм рвался, причиняя знакомому портному всё больше хлопот.",
      poster_url: "https://st.kp.yandex.net/images/film_big/1138757.jpg",
      anime_poster_url: "https://shikimori.io/uploads/poster/animes/31704/d05884e889e4f9e7009c1d0794a92273.jpeg",
      screenshots: [S("2aa262cee71873b881e45b4b770b44b16b1f9aba"), S("18badd731376b39c7b5a5a8c53b33d50e19e9a98"), S("3a603d6e48576d21dd74f4584f422c5626d995cf")],
      duration: 24, anime_genres: ["Комедия", "Пародия", "Супер сила", "Сэйнэн", "Экшен"],
      anime_studios: ["Madhouse"], kinopoisk_rating: 8.0, imdb_rating: 7.9,
      shikimori_rating: 7.7, shikimori_votes: 30378, rating_mpaa: "R", minimal_age: 18,
      aired_at: "2015-12-04", episodes_total: 1, episodes_aired: 1,
    },
  },

  // ─── Тайтлы без метаданных Shikimori (постер = скриншот) ──────────────────
  { id: "serial-78216", type: "anime-serial", year: 2022, link: "//kodikplayer.com/serial/78216/2bd9223a8c56cc03fe0c9a9ef7611a6c/720p", title: "Эпоха драконов: Индульгенция", title_orig: "Dragon Age: Absolution", translation: { id: 2835, title: "Silver AniAge", type: "voice" }, last_episode: 6, episodes_count: 6, created_at: "2026-09-25T10:13:54Z", updated_at: "2026-09-25T10:42:51Z", screenshots: [K("seria", 1670795)] },
  { id: "serial-77555", type: "anime-serial", shikimori_id: "61814", year: 2026, link: "//kodikplayer.com/serial/77555/97ea435e5db434d9b0d8a56980aeb428/720p", title: "Невеста демона", title_orig: "Oni no Hanayome", translation: { id: 4166, title: "Логово Любви", type: "voice" }, last_episode: 11, episodes_count: 11, created_at: "2026-08-08T05:42:54Z", updated_at: "2026-09-25T15:19:48Z", screenshots: [K("seria", 1652134)], material_data: { anime_status: "ongoing", all_status: "ongoing", year: 2026 } },
  { id: "serial-71757", type: "anime-serial", shikimori_id: "49571", year: 2021, link: "//kodikplayer.com/serial/71757/cfdd61bbe2237da0a87df37931efc3fb/720p", title: "Пожиратель звёзд 2", title_orig: "Tunshi Xingkong 2nd Season", translation: { id: 3209, title: "HORIZON", type: "voice" }, last_episode: 215, episodes_count: 55, created_at: "2025-11-28T15:09:30Z", updated_at: "2026-09-25T11:58:21Z", screenshots: [K("seria", 1539776)] },
  { id: "movie-119461", type: "anime", shikimori_id: "22839", year: 2014, link: "//kodikplayer.com/video/119461/40a063d6c9031cb2439e90307f89d2e6/720p", title: "Перепутье", title_orig: "Kurosurodo", translation: { id: 3605, title: "Подвал Мурой", type: "voice" }, created_at: "2026-09-24T15:23:30Z", updated_at: "2026-09-24T15:23:30Z", screenshots: [K("video", 119461)] },
  { id: "serial-77948", type: "anime-serial", shikimori_id: "62734", year: 2026, link: "//kodikplayer.com/serial/77948/6e7bb2c529bdc5610a239728e2f5fc42/720p", title: "Странники духовного мира", title_orig: "Ling Jing Xing Zhe", translation: { id: 3857, title: "MDA", type: "voice" }, last_episode: 5, episodes_count: 5, created_at: "2026-09-07T17:08:51Z", updated_at: "2026-09-25T16:44:19Z", screenshots: [K("seria", 1663792)], material_data: { anime_status: "ongoing", all_status: "ongoing", year: 2026 } },
  { id: "serial-74265", type: "anime-serial", shikimori_id: "61316", year: 2026, link: "//kodikplayer.com/serial/74265/d3cddd33edb0b98dfaf1090565124a71/720p", title: "Жизнь в альтернативном мире с нуля [ТВ-4]", title_orig: "Re:Zero kara Hajimeru Isekai Seikatsu 4", translation: { id: 1978, title: "Dream Cast", type: "voice" }, last_episode: 18, episodes_count: 18, created_at: "2026-04-09T02:32:28Z", updated_at: "2026-09-24T20:18:53Z", screenshots: [K("seria", 1590289)], material_data: { anime_status: "ongoing", all_status: "ongoing", year: 2026 } },
  { id: "serial-77647", type: "anime-serial", shikimori_id: "61607", year: 2026, link: "//kodikplayer.com/serial/77647/e12e33ed618d19d68283473d86d05568/720p", title: "Агент времени 3", title_orig: "Shiguang Dailiren III", translation: { id: 3955, title: "AniTime Voice", type: "voice" }, last_episode: 8, episodes_count: 8, created_at: "2026-08-14T10:49:36Z", updated_at: "2026-09-25T13:26:56Z", screenshots: [K("seria", 1654522)], material_data: { anime_status: "ongoing", all_status: "ongoing", year: 2026 } },
  { id: "serial-77022", type: "anime-serial", shikimori_id: "58929", year: 2026, link: "//kodikplayer.com/serial/77022/c76153c21a2aa0c888d992897ffc5a01/720p", title: "Призрак в доспехах (2026)", title_orig: "Koukaku Kidoutai (2026)", translation: { id: 2835, title: "Silver AniAge", type: "voice" }, last_episode: 10, episodes_count: 10, created_at: "2026-07-11T16:33:18Z", updated_at: "2026-09-22T00:58:48Z", screenshots: [K("seria", 1641808)] },
  { id: "serial-76571", type: "anime-serial", shikimori_id: "63150", year: 2026, link: "//kodikplayer.com/serial/76571/5e9ffa890b13c6d9f12529e9c4fdc56d/720p", title: "Монстрик Карамелька", title_orig: "Otome Kaijuu Caramelise", translation: { id: 2835, title: "Silver AniAge", type: "voice" }, last_episode: 12, episodes_count: 12, created_at: "2026-07-04T17:39:04Z", updated_at: "2026-09-25T15:19:14Z", screenshots: [K("seria", 1639115)], material_data: { anime_status: "ongoing", all_status: "ongoing", year: 2026 } },
  { id: "serial-50334", type: "anime-serial", shikimori_id: "36653", year: 2018, link: "//kodikplayer.com/serial/50334/affe1cce7009a42fe1355af9412c1c91/720p", title: "Песнь тетивы [ТВ-1]", title_orig: "Tsurune: Kazemai Koukou Kyuudou Bu", translation: { id: 2228, title: "Freedub Studio", type: "voice" }, last_episode: 13, episodes_count: 13, created_at: "2023-04-13T12:30:22Z", updated_at: "2026-09-11T09:35:55Z", screenshots: [K("seria", 1133209)] },
  { id: "serial-72108", type: "anime-serial", shikimori_id: "61107", year: 2025, link: "//kodikplayer.com/serial/72108/68993e0170122ae4947e44ae1956e9d4/720p", title: "Ура мечте!", title_orig: "Ganso! Bandori-chan", translation: { id: 2820, title: "SubVost.Subtitles", type: "subtitles" }, last_episode: 51, episodes_count: 51, created_at: "2025-12-19T20:05:33Z", updated_at: "2026-09-24T14:47:04Z", screenshots: [K("seria", 1548817)] },
  { id: "serial-76921", type: "anime-serial", shikimori_id: "54000", year: 2026, link: "//kodikplayer.com/serial/76921/060d4e503eae02533584d4ca34b59e20/720p", title: "В симуляторе свиданий: Нелёгкая жизнь мобов [ТВ-2]", title_orig: "Otomege Sekai wa Mob ni Kibishii Sekai Desu 2", translation: { id: 609, title: "AniDUB", type: "voice" }, last_episode: 12, episodes_count: 12, created_at: "2026-07-09T10:53:48Z", updated_at: "2026-09-24T12:34:18Z", screenshots: [K("seria", 1640932)] },
  { id: "serial-77527", type: "anime-serial", shikimori_id: "62789", year: 2026, link: "//kodikplayer.com/serial/77527/3b086c9a866b4fa2702122023715124b/720p", title: "Рассекая небосвод", title_orig: "Yi Zhan Cangqiong", translation: { id: 3084, title: "ТО Дубляжная", type: "voice" }, last_episode: 10, episodes_count: 10, created_at: "2026-08-06T12:34:03Z", updated_at: "2026-09-25T16:44:29Z", screenshots: [K("seria", 1651592)], material_data: { anime_status: "ongoing", all_status: "ongoing", year: 2026 } },
  { id: "serial-77124", type: "anime-serial", shikimori_id: "49233", year: 2026, link: "//kodikplayer.com/serial/77124/23f62c93cf7179182c3613f02424c63d/720p", title: "Военная хроника маленькой девочки [ТВ-2]", title_orig: "Youjo Senki II", translation: { id: 3861, title: "AniLiberty", type: "voice" }, last_episode: 12, episodes_count: 12, created_at: "2026-07-14T14:32:05Z", updated_at: "2026-09-25T11:58:02Z", screenshots: [K("seria", 1643129)], material_data: { anime_status: "ongoing", all_status: "ongoing", year: 2026 } },
  { id: "serial-77166", type: "anime-serial", shikimori_id: "63780", year: 2026, link: "//kodikplayer.com/serial/77166/50f8b8c2a6643858473719187205124a/720p", title: "Для тебя во всём цвету [ТВ-2]", title_orig: "Hanazakari no Kimitachi e 2", translation: { id: 557, title: "JAM", type: "voice" }, last_episode: 13, episodes_count: 13, created_at: "2026-07-16T06:50:23Z", updated_at: "2026-09-24T19:48:08Z", screenshots: [K("seria", 1643865)], material_data: { anime_status: "ongoing", all_status: "ongoing", year: 2026 } },
  { id: "serial-76855", type: "anime-serial", shikimori_id: "62542", year: 2026, link: "//kodikplayer.com/serial/76855/d47d98a38073c7b6528762e3c85310a7/720p", title: "Необъятный океан [ТВ-3]", title_orig: "Grand Blue 3", translation: { id: 3881, title: "Ancord Многоголосый", type: "voice" }, last_episode: 11, episodes_count: 11, created_at: "2026-07-08T12:59:26Z", updated_at: "2026-09-25T16:01:38Z", screenshots: [K("seria", 1640581)], material_data: { anime_status: "ongoing", all_status: "ongoing", year: 2026 } },
  { id: "serial-77371", type: "anime-serial", shikimori_id: "33028", year: 2016, link: "//kodikplayer.com/serial/77371/d4224fc24b715bd25752541535987523/720p", title: "Данганронпа 3: Отчаяние", title_orig: "Danganronpa 3: The End of Kibougamine Gakuen - Zetsubou Hen", translation: { id: 3994, title: "ODALETYDUB", type: "voice" }, last_episode: 8, episodes_count: 8, created_at: "2026-07-25T14:02:16Z", updated_at: "2026-09-24T12:41:42Z", screenshots: [K("seria", 1647431)] },
  { id: "serial-77212", type: "anime-serial", shikimori_id: "60059", year: 2026, link: "//kodikplayer.com/serial/77212/1edb50a334018004b8dfcc78baaa0eb0/720p", title: "Неуловимый самурай [ТВ-2]", title_orig: "Nige Jouzu no Wakagimi (2026)", translation: { id: 1291, title: "Crunchyroll.Subtitles", type: "subtitles" }, last_episode: 11, episodes_count: 11, created_at: "2026-07-17T17:35:57Z", updated_at: "2026-09-25T16:24:25Z", screenshots: [K("seria", 1644205)], material_data: { anime_status: "ongoing", all_status: "ongoing", year: 2026 } },
  { id: "serial-78168", type: "anime-serial", shikimori_id: "31327", year: 2015, link: "//kodikplayer.com/serial/78168/9eca08aa1eddd5204e5947187202c720/720p", title: "Кулинарные поединки Сомы OVA-1", title_orig: "Shokugeki no Souma OVA", translation: { id: 3605, title: "Подвал Мурой", type: "voice" }, last_episode: 1, episodes_count: 1, created_at: "2026-09-21T18:41:55Z", updated_at: "2026-09-21T18:41:55Z", screenshots: [K("seria", 1669153)] },
  { id: "serial-78166", type: "anime-serial", shikimori_id: "35466", year: 2018, link: "//kodikplayer.com/serial/78166/4aa07115176e212665ad9f386d2c1319/720p", title: "Повторная жизнь OVA", title_orig: "Relife OVA", translation: { id: 3084, title: "ТО Дубляжная", type: "voice" }, last_episode: 4, episodes_count: 4, created_at: "2026-09-21T17:22:38Z", updated_at: "2026-09-21T17:42:39Z", screenshots: [K("seria", 1669133)] },
  { id: "movie-119464", type: "anime", shikimori_id: "34021", year: 2017, link: "//kodikplayer.com/video/119464/d87ab0f61d4424ecc4de596f0e609953/720p", title: "Люпен III: Кровь Гоэмона Исикавы", title_orig: "Lupin the IIIrd: Chikemuri no Ishikawa Goemon", translation: { id: 933, title: "Amber", type: "voice" }, created_at: "2026-09-24T20:50:07Z", updated_at: "2026-09-24T20:50:07Z", screenshots: [K("video", 119464)] },
  { id: "movie-90834", type: "anime", shikimori_id: "34240", year: 2016, link: "//kodikplayer.com/video/90834/bbab3e174cad1ca19f2c61d25d6f374d/720p", title: "Убежище", title_orig: "Shelter", translation: { id: 1500, title: "YakuSub Studio.Subtitles", type: "subtitles" }, created_at: "2022-11-18T15:08:24Z", updated_at: "2022-11-18T15:08:24Z", screenshots: [K("video", 90834)] },
  { id: "serial-78075", type: "anime-serial", shikimori_id: "64340", year: 2026, link: "//kodikplayer.com/serial/78075/2ebe1c168f3d791afc5422436100147e/720p", title: "Во всеоружии: Сила артефактов", title_orig: "Tempal: Item no Chikara", translation: { id: 923, title: "AnimeVost", type: "voice" }, last_episode: 2, episodes_count: 1, created_at: "2026-09-16T11:18:03Z", updated_at: "2026-09-16T11:18:03Z", screenshots: [K("seria", 1666950)] },
  { id: "movie-77283", type: "anime", shikimori_id: "3990", year: 1943, link: "//kodikplayer.com/video/77283/c755f1853b8ed6aa60eec457edc17c5d/720p", title: "Паук и тюльпан", title_orig: "Kumo to churippu", translation: { id: 869, title: "Субтитры", type: "subtitles" }, created_at: "2021-08-20T13:20:01Z", updated_at: "2021-08-20T13:20:01Z", screenshots: [K("video", 77283)] },
];

export function demoEnabled() {
  return true;
}

function matchesTypes(r: Raw, types: string[]) {
  return types.includes(r.type);
}

export function demoList(p: DemoListParams, dedupe: (rows: Raw[]) => any[]) {
  const types = (p.types ?? "anime-serial,anime").split(",");
  let rows = DEMO_ITEMS.filter((r) => matchesTypes(r, types));
  if (p.anime_kind) rows = rows.filter((r) => r.material_data?.anime_kind === p.anime_kind);
  if (p.anime_status) rows = rows.filter((r) => r.material_data?.anime_status === p.anime_status);
  if (p.anime_genres) rows = rows.filter((r) => (r.material_data?.anime_genres ?? []).includes(p.anime_genres!));
  if (p.year) rows = rows.filter((r) => String(r.material_data?.year ?? r.year) === String(p.year));

  const dir = p.order === "asc" ? 1 : -1;
  const by = p.sort ?? "updated_at";
  rows = [...rows].sort((a, b) => {
    let av: number | string = 0;
    let bv: number | string = 0;
    if (by === "shikimori_rating") {
      av = a.material_data?.shikimori_rating ?? 0;
      bv = b.material_data?.shikimori_rating ?? 0;
    } else if (by === "year") {
      av = a.material_data?.year ?? a.year ?? 0;
      bv = b.material_data?.year ?? b.year ?? 0;
    } else if (by === "created_at") {
      av = a.created_at ?? "";
      bv = b.created_at ?? "";
    } else {
      av = a.updated_at ?? "";
      bv = b.updated_at ?? "";
    }
    return av < bv ? dir : av > bv ? -dir : 0;
  });

  const items = dedupe(rows).slice(0, p.limit ?? 100);
  return { items, next: null, total: items.length };
}

export function demoSearch(q: string): Raw[] {
  const needle = q.trim().toLowerCase();
  if (!needle) return [];
  return DEMO_ITEMS.filter((r) => {
    const m = r.material_data ?? {};
    const hay = [
      r.title, r.title_orig, r.other_title,
      m.title, m.anime_title, m.title_en,
      ...(m.other_titles ?? []), ...(m.other_titles_en ?? []), ...(m.other_titles_jp ?? []),
    ]
      .filter(Boolean)
      .join(" ")
      .toLowerCase();
    return hay.includes(needle);
  });
}

export function demoRawById(id: string): Raw[] {
  return DEMO_ITEMS.filter((r) => r.id === id || (r.shikimori_id && String(r.shikimori_id) === id));
}
