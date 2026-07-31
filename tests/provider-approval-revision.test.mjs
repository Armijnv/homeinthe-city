import assert from "node:assert/strict";
import test from "node:test";
import { loadTypeScriptModule } from "./load-typescript-module.mjs";

const approval = await loadTypeScriptModule(
  "sanity/lib/providerSubmissionApproval.ts",
);

test("matching Provider revisions allow normal approval", () => {
  assert.equal(
    approval.providerApprovalRevisionStatus("revision-1", "revision-1"),
    "ready",
  );
});

test("a changed Provider revision refuses approval", () => {
  assert.equal(
    approval.providerApprovalRevisionStatus("revision-1", "revision-2"),
    "provider-changed",
  );
});

test("a legacy submission without a baseline refuses unsafe approval", () => {
  assert.equal(
    approval.providerApprovalRevisionStatus(undefined, "revision-2"),
    "legacy-baseline-missing",
  );
});
