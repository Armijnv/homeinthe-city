# Project TODO

## High Priority Dashboard Improvements

- Add latitude and longitude fields to Admin → Create City.
- Add latitude and longitude editing to City Dashboard.
- Remove need to open Sanity Studio for city coordinates.
- Verify globe, map and city discovery all use the same coordinate source.

# Home in the City - Architecture Decisions

## Current model

### Network structure

- Home in the City is a curated provider network.
- Public users cannot create provider profiles.
- Admin creates and manages providers.
- Admin can edit, disable, and reassign any provider.
- Admin can edit all cities.
- City hosts can manage their assigned city.
- City hosts should later be able to add or invite providers for their own city, but not outside it.

### Roles

#### Admin
- Full control over providers, cities, permissions, and visibility.
- Can assign city hosts.
- Can assign managed cities.
- Can override all content.

#### City Host
- Can manage assigned cities only.
- Can edit city content, recommendations, and map places.
- Can later add/invite providers for assigned cities.
- Cannot assign providers to cities they do not manage.
- All changes are logged.

#### Provider / Interpreter
- Can edit own profile.
- Can be connected to one or more cities.
- Can later manage their own language layer for a city.
- Cannot edit the main city settings unless they are also the city host.

### Cities and languages

- City languages inherit from the primary city host by default.
- Admin can override language availability when needed.
- Disabled languages should not appear as public flags.
- Nonexistent city/language routes should return 404.

### Future language host model

Goal:

- Jon = City Host Florianópolis.
- Claudia = City Host São Paulo.
- German interpreter = German Porto Alegre language page.
- Korean interpreter = Korean São Paulo language page.
- Swedish interpreter = Swedish Florianópolis language page.

Language specialists should eventually manage their own city-language layer without becoming the main city host.

Example:

- Jon manages the main Florianópolis city page.
- A Swedish interpreter manages the Swedish Florianópolis page.
- A German interpreter manages the German Porto Alegre page.
- A Korean interpreter manages the Korean São Paulo page.

### Lead management

Planned:

- Track email leads.
- Track WhatsApp lead clicks.
- Notify admin when leads are sent.
- Maintain visibility into provider response quality.

### Recent implementations

Completed June 2026:
- City host permissions.
- Managed city access control.
- City change audit logging.
- Language inheritance system.
- Admin provider creation and editing.
- Provider change audit logging.

## Urgent before Monday

- [ ] Test mobile map place photo upload from an iPhone.
- [ ] Test JPG/PNG upload on mobile after the Server Action upload limit change.
- [ ] Confirm HEIC/HEIF photo errors are visible and understandable on mobile.
- [ ] Prepare Florianopolis for Jon.
- [ ] Replace the fake Florianopolis image with `public/florianopolis.jpg`.
- [ ] Assign city host permissions through `managedCities`.
- [ ] Confirm Jon can access only his managed city dashboard.
- [ ] Confirm regular providers cannot edit city content.
- [ ] Smoke-test `/dashboard/cities/[citySlug]` on mobile.

## Home in the City roadmap

- [ ] Finish city dashboard content/recommendations editors.
- [ ] Add real content for the first expanded city pages.
- [ ] Improve provider and city host dashboard flows.
- [ ] Make onboarding clearer for providers, hosts, and city hosts.
- [ ] Add better visible success/error states across dashboard forms.
- [ ] Review public city page copy after dashboard edits are live.

## SEO / indexing

- [ ] Request Google indexing for key pages.
- [ ] Submit or refresh sitemap in Google Search Console.
- [ ] Request indexing for Porto Alegre city guide.
- [ ] Request indexing for Florianopolis city guide when ready.
- [ ] Request indexing for provider profile pages.
- [ ] Check canonical URLs and localized alternates for city pages.
- [ ] Review page titles and descriptions for new city pages.

## City dashboard

- [ ] Finish and test city content editor.
- [ ] Finish and test recommendations editor.
- [ ] Confirm sidebar cards save and render correctly.
- [ ] Confirm recommendation categories only show when they have items.
- [ ] Confirm custom recommendation categories save and display correctly.
- [ ] Add public rendering for the new `recommendations` Sanity field if needed.
- [ ] Verify admin can edit all cities.
- [ ] Verify city hosts can edit only cities in `managedCities`.
- [ ] Verify regular providers cannot access city editing routes.
- [ ] Add any missing city dashboard links from admin views.

## Real estate

- [ ] Review Florianopolis real estate pages before sharing.
- [ ] Confirm property listing images and map coordinates are production-ready.
- [ ] Check real estate page SEO titles/descriptions.
- [ ] Decide how realtor/provider profiles connect to city pages.
- [ ] Review rental/sale listing statuses and public visibility.

## Future ideas

- [ ] Add more city pages beyond Porto Alegre and Florianopolis.
- [ ] Improve provider/city host app experience.
- [ ] Consider PWA support for city hosts working from phones.
- [ ] Add richer mobile media handling for dashboard uploads.
- [ ] Add better image conversion guidance for iPhone photos.
- [ ] Add dashboard previews before publishing city content.
- [ ] Add more structured recommendation types over time.
