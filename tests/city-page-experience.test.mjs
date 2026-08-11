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
  mapFormSource,
  mapActionsSource,
  mapDashboardSource,
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
  readFile(new URL("../app/dashboard/MapPlaceForm.tsx", import.meta.url), "utf8"),
  readFile(new URL("../app/dashboard/map-place-actions.ts", import.meta.url), "utf8"),
  readFile(
    new URL("../app/dashboard/cities/[citySlug]/map/page.tsx", import.meta.url),
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
  assert.match(cityPageSource, /intro: experienceCopy\.fromHostIntroduction/);
  assert.doesNotMatch(cityPageSource, /intro: experienceCopy\.meetHostIntroduction/);
  assert.match(cityPageSource, /recommendations=\{recommendationGuides\}/);
  assert.match(cityPageSource, /groups=\{recommendationGroups\}/);
  assert.doesNotMatch(cityPageSource, /id: "host-favorites"/);
});

test("the Porto Alegre dashboard mirrors the public tabs and hides legacy controls", () => {
  assert.match(editorSource, /citySlug === "porto-alegre"/);
  assert.match(editorSource, /<PortoAlegreExperienceFields/);
  assert.match(editorSource, /aria-label="Editing language"/);
  assert.match(editorSource, /aria-label="Public page editing areas"/);
  assert.match(editorSource, /type PortoEditorSection = "about" \| "living" \| "explore" \| "from-host"/);
  assert.match(editorSource, /name=\{`name_\$\{language\.id\}`\}/);
  assert.match(editorSource, /name=\{`headline_\$\{language\.id\}`\}/);
  assert.match(editorSource, /name=\{`cta_\$\{language\.id\}`\}/);
  assert.doesNotMatch(editorSource, /name="heroImage"/);
  assert.doesNotMatch(editorSource, /field="aboutCardTitle"/);
  assert.doesNotMatch(editorSource, /field="favoritesCardTitle"/);
  assert.doesNotMatch(editorSource, /field="meetHostIntroduction"/);

  for (const field of [
    "aboutTitle",
    "livingBody",
    "exploreIntroduction",
    "favoritesIntroduction",
    "fromHostIntroduction",
  ]) {
    assert.match(editorSource, new RegExp(`"${field}"`));
    assert.match(experienceSource, new RegExp(`"${field}"`));
  }

  for (const preservedLegacyField of [
    "aboutCardTitle",
    "favoritesCardTitle",
    "meetHostIntroduction",
  ]) {
    assert.match(experienceSource, new RegExp(`"${preservedLegacyField}"`));
  }
});

test("Porto Alegre saves through the existing audited city action only", () => {
  assert.match(actionSource, /if \(citySlug === "porto-alegre"\)/);
  assert.match(actionSource, /setValues\[`cta_\$\{lang\}`\]/);
  assert.match(actionSource, /setValues\.cityPageExperience = cityPageExperienceFromForm/);
  assert.match(actionSource, /existing\.cityPageExperience/);
  assert.match(actionSource, /if \(!formData\.has\(inputName\)\) continue/);
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

test("Porto Alegre Explore reuses the existing place workflow for host picks", () => {
  assert.match(mapDashboardSource, /showHostRecommendation=\{citySlug === "porto-alegre"\}/);
  assert.match(mapFormSource, /name="favoriteControl" value="1"/);
  assert.match(mapFormSource, /name="favorite"/);
  assert.match(mapActionsSource, /const canUpdateFavorite = stringValue\(formData, "favoriteControl"\) === "1"/);
  assert.match(mapActionsSource, /\.\.\.\(canUpdateFavorite \? \{ \[`\$\{selector\}\.favorite`\]: favorite \} : \{\}\)/);
});
