import assert from "node:assert/strict";
import test from "node:test";
import { loadTypeScriptModule } from "./load-typescript-module.mjs";

const identity = await loadTypeScriptModule("app/lib/clerkIdentityPolicy.ts");
const changeLog = await loadTypeScriptModule("app/lib/providerChangeLog.ts");

function email(emailAddress, status) {
  return { emailAddress, verification: { status } };
}

function providerOwnership(overrides = {}) {
  return {
    ownership: {
      contactEmail: "provider@example.com",
      ownershipStatus: "claimed",
      selfEditEnabled: true,
      selfEditableFields: ["name", "about"],
      ...overrides,
    },
  };
}

test("verified Clerk emails are normalized and unverified emails are rejected", () => {
  const emails = identity.verifiedEmailAddresses({
    emailAddresses: [
      email(" Verified@Example.com ", "verified"),
      email("unverified@example.com", "unverified"),
    ],
  });

  assert.deepEqual(emails, ["verified@example.com"]);
});

test("a verified secondary email is available when the primary is unverified", () => {
  const secondary = email("secondary@example.com", "verified");
  const selected = identity.verifiedPrimaryEmailAddress({
    primaryEmailAddress: email("primary@example.com", "unverified"),
    emailAddresses: [email("primary@example.com", "unverified"), secondary],
  });

  assert.equal(selected, "secondary@example.com");
});

test("ownerUserId takes priority over a reconnectable Provider match", () => {
  const owned = { id: "owned", ownership: { ownerUserId: "user_123" } };
  const reconnectable = {
    id: "legacy",
    ownership: { ownerUserId: "legacy:old" },
  };

  assert.equal(identity.selectProviderForUser([reconnectable, owned], "user_123"), owned);
});

test("a verified configured administrator email grants administrator access", () => {
  const status = identity.adminStatusForIdentity(
    {
      emailAddresses: [email("admin@example.com", "verified")],
      publicMetadata: {},
    },
    ["admin@example.com"],
  );

  assert.equal(status.isAdmin, true);
});

test("an unverified configured administrator email does not grant access", () => {
  const status = identity.adminStatusForIdentity(
    {
      emailAddresses: [email("admin@example.com", "unverified")],
      publicMetadata: {},
    },
    ["admin@example.com"],
  );

  assert.deepEqual(status, { isAdmin: false, reason: "none" });
});

test("Clerk administrator metadata grants administrator access", () => {
  const status = identity.adminStatusForIdentity(
    {
      emailAddresses: [],
      publicMetadata: { role: "admin" },
    },
    [],
  );

  assert.deepEqual(status, {
    isAdmin: true,
    reason: "Clerk publicMetadata.role",
  });
});

test("an administrator retains Provider management access", () => {
  const capability = identity.providerEditCapability({
    provider: providerOwnership({
      selfEditEnabled: false,
      selfEditableFields: [],
    }),
    userId: "user_admin",
    verifiedEmails: [],
    isAdmin: true,
  });

  assert.equal(capability.canEdit, true);
  assert.equal(capability.identityMatch, "admin");
});

test("a matching ownerUserId can self-edit when enabled", () => {
  const capability = identity.providerEditCapability({
    provider: providerOwnership({ ownerUserId: "user_owner" }),
    userId: "user_owner",
    verifiedEmails: [],
    isAdmin: false,
  });

  assert.equal(capability.canEdit, true);
  assert.equal(capability.reason, "owner-user-id");
  assert.equal(capability.shouldBindOwnerUserId, false);
});

test("a verified email can reconnect an unbound or legacy Provider", () => {
  for (const ownerUserId of [undefined, "legacy:provider"]) {
    const capability = identity.providerEditCapability({
      provider: providerOwnership({ ownerUserId }),
      userId: "user_reconnected",
      verifiedEmails: ["provider@example.com"],
      isAdmin: false,
    });

    assert.equal(capability.canEdit, true);
    assert.equal(capability.reason, "verified-email-reconnection");
    assert.equal(capability.shouldBindOwnerUserId, true);
  }
});

test("an unverified email cannot reconnect a Provider", () => {
  const capability = identity.providerEditCapability({
    provider: providerOwnership({ ownerUserId: undefined }),
    userId: "user_unverified",
    verifiedEmails: [],
    isAdmin: false,
  });

  assert.equal(capability.canEdit, false);
  assert.equal(capability.reason, "unrelated-user");
});

test("an unrelated authenticated user cannot edit another Provider", () => {
  const capability = identity.providerEditCapability({
    provider: providerOwnership({ ownerUserId: "user_owner" }),
    userId: "user_other",
    verifiedEmails: ["other@example.com"],
    isAdmin: false,
  });

  assert.equal(capability.canEdit, false);
  assert.equal(capability.reason, "unrelated-user");
});

test("selfEditEnabled is an authoritative server-side switch", () => {
  const enabled = identity.providerEditCapability({
    provider: providerOwnership({ ownerUserId: "user_owner" }),
    userId: "user_owner",
    verifiedEmails: [],
    isAdmin: false,
  });
  const disabled = identity.providerEditCapability({
    provider: providerOwnership({
      ownerUserId: "user_owner",
      selfEditEnabled: false,
    }),
    userId: "user_owner",
    verifiedEmails: [],
    isAdmin: false,
  });

  assert.equal(enabled.canEdit, true);
  assert.equal(disabled.canEdit, false);
  assert.equal(disabled.reason, "self-edit-disabled");
});

test("selfEditableFields allowlist removes disallowed publish fields", () => {
  const capability = identity.providerEditCapability({
    provider: providerOwnership({ ownerUserId: "user_owner" }),
    userId: "user_owner",
    verifiedEmails: [],
    isAdmin: false,
  });
  const snapshot = identity.enforceProviderEditableFields(
    {
      name: "Allowed name",
      about_en: "Allowed about text",
      headline_en: "Disallowed headline",
      roles: ["host"],
      unknownField: "never accepted",
    },
    capability,
  );

  assert.deepEqual(snapshot, {
    name: "Allowed name",
    about_en: "Allowed about text",
  });
  assert.equal(identity.canEditProviderField(capability, "name"), true);
  assert.equal(identity.canEditProviderField(capability, "headlines"), false);
});

test("an authorized Provider direct-publish patch contains only actual changes", () => {
  const capability = identity.providerEditCapability({
    provider: providerOwnership({ ownerUserId: "user_owner" }),
    userId: "user_owner",
    verifiedEmails: [],
    isAdmin: false,
  });
  const candidate = identity.enforceProviderEditableFields(
    { name: "New name", about_en: "Unchanged", headline_en: "Disallowed" },
    capability,
  );
  const changes = identity.changedProviderFields(
    { name: "Old name", about_en: "Unchanged" },
    candidate,
  );

  assert.deepEqual(changes.map((change) => change.field), ["name"]);
  assert.deepEqual(identity.providerPatchFromChanges(changes), {
    name: "New name",
  });
});

test("submitted fields outside the Provider allowlist are rejected", () => {
  const capability = identity.providerEditCapability({
    provider: providerOwnership({ ownerUserId: "user_owner" }),
    userId: "user_owner",
    verifiedEmails: [],
    isAdmin: false,
  });

  assert.deepEqual(
    identity.disallowedProviderSelfEditFormFields(
      ["name", "headline_en", "roles", "ownership.contactEmail"],
      capability,
    ),
    ["headline_en", "roles", "ownership.contactEmail"],
  );
});

test("an intro-only edit ignores a stored non-allowlisted preferred contact", () => {
  const capability = identity.providerEditCapability({
    provider: providerOwnership({
      ownerUserId: "user_owner",
      selfEditableFields: ["intro"],
    }),
    userId: "user_owner",
    verifiedEmails: [],
    isAdmin: false,
  });
  const provider = {
    intro_en: "Old intro",
    contactOptions: { preferredContact: "whatsapp" },
  };
  const submittedFields = ["intro_en", "intro_pt", "intro_nl"];
  const candidate = identity.enforceProviderEditableFields(
    {
      intro_en: "New intro",
      contactOptions: provider.contactOptions,
    },
    capability,
  );
  const changes = identity.changedProviderFields(provider, candidate);

  assert.deepEqual(
    identity.disallowedProviderSelfEditFormFields(submittedFields, capability),
    [],
  );
  assert.deepEqual(candidate, { intro_en: "New intro" });
  assert.deepEqual(identity.providerPatchFromChanges(changes), {
    intro_en: "New intro",
  });
});

test("forged self-edit controls that are not allowlisted remain rejected", () => {
  const capability = identity.providerEditCapability({
    provider: providerOwnership({
      ownerUserId: "user_owner",
      selfEditableFields: ["intro"],
    }),
    userId: "user_owner",
    verifiedEmails: [],
    isAdmin: false,
  });

  assert.deepEqual(
    identity.disallowedProviderSelfEditFormFields(
      ["preferred-contact", "provider-revision"],
      capability,
    ),
    ["preferred-contact", "provider-revision"],
  );
});

test("sensitive Provider fields remain administrator-only", () => {
  const capability = identity.providerEditCapability({
    provider: providerOwnership({ ownerUserId: "user_admin" }),
    userId: "user_admin",
    verifiedEmails: [],
    isAdmin: true,
  });
  const submitted = [...identity.providerAdministratorOnlyFields];

  assert.deepEqual(
    identity.disallowedProviderSelfEditFormFields(submitted, capability),
    submitted,
  );
  assert.equal(identity.providerSelfEditableFields.includes("roles"), false);
  assert.equal(identity.providerSelfEditableFields.includes("primaryRole"), false);
});

test("a stale Provider revision is rejected", () => {
  assert.equal(
    identity.providerSelfEditRevisionStatus("revision-old", "revision-current"),
    "stale",
  );
  assert.equal(
    identity.providerSelfEditRevisionStatus("revision-current", "revision-current"),
    "current",
  );
});

test("a verified-email first save requests binding and owner access works afterward", () => {
  const reconnecting = identity.providerEditCapability({
    provider: providerOwnership({ ownerUserId: undefined }),
    userId: "user_owner",
    verifiedEmails: ["provider@example.com"],
    isAdmin: false,
  });
  const bound = identity.providerEditCapability({
    provider: providerOwnership({ ownerUserId: "user_owner" }),
    userId: "user_owner",
    verifiedEmails: [],
    isAdmin: false,
  });

  assert.equal(reconnecting.shouldBindOwnerUserId, true);
  assert.equal(bound.canEdit, true);
  assert.equal(bound.identityMatch, "ownerUserId");
  assert.equal(bound.shouldBindOwnerUserId, false);
});

test("Provider self-publishing creates a detailed administrator change log", () => {
  const document = changeLog.providerChangeLogDocument({
    context: {
      user: { id: "user_owner", fullName: "Provider Owner" },
      signedInEmail: "provider@example.com",
    },
    providerId: "provider-test",
    providerName: "Test Provider",
    providerSlug: "test-provider",
    changeType: "providerSelfPublished",
    description: "Provider published changes to name.",
    changes: [
      { field: "name", beforeValue: "Old name", afterValue: "New name" },
    ],
  });

  assert.equal(document.provider._ref, "provider-test");
  assert.equal(document.actorUserId, "user_owner");
  assert.equal(document.actorEmail, "provider@example.com");
  assert.deepEqual(document.changedFields, ["name"]);
  assert.equal(document.changes[0].beforeValue, "Old name");
  assert.equal(document.changes[0].afterValue, "New name");
  assert.ok(Date.parse(document.changedAt));
});
