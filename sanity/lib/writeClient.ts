import { createClient } from "next-sanity";

import { apiVersion, dataset, projectId } from "../env";

export const writeClient = createClient({
  projectId,
  dataset,
  apiVersion,
  token: process.env.SANITY_API_WRITE_TOKEN,
  useCdn: false,
});

export function assertSanityWriteToken() {
  if (!process.env.SANITY_API_WRITE_TOKEN) {
    throw new Error("Missing environment variable: SANITY_API_WRITE_TOKEN");
  }
}
