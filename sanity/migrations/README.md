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
