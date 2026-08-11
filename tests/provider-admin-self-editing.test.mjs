import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const [adminPageSource, adminFormSource, adminActionSource, providerPageSource, providerActionSource, identitySource, activitySource, activityDetailSource] = await Promise.all([
  readFile(new URL("../app/dashboard/admin/providers/[providerId]/page.tsx", import.meta.url), "utf8"),
  readFile(new URL("../app/dashboard/admin/providers/ProviderAdminForm.tsx", import.meta.url), "utf8"),
  readFile(new URL("../app/dashboard/admin/providers/actions.ts", import.meta.url), "utf8"),
  readFile(new URL("../app/account/profile/edit/page.tsx", import.meta.url), "utf8"),
  readFile(new URL("../app/account/profile/edit/actions.ts", import.meta.url), "utf8"),
  readFile(new URL("../app/lib/clerkIdentityPolicy.ts", import.meta.url), "utf8"),
  readFile(new URL("../app/lib/adminActivity.ts", import.meta.url), "utf8"),
  readFile(new URL("../app/dashboard/admin/activity/[activityId]/page.tsx", import.meta.url), "utf8"),
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

test("administrator provider editing reads and writes the complete public profile", () => {
  for (const field of [
    "headline_en",
    "intro_en",
    "about_en",
    "servicesTitle_en",
    "services",
    "mainPhoto",
    "phone",
    "website",
    "preferredContact",
  ]) {
    assert.match(adminPageSource, new RegExp(field));
  }
  assert.match(adminFormSource, /role="tablist"/);
  assert.match(adminFormSource, /name="mainPhotoFile"/);
  assert.match(adminFormSource, /name="servicesJson"/);
  assert.match(adminFormSource, /Public service cards/);
  assert.match(adminActionSource, /uploadSanityImage/);
  assert.match(adminActionSource, /localizedCopy: localizedProviderCopy/);
  assert.match(adminActionSource, /services: providerServices/);
  assert.match(adminActionSource, /"contactOptions\.phone"/);
  assert.match(adminActionSource, /"contactOptions\.website"/);
});

test("provider activity links to the current administrator provider editor", () => {
  assert.match(activitySource, /"providerId": provider\._ref/);
  assert.match(activitySource, /providerSlug/);
  assert.match(activityDetailSource, /Edit provider/);
  assert.match(activityDetailSource, /dashboard\/admin\/providers/);
  assert.match(adminPageSource, /Recent provider activity/);
});

test("provider self-edit permissions and direct publishing remain unchanged", () => {
  assert.doesNotMatch(adminFormSource, /services[^\n]*selfEditableFields/);
  assert.match(providerActionSource, /changeType: "providerSelfPublished"/);
  assert.doesNotMatch(providerActionSource, /providerSubmission/);
});
