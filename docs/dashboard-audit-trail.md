# Dashboard audit trail

The Administrator Activity feed is the audit record for mutations performed through the Home in the City dashboards.

Dashboard server actions must write the content mutation and its activity document in the same Sanity transaction. Unchanged saves must not create activity documents. Provider activity uses `providerChangeLog`, city, map-place, and recommendation activity uses `cityChangeLog`, and property activity uses `propertyChangeLog`. Provider review submissions remain represented by their `providerSubmission` document.

## Intentional exclusion: Sanity Studio

Direct changes made in Sanity Studio intentionally bypass the dashboard audit trail. Studio uses Sanity's native document mutations and does not call the dashboard server actions that create Activity records.

Until Studio document actions or webhooks are implemented, the Administrator Activity feed is complete for dashboard-based changes only. Operational procedures should treat Studio changes as outside this audit record.
