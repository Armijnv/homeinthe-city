import assert from "node:assert/strict";
import test from "node:test";
import { loadTypeScriptModule } from "./load-typescript-module.mjs";

const policy = await loadTypeScriptModule("app/lib/propertyListingPolicy.ts");
const changeLog = await loadTypeScriptModule("app/lib/propertyChangeLog.ts");

const realtor = {
  _id: "provider-realtor",
  roles: ["host", "realtor"],
  primaryRole: "realtor",
};
const otherRealtor = {
  _id: "provider-other",
  roles: ["realtor"],
};
const provider = { _id: "provider-normal", roles: ["interpreter"] };

test("a real-estate agent can create a listing linked to themselves", () => {
  assert.equal(policy.canCreatePropertyListing(realtor, false), true);
  assert.equal(
    policy.propertyOwnerForCreate(realtor, false, otherRealtor._id),
    realtor._id,
  );
});

test("a real-estate agent can edit only their linked listing", () => {
  assert.equal(
    policy.canEditPropertyListing({
      provider: realtor,
      isAdmin: false,
      listing: { linkedRealtor: { _ref: realtor._id } },
    }),
    true,
  );
  assert.equal(
    policy.canEditPropertyListing({
      provider: realtor,
      isAdmin: false,
      listing: { linkedRealtor: { _ref: otherRealtor._id } },
    }),
    false,
  );
});

test("a non-agent cannot create or edit Property Listings", () => {
  assert.equal(policy.canCreatePropertyListing(provider, false), false);
  assert.equal(
    policy.canEditPropertyListing({
      provider,
      isAdmin: false,
      listing: { linkedRealtor: { _ref: provider._id } },
    }),
    false,
  );
});

test("an administrator can create and edit all Property Listings", () => {
  assert.equal(policy.canCreatePropertyListing(null, true), true);
  assert.equal(
    policy.propertyOwnerForCreate(null, true, otherRealtor._id),
    otherRealtor._id,
  );
  assert.equal(
    policy.canEditPropertyListing({
      provider: null,
      isAdmin: true,
      listing: { linkedRealtor: { _ref: otherRealtor._id } },
    }),
    true,
  );
});

test("listing ownership and publication controls are administrator-only", () => {
  assert.equal(policy.agentEditablePropertyFields.includes("linkedRealtor"), false);
  assert.equal(policy.agentEditablePropertyFields.includes("status"), false);
  assert.equal(policy.propertyAdministratorOnlyFields.includes("linkedRealtor"), true);
  assert.equal(policy.propertyAdministratorOnlyFields.includes("status"), true);
  assert.equal(policy.propertyStatusForCreate(false, "available"), "hidden");
  assert.equal(policy.propertyStatusForCreate(true, "available"), "available");
});

test("dashboard Property publishing creates an administrator audit entry", () => {
  const document = changeLog.propertyChangeLogDocument({
    context: {
      user: { id: "user_realtor", fullName: "Real Estate Agent" },
      signedInEmail: "agent@example.com",
    },
    propertyId: "property-one",
    propertyTitle: "Test home",
    propertySlug: "test-home",
    changeType: "propertyEdited",
    changes: [
      { field: "title_en", beforeValue: "Old", afterValue: "New" },
    ],
  });

  assert.equal(document._type, "propertyChangeLog");
  assert.equal(document.property._ref, "property-one");
  assert.equal(document.actorUserId, "user_realtor");
  assert.equal(document.actorEmail, "agent@example.com");
  assert.deepEqual(document.changedFields, ["title_en"]);
  assert.equal(document.changes[0].beforeValue, "Old");
  assert.equal(document.changes[0].afterValue, "New");
});
