import assert from "node:assert/strict";
import test from "node:test";
import { loadTypeScriptModule } from "./load-typescript-module.mjs";

const presentation = await loadTypeScriptModule(
  "app/lib/providerChangePresentation.ts",
);

test("Provider change fields use human-readable labels", () => {
  assert.equal(presentation.providerChangeFieldLabel("intro_en"), "English intro");
  assert.equal(presentation.providerChangeFieldLabel("about_pt"), "Portuguese bio");
  assert.equal(
    presentation.providerChangeFieldLabel("ownership.ownerUserId"),
    "Account connected",
  );
  assert.equal(
    presentation.providerChangeFieldLabel("servicesTitle_nl"),
    "Dutch service-card heading",
  );
  assert.equal(
    presentation.providerChangeFieldLabel("contactOptions.whatsapp"),
    "WhatsApp",
  );
});

test("Provider city and language changes avoid raw references", () => {
  assert.equal(
    presentation.providerChangeValue(
      JSON.stringify([{ _type: "reference", _ref: "city-porto" }]),
      { "city-porto": "Porto Alegre" },
    ),
    "Porto Alegre",
  );
  assert.equal(
    presentation.providerChangeValue(
      JSON.stringify([{ language: "pt", level: "fluent" }]),
    ),
    "Portuguese (fluent)",
  );
});
