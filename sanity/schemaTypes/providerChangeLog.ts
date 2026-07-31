import { defineField, defineType } from "sanity";

export const providerChangeLog = defineType({
  name: "providerChangeLog",
  title: "Provider Change Log",
  type: "document",
  fields: [
    defineField({
      name: "changedAt",
      title: "Changed At",
      type: "datetime",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "provider",
      title: "Provider",
      type: "reference",
      to: [{ type: "provider" }],
      validation: (Rule) => Rule.required(),
    }),
    defineField({ name: "providerName", title: "Provider Name", type: "string" }),
    defineField({ name: "providerSlug", title: "Provider Slug", type: "string" }),
    defineField({
      name: "changeType",
      title: "Change Type",
      type: "string",
      options: {
        list: [
          { title: "Provider created", value: "providerCreated" },
          { title: "Provider edited", value: "providerEdited" },
          { title: "Provider self-published", value: "providerSelfPublished" },
          { title: "Managed city assigned", value: "managedCityAssigned" },
          { title: "Managed city removed", value: "managedCityRemoved" },
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
  preview: {
    select: {
      title: "description",
      provider: "providerName",
      actor: "actorName",
      changedAt: "changedAt",
    },
    prepare({ title, provider, actor, changedAt }) {
      return {
        title: title || "Provider change",
        subtitle: [provider, actor, changedAt].filter(Boolean).join(" · "),
      };
    },
  },
});
