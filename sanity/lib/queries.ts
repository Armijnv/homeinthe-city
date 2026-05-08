export const cityQuery = `
  *[_type == "city" && slug.current == $slug][0]{
    name_en,
    name_pt,
    name_nl,

    headline_en,
    headline_pt,
    headline_nl,

    intro_en,
    intro_pt,
    intro_nl,

    introBlocks_en,
    introBlocks_pt,
    introBlocks_nl,

           mapPlaces[]{
      name,
      category,
      description_en,
      description_pt,
      description_nl,
      latitude,
      longitude,
      detail_en,
detail_pt,
detail_nl,
      googleMaps,
      website,
      favorite,
      image{
        asset->{
          url
        }
      }
    },

    cta_en,
    cta_pt,
    cta_nl,

    restaurants[]{
      name,
      note_en,
      note_pt,
      note_nl,
      favorite,
      link
    },

    venues[]{
      name,
      text_en,
      text_pt,
      text_nl,
      link,
      image{
        asset->{
          url
        }
      }
    },

    museums[]{
      title,
      dates_en,
      dates_pt,
      dates_nl,
      description_en,
      description_pt,
      description_nl,
      link,
      image{
        asset->{
          url
        }
      }
    }
  }
`;

export const hostQuery = `
  *[_type == "host" && slug.current == $slug][0]{
    name,

    eyebrow_en,
    eyebrow_pt,
    eyebrow_nl,

    headline_en,
    headline_pt,
    headline_nl,

    intro_en,
    intro_pt,
    intro_nl,

    servicesTitle_en,
    servicesTitle_pt,
    servicesTitle_nl,

    aboutTitle_en,
    aboutTitle_pt,
    aboutTitle_nl,

    about_en,
    about_pt,
    about_nl,

    whatsapp,
    email,

    photo{
      asset->{
        url
      }
    },

    services[]{
      title_en,
      title_pt,
      title_nl,

      description_en,
      description_pt,
      description_nl
    }
  }
`;