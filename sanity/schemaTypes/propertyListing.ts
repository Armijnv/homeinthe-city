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

const buildingAmenityOptions = [
  { title: "Elevator", value: "elevator" },
  { title: "24h security", value: "security24h" },
  { title: "Concierge", value: "concierge" },
  { title: "Gym", value: "gym" },
  { title: "Pool", value: "pool" },
  { title: "Party room", value: "partyRoom" },
  { title: "Coworking space", value: "coworkingSpace" },
];

const apartmentAmenityOptions = [
  { title: "Air conditioning", value: "airConditioning" },
  { title: "High-speed internet", value: "highSpeedInternet" },
  { title: "Balcony", value: "balcony" },
  { title: "BBQ / churrasqueira", value: "bbq" },
  { title: "Washer", value: "washer" },
  { title: "Dryer", value: "dryer" },
  { title: "Dishwasher", value: "dishwasher" },
  { title: "Home office", value: "homeOffice" },
  { title: "Smart TV", value: "smartTv" },
  { title: "Fully equipped kitchen", value: "fullyEquippedKitchen" },
];

const parkingAmenityOptions = [
  { title: "Parking space", value: "parkingSpace" },
  { title: "Covered parking", value: "coveredParking" },
  { title: "Visitor parking", value: "visitorParking" },
];

const lifestyleAmenityOptions = [
  { title: "Park view", value: "parkView" },
  { title: "City view", value: "cityView" },
  { title: "Pet friendly", value: "petFriendly" },
  { title: "Family friendly", value: "familyFriendly" },
  { title: "Quiet street", value: "quietStreet" },
  { title: "Walkable neighborhood", value: "walkableNeighborhood" },
];

const amenityField = (
  name: string,
  title: string,
  options: Array<{ title: string; value: string }>,
) =>
  defineField({
    name,
    title,
    type: "array",
    of: [{ type: "string" }],
    options: { list: options },
  });

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
          { title: "Archived", value: "archived" },
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
    defineField({
      name: "minimumStay",
      title: "Minimum Stay",
      type: "string",
      hidden: ({ document }) => document?.listingType !== "rent",
    }),
    defineField({
      name: "maximumGuests",
      title: "Maximum Guests",
      type: "number",
      hidden: ({ document }) => document?.listingType !== "rent",
    }),
    defineField({
      name: "utilitiesIncluded",
      title: "Utilities Included",
      type: "boolean",
      hidden: ({ document }) => document?.listingType !== "rent",
    }),
    defineField({
      name: "internetIncluded",
      title: "Internet Included",
      type: "boolean",
      hidden: ({ document }) => document?.listingType !== "rent",
    }),
    defineField({
      name: "cleaningIncluded",
      title: "Cleaning Included",
      type: "boolean",
      hidden: ({ document }) => document?.listingType !== "rent",
    }),
    defineField({
      name: "availableFrom",
      title: "Available From",
      type: "date",
      hidden: ({ document }) => document?.listingType !== "rent",
    }),
    defineField({
      name: "petsAllowed",
      title: "Pets Allowed",
      type: "boolean",
      hidden: ({ document }) => document?.listingType !== "rent",
    }),
    defineField({
      name: "financingPossible",
      title: "Financing Possible",
      type: "boolean",
      hidden: ({ document }) => document?.listingType !== "sale",
    }),
    defineField({
      name: "occupancyStatus",
      title: "Occupancy Status",
      type: "string",
      options: {
        list: [
          { title: "Vacant", value: "vacant" },
          { title: "Occupied", value: "occupied" },
        ],
      },
      hidden: ({ document }) => document?.listingType !== "sale",
    }),
    defineField({
      name: "yearBuilt",
      title: "Year Built",
      type: "number",
      hidden: ({ document }) => document?.listingType !== "sale",
    }),
    ...localizedTextFields("shortDescription", "Short Description"),
    ...localizedTextFields("longDescription", "Long Description"),
    ...localizedListFields("features", "Features"),
    amenityField("buildingAmenities", "Building Amenities", buildingAmenityOptions),
    amenityField("apartmentAmenities", "Apartment Amenities", apartmentAmenityOptions),
    amenityField("parkingAmenities", "Parking Amenities", parkingAmenityOptions),
    amenityField("lifestyleAmenities", "Lifestyle / Comfort Amenities", lifestyleAmenityOptions),
    ...localizedTextFields("neighborhoodDescription", "Neighborhood Description"),
    ...localizedListFields("nearbyHighlights", "Nearby Highlights"),
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
      name: "videoUrl",
      title: "Video URL",
      type: "url",
      description: "Optional YouTube, Vimeo, or hosted video tour URL.",
    }),
    defineField({
      name: "linkedRealtor",
      title: "Linked Realtor / Provider",
      type: "reference",
      to: [{ type: "provider" }],
      description:
        "Authoritative dashboard owner. Real-estate Providers may edit only listings linked to their own Provider document.",
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
