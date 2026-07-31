import assert from "node:assert/strict";
import test from "node:test";
import { parse } from "groq-js";
import { loadTypeScriptModule } from "./load-typescript-module.mjs";

const queries = await loadTypeScriptModule("sanity/lib/queries.ts");

test("every exported GROQ query parses successfully", () => {
  const exportedQueries = Object.entries(queries).filter(
    ([, value]) => typeof value === "string",
  );

  assert.ok(exportedQueries.length > 0);

  for (const [name, query] of exportedQueries) {
    assert.doesNotThrow(() => parse(query), `${name} should contain valid GROQ`);
  }
});
