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
          { title: "City created", value: "cityCreated" },
          { title: "City content", value: "cityContent" },
          { title: "City publication", value: "cityStatus" },
          { title: "City coordinates", value: "cityCoordinates" },
          { title: "Recommendations", value: "recommendations" },
          { title: "Recommendation added", value: "recommendationAdded" },
          { title: "Recommendation updated", value: "recommendationUpdated" },
          { title: "Recommendation deleted", value: "recommendationDeleted" },
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
    defineField({ name: "actorRole", title: "Actor Role", type: "string" }),
    defineField({ name: "changedFields", title: "Changed Fields", type: "array", of: [{ type: "string" }] }),
    defineField({
      name: "changes",
      title: "Before / After Changes",
      type: "array",
      of: [{
        type: "object",
        fields: [
          defineField({ name: "field", title: "Field", type: "string" }),
          defineField({ name: "beforeValue", title: "Before", type: "text" }),
          defineField({ name: "afterValue", title: "After", type: "text" }),
        ],
      }],
    }),
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
