# HOME_IN_THE_CITY_SETUP.md
Updated: 2026-05-20

## PURPOSE
Business interpreters / local hosts / city guides
Main city: Porto Alegre
Languages: EN / PT / NL
Former name: Trusted Hosts

## INFRASTRUCTURE
Domain: https://homeinthe.city
Hosting: Vercel
DNS: Cloudflare
Repo: GitHub Armijnv/homeinthe-city
Editor: VS Code
Machine: Silver-Bullet (MacBook)

## DEPLOYMENT STATUS / RULES
Production is served by Vercel behind Cloudflare.
Do not assume a local build will match Vercel unless the Sanity environment
variables below are present locally and in Vercel.

Before pushing or deploying, run:

npm run lint
npx tsc --noEmit
npm run build

Do not deploy automatically from Codex unless explicitly requested.

## STACK
Next.js (App Router)
TypeScript
Tailwind CSS
Sanity CMS (dataset: production)
Leaflet / react-leaflet
react-globe.gl / three.js

## REQUIRED ENVIRONMENT VARIABLES
Local development and Vercel production builds both require these public Sanity
values:

NEXT_PUBLIC_SANITY_PROJECT_ID
NEXT_PUBLIC_SANITY_DATASET=production
NEXT_PUBLIC_SANITY_API_VERSION=2026-05-01

Use `.env.example` as the local template. Copy it to `.env.local` and fill in
the real Sanity project id. Keep the same values configured in Vercel Project
Settings -> Environment Variables for Production, Preview and Development.

If `npm run build` fails with `Missing environment variable:
NEXT_PUBLIC_SANITY_DATASET` or `NEXT_PUBLIC_SANITY_PROJECT_ID`, the code is
usually not the issue; the local or Vercel environment is incomplete.

## SEO / INDEXING
The app uses Next metadata routes:

- `app/sitemap.ts` lists the current public EN / PT / NL pages.
- `app/robots.ts` allows crawling and points search engines to
  `https://homeinthe.city/sitemap.xml`.

Cloudflare may serve managed robots content until the latest application build
is deployed and cached responses expire. After deployment, verify:

curl -I https://homeinthe.city/robots.txt
curl -L https://homeinthe.city/robots.txt
curl -L https://homeinthe.city/sitemap.xml

Keep the multilingual URL structure intact when editing SEO:

- English root and `/brazil/porto-alegre`
- Portuguese `/pt` and `/pt/brasil/porto-alegre`
- Dutch `/nl` and `/nl/brazilie/porto-alegre`
- Host profiles under `/hosts/[slug]`, `/pt/hosts/[slug]`,
  `/nl/hosts/[slug]`

## IMAGE ASSETS
Primary public images were optimized on 2026-05-20 without changing filenames:

- `public/logo.png` was resized to 512x512 for header/footer use.
- `public/me.png` was resized to 800x1200 for profile/contact UI use.
- `public/og-armijn2.jpg` was resized to 1200x630 for Open Graph fallback use.

Do not replace these with larger originals unless there is a visible quality
problem. Keep filenames stable because they are referenced directly in app
components and metadata. Larger public images that are not currently critical
should be reviewed before being added to visible pages.

## SANITY / CONTENT
Sanity Studio is mounted at `/studio`.
Public content currently uses Sanity documents for city, service page and host
content. This project does not yet have a custom profile dashboard or app auth;
editing is through Sanity Studio.

## INTEGRATIONS
Vercel ↔ GitHub (OAuth)
ChatGPT Codex Connector ↔ GitHub
Copilot Chat
Copilot SWE Agent
Unknown PAT: "trusted"
Status: expiring; last used within last week

## DEPLOY
npm run lint
npx tsc --noEmit
npm run build
git add .
git commit -m "message"
git push
vercel --prod

Only run `vercel --prod` when the deployment is intentional.

## ACTIVE ISSUES
- old iPhone compatibility
- globe behind header desktop
- favicon visibility
- footer spacing
- Google indexing: verify robots/sitemap after next deployment
- mobile/tablet optimization priority
- dependency audit advisories need careful review before upgrading

## RULE
Every new connection (token, app, domain, API) gets:
Date | Purpose | Critical? | Where to revoke | Notes
