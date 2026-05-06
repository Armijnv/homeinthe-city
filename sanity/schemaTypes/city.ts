import { defineType, defineField } from "sanity";

export const city = defineType({
  name: "city",
  title: "City",
  type: "document",

  fields: [
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

    defineField({
      name: "restaurants",
      title: "Restaurants",
      type: "array",
      of: [
        {
          type: "object",
          fields: [
            {
              name: "name",
              title: "Name",
              type: "string",
            },

            {
              name: "note_en",
              title: "Note (English)",
              type: "string",
            },

            {
              name: "note_pt",
              title: "Note (Portuguese)",
              type: "string",
            },

            {
              name: "note_nl",
              title: "Note (Dutch)",
              type: "string",
            },

            {
              name: "favorite",
              title: "My pick",
              type: "boolean",
            },

            {
              name: "link",
              title: "Website / Google Maps",
              type: "url",
            },
          ],
        },
      ],
    }),

    defineField({
      name: "venues",
      title: "Live Music Venues",
      type: "array",
      of: [
        {
          type: "object",
          fields: [
            {
              name: "name",
              title: "Name",
              type: "string",
            },

            {
              name: "text_en",
              title: "Text (English)",
              type: "string",
            },

            {
              name: "text_pt",
              title: "Text (Portuguese)",
              type: "string",
            },

            {
              name: "text_nl",
              title: "Text (Dutch)",
              type: "string",
            },

            {
              name: "link",
              title: "Website",
              type: "url",
            },

            {
              name: "image",
              title: "Image",
              type: "image",
            },
          ],
        },
      ],
    }),

    defineField({
      name: "museums",
      title: "Museums / Exhibitions",
      type: "array",
      of: [
        {
          type: "object",
          fields: [
            {
              name: "title",
              title: "Title",
              type: "string",
            },

            {
              name: "dates_en",
              title: "Dates (English)",
              type: "string",
            },

            {
              name: "dates_pt",
              title: "Dates (Portuguese)",
              type: "string",
            },

            {
              name: "dates_nl",
              title: "Dates (Dutch)",
              type: "string",
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
              name: "link",
              title: "Exhibition link",
              type: "url",
            },

            {
              name: "image",
              title: "Image",
              type: "image",
            },
          ],
        },
      ],
    }),
  ],
});