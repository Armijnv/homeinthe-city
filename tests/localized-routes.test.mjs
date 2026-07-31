import assert from "node:assert/strict";
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
