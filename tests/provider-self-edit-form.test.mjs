import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const pageSource = await readFile(
  new URL("../app/account/profile/edit/page.tsx", import.meta.url),
  "utf8",
);
const actionSource = await readFile(
  new URL("../app/account/profile/edit/actions.ts", import.meta.url),
  "utf8",
);

test("the Provider self-edit form does not submit preferred contact or a hidden revision", () => {
  assert.doesNotMatch(pageSource, /name=["']preferred-contact["']/);
  assert.doesNotMatch(pageSource, /type=["']hidden["']/);
  assert.doesNotMatch(
    actionSource,
    /optionalValue\(formData,\s*["']preferred-contact["']\)/,
  );
  assert.match(
    pageSource,
    /publishProviderProfileChanges\.bind\(null, provider\._rev\)/,
  );
});
