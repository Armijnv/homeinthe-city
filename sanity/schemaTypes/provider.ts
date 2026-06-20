import { defineField, defineType } from "sanity";

const roleOptions = [
  { title: "Host", value: "host" },
  { title: "Interpreter", value: "interpreter" },
  { title: "Translator", value: "translator" },
  { title: "Guide", value: "guide" },
  { title: "Specialist", value: "specialist" },
  { title: "Real estate agent", value: "realtor" },
];

const selfEditableFieldOptions = [
  { title: "Name", value: "name" },
  { title: "Slug", value: "slug" },
  { title: "Roles", value: "roles" },
  { title: "Primary role", value: "primaryRole" },
  { title: "Cities", value: "cities" },
  { title: "Languages", value: "languages" },
  { title: "Headlines", value: "headlines" },
  { title: "Intro text", value: "intro" },
  { title: "About text", value: "about" },
  { title: "Contact options", value: "contactOptions" },
  { title: "Main photo", value: "mainPhoto" },
];

export const provider = defineType({
  name: "provider",
  title: "Provider / Person Profile",
  type: "document",

  fields: [
    defineField({
      name: "name",
      title: "Name",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),

    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      options: { source: "name", maxLength: 96 },
      validation: (Rule) => Rule.required(),
    }),

    defineField({
      name: "status",
      title: "Profile Status",
      type: "string",
      initialValue: "draft",
      options: {
        list: [
          { title: "Draft", value: "draft" },
          { title: "Review", value: "review" },
          { title: "Published", value: "published" },
          { title: "Disabled / Hidden", value: "disabled" },
        ],
      },
      validation: (Rule) => Rule.required(),
    }),

    defineField({
      name: "ownership",
      title: "Ownership",
      type: "object",
      description:
        "Preparation for future profile self-editing. This does not grant access by itself.",
      fields: [
        defineField({
          name: "contactEmail",
          title: "Contact Email",
          type: "email",
          description:
            "Email to verify and connect with a future owner account.",
        }),
        defineField({
          name: "ownerUserId",
          title: "Future Owner User ID",
          type: "string",
          description:
            "Stable auth user id once profile accounts exist. Leave empty until ownership is verified.",
        }),
        defineField({
          name: "ownershipStatus",
          title: "Ownership Status",
          type: "string",
          initialValue: "unclaimed",
          options: {
            list: [
              { title: "Unclaimed", value: "unclaimed" },
              { title: "Invited", value: "invited" },
              { title: "Claimed", value: "claimed" },
            ],
          },
        }),
        defineField({
          name: "selfEditEnabled",
          title: "Self Editing Enabled",
          type: "boolean",
          initialValue: false,
          description:
            "Keep disabled until app authentication and document ownership checks are implemented.",
        }),
        defineField({
          name: "selfEditableFields",
          title: "Future Self-Editable Fields",
          type: "array",
          of: [{ type: "string" }],
          options: { list: selfEditableFieldOptions },
          description:
            "Allowlist for a future profile editor. Server-side checks still need to enforce this.",
        }),
      ],
    }),

    defineField({
      name: "roles",
      title: "Roles",
      type: "array",
      of: [{ type: "string" }],
      options: { list: roleOptions },
      validation: (Rule) => Rule.required().min(1),
    }),

    defineField({
      name: "primaryRole",
      title: "Primary Role",
      type: "string",
      options: { list: roleOptions },
      validation: (Rule) => Rule.required(),
    }),

    defineField({
      name: "cities",
      title: "Cities Served",
      type: "array",
      of: [{ type: "reference", to: [{ type: "city" }] }],
      description:
        "Public profile coverage: cities where this provider works or serves clients. This does not grant city dashboard editing access.",
    }),

    defineField({
      name: "managedCities",
      title: "Managed Cities",
      type: "array",
      of: [{ type: "reference", to: [{ type: "city" }] }],
      description:
        "Dashboard permissions: cities this provider can manage as a city host. Keep this separate from Cities Served.",
    }),

    defineField({
      name: "languages",
      title: "Languages",
      type: "array",
      of: [
        {
          type: "object",
          fields: [
            defineField({
              name: "language",
              title: "Language",
              type: "string",
              options: {
                list: [
                  { title: "English", value: "en" },
                  { title: "Portuguese", value: "pt" },
                  { title: "Dutch", value: "nl" },
                  { title: "Spanish", value: "es" },
                  { title: "German", value: "de" },
                  { title: "French", value: "fr" },
                  { title: "Other", value: "other" },
                ],
              },
            }),
            defineField({
              name: "level",
              title: "Level",
              type: "string",
              options: {
                list: [
                  { title: "Native", value: "native" },
                  { title: "Fluent", value: "fluent" },
                  { title: "Professional", value: "professional" },
                  { title: "Conversational", value: "conversational" },
                ],
              },
            }),
            defineField({
              name: "services",
              title: "Language Services",
              type: "array",
              of: [{ type: "string" }],
              options: {
                list: [
                  { title: "Speaks", value: "speaks" },
                  { title: "Interprets from", value: "interpretsFrom" },
                  { title: "Interprets to", value: "interpretsTo" },
                  { title: "Translates from", value: "translatesFrom" },
                  { title: "Translates to", value: "translatesTo" },
                ],
              },
            }),
          ],
          preview: {
            select: {
              title: "language",
              subtitle: "level",
            },
          },
        },
      ],
    }),

    defineField({ name: "headline_en", title: "Headline (English)", type: "string" }),
    defineField({ name: "headline_pt", title: "Headline (Portuguese)", type: "string" }),
    defineField({ name: "headline_nl", title: "Headline (Dutch)", type: "string" }),

    defineField({ name: "intro_en", title: "Intro (English)", type: "text" }),
    defineField({ name: "intro_pt", title: "Intro (Portuguese)", type: "text" }),
    defineField({ name: "intro_nl", title: "Intro (Dutch)", type: "text" }),

    defineField({ name: "about_en", title: "About (English)", type: "text" }),
    defineField({ name: "about_pt", title: "About (Portuguese)", type: "text" }),
    defineField({ name: "about_nl", title: "About (Dutch)", type: "text" }),

    defineField({
      name: "servicesTitle_en",
      title: "Services Title (English)",
      type: "string",
    }),
    defineField({
      name: "servicesTitle_pt",
      title: "Services Title (Portuguese)",
      type: "string",
    }),
    defineField({
      name: "servicesTitle_nl",
      title: "Services Title (Dutch)",
      type: "string",
    }),
    defineField({
      name: "services",
      title: "Service / Help Cards",
      type: "array",
      of: [
        {
          type: "object",
          fields: [
            defineField({
              name: "roles",
              title: "Applicable provider roles",
              type: "array",
              of: [{ type: "string" }],
              options: { list: roleOptions },
              validation: (Rule) => Rule.required().min(1),
              description:
                "This card is shown only when the provider has at least one selected role.",
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
              name: "description_en",
              title: "Description (English)",
              type: "text",
            }),
            defineField({
              name: "description_pt",
              title: "Description (Portuguese)",
              type: "text",
            }),
            defineField({
              name: "description_nl",
              title: "Description (Dutch)",
              type: "text",
            }),
          ],
        },
      ],
    }),

    defineField({
      name: "contactOptions",
      title: "Contact Options",
      type: "object",
      fields: [
        defineField({ name: "email", title: "Email", type: "string" }),
        defineField({ name: "phone", title: "Phone", type: "string" }),
        defineField({ name: "whatsapp", title: "WhatsApp Link", type: "url" }),
        defineField({ name: "website", title: "Website", type: "url" }),
        defineField({
          name: "preferredContact",
          title: "Preferred Contact",
          type: "string",
          options: {
            list: [
              { title: "Email", value: "email" },
              { title: "Phone", value: "phone" },
              { title: "WhatsApp", value: "whatsapp" },
              { title: "Website", value: "website" },
            ],
          },
        }),
      ],
    }),

    defineField({
      name: "mainPhoto",
      title: "Main Photo",
      type: "image",
      options: { hotspot: true },
      fields: [
        defineField({
          name: "alt",
          title: "Alt Text",
          type: "string",
        }),
      ],
    }),

    defineField({
      name: "verificationStatus",
      title: "Verification Status",
      type: "string",
      initialValue: "unverified",
      options: {
        list: [
          { title: "Unverified", value: "unverified" },
          { title: "Pending", value: "pending" },
          { title: "Verified", value: "verified" },
          { title: "Rejected", value: "rejected" },
        ],
      },
    }),

    defineField({
      name: "legacyHost",
      title: "Legacy Host Compatibility",
      type: "object",
      description:
        "Links this provider profile back to the current host document while legacy host routes remain live.",
      fields: [
        defineField({
          name: "slug",
          title: "Legacy Host Slug",
          type: "string",
        }),
        defineField({
          name: "documentId",
          title: "Legacy Host Document ID",
          type: "string",
        }),
        defineField({
          name: "keepLegacyRoutes",
          title: "Keep Legacy Routes",
          type: "boolean",
          initialValue: true,
          description:
            "Keep enabled until provider routes replace /hosts/[slug] safely.",
        }),
      ],
    }),
  ],

  preview: {
    select: {
      title: "name",
      subtitle: "primaryRole",
      media: "mainPhoto",
    },
  },
});
