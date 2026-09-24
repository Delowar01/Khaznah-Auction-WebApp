# Deploying the Khazna design preview

This folder (`design-preview/`) is a self-contained, fully static Next.js app.
It has no backend, needs no environment variables, credentials or APIs, and
makes no network requests. It can be deployed on its own and removed without
touching anything else.

> **Do not deploy to a live Khazna domain.** Use a temporary preview host
> (for example a `*.vercel.app`, `*.pages.dev` or `*.netlify.app` subdomain).
> Every page already sends `noindex, nofollow` and `public/robots.txt`
> disallows all crawling, so the preview stays out of search results.

Requirements to build: **Node.js 20.9+** (22 LTS recommended) and npm.

---

## Option 1 — Vercel (recommended for a single preview URL)

Connect the repository directly.

| Setting | Value |
|---|---|
| **Repository** | `Delowar01/Khaznah-Auction-WebApp` |
| **Branch** | `claude/magical-faraday-fne4kq` |
| **Root Directory** | `design-preview` |
| **Framework preset** | Next.js (auto-detected) |
| **Build command** | `npm run build` (default) |
| **Install command** | `npm ci` (default) |
| **Output** | handled by Next.js / Vercel (no override) |
| **Environment variables** | none |
| **Node version** | 20.x or later (pinned by `engines` in `package.json`) |

Steps:

1. In Vercel, **Add New → Project** and import `Delowar01/Khaznah-Auction-WebApp`.
2. Set **Root Directory** to `design-preview`. Vercel then detects Next.js and
   fills in the build and install commands above.
3. Under **Git**, set the Production Branch to `claude/magical-faraday-fne4kq`
   (or deploy that branch as a preview deployment).
4. Leave environment variables empty. Deploy.
5. Optional but recommended for a private client link: turn on **Deployment
   Protection** (Vercel Authentication or a password) in the project settings.

**Exact start URL after deployment:** `https://<project-name>.vercel.app/`.
Opening it redirects to `/en` (or `/ar` for a returning Arabic visitor) and
shows the concept selector. Example, depending on the project name:
`https://khazna-design-preview.vercel.app/` → `…/en`.

CLI alternative (from this folder): `npx vercel` for a preview deployment, or
`npx vercel --prod` to promote it.

---

## Option 2 — Static export to any static host

The app also exports to plain HTML/CSS/JS with no server:

```bash
cd design-preview
npm ci
npm run export        # sets STATIC_EXPORT=1 and writes ./out
```

`npm run export` produces a static site in `out/` (`output: 'export'` with
`trailingSlash`, so each route is a folder with an `index.html`). Upload the
**contents** of `out/`. The 404 page is `out/404.html`.

> On Windows, run the export from Git Bash or WSL, or set `STATIC_EXPORT=1`
> manually, because the script uses an inline environment variable.

### Cloudflare Pages

```bash
npm run export
npx wrangler pages deploy out --project-name khazna-design-preview
```

Or connect the repo in the Cloudflare Pages dashboard with **Root directory**
`design-preview`, **Build command** `npm run export`, **Output directory**
`out`. URL: `https://<project>.pages.dev/`.

### Netlify

```bash
npm run export
npx netlify deploy --dir=out --prod
```

Or in the Netlify UI set **Base directory** `design-preview`, **Build command**
`npm run export`, **Publish directory** `design-preview/out`. Netlify serves
`404.html` automatically.

### Amazon S3 + CloudFront

```bash
npm run export
aws s3 sync out/ s3://<your-bucket>/ --delete
```

- S3 static website hosting: **Index document** `index.html`,
  **Error document** `404.html`.
- Because the build uses `trailingSlash`, folder URLs resolve to their
  `index.html`. If you serve S3 through CloudFront as a private origin, add a
  viewer-request rewrite that appends `index.html` to folder paths, and map 404
  responses to `/404.html`.
- Invalidate CloudFront (`/*`) after each upload.

### VPS with Nginx

Copy `out/` to the server (for example `/var/www/khazna-preview`) and serve it
statically:

```nginx
server {
    listen 80;
    server_name preview.example.com;
    root /var/www/khazna-preview;

    location / {
        try_files $uri $uri/ $uri.html =404;
    }

    error_page 404 /404.html;
}
```

No Node.js process is required at runtime — Nginx serves the files directly.
Put HTTPS (for example a Let's Encrypt certificate) in front for a client link.

### Node host (if you prefer a running server over static files)

```bash
npm ci && npm run build && npm start   # serves on http://localhost:3100
```

Put any reverse proxy in front. This runs `next start`; it is not required for
the static hosts above.

---

## Optional — a single downloadable package

To hand over the preview as one file instead of connecting a host:

```bash
npm run package:static   # builds the static export and zips it
```

This writes `khazna-design-preview-static.zip` (the contents of `out/`). Unzip
it on any static host or open `index.html` through a local web server. The zip
is git-ignored and is **not** committed to the repository.

---

## What this preview does not include

- No backend, database, API or WebSocket.
- No environment variables, secrets or credentials.
- No connection to any Khazna production system.
- No analytics or third-party tracking.

All content is sample data bundled with the app.
