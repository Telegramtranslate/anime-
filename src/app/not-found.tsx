import Link from "next/link";

export default function NotFound() {
  return (
    <div className="grid min-h-[80vh] place-items-center px-5 text-center">
      <div>
        <div className="grad-text font-display text-8xl font-extrabold">404</div>
        <p className="mt-4 text-white/60">Такой страницы нет — возможно, аниме убрали из базы.</p>
        <Link href="/" className="btn-primary mt-8 inline-block rounded-full px-7 py-3.5 font-semibold">На главную</Link>
      </div>
    </div>
  );
}
