import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const [
  cityPageSource,
  layoutSource,
  editorSource,
  actionSource,
  schemaSource,
  experienceSource,
] = await Promise.all([
  readFile(new URL("../app/components/CityPage.tsx", import.meta.url), "utf8"),
  readFile(
    new URL("../app/components/CityExperienceLayout.tsx", import.meta.url),
    "utf8",
  ),
  readFile(
    new URL(
      "../app/dashboard/cities/[citySlug]/CityDashboardEditors.tsx",
      import.meta.url,
    ),
    "utf8",
  ),
  readFile(
    new URL(
      "../app/dashboard/cities/[citySlug]/actions.ts",
      import.meta.url,
    ),
    "utf8",
  ),
  readFile(new URL("../sanity/schemaTypes/city.ts", import.meta.url), "utf8"),
  readFile(
    new URL("../app/lib/cityPageExperience.ts", import.meta.url),
    "utf8",
  ),
]);

test("the new city experience is gated to Porto Alegre", () => {
  const portoGate = cityPageSource.indexOf("if (isPortoAlegre) {");
  const experienceLayout = cityPageSource.indexOf("<CityExperienceLayout");
  const legacyReturn = cityPageSource.indexOf("\n  return (", experienceLayout);

  assert.ok(portoGate >= 0);
  assert.ok(experienceLayout > portoGate);
  assert.ok(legacyReturn > experienceLayout);
});

test("Porto Alegre uses four in-place tabs without scroll navigation", () => {
  const ids = ["about-city", "living-working", "explore-city", "from-host"];

  for (const id of ids) {
    assert.match(cityPageSource, new RegExp(`id: "${id}"`));
  }

  assert.match(layoutSource, /role="tablist"/);
  assert.match(layoutSource, /role="tab"/);
  assert.match(layoutSource, /role="tabpanel"/);
  assert.match(layoutSource, /useState\(navigationItems\[0\]/);
  assert.match(layoutSource, /sections\.find\(\(section\) => section\.id === activeTab\)/);
  assert.doesNotMatch(layoutSource, /scrollIntoView/);
});

test("the prototype uses a compact editable header and existing section content sources", () => {
  assert.match(cityPageSource, /\{headline \? \(/);
  assert.doesNotMatch(cityPageSource, /city\?\.heroImage\?\.asset\?\.url/);
  assert.match(cityPageSource, /<CityLiveInfoWidget info=\{initialLiveInfo\}/);
  assert.match(cityPageSource, /src=\{displayHost\.photoUrl\}/);
  assert.match(cityPageSource, /portoAlegreExperienceLocale/);
  assert.doesNotMatch(cityPageSource, /experienceCopy\.positioning/);
  assert.match(cityPageSource, /id: "explore-city",[\s\S]*?<CityMap/);
  assert.match(cityPageSource, /id: "from-host"/);
  assert.match(cityPageSource, /recommendations=\{recommendationGuides\}/);
  assert.match(cityPageSource, /groups=\{recommendationGroups\}/);
  assert.doesNotMatch(cityPageSource, /id: "host-favorites"/);
});

test("the Porto Alegre dashboard edits every prototype copy group", () => {
  assert.match(editorSource, /citySlug === "porto-alegre"/);
  assert.match(editorSource, /<PortoAlegreExperienceFields city=\{city\}/);
  assert.match(editorSource, /name=\{`name_\$\{language\.id\}`\}/);
  assert.match(editorSource, /name=\{`headline_\$\{language\.id\}`\}/);
  assert.match(editorSource, /name="heroImage"/);

  for (const field of [
    "aboutCardTitle",
    "livingCardTitle",
    "exploreCardTitle",
    "favoritesCardTitle",
    "aboutTitle",
    "livingBody",
    "exploreIntroduction",
    "favoritesIntroduction",
    "meetHostIntroduction",
  ]) {
    assert.match(editorSource, new RegExp(`"${field}"`));
    assert.match(experienceSource, new RegExp(`"${field}"`));
  }
});

test("Porto Alegre saves through the existing audited city action only", () => {
  assert.match(actionSource, /if \(citySlug === "porto-alegre"\)/);
  assert.match(actionSource, /setValues\.cityPageExperience = cityPageExperienceFromForm/);
  assert.match(actionSource, /setValues\.heroImage = uploadedHeroImage/);
  assert.match(actionSource, /cityChangeLogDocument\(\{/);
  assert.match(actionSource, /activityFieldChanges\(comparableBefore, comparableAfter\)/);
  assert.match(actionSource, /if \(!changes\.length\)/);
});

test("the optional prototype schema is limited to Porto Alegre", () => {
  assert.match(schemaSource, /name: "cityPageExperience"/);
  assert.match(schemaSource, /slug\?\.current !==[\s\S]*?"porto-alegre"/);
  assert.match(schemaSource, /cityExperienceLanguageField\("en", "English"\)/);
  assert.match(schemaSource, /cityExperienceLanguageField\("pt", "Portuguese"\)/);
  assert.match(schemaSource, /cityExperienceLanguageField\("nl", "Dutch"\)/);
});
