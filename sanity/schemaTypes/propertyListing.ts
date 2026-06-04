import { defineField, defineType } from "sanity";

const localizedStringFields = (name: string, title: string) => [
  defineField({ name: `${name}_en`, title: `${title} (English)`, type: "string" }),
  defineField({ name: `${name}_pt`, title: `${title} (Portuguese)`, type: "string" }),
  defineField({ name: `${name}_nl`, title: `${title} (Dutch)`, type: "string" }),
];

const localizedTextFields = (name: string, title: string) => [
  defineField({ name: `${name}_en`, title: `${title} (English)`, type: "text" }),
  defineField({ name: `${name}_pt`, title: `${title} (Portuguese)`, type: "text" }),
  defineField({ name: `${name}_nl`, title: `${title} (Dutch)`, type: "text" }),
];

const localizedListFields = (name: string, title: string) => [
  defineField({
    name: `${name}_en`,
    title: `${title} (English)`,
    type: "array",
    of: [{ type: "string" }],
  }),
  defineField({
    name: `${name}_pt`,
    title: `${title} (Portuguese)`,
    type: "array",
    of: [{ type: "string" }],
  }),
  defineField({
    name: `${name}_nl`,
    title: `${title} (Dutch)`,
    type: "array",
    of: [{ type: "string" }],
  }),
];

export const propertyListing = defineType({
  name: "propertyListing",
  title: "Property Listing",
  type: "document",
  fields: [
    ...localizedStringFields("title", "Title"),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      options: { source: "title_en", maxLength: 96 },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "listingType",
      title: "Listing Type",
      type: "string",
      options: {
        list: [
          { title: "Rent", value: "rent" },
          { title: "Sale", value: "sale" },
        ],
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "status",
      title: "Status",
      type: "string",
      initialValue: "hidden",
      options: {
        list: [
          { title: "Available", value: "available" },
          { title: "Reserved", value: "reserved" },
          { title: "Sold", value: "sold" },
          { title: "Rented", value: "rented" },
          { title: "Hidden", value: "hidden" },
        ],
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "city",
      title: "City",
      type: "reference",
      to: [{ type: "city" }],
    }),
    defineField({
      name: "cityName",
      title: "City Name",
      type: "string",
      description: "Fallback city name if no city document is linked.",
    }),
    defineField({ name: "neighborhood", title: "Neighborhood", type: "string" }),
    defineField({
      name: "addressVisibility",
      title: "Address Visibility",
      type: "string",
      initialValue: "neighborhood",
      options: {
        list: [
          { title: "Hidden", value: "hidden" },
          { title: "Neighborhood only", value: "neighborhood" },
          { title: "Full address", value: "full" },
        ],
      },
    }),
    defineField({ name: "address", title: "Address", type: "string" }),
    defineField({ name: "price", title: "Price", type: "number" }),
    defineField({
      name: "currency",
      title: "Currency",
      type: "string",
      initialValue: "BRL",
      options: {
        list: [
          { title: "BRL", value: "BRL" },
          { title: "EUR", value: "EUR" },
          { title: "USD", value: "USD" },
        ],
      },
    }),
    defineField({ name: "monthlyCondoFee", title: "Monthly Condo Fee", type: "number" }),
    defineField({ name: "propertyTax", title: "Property Tax", type: "number" }),
    defineField({ name: "bedrooms", title: "Bedrooms", type: "number" }),
    defineField({ name: "bathrooms", title: "Bathrooms", type: "number" }),
    defineField({ name: "parkingSpaces", title: "Parking Spaces", type: "number" }),
    defineField({ name: "areaM2", title: "Area (m²)", type: "number" }),
    defineField({ name: "floor", title: "Floor", type: "number" }),
    defineField({ name: "furnished", title: "Furnished", type: "boolean" }),
    ...localizedTextFields("shortDescription", "Short Description"),
    ...localizedTextFields("longDescription", "Long Description"),
    ...localizedListFields("features", "Features"),
    defineField({
      name: "mainImage",
      title: "Main Image",
      type: "image",
      options: { hotspot: true },
      fields: [defineField({ name: "alt", title: "Alt Text", type: "string" })],
    }),
    defineField({
      name: "gallery",
      title: "Gallery Images",
      type: "array",
      of: [
        {
          type: "image",
          options: { hotspot: true },
          fields: [defineField({ name: "alt", title: "Alt Text", type: "string" })],
        },
      ],
    }),
    defineField({ name: "mapCoordinates", title: "Map Coordinates", type: "geopoint" }),
    defineField({
      name: "linkedRealtor",
      title: "Linked Realtor / Provider",
      type: "reference",
      to: [{ type: "provider" }],
    }),
    defineField({
      name: "contact",
      title: "Listing Contact",
      type: "object",
      fields: [
        defineField({ name: "whatsapp", title: "WhatsApp Link", type: "url" }),
        defineField({ name: "email", title: "Email", type: "email" }),
      ],
    }),
    ...localizedStringFields("seoTitle", "SEO Title"),
    ...localizedTextFields("seoDescription", "SEO Description"),
  ],
  preview: {
    select: {
      title: "title_en",
      subtitle: "status",
      media: "mainImage",
    },
  },
});
