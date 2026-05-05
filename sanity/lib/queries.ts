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