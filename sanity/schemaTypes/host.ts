import { defineType, defineField } from "sanity";

const providerRoleOptions = [
  { title: "Host", value: "host" },
  { title: "Interpreter", value: "interpreter" },
  { title: "Translator", value: "translator" },
  { title: "Guide", value: "guide" },
  { title: "Specialist", value: "specialist" },
  { title: "Real estate agent", value: "realtor" },
];

export const host = defineType({
  name: "host",
  title: "Host",
  type: "document",

  fields: [
    defineField({ name: "name", title: "Name", type: "string" }),

    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      options: { source: "name", maxLength: 96 },
    }),

    defineField({ name: "photo", title: "Photo", type: "image" }),

    defineField({ name: "eyebrow_en", title: "Eyebrow (English)", type: "string" }),
    defineField({ name: "eyebrow_pt", title: "Eyebrow (Portuguese)", type: "string" }),
    defineField({ name: "eyebrow_nl", title: "Eyebrow (Dutch)", type: "string" }),

    defineField({ name: "headline_en", title: "Headline (English)", type: "string" }),
    defineField({ name: "headline_pt", title: "Headline (Portuguese)", type: "string" }),
    defineField({ name: "headline_nl", title: "Headline (Dutch)", type: "string" }),

    defineField({ name: "intro_en", title: "Intro (English)", type: "text" }),
    defineField({ name: "intro_pt", title: "Intro (Portuguese)", type: "text" }),
    defineField({ name: "intro_nl", title: "Intro (Dutch)", type: "text" }),

    defineField({ name: "servicesTitle_en", title: "Services Title (English)", type: "string" }),
    defineField({ name: "servicesTitle_pt", title: "Services Title (Portuguese)", type: "string" }),
    defineField({ name: "servicesTitle_nl", title: "Services Title (Dutch)", type: "string" }),

    defineField({
      name: "services",
      title: "Services",
      type: "array",
      of: [
        {
          type: "object",
          fields: [
            {
              name: "roles",
              title: "Applicable provider roles",
              type: "array",
              of: [{ type: "string" }],
              options: { list: providerRoleOptions },
              validation: (Rule) => Rule.required().min(1),
              description:
                "This card is shown only when the provider has at least one selected role.",
            },
            { name: "title_en", title: "Title (English)", type: "string" },
            { name: "title_pt", title: "Title (Portuguese)", type: "string" },
            { name: "title_nl", title: "Title (Dutch)", type: "string" },

            { name: "description_en", title: "Description (English)", type: "text" },
            { name: "description_pt", title: "Description (Portuguese)", type: "text" },
            { name: "description_nl", title: "Description (Dutch)", type: "text" },
          ],
        },
      ],
    }),

    defineField({ name: "aboutTitle_en", title: "About Title (English)", type: "string" }),
    defineField({ name: "aboutTitle_pt", title: "About Title (Portuguese)", type: "string" }),
    defineField({ name: "aboutTitle_nl", title: "About Title (Dutch)", type: "string" }),

    defineField({ name: "about_en", title: "About Text (English)", type: "text" }),
    defineField({ name: "about_pt", title: "About Text (Portuguese)", type: "text" }),
    defineField({ name: "about_nl", title: "About Text (Dutch)", type: "text" }),

    defineField({ name: "whatsapp", title: "WhatsApp link", type: "url" }),
    defineField({ name: "email", title: "Email", type: "string" }),
  ],
});
