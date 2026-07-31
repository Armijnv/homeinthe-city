import assert from "node:assert/strict";
import test from "node:test";
import { loadTypeScriptModule } from "./load-typescript-module.mjs";

const identity = await loadTypeScriptModule("app/lib/clerkIdentityPolicy.ts");

function email(emailAddress, status) {
  return { emailAddress, verification: { status } };
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
  const reconnectable = { id: "legacy", ownership: { ownerUserId: "legacy:old" } };

  assert.equal(
    identity.selectProviderForUser([reconnectable, owned], "user_123"),
    owned,
  );
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
