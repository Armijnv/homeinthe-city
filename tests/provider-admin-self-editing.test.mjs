import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const [adminPageSource, adminFormSource, adminActionSource, providerPageSource, providerActionSource, identitySource] = await Promise.all([
  readFile(new URL("../app/dashboard/admin/providers/[providerId]/page.tsx", import.meta.url), "utf8"),
  readFile(new URL("../app/dashboard/admin/providers/ProviderAdminForm.tsx", import.meta.url), "utf8"),
  readFile(new URL("../app/dashboard/admin/providers/actions.ts", import.meta.url), "utf8"),
  readFile(new URL("../app/account/profile/edit/page.tsx", import.meta.url), "utf8"),
  readFile(new URL("../app/account/profile/edit/actions.ts", import.meta.url), "utf8"),
  readFile(new URL("../app/lib/clerkIdentityPolicy.ts", import.meta.url), "utf8"),
]);

test("administrator provider editing reads and writes the existing Sanity self-editing fields", () => {
  assert.match(adminPageSource, /ownership\{[^}]*selfEditEnabled[^}]*selfEditableFields[^}]*\}/s);
  assert.match(adminFormSource, /name="selfEditEnabled"/);
  assert.match(adminFormSource, /option value="false">Disabled/);
  assert.match(adminFormSource, /option value="true">Enabled/);
  assert.match(adminFormSource, /name="selfEditableFields"/);
  assert.match(adminActionSource, /"ownership\.selfEditEnabled": input\.selfEditEnabled/);
  assert.match(adminActionSource, /"ownership\.selfEditableFields": input\.selfEditableFields/);
});

test("the self-editing policy update remains admin-only and audited", () => {
  assert.match(adminActionSource, /updateProviderAction[\s\S]*requireAdmin\("\/dashboard\/admin\/providers"\)/);
  assert.match(adminActionSource, /"ownership\.selfEditEnabled": existing\.ownership\?\.selfEditEnabled === true/);
  assert.match(adminActionSource, /providerChangeLogDocument\([\s\S]*changes: changes\.map/);
  assert.doesNotMatch(providerPageSource, /name=["']selfEditEnabled["']/);
  assert.doesNotMatch(providerActionSource, /formData[^\n]*selfEditEnabled|formString\(formData,\s*["']selfEditEnabled["']/);
});

test("provider authorization consumes both saved ownership settings", () => {
  assert.match(identitySource, /provider\.ownership\?\.selfEditEnabled !== true/);
  assert.match(identitySource, /normalizedProviderEditableFields\(provider\.ownership\?\.selfEditableFields\)/);
});
