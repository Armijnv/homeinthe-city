import { defineType, defineField } from "sanity";

export const servicePage = defineType({
  name: "servicePage",
  title: "Service Page",
  type: "document",

  fields: [
    /* ======================================================
       BASIC INFO
    ====================================================== */

    defineField({
      name: "name",
      title: "Internal Name",
      type: "string",
    }),

    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      options: {
        source: "name",
        maxLength: 96,
      },
    }),

    defineField({
      name: "kind",
      title: "Page Kind",
      type: "string",
      options: {
        list: [
          { title: "General interpreter hub", value: "interpreterHub" },
          { title: "City interpreter page", value: "cityInterpreter" },
        ],
      },
      description:
        "Use City interpreter page for editorial content attached to one city. Existing legacy service pages may remain unclassified until migrated.",
    }),

    defineField({
      name: "city",
      title: "City",
      type: "reference",
      to: [{ type: "city" }],
      options: { disableNew: true },
      hidden: ({ document }) => document?.kind !== "cityInterpreter",
      validation: (Rule) =>
        Rule.custom((value, context) =>
          context.document?.kind === "cityInterpreter" && !value
            ? "A city interpreter page must reference its city."
            : true,
        ),
      description:
        "Required for newly managed city interpreter pages. Provider identity and language coverage are derived from provider profiles.",
    }),

    /* ======================================================
       SEO
    ====================================================== */

    defineField({
      name: "seoTitle_en",
      title: "SEO Title (English)",
      type: "string",
    }),

    defineField({
      name: "seoTitle_pt",
      title: "SEO Title (Portuguese)",
      type: "string",
    }),

    defineField({
      name: "seoTitle_nl",
      title: "SEO Title (Dutch)",
      type: "string",
    }),

    defineField({
      name: "seoDescription_en",
      title: "SEO Description (English)",
      type: "text",
    }),

    defineField({
      name: "seoDescription_pt",
      title: "SEO Description (Portuguese)",
      type: "text",
    }),

    defineField({
      name: "seoDescription_nl",
      title: "SEO Description (Dutch)",
      type: "text",
    }),

    /* ======================================================
       HERO
    ====================================================== */

    defineField({
      name: "eyebrow_en",
      title: "Eyebrow (English)",
      type: "string",
    }),

    defineField({
      name: "eyebrow_pt",
      title: "Eyebrow (Portuguese)",
      type: "string",
    }),

    defineField({
      name: "eyebrow_nl",
      title: "Eyebrow (Dutch)",
      type: "string",
    }),

    defineField({
      name: "title_en",
      title: "Title (English)",
      type: "string",
    }),

    defineField({
      name: "title_pt",
      title: "Title (Portuguese)",
      type: "string",
    }),

    defineField({
      name: "title_nl",
      title: "Title (Dutch)",
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

    /* ======================================================
       PAGE SECTIONS
    ====================================================== */

    defineField({
      name: "sections",
      title: "Page Sections",
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
          ],
        },
      ],
    }),

    /* ======================================================
       PRICING
    ====================================================== */

    defineField({
      name: "pricingTitle_en",
      title: "Pricing Title (English)",
      type: "string",
    }),

    defineField({
      name: "pricingTitle_pt",
      title: "Pricing Title (Portuguese)",
      type: "string",
    }),

    defineField({
      name: "pricingTitle_nl",
      title: "Pricing Title (Dutch)",
      type: "string",
    }),

    defineField({
      name: "pricingItems",
      title: "Pricing Items",
      type: "array",
      of: [
        {
          type: "object",
          fields: [
            { name: "label_en", title: "Label (English)", type: "string" },
            { name: "label_pt", title: "Label (Portuguese)", type: "string" },
            { name: "label_nl", title: "Label (Dutch)", type: "string" },
            { name: "detail_en", title: "Detail (English)", type: "string" },
{ name: "detail_pt", title: "Detail (Portuguese)", type: "string" },
{ name: "detail_nl", title: "Detail (Dutch)", type: "string" },
          ],
        },
      ],
    }),

    /* ======================================================
       CTA
    ====================================================== */

    defineField({
      name: "ctaTitle_en",
      title: "CTA Title (English)",
      type: "string",
    }),

    defineField({
      name: "ctaTitle_pt",
      title: "CTA Title (Portuguese)",
      type: "string",
    }),

    defineField({
      name: "ctaTitle_nl",
      title: "CTA Title (Dutch)",
      type: "string",
    }),

    defineField({
      name: "ctaText_en",
      title: "CTA Text (English)",
      type: "text",
    }),

    defineField({
      name: "ctaText_pt",
      title: "CTA Text (Portuguese)",
      type: "text",
    }),

    defineField({
      name: "ctaText_nl",
      title: "CTA Text (Dutch)",
      type: "text",
    }),

    defineField({
      name: "button_en",
      title: "Button Text (English)",
      type: "string",
    }),

    defineField({
      name: "button_pt",
      title: "Button Text (Portuguese)",
      type: "string",
    }),

    defineField({
      name: "button_nl",
      title: "Button Text (Dutch)",
      type: "string",
    }),
  ],
});
