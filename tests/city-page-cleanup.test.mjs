import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const [cityPageSource, headerSource] = await Promise.all([
  readFile(new URL("../app/components/CityPage.tsx", import.meta.url), "utf8"),
  readFile(new URL("../app/components/Header.tsx", import.meta.url), "utf8"),
]);

test("city pages do not render automatic incomplete-guide copy", () => {
  for (const unwanted of [
    "Local recommendations and support options will appear here as the guide grows.",
    "Local picks coming soon",
    "Restaurants, cafés, cultural places and practical city tips will be added from the Sanity City document.",
    "Contact Home in the City for practical questions while this guide is being completed.",
  ]) {
    assert.equal(cityPageSource.includes(unwanted), false, unwanted);
  }
  assert.doesNotMatch(cityPageSource, /href=\{primaryHostAction\?\.href \|\|/);
});

test("empty city sections are conditional and configured sidebar values are optional", () => {
  assert.match(cityPageSource, /mapEntries\.length \? <CityMap/);
  assert.match(cityPageSource, /title \|\| introText \|\| hostLine \|\| introBlocks\.length \?/);
  assert.match(cityPageSource, /primaryHostAction \? <div/);
  assert.match(cityPageSource, /cardText \? <p/);
  assert.match(cityPageSource, /cardHref && cardButton \? <a/);
});

test("Provider Login keeps its route and a 44px minimum target with secondary styling", () => {
  assert.match(headerSource, /label: t\.providerLogin,\s*href: "\/dashboard"/);
  const loginLinks = headerSource.match(/className="[^"]*min-h-11[^"]*border border-\[#d7b46a\][^"]*"/g) || [];
  assert.equal(loginLinks.length, 2);
});
