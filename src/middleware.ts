import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

/**
 * Базовый слой безопасности: защитные заголовки на всех ответах.
 * - nosniff: браузер не угадывает тип файла (защита от MIME-инъекций);
 * - SAMEORIGIN: сайт нельзя встроить в чужой iframe (защита от кликджекинга);
 * - Referrer-Policy: не утекают внутренние адреса при переходах;
 * - Permissions-Policy: отключены неиспользуемые возможности браузера.
 */
export function middleware(req: NextRequest) {
  const res = NextResponse.next();
  res.headers.set("X-Content-Type-Options", "nosniff");
  res.headers.set("X-Frame-Options", "SAMEORIGIN");
  res.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  res.headers.set("Permissions-Policy", "camera=(), microphone=(), geolocation=(), payment=(), usb=()");
  res.headers.set("X-DNS-Prefetch-Control", "on");
  // CSP: запрещаем встраивание объектов, чужие base URI и формы наружу;
  // frame-ancestors дублирует защиту от кликджекинга на уровне CSP.
  res.headers.set(
    "Content-Security-Policy",
    "base-uri 'self'; form-action 'self'; object-src 'none'; frame-ancestors 'self'",
  );
  return res;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|favicon.png).*)"],
};
