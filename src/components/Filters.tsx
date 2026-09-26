"use client";

import { useRouter, useSearchParams } from "next/navigation";

type Opt = { value: string; label: string };

export default function Filters({ kinds, statuses, genres, years }: { kinds: Opt[]; statuses: Opt[]; genres: string[]; years: number[] }) {
  const router = useRouter();
  const sp = useSearchParams();

  const set = (k: string, v: string) => {
    const p = new URLSearchParams(sp.toString());
    if (v) p.set(k, v);
    else p.delete(k);
    p.delete("next");
    router.push(`/catalog?${p.toString()}`);
  };

  const Select = ({ name, label, options }: { name: string; label: string; options: Opt[] }) => (
    <label className="glass relative flex min-w-[150px] flex-1 flex-col rounded-2xl px-4 py-2.5 transition hover:border-white/20">
      <span className="text-[10px] font-semibold uppercase tracking-wider text-white/40">{label}</span>
      <select
        value={sp.get(name) ?? ""}
        onChange={(e) => set(name, e.target.value)}
        className="mt-0.5 cursor-pointer appearance-none bg-transparent text-sm font-semibold outline-none [&>option]:bg-panel"
      >
        {options.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
      </select>
      <span className="pointer-events-none absolute right-4 top-1/2 text-white/40">▾</span>
    </label>
  );

  return (
    <div className="flex flex-wrap gap-3">
      <Select name="sort" label="Сортировка" options={[
        { value: "", label: "Рейтинг: сначала высокий" },
        { value: "updated", label: "Обновления: свежие сверху" },
        { value: "year_new", label: "Год: сначала новые" },
        { value: "year_old", label: "Год: сначала старые" },
      ]} />
      <Select name="kind" label="Тип" options={[{ value: "", label: "Любой" }, ...kinds]} />
      <Select name="status" label="Статус" options={[{ value: "", label: "Любой" }, ...statuses]} />
      <Select
        name="genre"
        label="Жанр"
        options={(() => {
          const cur = sp.get("genre");
          const opts = [{ value: "", label: "Все жанры" }, ...genres.map((g) => ({ value: g, label: g }))];
          if (cur && !opts.some((o) => o.value === cur)) opts.push({ value: cur, label: cur });
          return opts;
        })()}
      />
      <Select name="year" label="Год" options={[{ value: "", label: "Любой" }, ...years.map((y) => ({ value: String(y), label: String(y) }))]} />
    </div>
  );
}
