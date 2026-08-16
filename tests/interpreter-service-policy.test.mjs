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

function provider(citySlug, roles = ["interpreter"], options = {}) {
  return {
    _id: `provider-${citySlug}`,
    roles,
    primaryRole: roles[0],
    cities: [{ slug: { current: citySlug } }],
    managedCities: options.managed ? [{ slug: { current: citySlug } }] : [],
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

test("a managed-city interpreter can edit only their managed city page", () => {
  const armijn = provider("porto-alegre", ["host", "interpreter"], { managed: true });
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

test("a managed-city interpreter cannot edit another city or the general page", () => {
  const jon = provider("florianopolis", ["host", "interpreter"], { managed: true });
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

test("city management alone is insufficient without an interpreter role", () => {
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

test("primary hosts may edit only when they also have an interpreter role", () => {
  const primaryInterpreter = provider("porto-alegre", ["host", "interpreter"]);
  assert.equal(
    policy.canEditInterpreterServicePage({
      provider: primaryInterpreter,
      isAdmin: false,
      citySlug: "porto-alegre",
      primaryHostId: primaryInterpreter._id,
    }),
    true,
  );
  assert.equal(
    policy.canEditInterpreterServicePage({
      provider: provider("porto-alegre", ["host"]),
      isAdmin: false,
      citySlug: "porto-alegre",
      primaryHostId: "provider-porto-alegre",
    }),
    false,
  );
});

test("coverage derives provider languages and uses a generic route for future cities", async () => {
  const coverageSource = await readFile(
    new URL("../app/lib/cityInterpreterCoverage.ts", import.meta.url),
    "utf8",
  );
  assert.match(coverageSource, /new Set/);
  assert.match(coverageSource, /provider\.languages/);
  assert.match(coverageSource, /\/interpreter\/\$\{citySlug\}/);
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

test("the hub derives city coverage from published provider assignments instead of its static city registry", async () => {
  const hubSource = await readFile(
    new URL("../app/components/InterpreterHubPage.tsx", import.meta.url),
    "utf8",
  );
  const querySource = await readFile(
    new URL("../sanity/lib/queries.ts", import.meta.url),
    "utf8",
  );
  assert.match(hubSource, /cityInterpreterCoverageQuery/);
  assert.doesNotMatch(hubSource, /Object\.values\(interpreterCities\)/);
  assert.match(querySource, /export const cityInterpreterCoverageQuery/);
  assert.match(querySource, /status == "published"/);
  assert.match(querySource, /\^\._id in cities\[\]\._ref/);
});

test("the interpreter dashboard index and sitemap use the shared coverage query", async () => {
  const [indexSource, sitemapSource] = await Promise.all([
    readFile(new URL("../app/dashboard/interpreter-services/page.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/sitemap.ts", import.meta.url), "utf8"),
  ]);
  for (const source of [indexSource, sitemapSource]) {
    assert.match(source, /cityInterpreterCoverageQuery/);
    assert.doesNotMatch(source, /Object\.values\(interpreterCities\)/);
  }
  assert.match(indexSource, /\/dashboard\/cities\/\$\{citySlug\}\/interpreter/);
  assert.match(sitemapSource, /cityInterpreterPath/);
});

test("all city interpreter URLs use the slug-driven shared route and legacy routes redirect", async () => {
  const [coverageSource, dynamicRouteSource, pageSource, sitemapSource, ...legacyRoutes] =
    await Promise.all([
      readFile(new URL("../app/lib/cityInterpreterCoverage.ts", import.meta.url), "utf8"),
      readFile(new URL("../app/components/DynamicCityInterpreterRoute.tsx", import.meta.url), "utf8"),
      readFile(new URL("../app/components/CityInterpreterPage.tsx", import.meta.url), "utf8"),
      readFile(new URL("../app/sitemap.ts", import.meta.url), "utf8"),
      ...[
        "../app/interpreter-porto-alegre/page.tsx",
        "../app/interpreter-florianopolis/page.tsx",
        "../app/interpreter-sao-paulo/page.tsx",
        "../app/pt/interprete-porto-alegre/page.tsx",
        "../app/pt/interprete-florianopolis/page.tsx",
        "../app/pt/interprete-sao-paulo/page.tsx",
        "../app/nl/tolk-porto-alegre/page.tsx",
      ].map((path) => readFile(new URL(path, import.meta.url), "utf8")),
    ]);
  assert.match(coverageSource, /return `\/interpreter\/\$\{citySlug\}`/);
  assert.doesNotMatch(coverageSource, /interpreterCityForSlug/);
  assert.match(dynamicRouteSource, /CityInterpreterPage/);
  assert.match(dynamicRouteSource, /interpreterCityForSlug\(citySlug\)\?\.content/);
  assert.match(pageSource, /lg:grid-cols-\[minmax\(0,1\.7fr\)_minmax\(18rem,0\.8fr\)\]/);
  assert.match(pageSource, /hasCta \|\| hasPricing/);
  assert.match(sitemapSource, /cityInterpreterCoverageQuery/);
  for (const source of legacyRoutes) {
    assert.match(source, /permanentRedirect/);
  }
});

test("city-page interpreter cards require published coverage and use the shared path resolver", async () => {
  const [cityQuerySource, cardsSource] = await Promise.all([
    readFile(new URL("../sanity/lib/queries.ts", import.meta.url), "utf8"),
    readFile(new URL("../app/lib/cityServiceCards.ts", import.meta.url), "utf8"),
  ]);
  assert.match(cityQuerySource, /"hasInterpreterCoverage"/);
  assert.match(cardsSource, /hasInterpreterCoverage/);
  assert.match(cardsSource, /@\/app\/lib\/cityInterpreterCoverage/);
  assert.doesNotMatch(cardsSource, /interpreterCityForSlug/);
});

test("city navigation uses published coverage and the shared path resolver", async () => {
  const [headerSource, activeCitiesSource, cityQuerySource] = await Promise.all([
    readFile(new URL("../app/components/Header.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/components/ActiveCities.tsx", import.meta.url), "utf8"),
    readFile(new URL("../sanity/lib/queries.ts", import.meta.url), "utf8"),
  ]);
  assert.match(headerSource, /currentCityGuide\?\.hasInterpreterCoverage/);
  assert.match(headerSource, /cityInterpreterPath/);
  assert.doesNotMatch(headerSource, /interpreterPathForCity/);
  assert.match(activeCitiesSource, /cityInterpreterPath/);
  assert.doesNotMatch(activeCitiesSource, /interpreterPathForCity/);
  assert.match(cityQuerySource, /export const cityNavigationQuery[\s\S]*hasInterpreterCoverage/);
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
