import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // не светим версию фреймворка в ответах (меньше информации для атакующего)
  poweredByHeader: false,
  // без карт исходников в проде: в браузере только минифицированный код
  productionBrowserSourceMaps: false,
};

export default nextConfig;
