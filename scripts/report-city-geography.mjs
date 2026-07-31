import { config } from "dotenv";
import { createClient } from "next-sanity";

config({ path: ".env.local", quiet: true });
config({ quiet: true });

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET;
const apiVersion =
  process.env.NEXT_PUBLIC_SANITY_API_VERSION || "2026-05-01";

if (!projectId || !dataset) {
  console.error(
    "Missing NEXT_PUBLIC_SANITY_PROJECT_ID or NEXT_PUBLIC_SANITY_DATASET.",
  );
  process.exitCode = 1;
} else {
  const client = createClient({
    projectId,
    dataset,
    apiVersion,
    useCdn: false,
  });

  const cities = await client.fetch(`
    *[_type == "city" && !(_id in path("drafts.**"))] | order(name_en asc){
      _id,
      name_en,
      name_pt,
      name_nl,
      "slug": slug.current,
      country,
      latitude,
      longitude
    }
  `);

  console.log(
    `Published City geography report for ${projectId}/${dataset}: ${cities.length} record(s)`,
  );

  for (const city of cities) {
    const missingGeographicFields = [
      !city.country ? "country" : null,
      typeof city.latitude !== "number" ? "latitude" : null,
      typeof city.longitude !== "number" ? "longitude" : null,
    ].filter(Boolean);
    const name = city.name_en || city.name_pt || city.name_nl || "Unnamed city";

    console.log(
      JSON.stringify({
        id: city._id,
        name,
        slug: city.slug || null,
        country: city.country || null,
        hasCountry: Boolean(city.country),
        latitude: city.latitude ?? null,
        hasLatitude: typeof city.latitude === "number",
        longitude: city.longitude ?? null,
        hasLongitude: typeof city.longitude === "number",
        missingGeographicFields,
      }),
    );
  }

  const requiringReview = cities.filter(
    (city) =>
      !city.country ||
      typeof city.latitude !== "number" ||
      typeof city.longitude !== "number",
  );

  console.log(
    `Manual geography review: ${requiringReview.length} record(s). This report made no changes.`,
  );
}
