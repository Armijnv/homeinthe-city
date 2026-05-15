# HOME_IN_THE_CITY_SETUP.md
Updated: 2026-05-15

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

## STACK
Next.js (App Router)
TypeScript
Tailwind CSS
Sanity CMS (dataset: production)
Leaflet / react-leaflet
react-globe.gl / three.js

## INTEGRATIONS
Vercel ↔ GitHub (OAuth)
ChatGPT Codex Connector ↔ GitHub
Copilot Chat
Copilot SWE Agent
Unknown PAT: "trusted"
Status: expiring; last used within last week

## DEPLOY
git add .
git commit -m "message"
git push
vercel --prod

## ACTIVE ISSUES
- old iPhone compatibility
- globe behind header desktop
- favicon visibility
- footer spacing
- Google indexing
- mobile/tablet optimization priority

## RULE
Every new connection (token, app, domain, API) gets:
Date | Purpose | Critical? | Where to revoke | Notes
