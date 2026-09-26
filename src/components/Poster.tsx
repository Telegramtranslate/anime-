"use client";

import { useState } from "react";

/** Постер: если картинка не загрузилась (404/битый URL) — фирменная заглушка с буквой. */
export default function Poster({
  src,
  alt,
  className,
  letterClass,
}: {
  src: string | null;
  alt: string;
  className?: string;
  letterClass?: string;
}) {
  const [broken, setBroken] = useState(false);
  if (!src || broken) {
    return (
      <div className={`grid h-full w-full place-items-center bg-gradient-to-br from-accent/30 via-panel to-accent2/20 ${className ?? ""}`}>
        <span className={`font-display font-extrabold text-white/25 ${letterClass ?? "text-5xl"}`}>
          {alt[0]?.toUpperCase() ?? "•"}
        </span>
      </div>
    );
  }
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={src} alt={alt} loading="lazy" decoding="async" onError={() => setBroken(true)} className={className} />
  );
}
