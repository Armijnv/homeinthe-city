import assert from "node:assert/strict";
import test from "node:test";
import { loadTypeScriptModule } from "./load-typescript-module.mjs";

const activity = await loadTypeScriptModule("app/lib/activityChanges.ts");
const cityLog = await loadTypeScriptModule("app/lib/cityChangeLog.ts");
const summary = await loadTypeScriptModule("app/lib/adminActivitySummary.ts");

test("unchanged values do not produce activity field changes", () => {
  assert.deepEqual(
    activity.activityFieldChanges(
      { intro_en: "Welcome", cards: [{ _key: "one", _type: "object", title: "One" }] },
      { intro_en: "Welcome", cards: [{ _key: "one", _type: "object", title: "One" }] },
    ),
    [],
  );
});

test("recommendation activity distinguishes add, edit, and delete exactly once", () => {
  const before = [
    { _key: "edited", title_en: "Old title" },
    { _key: "deleted", title_en: "Deleted recommendation" },
  ];
  const after = [
    { _key: "edited", title_en: "New title" },
    { _key: "added", title_en: "Added recommendation" },
  ];

  const changes = activity.keyedArrayActivityChanges(before, after);
  assert.deepEqual(changes.map((change) => change.type).sort(), ["added", "deleted", "updated"]);
  assert.equal(changes.length, 3);
});

test("an unchanged recommendation array produces no activity", () => {
  const recommendations = [{ _key: "same", _type: "recommendationGuide", title_en: "Same" }];
  assert.deepEqual(
    activity.keyedArrayActivityChanges(recommendations, structuredClone(recommendations)),
    [],
  );
});

test("administrator city changes create the same activity document as host changes", () => {
  const base = {
    city: { _id: "city-porto-alegre", name_en: "Porto Alegre", slug: { current: "porto-alegre" } },
    changeType: "cityContent",
    description: "Updated city content.",
    changes: [{ field: "intro_en", beforeValue: "Old", afterValue: "New" }],
  };
  const user = { id: "user-1", fullName: "Armijn" };
  const admin = cityLog.cityChangeLogDocument({ ...base, context: { isAdmin: true, user, signedInEmail: "admin@example.com" } });
  const host = cityLog.cityChangeLogDocument({ ...base, context: { isAdmin: false, user, signedInEmail: "host@example.com", provider: { _id: "provider-1", name: "Jon" } } });

  assert.equal(admin._type, "cityChangeLog");
  assert.equal(admin.actorRole, "Administrator");
  assert.equal(host._type, "cityChangeLog");
  assert.equal(host.actorRole, "City Host");
  assert.equal(admin.changes.length, 1);
});

test("a profile-photo-only activity is counted by the Administrator summary", () => {
  assert.equal(
    summary.adminActivitySummaryKey({
      kind: "provider",
      changeType: "providerSelfPublished",
      changes: [{ field: "mainPhoto" }],
    }),
    "profilePhotos",
  );
});
