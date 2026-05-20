# Sanity Migrations

## Armijn provider profile

`provider-armijn.ndjson` creates the first `provider` document for Armijn using the current legacy host content, existing Porto Alegre city reference, and existing Sanity image asset.

Import after Sanity write credentials are available:

```bash
sanity dataset import sanity/migrations/provider-armijn.ndjson production --replace
```

This does not remove or modify the legacy `host` document. Keep existing host routes unchanged until provider routes are built and migration is planned.
