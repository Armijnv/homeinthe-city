import assert from "node:assert/strict";
import { access, readFile } from "node:fs/promises";
import test from "node:test";

const [cityPage, cityMap, experienceLayout, editor, actions, schema, guides, sitemap, mapDashboard, activeCities, mapActions, realEstatePages, header, mapPlaceForm, coordinatePicker, sanityImageUpload] =
  await Promise.all([
    readFile(new URL("../app/components/CityPage.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/components/CityMap.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/components/CityExperienceLayout.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/dashboard/cities/[citySlug]/CityDashboardEditors.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/dashboard/cities/[citySlug]/actions.ts", import.meta.url), "utf8"),
    readFile(new URL("../sanity/schemaTypes/city.ts", import.meta.url), "utf8"),
    readFile(new URL("../app/lib/cityGuides.ts", import.meta.url), "utf8"),
    readFile(new URL("../app/sitemap.ts", import.meta.url), "utf8"),
    readFile(new URL("../app/dashboard/cities/[citySlug]/map/page.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/components/ActiveCities.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/dashboard/map-place-actions.ts", import.meta.url), "utf8"),
    readFile(new URL("../app/components/RealEstatePages.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/components/Header.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/dashboard/MapPlaceForm.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/dashboard/MapPlaceCoordinatePicker.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/lib/sanityImageUpload.ts", import.meta.url), "utf8"),
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

test("supporting information cards preserve editor-entered line breaks", () => {
  assert.match(
    cityPage,
    /<p className=\{`\$\{title \? "mt-3" : ""\} whitespace-pre-line text-sm leading-6 text-stone-700`\}>/,
  );
});

test("city map places use stable URL state and supporting cards can select them", () => {
  assert.match(guides, /export function cityMapPlacePath/);
  assert.match(guides, /new URLSearchParams\(\{ tab: "explore", place: placeKey \}\)/);
  assert.match(cityPage, /placeKey: place\._key/);
  assert.match(cityPage, /query\.get\("tab"\) === "explore" \|\| placeKey/);
  assert.match(cityPage, /selectedPlaceKey=\{experienceUrlState\.placeKey\}/);
  assert.match(cityMap, /candidate\.placeKey === selectedPlaceKey/);
  assert.match(cityPage, /window\.history\.pushState/);
  assert.match(cityPage, /window\.addEventListener\("popstate", syncUrlState\)/);
  assert.match(editor, /Destination type/);
  assert.match(editor, /City map place/);
  assert.match(editor, /cityMapPlacePath\(activeLanguage, citySlug/);
});

test("supporting information card links remain button-only and manual URLs remain supported", () => {
  assert.match(cityPage, /\{href && button \? \(/);
  assert.match(cityPage, /<article[\s\S]*?<a\n              href=\{href\}/);
  assert.match(editor, /<option value="url">Link \/ URL<\/option>/);
});

test("supporting-card JPEG uploads accept browser JPEG MIME aliases", () => {
  assert.match(actions, /uploadedInformationCardImage/);
  assert.match(actions, /uploadSanityImage\(/);
  assert.match(sanityImageUpload, /"image\/jpg"/);
  assert.match(sanityImageUpload, /"image\/pjpeg"/);
  assert.match(sanityImageUpload, /"image\/jfif"/);
  assert.match(sanityImageUpload, /return "image\/jpeg"/);
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

test("active city cards are derived from published city data and optional interpreter coverage", () => {
  assert.match(activeCities, /publishedCityGuides\(cityGuides\)/);
  assert.match(activeCities, /city\.hasInterpreterCoverage/);
  assert.doesNotMatch(activeCities, /const activeCities/);
  assert.doesNotMatch(activeCities, /porto-alegre|florianopolis|sao-paulo/);
});

test("new and edited map places use localized names and category presets without writing legacy fields", () => {
  assert.match(mapActions, /name_en: nameEn/);
  assert.match(mapActions, /categoryPreset: isCustom \? "custom"/);
  assert.doesNotMatch(mapActions, /\$\{selector\}\.(?:name|category)`/);
  assert.doesNotMatch(schema, /Legacy place name|Legacy category key/);
});

test("map-place editing keeps the draggable marker and coordinate fields synchronized", () => {
  assert.match(mapPlaceForm, /String\(place\.latitude\)/);
  assert.match(mapPlaceForm, /<MapPlaceCoordinatePicker/);
  assert.match(mapPlaceForm, /latitude=\{latitude\}/);
  assert.match(mapPlaceForm, /longitude=\{longitude\}/);
  assert.match(mapPlaceForm, /setLatitude\(String\(nextLatitude\)\)/);
  assert.match(mapPlaceForm, /setLongitude\(String\(nextLongitude\)\)/);
  assert.doesNotMatch(mapPlaceForm, /coords\.latitude\.toFixed|coords\.longitude\.toFixed/);

  assert.match(coordinatePicker, /draggable/);
  assert.match(coordinatePicker, /dragend\(\)/);
  assert.match(coordinatePicker, /markerRef\.current\?\.getLatLng\(\)/);
  assert.match(coordinatePicker, /latitude: position\.lat/);
  assert.match(coordinatePicker, /longitude: position\.lng/);
  assert.match(coordinatePicker, /markerRef\.current\?\.setLatLng/);
  assert.match(coordinatePicker, /touch-pan-y/);
  assert.match(mapActions, /\[`\$\{selector\}\.latitude`\]: latitude/);
  assert.match(mapActions, /\[`\$\{selector\}\.longitude`\]: longitude/);
});

test("real-estate city pages and navigation derive only from eligible listing coverage", async () => {
  assert.match(realEstatePages, /No public property listings for/);
  assert.doesNotMatch(realEstatePages, /export function realEstateCityConfig\(/);
  assert.doesNotMatch(realEstatePages, /return "porto-alegre"/);
  assert.match(header, /propertyCityLinks\(propertyListings, lang, realEstatePath\)/);
  assert.doesNotMatch(header, /portoAlegreRealEstatePath|florianopolisRealEstatePath/);

  for (const path of [
    "../app/real-estate/porto-alegre/page.tsx",
    "../app/real-estate/florianopolis/page.tsx",
    "../app/pt/imoveis/porto-alegre/page.tsx",
    "../app/pt/imoveis/florianopolis/page.tsx",
    "../app/nl/vastgoed/porto-alegre/page.tsx",
    "../app/nl/vastgoed/florianopolis/page.tsx",
  ]) {
    await assert.rejects(access(new URL(path, import.meta.url)));
  }
});
