import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const [cityPageSource, headerSource, footerSource] = await Promise.all([
  readFile(new URL("../app/components/CityPage.tsx", import.meta.url), "utf8"),
  readFile(new URL("../app/components/Header.tsx", import.meta.url), "utf8"),
  readFile(new URL("../app/components/Footer.tsx", import.meta.url), "utf8"),
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
  assert.match(cityPageSource, /const hasExploreContent = Boolean\(/);
  assert.match(cityPageSource, /mapEntries\.length,/);
  assert.match(cityPageSource, /content: hasExploreContent \? \(/);
  assert.match(cityPageSource, /\{mapEntries\.length \? \(/);
  assert.match(cityPageSource, /serviceCards\.length \|\| sidebarCards\.length \?/);
  assert.match(cityPageSource, /return cardTitle \? \(/);
  assert.match(cityPageSource, /\{cardText \? \(/);
  assert.match(cityPageSource, /\{cardHref && cardButton \? \(/);
});

test("Provider Login is available only in the separated menu section and footer", () => {
  assert.match(headerSource, /label: t\.providerLogin,\s*href: "\/dashboard"/);
  assert.match(headerSource, /className="mt-auto border-t border-white\/10 pt-4"/);
  assert.match(headerSource, /href=\{providerLogin\.href\}\s*className="inline-flex min-h-11/);
  assert.equal((headerSource.match(/href=\{providerLogin\.href\}/g) || []).length, 1);
  assert.match(footerSource, /href="\/dashboard"/);
  assert.match(footerSource, /\{t\.forProviders\}/);
});
