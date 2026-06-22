# Sanity Migrations

## Armijn provider profile

`provider-armijn.ndjson` creates the first `provider` document for Armijn using the current legacy host content, existing Porto Alegre city reference, and existing Sanity image asset.

The provider profile keeps `status: "published"` and adds future ownership metadata:

- `ownership.contactEmail` for later account verification
- `ownership.selfEditEnabled: false` until authenticated self-editing exists
- `legacyHost.slug: "armijn"` with `keepLegacyRoutes: true` so existing `/hosts/[slug]` routes stay compatible

Import after Sanity write credentials are available:

```bash
sanity dataset import sanity/migrations/provider-armijn.ndjson production --replace
```

This does not remove or modify the legacy `host` document. Keep existing host routes unchanged until provider routes are built and migration is planned.

## City recommendation guides

The editorial recommendation redesign is intentionally additive:

- New articles are stored in `city.recommendationGuides`.
- Existing place-style entries remain unchanged in `city.recommendations`.
- The city-host dashboard only writes `recommendationGuides`, so saving or reordering a new guide cannot delete legacy data.
- Public city pages render curated guides first and legacy picks in a clearly separated section.

Review each legacy record with the city host. Move a single-place record to `mapPlaces`, or rewrite its local knowledge as a themed entry in `recommendationGuides`. Remove the legacy record only after the replacement has been published and checked in every supported language. No automatic destructive migration is required.
