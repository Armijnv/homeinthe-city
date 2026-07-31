import assert from "node:assert/strict";
import test from "node:test";
import { loadTypeScriptModule } from "./load-typescript-module.mjs";

const access = await loadTypeScriptModule("app/lib/dashboardAccess.ts");

const provider = {
  _id: "provider-test",
  managedCities: [
    { _id: "city-porto-alegre", slug: { current: "porto-alegre" } },
  ],
};

test("administrator access level takes priority", () => {
  assert.equal(access.accessLevel(provider, true), "Admin");
});

test("a Provider without managed cities has Provider access", () => {
  assert.equal(
    access.accessLevel({ _id: "provider-only", managedCities: [] }, false),
    "Provider",
  );
});

test("a Provider with a managed city has city-host access", () => {
  assert.equal(access.accessLevel(provider, false), "City host");
  assert.equal(access.isManagedCity(provider, "porto-alegre"), true);
});

test("a city host cannot manage an unassigned city", () => {
  assert.equal(access.isManagedCity(provider, "florianopolis"), false);
});
