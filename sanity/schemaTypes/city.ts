import { defineType, defineField } from "sanity";

export const city = defineType({
  name: "city",
  title: "City",
  type: "document",

  fields: [
    /* ======================================================
       BASIC CITY INFO
    ====================================================== */

    defineField({
      name: "name_en",
      title: "Name (English)",
      type: "string",
    }),

    defineField({
      name: "name_pt",
      title: "Name (Portuguese)",
      type: "string",
    }),

    defineField({
      name: "name_nl",
      title: "Name (Dutch)",
      type: "string",
    }),

    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      options: {
        source: "name_en",
        maxLength: 96,
      },
    }),

    /* ======================================================
       HERO / INTRO CONTENT
    ====================================================== */

    defineField({
      name: "headline_en",
      title: "Headline (English)",
      type: "string",
    }),

    defineField({
      name: "headline_pt",
      title: "Headline (Portuguese)",
      type: "string",
    }),

    defineField({
      name: "headline_nl",
      title: "Headline (Dutch)",
      type: "string",
    }),

    defineField({
      name: "intro_en",
      title: "Intro (English)",
      type: "text",
    }),

    defineField({
      name: "intro_pt",
      title: "Intro (Portuguese)",
      type: "text",
    }),

    defineField({
      name: "intro_nl",
      title: "Intro (Dutch)",
      type: "text",
    }),

    defineField({
      name: "introBlocks_en",
      title: "Intro Blocks (English)",
      type: "array",
      of: [{ type: "text" }],
    }),

    defineField({
      name: "introBlocks_pt",
      title: "Intro Blocks (Portuguese)",
      type: "array",
      of: [{ type: "text" }],
    }),

    defineField({
      name: "introBlocks_nl",
      title: "Intro Blocks (Dutch)",
      type: "array",
      of: [{ type: "text" }],
    }),

    /* ======================================================
       MAP PLACES
    ====================================================== */

    defineField({
      name: "mapPlaces",
      title: "Map Places",
      type: "array",
      description:
        "Places shown in the Porto Alegre map section. Use Business for meeting cafés, coworking spaces, business lunch spots, hotel lobbies, Wi-Fi-friendly places and practical business-trip locations.",
      of: [
        {
          type: "object",
          fields: [
            {
              name: "name",
              title: "Place name",
              type: "string",
              description: "Shown on the small card and detail card.",
            },

            {
              name: "category",
              title: "Category",
              type: "string",
              description: "Controls which map filter this place appears under.",
              options: {
                list: [
                  { title: "Restaurant", value: "restaurant" },
                  { title: "Café", value: "coffee" },
                  { title: "Museum", value: "museum" },
                  { title: "Live Music", value: "liveMusic" },
                  { title: "Business Trip Useful Place", value: "business" },
                  { title: "Walk", value: "walk" },
                  { title: "Yoga School", value: "yoga" },
                  { title: "Organic Fair", value: "organicFair" },
                  { title: "Other", value: "other" },
                ],
              },
            },

            {
              name: "neighborhood",
              title: "Neighborhood / area",
              type: "string",
              description: "Example: Moinhos de Vento, Cidade Baixa, Centro Histórico.",
            },

            {
              name: "detail_en",
              title: "Short card detail (English)",
              type: "string",
              description:
                "Small label shown on the compact card. Example: Italian food · Moinhos de Vento, quiet café · good Wi-Fi, coworking.",
            },
            {
              name: "detail_pt",
              title: "Short card detail (Portuguese)",
              type: "string",
            },
            {
              name: "detail_nl",
              title: "Short card detail (Dutch)",
              type: "string",
            },

            {
              name: "description_en",
              title: "Full description shown under map (English)",
              type: "text",
              rows: 4,
              description:
                "Longer explanation shown only after a user clicks the place. Say why it is useful or worth visiting.",
            },
            {
              name: "description_pt",
              title: "Full description shown under map (Portuguese)",
              type: "text",
              rows: 4,
            },
            {
              name: "description_nl",
              title: "Full description shown under map (Dutch)",
              type: "text",
              rows: 4,
            },

            { name: "latitude", title: "Latitude", type: "number" },
            { name: "longitude", title: "Longitude", type: "number" },

            { name: "googleMaps", title: "Google Maps Link", type: "url" },
            { name: "website", title: "Website", type: "url" },
            { name: "image", title: "Image", type: "image" },
            { name: "favorite", title: "My pick", type: "boolean" },
          ],
          preview: {
            select: {
              title: "name",
              subtitle: "detail_en",
              media: "image",
            },
          },
        },
      ],
    }),

    /* ======================================================
       SIDEBAR CARDS
    ====================================================== */

    defineField({
      name: "sidebarCards",
      title: "Sidebar Cards",
      type: "array",
      description: "Small cards shown in the right column of the city page.",
      of: [
        {
          type: "object",
          fields: [
            { name: "title_en", title: "Title (English)", type: "string" },
            { name: "title_pt", title: "Title (Portuguese)", type: "string" },
            { name: "title_nl", title: "Title (Dutch)", type: "string" },

            { name: "text_en", title: "Text (English)", type: "text" },
            { name: "text_pt", title: "Text (Portuguese)", type: "text" },
            { name: "text_nl", title: "Text (Dutch)", type: "text" },

            { name: "button_en", title: "Button (English)", type: "string" },
            { name: "button_pt", title: "Button (Portuguese)", type: "string" },
            { name: "button_nl", title: "Button (Dutch)", type: "string" },

            { name: "href_en", title: "Link (English)", type: "string" },
            { name: "href_pt", title: "Link (Portuguese)", type: "string" },
            { name: "href_nl", title: "Link (Dutch)", type: "string" },
          ],
        },
      ],
    }),

    /* ======================================================
       CTA TEXT
    ====================================================== */

    defineField({
      name: "cta_en",
      title: "CTA Text (English)",
      type: "string",
    }),

    defineField({
      name: "cta_pt",
      title: "CTA Text (Portuguese)",
      type: "string",
    }),

    defineField({
      name: "cta_nl",
      title: "CTA Text (Dutch)",
      type: "string",
    }),
  ],
});
