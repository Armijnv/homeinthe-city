import { defineField, defineType } from "sanity";

const roleOptions = [
  { title: "Host", value: "host" },
  { title: "Interpreter", value: "interpreter" },
  { title: "Translator", value: "translator" },
  { title: "Guide", value: "guide" },
  { title: "Specialist", value: "specialist" },
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
          { title: "Pending Review", value: "pendingReview" },
          { title: "Published", value: "published" },
          { title: "Hidden", value: "hidden" },
          { title: "Suspended", value: "suspended" },
        ],
      },
      validation: (Rule) => Rule.required(),
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
      title: "Cities",
      type: "array",
      of: [{ type: "reference", to: [{ type: "city" }] }],
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
  ],

  preview: {
    select: {
      title: "name",
      subtitle: "primaryRole",
      media: "mainPhoto",
    },
  },
});
