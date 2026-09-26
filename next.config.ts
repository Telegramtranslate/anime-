import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // не светим версию фреймворка в ответах (меньше информации для атакующего)
  poweredByHeader: false,
};

export default nextConfig;
