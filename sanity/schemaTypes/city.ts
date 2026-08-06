import { defineType, defineField } from "sanity";
import { recommendationGuideCategories } from "../../app/lib/recommendationGuides";

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

const cityExperienceFields = [
  { name: "aboutCardTitle", title: "About card title", type: "string" },
  {
    name: "aboutCardDescription",
    title: "About card description",
    type: "text",
    rows: 3,
  },
  { name: "livingCardTitle", title: "Living & Working card title", type: "string" },
  {
    name: "livingCardDescription",
    title: "Living & Working card description",
    type: "text",
    rows: 3,
  },
  { name: "exploreCardTitle", title: "Explore card title", type: "string" },
  {
    name: "exploreCardDescription",
    title: "Explore card description",
    type: "text",
    rows: 3,
  },
  { name: "favoritesCardTitle", title: "Host favorites card title", type: "string" },
  {
    name: "favoritesCardDescription",
    title: "Host favorites card description",
    type: "text",
    rows: 3,
  },
  { name: "aboutTitle", title: "About section title", type: "string" },
  { name: "livingTitle", title: "Living & Working section title", type: "string" },
  {
    name: "livingIntroduction",
    title: "Living & Working introduction",
    type: "text",
    rows: 4,
  },
  {
    name: "livingBody",
    title: "Living & Working formatted body",
    type: "text",
    rows: 12,
    description:
      "Use blank lines for paragraphs. Start consecutive lines with '- ' for a bullet list.",
  },
  { name: "exploreTitle", title: "Explore section title", type: "string" },
  {
    name: "exploreIntroduction",
    title: "Explore section introduction",
    type: "text",
    rows: 4,
  },
  { name: "favoritesTitle", title: "Host favorites section title", type: "string" },
  {
    name: "favoritesIntroduction",
    title: "Host favorites introduction",
    type: "text",
    rows: 4,
  },
  { name: "meetHostTitle", title: "Meet your host section title", type: "string" },
  {
    name: "meetHostIntroduction",
    title: "Meet your host introduction",
    type: "text",
    rows: 4,
  },
] as const;

function cityExperienceLanguageField(
  name: "en" | "pt" | "nl",
  title: string,
) {
  return defineField({
    name,
    title,
    type: "object",
    fields: cityExperienceFields.map((field) =>
      defineField({
        name: field.name,
        title: field.title,
        type: field.type,
        rows: "rows" in field ? field.rows : undefined,
        description: "description" in field ? field.description : undefined,
      }),
    ),
  });
}

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
      name: "enabledLanguages",
      title: "Enabled City Guide Languages",
      type: "array",
      description:
        "Optional admin override. Leave unset to inherit languages from the assigned Primary Host. When set, only these languages are published.",
      of: [{ type: "string" }],
      options: {
        layout: "grid",
        list: [
          { title: "English", value: "en" },
          { title: "Portuguese", value: "pt" },
          { title: "Dutch", value: "nl" },
        ],
      },
      validation: (Rule) => Rule.unique().min(1),
    }),

    defineField({
      name: "country",
      title: "Country",
      type: "string",
      description:
        "Country name used for public city and property geographic metadata.",
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
      name: "heroImage",
      title: "Porto Alegre Hero Image",
      type: "image",
      description: "The main image in the experimental Porto Alegre page hero.",
      hidden: ({ document }) =>
        (document as { slug?: { current?: string } } | undefined)?.slug?.current !==
        "porto-alegre",
      options: { hotspot: true },
      fields: [
        defineField({
          name: "alt",
          title: "Alternative text",
          type: "string",
          description: "A short description of the image for accessibility.",
        }),
      ],
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
      name: "cityPageExperience",
      title: "Porto Alegre Page Experience",
      type: "object",
      description:
        "Optional section and discovery-card copy for the experimental Porto Alegre page.",
      hidden: ({ document }) =>
        (document as { slug?: { current?: string } } | undefined)?.slug?.current !==
        "porto-alegre",
      fields: [
        cityExperienceLanguageField("en", "English"),
        cityExperienceLanguageField("pt", "Portuguese"),
        cityExperienceLanguageField("nl", "Dutch"),
      ],
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
              title: "Legacy / default place name",
              type: "string",
              description:
                "Existing single-language name. New dashboard entries also fill the English/default name below.",
            },
            {
              name: "name_en",
              title: "Place name (English / default)",
              type: "string",
              description:
                "Used on the English map and as fallback for Portuguese and Dutch when those names are empty.",
            },
            {
              name: "name_pt",
              title: "Place name (Portuguese)",
              type: "string",
              description: "Falls back to English/default if empty.",
            },
            {
              name: "name_nl",
              title: "Place name (Dutch)",
              type: "string",
              description: "Falls back to English/default if empty.",
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
              title: "Long description shown in map preview (English)",
              type: "text",
              rows: 4,
            },
            {
              name: "description_pt",
              title: "Long description shown in map preview (Portuguese)",
              type: "text",
              rows: 4,
            },
            {
              name: "description_nl",
              title: "Long description shown in map preview (Dutch)",
              type: "text",
              rows: 4,
            },

            { name: "latitude", title: "Latitude", type: "number" },
            { name: "longitude", title: "Longitude", type: "number" },

            { name: "googleMaps", title: "Google Maps Link", type: "url" },
            { name: "website", title: "Website", type: "url" },
            {
              name: "image",
              title: "Main image",
              type: "image",
              description: "One photo for the public map preview. No gallery.",
              fields: [
                {
                  name: "alt",
                  title: "Alt text",
                  type: "string",
                  description: "Short description of the image for accessibility.",
                },
              ],
            },
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
      name: "recommendationGuides",
      title: "Curated Recommendation Guides",
      type: "array",
      description:
        "Host-written local guides, themed lists and practical itineraries. Array order controls public display order.",
      of: [
        {
          type: "object",
          name: "recommendationGuide",
          title: "Recommendation guide",
          fields: [
            { name: "title_en", title: "Title (English)", type: "string" },
            { name: "title_pt", title: "Title (Portuguese)", type: "string" },
            { name: "title_nl", title: "Title (Dutch)", type: "string" },
            {
              name: "introduction_en",
              title: "Short introduction (English)",
              type: "text",
              rows: 3,
            },
            {
              name: "introduction_pt",
              title: "Short introduction (Portuguese)",
              type: "text",
              rows: 3,
            },
            {
              name: "introduction_nl",
              title: "Short introduction (Dutch)",
              type: "text",
              rows: 3,
            },
            {
              name: "content_en",
              title: "Full content (English)",
              type: "text",
              rows: 12,
              description:
                "Use blank lines for paragraphs and lines beginning with a dash for practical lists.",
            },
            {
              name: "content_pt",
              title: "Full content (Portuguese)",
              type: "text",
              rows: 12,
            },
            {
              name: "content_nl",
              title: "Full content (Dutch)",
              type: "text",
              rows: 12,
            },
            {
              name: "recommendationType",
              title: "Recommendation type",
              type: "string",
              initialValue: "localExperience",
              options: {
                list: [
                  ...recommendationGuideCategories.map((category) => ({
                    title: category.labels.en,
                    value: category.id,
                  })),
                  { title: "Custom Category", value: "custom" },
                ],
              },
            },
            {
              name: "customCategory_en",
              title: "Custom category (English)",
              type: "string",
              hidden: ({ parent }) => parent?.recommendationType !== "custom",
            },
            {
              name: "customCategory_pt",
              title: "Custom category (Portuguese)",
              type: "string",
              hidden: ({ parent }) => parent?.recommendationType !== "custom",
            },
            {
              name: "customCategory_nl",
              title: "Custom category (Dutch)",
              type: "string",
              hidden: ({ parent }) => parent?.recommendationType !== "custom",
            },
            {
              name: "featuredImage",
              title: "Featured image",
              type: "image",
              options: { hotspot: true },
              fields: [
                {
                  name: "alt",
                  title: "Alt text",
                  type: "string",
                  description: "Describe the image for accessibility and search engines.",
                },
              ],
            },
            {
              name: "relatedMapPlaceKeys",
              title: "Related map places",
              type: "array",
              description:
                "Map place item keys. City hosts can select these by name in the dashboard.",
              of: [{ type: "string" }],
              validation: (Rule) => Rule.unique(),
            },
            {
              name: "relatedProvider",
              title: "Related provider",
              type: "reference",
              to: [{ type: "provider" }],
              options: { disableNew: true, filter: "status == 'published'" },
            },
            {
              name: "relatedCity",
              title: "Related city page",
              type: "reference",
              to: [{ type: "city" }],
              options: { disableNew: true },
            },
          ],
          preview: {
            select: {
              title: "title_en",
              subtitle: "recommendationType",
              media: "featuredImage",
            },
          },
        },
      ],
    }),

    defineField({
      name: "recommendations",
      title: "Legacy Recommendations — Review Before Migration",
      type: "array",
      description:
        "Preserved place-style recommendation records. Do not delete these until their information has been reviewed and moved into Curated Recommendation Guides or Map Places.",
      of: [
        {
          type: "object",
          fields: [
            {
              name: "name",
              title: "Legacy / default recommendation name",
              type: "string",
            },
            {
              name: "name_en",
              title: "Recommendation name (English / default)",
              type: "string",
            },
            {
              name: "name_pt",
              title: "Recommendation name (Portuguese)",
              type: "string",
            },
            {
              name: "name_nl",
              title: "Recommendation name (Dutch)",
              type: "string",
            },
            {
              name: "categoryPreset",
              title: "Category preset",
              type: "string",
              options: {
                list: mapCategoryPresets,
              },
            },
            {
              name: "category",
              title: "Legacy / custom category key",
              type: "string",
              hidden: ({ parent }) =>
                Boolean(parent?.categoryPreset && parent.categoryPreset !== "custom"),
            },
            {
              name: "categoryLabel_en",
              title: "Custom category label (English)",
              type: "string",
              hidden: ({ parent }) => parent?.categoryPreset !== "custom",
            },
            {
              name: "categoryLabel_pt",
              title: "Custom category label (Portuguese)",
              type: "string",
              hidden: ({ parent }) => parent?.categoryPreset !== "custom",
            },
            {
              name: "categoryLabel_nl",
              title: "Custom category label (Dutch)",
              type: "string",
              hidden: ({ parent }) => parent?.categoryPreset !== "custom",
            },
            {
              name: "neighborhood",
              title: "Neighborhood / area",
              type: "string",
            },
            {
              name: "detail_en",
              title: "Short note (English)",
              type: "string",
            },
            {
              name: "detail_pt",
              title: "Short note (Portuguese)",
              type: "string",
            },
            {
              name: "detail_nl",
              title: "Short note (Dutch)",
              type: "string",
            },
            {
              name: "description_en",
              title: "Description (English)",
              type: "text",
              rows: 4,
            },
            {
              name: "description_pt",
              title: "Description (Portuguese)",
              type: "text",
              rows: 4,
            },
            {
              name: "description_nl",
              title: "Description (Dutch)",
              type: "text",
              rows: 4,
            },
            { name: "website", title: "Website / Instagram", type: "url" },
            { name: "favorite", title: "My pick", type: "boolean" },
          ],
          preview: {
            select: {
              title: "name_en",
              subtitle: "categoryPreset",
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
