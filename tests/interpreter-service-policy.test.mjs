import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";
import { loadTypeScriptModule } from "./load-typescript-module.mjs";

const policy = await loadTypeScriptModule(
  "app/lib/interpreterServicePolicy.ts",
);
const presentation = await loadTypeScriptModule(
  "app/lib/servicePagePresentation.ts",
);

function provider(citySlug, roles = ["interpreter"]) {
  return {
    _id: `provider-${citySlug}`,
    roles,
    primaryRole: roles[0],
    cities: [{ slug: { current: citySlug } }],
    managedCities: [],
  };
}

test("an administrator can edit the general and every configured city interpreter page", () => {
  for (const citySlug of [undefined, "porto-alegre", "florianopolis", "sao-paulo"]) {
    assert.equal(
      policy.canEditInterpreterServicePage({
        provider: null,
        isAdmin: true,
        citySlug,
      }),
      true,
    );
  }
});

test("an Armijn-like interpreter can edit only their assigned Porto Alegre page", () => {
  const armijn = provider("porto-alegre", ["host", "interpreter"]);
  assert.equal(
    policy.canEditInterpreterServicePage({
      provider: armijn,
      isAdmin: false,
      citySlug: "porto-alegre",
    }),
    true,
  );
  assert.equal(
    policy.canEditInterpreterServicePage({
      provider: armijn,
      isAdmin: false,
      citySlug: "florianopolis",
    }),
    false,
  );
});

test("a Jon-like interpreter can edit Florianopolis but not Porto Alegre or admin-only pages", () => {
  const jon = provider("florianopolis", ["host", "interpreter"]);
  assert.equal(
    policy.canEditInterpreterServicePage({
      provider: jon,
      isAdmin: false,
      citySlug: "florianopolis",
    }),
    true,
  );
  assert.equal(
    policy.canEditInterpreterServicePage({
      provider: jon,
      isAdmin: false,
      citySlug: "porto-alegre",
    }),
    false,
  );
  assert.equal(
    policy.canEditInterpreterServicePage({
      provider: jon,
      isAdmin: false,
      citySlug: undefined,
    }),
    false,
  );
});

test("a provider without an interpreter assignment cannot edit interpreter pages", () => {
  assert.equal(
    policy.canEditInterpreterServicePage({
      provider: provider("porto-alegre", ["host"]),
      isAdmin: false,
      citySlug: "porto-alegre",
    }),
    false,
  );
  assert.equal(
    policy.canEditInterpreterServicePage({
      provider: provider("florianopolis", ["interpreter"]),
      isAdmin: false,
      citySlug: "porto-alegre",
    }),
    false,
  );
});

test("an unauthenticated account has no interpreter-page access", () => {
  assert.equal(
    policy.canEditInterpreterServicePage({
      provider: null,
      isAdmin: false,
      citySlug: "porto-alegre",
    }),
    false,
  );
});

test("interpreter-page access does not use managed-city permissions", () => {
  const cityHostOnly = {
    roles: ["host"],
    cities: [],
    managedCities: [{ slug: { current: "porto-alegre" } }],
  };
  assert.equal(
    policy.canEditInterpreterServicePage({
      provider: cityHostOnly,
      isAdmin: false,
      citySlug: "porto-alegre",
    }),
    false,
  );
});

const [
  actionSource,
  editorSource,
  adminSource,
  activitySource,
  cityRouteSource,
  hubRouteSource,
  interpreterRegistrySource,
] = await Promise.all([
  readFile(
    new URL("../app/dashboard/interpreter-services/actions.ts", import.meta.url),
    "utf8",
  ),
  readFile(
    new URL(
      "../app/dashboard/interpreter-services/InterpreterServiceForm.tsx",
      import.meta.url,
    ),
    "utf8",
  ),
  readFile(new URL("../app/dashboard/admin/page.tsx", import.meta.url), "utf8"),
  readFile(new URL("../app/lib/adminActivity.ts", import.meta.url), "utf8"),
  readFile(
    new URL("../app/components/InterpreterCityRoute.tsx", import.meta.url),
    "utf8",
  ),
  readFile(
    new URL("../app/components/InterpreterHubRoute.tsx", import.meta.url),
    "utf8",
  ),
  readFile(new URL("../app/lib/interpreterPages.ts", import.meta.url), "utf8"),
]);

test("service-page saves authorize on the server and create administrator activity", () => {
  assert.match(actionSource, /requireInterpreterServiceAccess\(pageKey\)/);
  assert.match(actionSource, /servicePageChangeLogDocument/);
  assert.match(actionSource, /createIfNotExists/);
  assert.match(activitySource, /servicePageChangeLog/);
  assert.match(activitySource, /editorPath/);
});

test("the interpreter editor is discoverable and uses one language at a time", () => {
  assert.match(adminSource, /Interpreter services/);
  assert.match(adminSource, /dashboard\/interpreter-services/);
  assert.match(editorSource, /role="tablist"/);
  assert.match(editorSource, /English/);
  assert.match(editorSource, /Português/);
  assert.match(editorSource, /Nederlands/);
  assert.match(editorSource, /Managed automatically/);
});

test("all public interpreter routes consume their configured Sanity overlay with code fallbacks", () => {
  assert.match(cityRouteSource, /city\.servicePageSlug/);
  assert.match(hubRouteSource, /interpreterHubServicePageSlug/);
  for (const slug of [
    "interpreter-porto-alegre",
    "interpreter-florianopolis",
    "interpreter-sao-paulo",
    "interpreters-brazil",
  ]) {
    assert.match(interpreterRegistrySource, new RegExp(slug));
  }
});

test("interpreter-page activity uses human-readable localized field names", () => {
  assert.equal(
    presentation.servicePageFieldLabel("intro_pt"),
    "Portuguese introduction",
  );
  assert.equal(
    presentation.servicePageFieldLabel("pricingItems"),
    "Pricing rows",
  );
});
