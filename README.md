# Home in the City

Next.js app for [homeinthe.city](https://homeinthe.city), with localized pages for English, Portuguese and Dutch visitors.

## Getting Started

Copy the environment template and fill in the Sanity project id:

```bash
cp .env.example .env.local
```

Required values:

```bash
NEXT_PUBLIC_SANITY_PROJECT_ID=your-sanity-project-id
NEXT_PUBLIC_SANITY_DATASET=production
NEXT_PUBLIC_SANITY_API_VERSION=2026-05-01
```

Run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

The app uses `next/font` to load Geist.

## Build Checks

Run these checks locally before pushing:

```bash
npm run lint
npx tsc --noEmit
npm run build
```

SEO routes are handled by `app/sitemap.ts` and `app/robots.ts`.

## Deploy

Make sure the same Sanity values are configured in the production, preview and development environments before building or deploying.
