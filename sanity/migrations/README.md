# Sanity Migrations

## Armijn provider profile

`provider-armijn.ndjson` creates the first `provider` document for Armijn using the current legacy host content, existing Porto Alegre city reference, and existing Sanity image asset.

The provider profile keeps `status: "published"` and adds future ownership metadata:

- `ownership.contactEmail` for later account verification
- `ownership.selfEditEnabled: false` until authenticated self-editing exists
- `legacyHost.slug: "armijn"` with `keepLegacyRoutes: false` because Armijn's legacy host URLs permanently redirect to the localized provider routes

Import after Sanity write credentials are available:

```bash
sanity dataset import sanity/migrations/provider-armijn.ndjson production --replace
```

This does not remove or modify the legacy `host` document. The application keeps the document for historical compatibility but no longer renders Armijn as a separate host profile.

## Historical Provider submission baseline revisions

Provider self-editing now publishes allowlisted fields directly with a Provider
change-log entry. It does not create new `providerSubmission` documents.

Existing submission records and the approval UI remain for historical
compatibility. Historical drafts that already store `baselineProviderRevision`
continue to use the original revision-safe approval behavior. No bulk data
migration is required.

- Existing drafts and review submissions without a baseline are preserved and
  cannot be approved safely. Reject them and request a new submission.
- Do not backfill an existing submission with the current Provider revision;
  that would hide whether the Provider changed after the original draft was
  made.

## City recommendation guides

The editorial recommendation redesign is intentionally additive:

- New articles are stored in `city.recommendationGuides`.
- Existing place-style entries remain unchanged in `city.recommendations`.
- The city-host dashboard only writes `recommendationGuides`, so saving or reordering a new guide cannot delete legacy data.
- Public city pages render curated guides first and legacy picks in a clearly separated section.

Review each legacy record with the city host. Move a single-place record to `mapPlaces`, or rewrite its local knowledge as a themed entry in `recommendationGuides`. Remove the legacy record only after the replacement has been published and checked in every supported language. No automatic destructive migration is required.

## Property dashboard ownership

The dashboard treats the existing `propertyListing.linkedRealtor` reference as
the authoritative listing owner. It never accepts an agent-supplied Provider ID:
the linked Provider is derived from the authenticated Clerk account when an
agent creates a listing. Administrators retain explicit ownership controls.

The Production audit on 2026-07-31 found all three existing listings already
linked to Kornelis van Dijk (`92be1386-c481-462b-88d9-0200a1403e66`):

- `8eee4945-b56e-4a44-b529-8420407ba59d` (`parklife`)
- `52c426b4-eb25-41db-b0bf-4742a3cc2248` (`parkview`)
- `880976df-cf7b-4566-93a6-b4e4883cc5aa` (`pantano-do-sul-three-sea-view-units`)

Kornelis has the `realtor` role and a bound `ownership.ownerUserId`, so no
ownership migration is required. Do not invent ownership for future unlinked
listings; an administrator must review and link those records manually.

Dashboard-created listings are normal Sanity documents with `status: "hidden"`,
not Sanity drafts. They remain absent from public pages and the sitemap until an
administrator changes the status. Every dashboard create or edit also creates a
`propertyChangeLog` document for oversight.
