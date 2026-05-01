import {defineType, defineField} from 'sanity'

export const city = defineType({
  name: 'city',
  title: 'City',
  type: 'document',
  fields: [
    defineField({ name: 'name_en', title: 'Name (English)', type: 'string' }),
    defineField({ name: 'name_pt', title: 'Name (Portuguese)', type: 'string' }),

    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: { source: 'name_en', maxLength: 96 },
    }),

    // HEADLINE
    defineField({
      name: 'headline_en',
      title: 'Headline (English)',
      type: 'string',
    }),
    defineField({
      name: 'headline_pt',
      title: 'Headline (Portuguese)',
      type: 'string',
    }),

    // INTRO
    defineField({ name: 'intro_en', title: 'Intro (English)', type: 'text' }),
    defineField({ name: 'intro_pt', title: 'Intro (Portuguese)', type: 'text' }),

    // CALL TO ACTION
    defineField({
      name: 'cta_en',
      title: 'CTA Text (English)',
      type: 'string',
    }),
    defineField({
      name: 'cta_pt',
      title: 'CTA Text (Portuguese)',
      type: 'string',
    }),
  ],
})