import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  typescript: {
    ignoreBuildErrors: true,
  },
  reactStrictMode: false,
  allowedDevOrigins: [
    'preview-chat-e4fe5505-22fe-4fae-9d1e-cbb0f592aa59.space-z.ai',
    '.space-z.ai'
  ],
};

export default nextConfig;
