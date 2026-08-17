import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";
import { loadTypeScriptModule } from "./load-typescript-module.mjs";

const routes = await loadTypeScriptModule("app/lib/cityGuides.ts");

test("English Provider profiles use the Provider route family", () => {
  assert.equal(routes.providerProfilePath("en", "armijn"), "/providers/armijn");
});

test("Portuguese Provider profiles use the profissionais route family", () => {
  assert.equal(
    routes.providerProfilePath("pt", "armijn"),
    "/pt/profissionais/armijn",
  );
});

test("Dutch Provider profiles use the professionals route family", () => {
  assert.equal(
    routes.providerProfilePath("nl", "armijn"),
    "/nl/professionals/armijn",
  );
});

test("legacy host profile URLs permanently redirect to the localized provider routes", async () => {
  const [english, portuguese, dutch] = await Promise.all([
    readFile(new URL("../app/hosts/[slug]/page.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/pt/hosts/[slug]/page.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/nl/hosts/[slug]/page.tsx", import.meta.url), "utf8"),
  ]);
  assert.match(english, /permanentRedirect\(`\/providers\//);
  assert.match(portuguese, /permanentRedirect\(`\/pt\/profissionais\//);
  assert.match(dutch, /permanentRedirect\(`\/nl\/professionals\//);
});
