import type { Metadata } from "next";
import type { ReactNode } from "react";
// Шрифты самозагружаемые (тот же Manrope + Unbounded, кириллица включена) —
// сборка не зависит от доступности Google Fonts.
import "@fontsource-variable/manrope/wght.css";
import "@fontsource/unbounded/500.css";
import "@fontsource/unbounded/700.css";
import "@fontsource/unbounded/800.css";
import Header from "@/components/Header";
import CodeGuard from "@/components/CodeGuard";
import Link from "next/link";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://ani-verse228.vercel.app"),
  title: {
    default: "ANIVERSE — смотреть аниме онлайн бесплатно в хорошем качестве",
    template: "%s · ANIVERSE",
  },
  description:
    "Смотреть аниме онлайн бесплатно в хорошем качестве HD 720p-1080p с русской озвучкой. Тысячи сериалов и фильмов: онгоинги, топы, новинки. Все серии подряд без регистрации.",
  keywords: [
    "смотреть аниме онлайн", "аниме бесплатно", "аниме онлайн в хорошем качестве",
    "аниме с русской озвучкой", "аниме сериалы", "аниме фильмы", "онгоинги", "аниме 2026",
  ],
  openGraph: {
    siteName: "ANIVERSE",
    locale: "ru_RU",
    type: "website",
    title: "ANIVERSE — смотреть аниме онлайн бесплатно",
    description: "Тысячи аниме-сериалов и фильмов в HD с русской озвучкой. Онгоинги, топы и новинки — все серии подряд.",
    images: [{ url: "/favicon.png", type: "image/png" }],
  },
  twitter: { card: "summary", title: "ANIVERSE — смотреть аниме онлайн бесплатно", description: "Аниме в HD с русской озвучкой: онгоинги, топы, новинки." },
  icons: { icon: [{ url: "/favicon.png", type: "image/png" }] },
  themeColor: "#07070b",
  verification: { google: "YuKXId-N_keD9-kaV-ycKhi35fJo2Sx5mLFzLesXRhI" },
  alternates: { canonical: "/" },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="ru">
      <head>
        <link rel="preconnect" href="https://i.shikimori.one" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://i.shikimori.one" />
      </head>
      <body className="noise bg-ink font-sans text-white antialiased">
        <Header />
        <CodeGuard />
        <main className="relative z-10">{children}</main>
        <footer className="relative z-10 mt-24 border-t border-line">
          <div className="mx-auto flex max-w-[1500px] flex-col gap-6 px-5 py-10 text-sm text-white/40 md:flex-row md:items-center md:justify-between md:px-10">
            <div>
              <div className="font-display text-lg font-bold text-white">ANI<span className="grad-text">VERSE</span></div>
              <p className="mt-1">Твоё аниме-пространство: смотри онлайн, собирай коллекцию и делись мнением.</p>
            </div>
            <nav className="flex gap-6">
              <Link href="/catalog" className="hover:text-white">Каталог</Link>
              <Link href="/catalog?status=ongoing" className="hover:text-white">Онгоинги</Link>
              <Link href="/my" className="hover:text-white">Моя коллекция</Link>
            </nav>
          </div>
        </footer>
      </body>
    </html>
  );
}
