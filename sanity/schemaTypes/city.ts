import { defineType, defineField } from "sanity";

const mapCategoryPresets = [
  { title: "Restaurant / Restaurante / Restaurant", value: "restaurant" },
  { title: "Café / Café / Café", value: "cafe" },
  { title: "Bakery / Padaria / Bakkerij", value: "bakery" },
  { title: "Beach / Praia / Strand", value: "beach" },
  { title: "Surf Shop / Loja de Surf / Surfwinkel", value: "surfShop" },
  {
    title: "Surfboard Repair / Conserto de Pranchas / Surfplank Reparatie",
    value: "surfboardRepair",
  },
  {
    title: "Organic Market / Feira Orgânica / Biologische Markt",
    value: "organicMarket",
  },
  { title: "Coworking / Coworking / Coworking", value: "coworking" },
  { title: "Walk / Caminhada / Wandeling", value: "walk" },
  { title: "Museum / Museu / Museum", value: "museum" },
  { title: "Live Music / Música ao Vivo / Live Muziek", value: "liveMusic" },
  {
    title: "Business Service / Serviço Empresarial / Zakelijke Dienst",
    value: "businessService",
  },
  { title: "Yoga School / Escola de Yoga / Yogaschool", value: "yogaSchool" },
  { title: "Custom category", value: "custom" },
];

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

    defineField({
      name: "guideStatus",
      title: "City Guide Status",
      type: "string",
      description:
        "Controls whether this city appears in public city discovery and on the homepage globe.",
      initialValue: "live",
      options: {
        layout: "radio",
        list: [
          { title: "Live", value: "live" },
          { title: "Coming soon", value: "comingSoon" },
          { title: "Hidden", value: "hidden" },
        ],
      },
    }),

    defineField({
      name: "latitude",
      title: "City Latitude",
      type: "number",
      description: "Used for the homepage globe pin.",
    }),

    defineField({
      name: "longitude",
      title: "City Longitude",
      type: "number",
      description: "Used for the homepage globe pin.",
    }),

    defineField({
      name: "primaryHost",
      title: "Primary Host",
      type: "reference",
      description:
        "The Provider Profile shown as the main local host for this city.",
      to: [{ type: "provider" }],
      options: {
        disableNew: true,
        filter: "status == 'published'",
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
        "Places shown in this city's map section. Categories are flexible and are grouped automatically on the frontend when places exist.",
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
              name: "categoryPreset",
              title: "Category preset",
              type: "string",
              description:
                "Use a preset whenever possible so the public map translates the category automatically. Choose Custom only when this place needs a category that is not in the preset list.",
              options: {
                list: mapCategoryPresets,
              },
            },

            {
              name: "category",
              title: "Legacy / custom category key",
              type: "string",
              description:
                "Only visible for old legacy values or Custom categories. Existing values still work, such as restaurant, coffee, museum, business and organicFair. For a new custom category, use a simple English key like repair shop and fill in the translated labels below.",
              hidden: ({ parent }) =>
                Boolean(parent?.categoryPreset && parent.categoryPreset !== "custom"),
            },

            {
              name: "categoryLabel_en",
              title: "Custom category label (English)",
              type: "string",
              description: "Only needed when Category preset is Custom.",
              hidden: ({ parent }) => parent?.categoryPreset !== "custom",
            },
            {
              name: "categoryLabel_pt",
              title: "Custom category label (Portuguese)",
              type: "string",
              description:
                "Only needed when Category preset is Custom. Falls back to English if empty.",
              hidden: ({ parent }) => parent?.categoryPreset !== "custom",
            },
            {
              name: "categoryLabel_nl",
              title: "Custom category label (Dutch)",
              type: "string",
              description:
                "Only needed when Category preset is Custom. Falls back to English if empty.",
              hidden: ({ parent }) => parent?.categoryPreset !== "custom",
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
            {
              name: "video",
              title: "Video",
              type: "file",
              options: {
                accept: "video/mp4",
              },
            },
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

    defineField({
      name: "sidebarCards",
      title: "Sidebar Cards",
      type: "array",
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
