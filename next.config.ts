import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'standalone',
  eslint: {
    // Warning: This allows production builds to successfully complete even if
    // your project has ESLint errors.
    ignoreDuringBuilds: true,
  },
  typescript: {
    // Warning: This allows production builds to successfully complete even if
    // your project has TypeScript errors.
    ignoreBuildErrors: true,
  },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          {
            key: "Strict-Transport-Security",
            value: "max-age=63072000; includeSubDomains; preload",
          },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=(), interest-cohort=()",
          },
          {
            // Lightweight CSP — allows same-origin + YouTube/Vimeo embeds (used by lectures).
            // report-only first is safer, but we keep enforcement since all surfaces are ours.
            key: "Content-Security-Policy",
            value: [
              "default-src 'self'",
              "script-src 'self' 'unsafe-inline'",
              "style-src 'self' 'unsafe-inline'",
              "img-src 'self' data: https: blob:",
              "font-src 'self' data:",
              "connect-src 'self'",
              "frame-src 'self' https://www.youtube.com https://www.youtube-nocookie.com https://player.vimeo.com",
              "media-src 'self' blob:",
              "object-src 'none'",
              "base-uri 'self'",
              "form-action 'self'",
              "frame-ancestors 'self'",
              "upgrade-insecure-requests",
            ].join("; "),
          },
        ],
      },
      {
        source: "/:locale/essays/:slug/raw.md",
        headers: [
          { key: "X-Robots-Tag", value: "index, follow, max-snippet:-1" },
        ],
      },
      {
        source: "/:locale/science/:slug/raw.md",
        headers: [
          { key: "X-Robots-Tag", value: "index, follow, max-snippet:-1" },
        ],
      },
      {
        source: "/:locale/lectures/:slug/transcript.md",
        headers: [
          { key: "X-Robots-Tag", value: "index, follow, max-snippet:-1" },
        ],
      },
    ];
  },
};

export default nextConfig;
