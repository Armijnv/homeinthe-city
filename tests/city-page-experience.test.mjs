import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const [cityPageSource, layoutSource] = await Promise.all([
  readFile(new URL("../app/components/CityPage.tsx", import.meta.url), "utf8"),
  readFile(
    new URL("../app/components/CityExperienceLayout.tsx", import.meta.url),
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

test("Porto Alegre has the four semantic discovery anchors in section order", () => {
  const ids = ["about-city", "living-working", "explore-city", "host-favorites"];

  for (const id of ids) {
    assert.match(cityPageSource, new RegExp(`id: "${id}"`));
  }

  assert.match(layoutSource, /href=\{`#\$\{item\.id\}`\}/);
  assert.match(layoutSource, /section\.scrollIntoView\(\{ behavior: "smooth"/);
  assert.match(layoutSource, /className="scroll-mt-28/);
});

test("the prototype keeps the requested positioning and section content sources", () => {
  assert.match(
    cityPageSource,
    /Local guidance, business interpretation and practical support from someone who knows Porto Alegre\./,
  );
  assert.match(cityPageSource, /id: "explore-city",[\s\S]*?<CityMap/);
  assert.match(cityPageSource, /id: "meet-host"/);
  assert.match(cityPageSource, /recommendations=\{recommendationGuides\}/);
  assert.match(cityPageSource, /groups=\{recommendationGroups\}/);
});
