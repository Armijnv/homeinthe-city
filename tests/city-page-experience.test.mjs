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
  cityServicesSource,
  cityDashboardPageSource,
  informationCardsSource,
  ...portoAlegrePageSources
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
  readFile(
    new URL("../app/lib/cityServiceCards.ts", import.meta.url),
    "utf8",
  ),
  readFile(
    new URL("../app/dashboard/cities/[citySlug]/page.tsx", import.meta.url),
    "utf8",
  ),
  readFile(new URL("../app/lib/cityInformationCards.ts", import.meta.url), "utf8"),
  ...[
    "../app/brazil/porto-alegre/page.tsx",
    "../app/pt/brasil/porto-alegre/page.tsx",
    "../app/nl/brazilie/porto-alegre/page.tsx",
  ].map((path) => readFile(new URL(path, import.meta.url), "utf8")),
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
  assert.match(cityPageSource, /cityPageBackgroundMode === "none"/);
  assert.match(cityPageSource, /"\/porto-alegre-desktop-background\.jpg"/);
  assert.match(cityPageSource, /<CityLiveInfoWidget info=\{initialLiveInfo\}/);
  assert.match(cityPageSource, /lg:grid-cols-\[minmax\(0,1\.15fr\)_minmax\(28rem,0\.95fr\)\]/);
  assert.match(cityPageSource, /<CityLiveInfoWidget info=\{initialLiveInfo\} lang=\{lang\} compact \/>/);
  assert.match(cityPageSource, /src=\{host\.photoUrl\}/);
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

test("Porto Alegre publishes recommendation guides as compact From Your Host stories", () => {
  const exploreStart = cityPageSource.indexOf('id: "explore-city"');
  const fromHostStart = cityPageSource.indexOf('id: "from-host"', exploreStart);
  const sectionEnd = cityPageSource.indexOf("const cityPageBackground", fromHostStart);
  const exploreSource = cityPageSource.slice(exploreStart, fromHostStart);
  const fromHostSource = cityPageSource.slice(fromHostStart, sectionEnd);

  assert.doesNotMatch(exploreSource, /recommendations=\{recommendationGuides\}/);
  assert.match(fromHostSource, /recommendations=\{recommendationGuides\}/);
  assert.match(fromHostSource, /intro: experienceCopy\.fromHostIntroduction/);
  assert.match(fromHostSource, /presentation="host-story"/);
  assert.match(cityPageSource, /hostStoriesTitle: "Host stories"/);
  assert.match(cityPageSource, /readStory: "Read story"/);
  assert.match(cityPageSource, /<details className="group/);
  assert.match(cityPageSource, /featuredImage\?\.asset\?\.url/);
});

test("Porto Alegre public routes periodically refresh externally updated Sanity content", () => {
  for (const pageSource of portoAlegrePageSources) {
    assert.match(pageSource, /export const revalidate = 60;/);
  }
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
  assert.match(editorSource, /City page background/);
  assert.match(editorSource, /name="heroImage"/);
  assert.match(editorSource, /name="cityPageBackgroundMode"/);
  assert.match(editorSource, /Default Porto Alegre image/);
  assert.match(editorSource, /Custom image/);
  assert.match(editorSource, /No background image/);
  assert.doesNotMatch(editorSource, /name="removeHeroImage"/);
  assert.doesNotMatch(editorSource, /name="heroImageAlt"/);
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

test("Porto Alegre manages host stories in From Your Host with one selected language", () => {
  assert.match(editorSource, /activePortoSection !== "from-host"/);
  assert.match(editorSource, /title=\{isPortoAlegre \? "Host stories"/);
  assert.match(editorSource, /hostStories=\{isPortoAlegre\}/);
  assert.match(editorSource, /Short introduction shown above your personal stories and recommendations\./);
  assert.match(editorSource, /activeLanguage=\{isPortoAlegre \? activeLanguage : undefined\}/);
  assert.match(editorSource, /languages\.filter\(\(language\) => language\.id === activeLanguage\)/);
  assert.match(editorSource, /\{isEditing \? "Close" : "Edit"\}/);
  assert.match(editorSource, /"Add host story"/);
  assert.match(editorSource, /window\.confirm/);
  assert.match(editorSource, /"Save host stories"/);
});

test("Porto Alegre saves through the existing audited city action only", () => {
  assert.match(actionSource, /if \(citySlug === "porto-alegre"\)/);
  assert.match(actionSource, /setValues\[`cta_\$\{lang\}`\]/);
  assert.match(actionSource, /setValues\.cityPageExperience = await cityPageExperienceFromForm/);
  assert.match(actionSource, /existing\.cityPageExperience/);
  assert.match(actionSource, /if \(!formData\.has\(inputName\)\) continue/);
  assert.match(actionSource, /setValues\.heroImage = uploadedHeroImage/);
  assert.match(actionSource, /setValues\.cityPageBackgroundMode = "custom"/);
  assert.match(actionSource, /setValues\.cityPageBackgroundMode = backgroundMode/);
  assert.match(actionSource, /cityChangeLogDocument\(\{/);
  assert.match(actionSource, /activityFieldChanges\(comparableBefore, comparableAfter\)/);
  assert.match(actionSource, /if \(!changes\.length\)/);
  assert.match(actionSource, /recommendation\.featuredImage\?\.alt \|\| fallbackAlt/);
  assert.match(actionSource, /citySlug === "porto-alegre"[\s\S]*?"Host stories saved\."/);
});

test("the optional prototype schema is limited to Porto Alegre", () => {
  assert.match(schemaSource, /name: "cityPageExperience"/);
  assert.match(schemaSource, /slug\?\.current !==[\s\S]*?"porto-alegre"/);
  assert.match(schemaSource, /cityExperienceLanguageField\("en", "English"\)/);
  assert.match(schemaSource, /cityExperienceLanguageField\("pt", "Portuguese"\)/);
  assert.match(schemaSource, /cityExperienceLanguageField\("nl", "Dutch"\)/);
  assert.match(schemaSource, /name: "informationCards"/);
  assert.match(schemaSource, /name: "cityPageBackgroundMode"/);
});

test("Porto Alegre reuses one optional information-card system across three tabs", () => {
  assert.match(informationCardsSource, /cityInformationCardSections = \[/);
  assert.match(informationCardsSource, /"about"/);
  assert.match(informationCardsSource, /"explore"/);
  assert.match(informationCardsSource, /"fromHost"/);
  assert.match(schemaSource, /name: "informationCards"[\s\S]*?name: "image"/);
  assert.match(editorSource, /Supporting information cards/);
  assert.match(editorSource, /No information cards yet\./);
  assert.match(editorSource, /Add information card/);
  assert.match(editorSource, /Move up/);
  assert.match(editorSource, /Move down/);
  assert.match(editorSource, /informationCardImage-/);
  assert.match(actionSource, /informationCardsFromForm/);
  assert.match(actionSource, /setValues\.informationCards/);
  assert.match(cityPageSource, /function SupportingInformationCards/);
  assert.match(cityPageSource, /informationCardsFor\("about"\)/);
  assert.match(cityPageSource, /informationCardsFor\("explore"\)/);
  assert.match(cityPageSource, /informationCardsFor\("fromHost"\)/);
});

test("Porto Alegre content and supporting cards render as separate floating objects", () => {
  assert.match(layoutSource, /<article className="min-w-0 rounded-2xl bg-white\/97/);
  assert.match(layoutSource, /supportingLayout === "below"/);
  assert.match(layoutSource, /sm:grid-cols-2 xl:grid-cols-3/);
  assert.match(cityPageSource, /supportingLayout: "below" as const/);
  assert.match(cityPageSource, /bg-white shadow-xl shadow-black\/10/);
});

test("Porto Alegre stores three reversible background states without deleting the custom image", () => {
  assert.match(schemaSource, /value: "default"/);
  assert.match(schemaSource, /value: "custom"/);
  assert.match(schemaSource, /value: "none"/);
  assert.match(cityDashboardPageSource, /cityPageBackgroundMode/);
  assert.match(actionSource, /existing\.heroImage\?\.asset\?\._ref \? "custom" : "default"/);
  assert.doesNotMatch(actionSource, /setValues\.heroImage = undefined/);
  assert.match(cityPageSource, /cityPageBackgroundMode === "custom"/);
  assert.match(cityPageSource, /cityPageBackground \? \(/);
  assert.match(cityPageSource, /cityPageBackgroundMode === "none" \? "bg-\[#1a1f2e\]" : "bg-stone-100"/);
});

test("Porto Alegre Explore reuses the existing place workflow for host picks", () => {
  assert.match(mapDashboardSource, /showHostRecommendation=\{citySlug === "porto-alegre"\}/);
  assert.match(mapFormSource, /name="favoriteControl" value="1"/);
  assert.match(mapFormSource, /name="favorite"/);
  assert.match(mapActionsSource, /const canUpdateFavorite = stringValue\(formData, "favoriteControl"\) === "1"/);
  assert.match(mapActionsSource, /\.\.\.\(canUpdateFavorite \? \{ \[`\$\{selector\}\.favorite`\]: favorite \} : \{\}\)/);
});

test("Porto Alegre Living separates automatic services from preserved optional cards", () => {
  assert.match(cityServicesSource, /hasInterpreterCoverage/);
  assert.match(cityServicesSource, /cityInterpreterPath/);
  assert.match(cityServicesSource, /kind: "real-estate"/);
  assert.match(cityServicesSource, /sidebarCardAutomaticServiceOverlap/);
  assert.match(cityPageSource, /automaticCityServiceCards/);
  assert.match(cityPageSource, /sidebarCardAutomaticServiceOverlap/);
  assert.match(editorSource, /Automatic city services/);
  assert.match(editorSource, /Additional Living &amp; Working cards/);
  assert.match(editorSource, /isCardHidden=\{isLegacyAutomaticCard\}/);
  assert.match(editorSource, /Administrator: legacy stored cards/);
  assert.match(editorSource, /No additional cards yet\./);
  assert.doesNotMatch(editorSource, /Preserved, but not shown publicly/);
  assert.match(editorSource, /presentation fields and optional image are managed here/);
  assert.match(layoutSource, /supportingContent\?: ReactNode/);
  assert.match(layoutSource, /lg:grid-cols-\[minmax\(0,1\.7fr\)_minmax\(19rem,0\.9fr\)\]/);
  assert.match(cityDashboardPageSource, /"propertyListingStatuses": \*\[/);
  assert.doesNotMatch(cityDashboardPageSource, /status in \["available", "reserved", "sold", "rented"\]/);
  assert.match(cityServicesSource, /automaticRealEstateListingStatuses = \[[\s\S]*?"available",[\s\S]*?"reserved"/);
  assert.match(cityPageSource, /isPortoAlegre[\s\S]*?hasAutomaticRealEstateService\(propertyListings\)[\s\S]*?: propertyListings\.length > 0/);
  assert.match(cityPageSource, /includeRealEstate: includeAutomaticRealEstate/);
  assert.match(editorSource, /qualifyingAutomaticRealEstateListingCount/);
  assert.match(editorSource, /hasAutomaticRealEstateService/);
});

test("automatic Living service presentation is editable without controlling availability or destinations", () => {
  assert.match(experienceSource, /livingServices\?: LivingServicePresentations/);
  assert.match(schemaSource, /name: "livingServices"/);
  assert.match(schemaSource, /livingServicePresentationField/);
  assert.match(cityServicesSource, /custom\?\.title\?\.trim\(\) \|\|/);
  assert.match(cityServicesSource, /hasInterpreterCoverage/);
  assert.match(cityServicesSource, /custom\?\.buttonLabel\?\.trim\(\)/);
  assert.match(editorSource, /livingService_\$\{serviceKey\}_\$\{language\.id\}_title/);
  assert.match(editorSource, /livingServiceImage-\$\{serviceKey\}/);
  assert.match(actionSource, /uploadedLivingServiceImage/);
  assert.match(actionSource, /removeLivingServiceImage-\$\{serviceKey\}/);
  assert.match(cityPageSource, /presentation: city\?\.cityPageExperience\?\.livingServices/);
  assert.match(cityPageSource, /card\.image\?\.asset\?\.url/);
});

test("the stationary Porto host photo exposes Provider-backed quick actions", () => {
  assert.match(cityPageSource, /function HostPhotoActions/);
  assert.match(cityPageSource, /aria-haspopup="menu"/);
  assert.match(cityPageSource, /document\.addEventListener\("pointerdown"/);
  assert.match(cityPageSource, /event\.key === "Escape"/);
  assert.match(cityPageSource, /\["WhatsApp", "Email"\]\.includes/);
  assert.match(cityPageSource, /host\.profileHref/);
  const hostPhotoSource = cityPageSource.slice(
    cityPageSource.indexOf("function HostPhotoActions"),
    cityPageSource.indexOf("const fallbackGuideCopy"),
  );
  assert.doesNotMatch(hostPhotoSource, /className="[^"]*(?:fixed|sticky)/);
});
