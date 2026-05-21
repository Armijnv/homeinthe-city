import { defineField, defineType } from "sanity";

const statusOptions = [
  { title: "Draft", value: "draft" },
  { title: "Review", value: "review" },
  { title: "Approved", value: "approved" },
  { title: "Rejected", value: "rejected" },
];

const roleOptions = [
  { title: "Host", value: "host" },
  { title: "Interpreter", value: "interpreter" },
  { title: "Translator", value: "translator" },
  { title: "Guide", value: "guide" },
  { title: "Specialist", value: "specialist" },
];

const languageOptions = [
  { title: "English", value: "en" },
  { title: "Portuguese", value: "pt" },
  { title: "Dutch", value: "nl" },
  { title: "Spanish", value: "es" },
  { title: "German", value: "de" },
  { title: "French", value: "fr" },
  { title: "Other", value: "other" },
];

const languageLevelOptions = [
  { title: "Native", value: "native" },
  { title: "Fluent", value: "fluent" },
  { title: "Professional", value: "professional" },
  { title: "Conversational", value: "conversational" },
];

const languageServiceOptions = [
  { title: "Speaks", value: "speaks" },
  { title: "Interprets from", value: "interpretsFrom" },
  { title: "Interprets to", value: "interpretsTo" },
  { title: "Translates from", value: "translatesFrom" },
  { title: "Translates to", value: "translatesTo" },
];

const profileSnapshotFields = [
  defineField({
    name: "name",
    title: "Name",
    type: "string",
  }),
  defineField({
    name: "slug",
    title: "Slug",
    type: "slug",
  }),
  defineField({
    name: "roles",
    title: "Roles",
    type: "array",
    of: [{ type: "string" }],
    options: { list: roleOptions },
  }),
  defineField({
    name: "primaryRole",
    title: "Primary Role",
    type: "string",
    options: { list: roleOptions },
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
            options: { list: languageOptions },
          }),
          defineField({
            name: "level",
            title: "Level",
            type: "string",
            options: { list: languageLevelOptions },
          }),
          defineField({
            name: "services",
            title: "Language Services",
            type: "array",
            of: [{ type: "string" }],
            options: { list: languageServiceOptions },
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
    name: "about_en",
    title: "About (English)",
    type: "text",
  }),
  defineField({
    name: "about_pt",
    title: "About (Portuguese)",
    type: "text",
  }),
  defineField({
    name: "about_nl",
    title: "About (Dutch)",
    type: "text",
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
];

export const providerSubmission = defineType({
  name: "providerSubmission",
  title: "Provider Submission",
  type: "document",

  fields: [
    defineField({
      name: "provider",
      title: "Provider",
      type: "reference",
      to: [{ type: "provider" }],
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "ownerUserId",
      title: "Owner User ID",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "ownerEmail",
      title: "Owner Email",
      type: "email",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "status",
      title: "Submission Status",
      type: "string",
      initialValue: "draft",
      options: { list: statusOptions },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "profileSnapshot",
      title: "Editable Profile Field Snapshot",
      type: "object",
      description:
        "Future self-editing payload. Approval should copy allowed fields into the linked provider.",
      fields: profileSnapshotFields,
    }),
    defineField({
      name: "submittedAt",
      title: "Submitted At",
      type: "datetime",
    }),
    defineField({
      name: "reviewedAt",
      title: "Reviewed At",
      type: "datetime",
    }),
    defineField({
      name: "reviewedBy",
      title: "Reviewed By",
      type: "string",
    }),
    defineField({
      name: "reviewNote",
      title: "Review Note",
      type: "text",
    }),
  ],

  preview: {
    select: {
      providerName: "provider.name",
      ownerEmail: "ownerEmail",
      status: "status",
    },
    prepare({ providerName, ownerEmail, status }) {
      return {
        title: providerName || ownerEmail || "Provider submission",
        subtitle: [status, ownerEmail].filter(Boolean).join(" · "),
      };
    },
  },
});
