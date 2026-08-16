import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const [cityPage, experienceLayout, editor, actions, schema, guides, sitemap, mapDashboard] =
  await Promise.all([
    readFile(new URL("../app/components/CityPage.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/components/CityExperienceLayout.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/dashboard/cities/[citySlug]/CityDashboardEditors.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/dashboard/cities/[citySlug]/actions.ts", import.meta.url), "utf8"),
    readFile(new URL("../sanity/schemaTypes/city.ts", import.meta.url), "utf8"),
    readFile(new URL("../app/lib/cityGuides.ts", import.meta.url), "utf8"),
    readFile(new URL("../app/sitemap.ts", import.meta.url), "utf8"),
    readFile(new URL("../app/dashboard/cities/[citySlug]/map/page.tsx", import.meta.url), "utf8"),
  ]);

test("every city uses the same shared city-page template", () => {
  assert.match(cityPage, /<CityExperienceLayout/);
  assert.doesNotMatch(cityPage, /isPortoAlegre/);
  assert.doesNotMatch(cityPage, /portoAlegreExperienceLocale/);
  assert.match(experienceLayout, /role="tablist"/);
  assert.match(experienceLayout, /role="tabpanel"/);
  assert.doesNotMatch(experienceLayout, /scrollIntoView/);
});

test("sparse city content remains optional rather than rendered as filler", () => {
  assert.match(cityPage, /mapEntries\.length \? \(/);
  assert.match(cityPage, /content: hasExploreContent \?/);
  assert.match(cityPage, /serviceCards\.length \|\| sidebarCards\.length \?/);
  assert.doesNotMatch(cityPage, /porto-alegre-desktop-background/);
  assert.doesNotMatch(guides, /fallbackDescriptions/);
  assert.doesNotMatch(guides, /isPortoAlegreGuide/);
});

test("the city dashboard and schema expose the same editor for every city", () => {
  assert.match(editor, /function CityExperienceFields/);
  assert.match(editor, /cityEditorSections/);
  assert.doesNotMatch(editor, /PortoAlegreExperienceFields/);
  assert.doesNotMatch(editor, /citySlug === "porto-alegre"/);
  assert.match(actions, /setValues\.cityPageExperience/);
  assert.doesNotMatch(actions, /Porto Alegre/);
  assert.doesNotMatch(schema, /slug\?\.current !==/);
  assert.match(schema, /name: "cityPageExperience"/);
  assert.match(schema, /name: "informationCards"/);
  assert.match(mapDashboard, /showHostRecommendation/);
});

test("public discovery stays data-driven and excludes hidden cities", () => {
  assert.match(sitemap, /cityGuideIsPublic\(city\)/);
  assert.match(sitemap, /cityGuideEnabledLanguages\(city\)/);
  assert.match(guides, /cityGuideStatus\(city\) !== "hidden"/);
});

test("future cities select data by slug rather than requiring a static page", async () => {
  for (const path of [
    "../app/brazil/[citySlug]/page.tsx",
    "../app/pt/brasil/[citySlug]/page.tsx",
    "../app/nl/brazilie/[citySlug]/page.tsx",
  ]) {
    const source = await readFile(new URL(path, import.meta.url), "utf8");
    assert.match(source, /getCityPageData\(citySlug\)/);
    assert.match(source, /cityGuideIsPublic\(city\)/);
  }
});
