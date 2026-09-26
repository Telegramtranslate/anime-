"use client";

import { useEffect } from "react";

/**
 * Базовая защита от любительского копирования:
 * отключает правый клик и горячие клавиши «просмотр кода / сохранение / devtools».
 * (Профессионала с прокси это не остановит — но 99% «копировщиков» да.)
 */
export default function CodeGuard() {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const k = e.key.toLowerCase();
      const blocked =
        e.key === "F12" ||
        (e.ctrlKey && e.shiftKey && (k === "i" || k === "j" || k === "c" || k === "к" || k === "о" || k === "с")) ||
        (e.ctrlKey && !e.shiftKey && (k === "u" || k === "s" || k === "p" || k === "г" || k === "ы" || k === "з"));
      if (blocked) {
        e.preventDefault();
        e.stopPropagation();
      }
    };
    const onCtx = (e: MouseEvent) => e.preventDefault();
    const onDrag = (e: DragEvent) => e.preventDefault();
    document.addEventListener("keydown", onKey, true);
    document.addEventListener("contextmenu", onCtx);
    document.addEventListener("dragstart", onDrag);
    return () => {
      document.removeEventListener("keydown", onKey, true);
      document.removeEventListener("contextmenu", onCtx);
      document.removeEventListener("dragstart", onDrag);
    };
  }, []);
  return null;
}
