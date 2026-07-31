# Home in the City Infrastructure Setup

Last updated: 2026-05-21

## Purpose

Home in the City is the production web app for business interpreters, local hosts, city guides, and city information in Porto Alegre.

Primary production domain: https://homeinthe.city

Languages: English, Portuguese, Dutch

Former name: Trusted Hosts

## Infrastructure Inventory

| Area | Current setup | Last updated |
| --- | --- | --- |
| Source control | GitHub repository `Armijnv/homeinthe-city` | 2026-05-21 |
| Hosting | Vercel project `homeinthe-city` | 2026-05-21 |
| Domain and DNS | Cloudflare manages `homeinthe.city` DNS in front of Vercel | 2026-05-20 |
| Content CMS | Sanity project with `production` dataset | 2026-05-21 |
| Studio | Sanity Studio mounted at `/studio` | 2026-05-20 |
| Auth | Clerk protects account routes and provider profile editing | 2026-05-21 |
| Search indexing | Google Search Console verification meta tag in root layout | 2026-05-20 |
| SEO feeds | Next metadata routes serve `/robots.txt` and `/sitemap.xml` | 2026-05-20 |

## GitHub

Repository: `Armijnv/homeinthe-city`

Default branch: `main`

Remote: `origin`

Connected integrations:

- Vercel GitHub integration for deployments.
- ChatGPT Codex GitHub connector.
- GitHub Copilot tools may have access depending on the signed-in GitHub account.

Known credential note:

- A legacy GitHub personal access token named `trusted` was previously noted as expiring. Revoke or replace it from GitHub account settings if it is still present.

Last reviewed: 2026-05-21

## Vercel

Project name: `homeinthe-city`

Production source: GitHub `main`

Production domain: `homeinthe.city`

Vercel environment scopes that must stay aligned:

- Production
- Preview
- Development

Required Vercel configuration:

- GitHub repository connected.
- Environment variables configured for Sanity.
- Environment variables configured for Clerk.
- Environment variable configured for Sanity write access when provider draft saving is enabled.

Last reviewed: 2026-05-21

## Sanity

Dataset: `production`

Studio route: `/studio`

Configured schemas:

- `city`
- `host`
- `provider`
- `providerSubmission`
- `servicePage`

City documents store `country` alongside latitude and longitude for public
geographic metadata. Use `npm run report:cities` to report missing values
without modifying Sanity.

Sanity integrations:

- `next-sanity` client for public reads.
- Server-side Sanity write client for provider draft submissions.
- Sanity Studio structure groups published providers and provider submissions.
- Sanity Vision plugin is enabled in Studio.

Current content ownership surfaces:

- Public content reads from published Sanity documents.
- Provider self-editing writes draft submissions only.
- Approval/publishing remains separate from the public provider document.

Last reviewed: 2026-05-21

## Clerk Auth

Clerk is installed through `@clerk/nextjs`.

Protected route area:

- `/account`
- `/account/profile/edit`

Auth routing:

- Sign-in route: `/sign-in`
- Sign-up route: `/sign-up`
- Account fallback route: `/account`

Current account behavior:

- Account pages require a signed-in Clerk session.
- Provider profile editing resolves the provider from the signed-in Clerk user and email addresses.
- Public provider profile slugs are not used for ownership resolution.

Last added: 2026-05-21

Last reviewed: 2026-05-21

## Provider Ownership Model

Live provider documents store ownership metadata under `ownership`.

Ownership fields:

- `ownership.contactEmail`
- `ownership.ownerUserId`
- `ownership.ownershipStatus`
- `ownership.selfEditEnabled`
- `ownership.selfEditableFields`

Draft edit model:

- Signed-in provider accounts are matched by Clerk user id or signed-in email against provider ownership metadata.
- Edits save to `providerSubmission`, not to the live `provider`.
- Draft edits are stored in `providerSubmission.profileSnapshot`.
- New submissions start with `status: draft`.
- Existing draft submissions are updated when present.
- There is no public publish action in the account editor.
- Public provider pages continue reading only published provider documents.

Submission fields:

- `provider`
- `baselineProviderRevision`
- `ownerUserId`
- `ownerEmail`
- `status`
- `profileSnapshot`
- `submittedAt`
- `reviewedAt`
- `reviewedBy`
- `reviewNote`

`baselineProviderRevision` captures the Provider document revision when a
draft is first saved. Approval is refused if the Provider has changed since
that revision. Older review submissions without a baseline are preserved but
must not be approved; reject and request a new submission instead. Do not
backfill older drafts or review submissions with the current revision, because
that would conceal whether the Provider changed after the original draft.

Last added: 2026-05-21

Last reviewed: 2026-05-21

## Cloudflare And Domain

Domain: `homeinthe.city`

DNS provider: Cloudflare

Hosting target: Vercel

Cloudflare considerations:

- DNS must continue pointing production traffic to Vercel.
- Cached responses can delay visible changes to `/robots.txt`, `/sitemap.xml`, and metadata after deployment.
- Domain ownership and DNS changes should be managed in Cloudflare, not Vercel alone.

Last reviewed: 2026-05-21

## Google Search Console

Verification method:

- Root layout includes a Google site verification meta tag.

Search-related application endpoints:

- `https://homeinthe.city/robots.txt`
- `https://homeinthe.city/sitemap.xml`

Current indexed URL families:

- English root and city pages.
- Portuguese `/pt` pages.
- Dutch `/nl` pages.
- Public hosts and provider profile pages.

Last reviewed: 2026-05-21

## Environment Variables

Environment variable names only:

- `NEXT_PUBLIC_SANITY_PROJECT_ID`
- `NEXT_PUBLIC_SANITY_DATASET`
- `NEXT_PUBLIC_SANITY_API_VERSION`
- `SANITY_API_WRITE_TOKEN`
- `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`
- `CLERK_SECRET_KEY`
- `NEXT_PUBLIC_CLERK_SIGN_IN_URL`
- `NEXT_PUBLIC_CLERK_SIGN_UP_URL`
- `NEXT_PUBLIC_CLERK_SIGN_IN_FALLBACK_REDIRECT_URL`
- `NEXT_PUBLIC_CLERK_SIGN_UP_FALLBACK_REDIRECT_URL`

Configured locations:

- Local `.env.local`
- Vercel Production environment
- Vercel Preview environment
- Vercel Development environment

Never commit environment variable values.

Last reviewed: 2026-05-21

## Deployment Workflow

Production deployment path:

1. Changes land on GitHub `main`.
2. Vercel builds from the connected GitHub repository.
3. Vercel serves production.
4. Cloudflare DNS routes `homeinthe.city` traffic to Vercel.
5. Google Search Console discovers public updates through rendered metadata, robots, and sitemap responses.

Manual production deployment:

- Use Vercel production deployment only when an intentional production release is needed.

Pre-deployment verification status:

- Lint is the configured static check.
- TypeScript is run with no emit.
- Production build depends on Sanity and Clerk environment variables being present in the target environment.

Last reviewed: 2026-05-21

## Known Dependencies

Runtime dependencies:

- `@clerk/nextjs`
- `@sanity/image-url`
- `@sanity/vision`
- `dotenv`
- `leaflet`
- `next`
- `next-sanity`
- `openai`
- `react`
- `react-dom`
- `react-globe.gl`
- `react-leaflet`
- `sanity`
- `styled-components`
- `three`

Development dependencies:

- `@tailwindcss/postcss`
- `@types/leaflet`
- `@types/node`
- `@types/react`
- `@types/react-dom`
- `eslint`
- `eslint-config-next`
- `tailwindcss`
- `typescript`

Dependency inventory last reviewed: 2026-05-21

## Change Log

| Date | Change |
| --- | --- |
| 2026-05-21 | Added Clerk auth and provider draft submission infrastructure notes. |
| 2026-05-21 | Added Sanity write-token environment variable name for provider draft saving. |
| 2026-05-21 | Updated GitHub and Vercel project references. |
| 2026-05-20 | Initial infrastructure notes for domain, hosting, Sanity, SEO, and deployment. |
