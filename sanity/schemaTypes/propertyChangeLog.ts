import { defineField, defineType } from "sanity";

export const propertyChangeLog = defineType({
  name: "propertyChangeLog",
  title: "Property Change Log",
  type: "document",
  fields: [
    defineField({
      name: "changedAt",
      title: "Changed At",
      type: "datetime",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "property",
      title: "Property",
      type: "reference",
      to: [{ type: "propertyListing" }],
      weak: true,
    }),
    defineField({ name: "propertyTitle", title: "Property Title", type: "string" }),
    defineField({ name: "propertySlug", title: "Property Slug", type: "string" }),
    defineField({
      name: "changeType",
      title: "Change Type",
      type: "string",
      options: {
        list: [
          { title: "Property created", value: "propertyCreated" },
          { title: "Property edited", value: "propertyEdited" },
          { title: "Property deleted", value: "propertyDeleted" },
        ],
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({ name: "actorName", title: "Changed By", type: "string" }),
    defineField({ name: "actorEmail", title: "Actor Email", type: "string" }),
    defineField({ name: "actorUserId", title: "Clerk User ID", type: "string" }),
    defineField({ name: "actorRole", title: "Actor Role", type: "string" }),
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
            defineField({ name: "field", title: "Field", type: "string" }),
            defineField({ name: "beforeValue", title: "Before", type: "text" }),
            defineField({ name: "afterValue", title: "After", type: "text" }),
          ],
        },
      ],
    }),
  ],
  preview: {
    select: {
      title: "propertyTitle",
      actor: "actorName",
      changedAt: "changedAt",
    },
    prepare({ title, actor, changedAt }) {
      return {
        title: title || "Property change",
        subtitle: [actor, changedAt].filter(Boolean).join(" · "),
      };
    },
  },
});
