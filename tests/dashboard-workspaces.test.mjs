import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";
import { loadTypeScriptModule } from "./load-typescript-module.mjs";

const workspace = await loadTypeScriptModule("app/lib/dashboardWorkspace.ts");
const dashboardSource = await readFile(
  new URL("../app/dashboard/page.tsx", import.meta.url),
  "utf8",
);

test("administrators see admin and Property tools", () => {
  assert.deepEqual(workspace.dashboardWorkspaceVisibility(null, true), {
    admin: true,
    provider: false,
    interpreter: false,
    cityHost: false,
    realEstate: true,
  });
});

test("a normal Provider sees no admin or Property creation tools", () => {
  assert.deepEqual(
    workspace.dashboardWorkspaceVisibility(
      { roles: ["interpreter"], managedCities: [] },
      false,
    ),
    {
      admin: false,
      provider: true,
      interpreter: true,
      cityHost: false,
      realEstate: false,
    },
  );
});

test("a city host gets city tools only when cities are assigned", () => {
  assert.equal(
    workspace.dashboardWorkspaceVisibility(
      { roles: ["host"], managedCities: [{ _id: "city-one" }] },
      false,
    ).cityHost,
    true,
  );
  assert.equal(
    workspace.dashboardWorkspaceVisibility(
      { roles: ["host"], managedCities: [] },
      false,
    ).cityHost,
    false,
  );
});

test("a real-estate agent sees the real-estate workspace", () => {
  assert.equal(
    workspace.dashboardWorkspaceVisibility(
      { roles: ["host", "realtor"], managedCities: [] },
      false,
    ).realEstate,
    true,
  );
});

test("dashboard places account actions after workspace navigation and status", () => {
  const workspaceHeading = dashboardSource.indexOf("Choose your workspace");
  const providerWorkspace = dashboardSource.indexOf('href="/dashboard/provider"');
  const propertyWorkspace = dashboardSource.indexOf('href="/dashboard/properties"');
  const profileStatus = dashboardSource.indexOf('title="Profile and status"');
  const accountActions = dashboardSource.indexOf("data-dashboard-secondary-account-actions");
  assert.ok(workspaceHeading > -1);
  assert.ok(providerWorkspace > workspaceHeading);
  assert.ok(propertyWorkspace > providerWorkspace);
  assert.ok(profileStatus > propertyWorkspace);
  assert.ok(accountActions > profileStatus);
});
