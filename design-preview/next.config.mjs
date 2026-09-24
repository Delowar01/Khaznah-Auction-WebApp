// Design preview configuration.
// The preview is fully static: every route is pre-rendered from mock data, so
// it can be served by `next start`, deployed to Vercel, or exported as plain
// files (`npm run export` → ./out) to any static host.
const isStaticExport = process.env.STATIC_EXPORT === "1";

/** @type {import('next').NextConfig} */
const nextConfig = {
  ...(isStaticExport ? { output: "export", trailingSlash: true } : {}),
  images: {
    // Images are pre-optimised WebP files produced by scripts/process-images.py.
    unoptimized: true,
  },
  poweredByHeader: false,
  // Do not generate AGENTS.md / CLAUDE.md files during `next dev`.
  agentRules: false,
  experimental: {
    optimizePackageImports: ["lucide-react", "motion"],
    // The app has two root layouts ((root) and [lang]), so unmatched URLs
    // need a standalone 404 page (app/global-not-found.js).
    globalNotFound: true,
  },
};

export default nextConfig;
