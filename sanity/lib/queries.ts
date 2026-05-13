/* ======================================================
   CITY QUERY
====================================================== */

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
      neighborhood,
      description_en,
      description_pt,
      description_nl,
      detail_en,
      detail_pt,
      detail_nl,
      latitude,
      longitude,
      googleMaps,
      website,
      favorite,
      image{
        asset->{
          url
        }
      },
      video{
        asset->{
          url
        }
      }
    },

    sidebarCards[]{
      title_en,
      title_pt,
      title_nl,

      text_en,
      text_pt,
      text_nl,

      button_en,
      button_pt,
      button_nl,

      href_en,
      href_pt,
      href_nl
    },

    cta_en,
    cta_pt,
    cta_nl
  }
`;

/* ======================================================
   SERVICE PAGE QUERY
====================================================== */

export const servicePageQuery = `
  *[_type == "servicePage" && slug.current == $slug][0]{
    name,
    slug,

    seoTitle_en,
    seoTitle_pt,
    seoTitle_nl,

    seoDescription_en,
    seoDescription_pt,
    seoDescription_nl,

    eyebrow_en,
    eyebrow_pt,
    eyebrow_nl,

    title_en,
    title_pt,
    title_nl,

    intro_en,
    intro_pt,
    intro_nl,

    sections[]{
      title_en,
      title_pt,
      title_nl,
      text_en,
      text_pt,
      text_nl
    },

    pricingTitle_en,
    pricingTitle_pt,
    pricingTitle_nl,

    pricingItems[]{
      label_en,
      label_pt,
      label_nl,
      detail_en,
      detail_pt,
      detail_nl
    },

    ctaTitle_en,
    ctaTitle_pt,
    ctaTitle_nl,

    ctaText_en,
    ctaText_pt,
    ctaText_nl,

    button_en,
    button_pt,
    button_nl
  }
`;

/* ======================================================
   HOST QUERY
====================================================== */

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
    about_pt,
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
