// next.config.js
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: [
      'gateway.pinata.cloud',
      'cdn-icons-png.flaticon.com',
      // Adicione outros domínios se necessário
    ],
  },
  // Outras configurações...
};

export default nextConfig;