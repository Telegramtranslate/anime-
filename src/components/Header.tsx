"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import AuthButton from "./AuthButton";
import NotificationCenter from "./NotificationCenter";

const NAV = [
  { href: "/", label: "Главная" },
  { href: "/catalog", label: "Каталог" },
  { href: "/catalog?status=ongoing", label: "Онгоинги" },
  { href: "/catalog?kind=movie", label: "Фильмы" },
  { href: "/my", label: "Коллекция" },
];

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const path = usePathname();

  useEffect(() => {
    const on = () => setScrolled(window.scrollY > 20);
    on();
    window.addEventListener("scroll", on, { passive: true });
    return () => window.removeEventListener("scroll", on);
  }, []);

  useEffect(() => setOpen(false), [path]);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
        scrolled ? "border-b border-line bg-ink/75 backdrop-blur-xl" : "bg-gradient-to-b from-black/70 to-transparent"
      }`}
    >
      <div className="mx-auto flex h-16 max-w-[1500px] items-center gap-3 px-4 min-[400px]:gap-6 min-[400px]:px-5 md:h-20 md:px-10">
        <Link href="/" className="flex items-center gap-2.5">
          <span className="btn-primary grid h-9 w-9 place-items-center rounded-xl">
            <svg viewBox="0 0 24 24" className="h-4 w-4 fill-white"><path d="M8 5v14l11-7z" /></svg>
          </span>
          <span className="font-display text-base font-bold tracking-tight min-[400px]:text-lg">
            ANI<span className="grad-text">VERSE</span>
          </span>
        </Link>
        <nav className="hidden items-center gap-1 lg:flex">
          {NAV.map((n) => (
            <Link key={n.href} href={n.href} className="rounded-full px-4 py-2 text-sm font-medium text-white/70 transition hover:bg-white/5 hover:text-white">
              {n.label}
            </Link>
          ))}
        </nav>
        <div className="ml-auto flex items-center gap-2 min-[400px]:gap-3">
          <NotificationCenter />
          <AuthButton />
          <button onClick={() => setOpen(!open)} className="grid h-10 w-10 place-items-center rounded-xl glass lg:hidden" aria-label="Меню">
            <svg viewBox="0 0 24 24" className="h-5 w-5 stroke-white" fill="none" strokeWidth="2"><path d={open ? "M6 6l12 12M18 6 6 18" : "M4 7h16M4 12h16M4 17h16"} /></svg>
          </button>
        </div>
      </div>
      {open && (
        <div className="border-t border-line bg-ink/95 px-5 pb-6 pt-4 backdrop-blur-xl lg:hidden">
          {NAV.map((n) => (
            <Link key={n.href} href={n.href} className="block rounded-xl px-3 py-3 text-white/80 hover:bg-white/5">{n.label}</Link>
          ))}
        </div>
      )}
    </header>
  );
}
