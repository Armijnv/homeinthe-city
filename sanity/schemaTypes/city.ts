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
      of: [
        {
          type: "object",
          fields: [
            { name: "name", title: "Name", type: "string" },

            {
              name: "category",
              title: "Category",
              type: "string",
              options: {
                list: [
                  { title: "Restaurant", value: "restaurant" },
                  { title: "Museum", value: "museum" },
                  { title: "Live Music", value: "liveMusic" },
                  { title: "Coffee", value: "coffee" },
                  { title: "Business", value: "business" },
                  { title: "Walk", value: "walk" },
                  { title: "Other", value: "other" },
                ],
              },
            },

            {
              name: "description_en",
              title: "Description (English)",
              type: "string",
            },

            {
              name: "description_pt",
              title: "Description (Portuguese)",
              type: "string",
            },

            {
              name: "description_nl",
              title: "Description (Dutch)",
              type: "string",
            },

            {
  name: "detail_en",
  title: "Detail (English)",
  type: "string",
},
{
  name: "detail_pt",
  title: "Detail (Portuguese)",
  type: "string",
},
{
  name: "detail_nl",
  title: "Detail (Dutch)",
  type: "string",
},

            { name: "latitude", title: "Latitude", type: "number" },
            { name: "longitude", title: "Longitude", type: "number" },

            {
              name: "googleMaps",
              title: "Google Maps Link",
              type: "url",
            },

            {
              name: "website",
              title: "Website",
              type: "url",
            },

            {
  name: "image",
  title: "Image",
  type: "image",
},

            {
              name: "favorite",
              title: "My pick",
              type: "boolean",
            },
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