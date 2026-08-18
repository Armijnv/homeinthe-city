import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const root = new URL("../", import.meta.url);
const source = async (path) => readFile(new URL(path, root), "utf8");

test("dashboard images are prepared to a responsive JPEG below the action safety limit", async () => {
  const imageSelection = await source("app/lib/dashboardImageSelection.ts");
  assert.match(imageSelection, /dashboardImageMaximumDimension = 2560/);
  assert.match(imageSelection, /dashboardImageTargetSize = 1_200 \* 1024/);
  assert.match(imageSelection, /maxDashboardImageSize = 1_500 \* 1024/);
  assert.match(imageSelection, /Math\.min\(1, dashboardImageMaximumDimension/);
  assert.match(imageSelection, /canvas\.toBlob\(resolve, "image\/jpeg", quality\)/);
  assert.match(imageSelection, /imageOrientation: "from-image"/);
  assert.match(imageSelection, /blob\.size > maxDashboardImageSize/);
});

test("shared preparation normalizes browser JPEG uploads and blocks oversized form payloads", async () => {
  const imageSelection = await source("app/lib/dashboardImageSelection.ts");
  const uploader = await source("app/lib/sanityImageUpload.ts");
  assert.match(imageSelection, /normalizedImageFilename/);
  assert.match(imageSelection, /type: "image\/jpeg"/);
  assert.match(imageSelection, /maxDashboardImageRequestSize = 3_500 \* 1024/);
  assert.match(imageSelection, /This form has too many images to upload at once/);
  assert.match(uploader, /maxSanityImageSize = maxDashboardImageSize/);
  assert.match(uploader, /"image\/jpg"/);
});

test("ordinary dashboard image forms use the shared browser preparation path", async () => {
  const [city, map, provider, property, profile] = await Promise.all([
    source("app/dashboard/cities/[citySlug]/CityDashboardEditors.tsx"),
    source("app/dashboard/MapPlaceForm.tsx"),
    source("app/dashboard/admin/providers/ProviderAdminForm.tsx"),
    source("app/dashboard/properties/PropertyListingForm.tsx"),
    source("app/account/profile/edit/ProfilePhotoInput.tsx"),
  ]);
  for (const form of [city, map, provider, property, profile]) {
    assert.match(form, /prepareDashboardImageInput/);
    assert.match(form, /data-dashboard-image/);
  }
  assert.match(city, /informationCardImage-/);
  assert.match(city, /informationCardImageAlt-/);
  assert.match(city, /removeInformationCardImage-/);
  assert.match(property, /gallery-images/);
});
