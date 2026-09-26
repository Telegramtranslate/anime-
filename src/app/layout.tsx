import type { Metadata } from "next";
import type { ReactNode } from "react";
// Шрифты самозагружаемые (тот же Manrope + Unbounded, кириллица включена) —
// сборка не зависит от доступности Google Fonts.
import "@fontsource-variable/manrope/wght.css";
import "@fontsource/unbounded/500.css";
import "@fontsource/unbounded/700.css";
import "@fontsource/unbounded/800.css";
import Header from "@/components/Header";
import Link from "next/link";
import "./globals.css";

export const metadata: Metadata = {
  title: { default: "ANIVERSE — смотреть аниме онлайн", template: "%s · ANIVERSE" },
  description: "Тысячи аниме-сериалов и фильмов в HD с лучшими озвучками. Онгоинги, топы, каталог и персональная коллекция.",
  icons: { icon: [{ url: "/favicon.png", type: "image/png" }] },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="ru">
      <body className="noise bg-ink font-sans text-white antialiased">
        <Header />
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
