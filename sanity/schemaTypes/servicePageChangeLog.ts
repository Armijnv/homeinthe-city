import { defineField, defineType } from "sanity";

export const servicePageChangeLog = defineType({
  name: "servicePageChangeLog",
  title: "Service Page Change Log",
  type: "document",
  fields: [
    defineField({
      name: "changedAt",
      title: "Changed At",
      type: "datetime",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "servicePage",
      title: "Service Page",
      type: "reference",
      to: [{ type: "servicePage" }],
      validation: (Rule) => Rule.required(),
    }),
    defineField({ name: "pageName", title: "Page Name", type: "string" }),
    defineField({ name: "pageKey", title: "Dashboard Page Key", type: "string" }),
    defineField({ name: "pageSlug", title: "Service Page Slug", type: "string" }),
    defineField({ name: "citySlug", title: "City Slug", type: "string" }),
    defineField({ name: "publicPath", title: "Public Path", type: "string" }),
    defineField({
      name: "changeType",
      title: "Change Type",
      type: "string",
      options: {
        list: [
          { title: "Service page created", value: "servicePageCreated" },
          { title: "Service page edited", value: "servicePageEdited" },
        ],
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "description",
      title: "Description",
      type: "string",
      validation: (Rule) => Rule.required().max(200),
    }),
    defineField({ name: "actorName", title: "Changed By", type: "string" }),
    defineField({ name: "actorEmail", title: "Actor Email", type: "string" }),
    defineField({ name: "actorUserId", title: "Clerk User ID", type: "string" }),
    defineField({ name: "actorRole", title: "Actor Role", type: "string" }),
    defineField({
      name: "provider",
      title: "Provider",
      type: "reference",
      to: [{ type: "provider" }],
    }),
    defineField({
      name: "changedFields",
      title: "Changed Fields",
      type: "array",
      of: [{ type: "string" }],
    }),
    defineField({
      name: "changes",
      title: "Before / After Changes",
      type: "array",
      of: [
        {
          type: "object",
          fields: [
            defineField({
              name: "field",
              title: "Field",
              type: "string",
              validation: (Rule) => Rule.required(),
            }),
            defineField({ name: "beforeValue", title: "Before", type: "text" }),
            defineField({ name: "afterValue", title: "After", type: "text" }),
          ],
        },
      ],
    }),
  ],
});
