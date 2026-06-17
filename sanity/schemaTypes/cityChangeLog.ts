import { defineField, defineType } from "sanity";

export const cityChangeLog = defineType({
  name: "cityChangeLog",
  title: "City Change Log",
  type: "document",
  fields: [
    defineField({
      name: "changedAt",
      title: "Changed At",
      type: "datetime",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "city",
      title: "City",
      type: "reference",
      to: [{ type: "city" }],
      validation: (Rule) => Rule.required(),
    }),
    defineField({ name: "cityName", title: "City Name", type: "string" }),
    defineField({ name: "citySlug", title: "City Slug", type: "string" }),
    defineField({
      name: "changeType",
      title: "Change Type",
      type: "string",
      options: {
        list: [
          { title: "City content", value: "cityContent" },
          { title: "Recommendations", value: "recommendations" },
          { title: "Map place added", value: "mapPlaceAdded" },
          { title: "Map place updated", value: "mapPlaceUpdated" },
          { title: "Map place deleted", value: "mapPlaceDeleted" },
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
    defineField({
      name: "provider",
      title: "Provider",
      type: "reference",
      to: [{ type: "provider" }],
    }),
  ],
  preview: {
    select: {
      title: "description",
      city: "cityName",
      actor: "actorName",
      changedAt: "changedAt",
    },
    prepare({ title, city, actor, changedAt }) {
      return {
        title: title || "City change",
        subtitle: [city, actor, changedAt].filter(Boolean).join(" · "),
      };
    },
  },
});
