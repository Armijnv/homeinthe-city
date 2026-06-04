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
   PROVIDER QUERY
====================================================== */

export const providerQuery = `
  *[_type == "provider" && slug.current == $slug && status == "published"][0]{
    name,
    slug,
    status,
    roles,
    primaryRole,

    cities[]->{
      name_en,
      name_pt,
      name_nl
    },

    languages[]{
      language,
      level,
      services
    },

    headline_en,
    headline_pt,
    headline_nl,

    intro_en,
    intro_pt,
    intro_nl,

    about_en,
    about_pt,
    about_nl,

    contactOptions{
      email,
      phone,
      whatsapp,
      website,
      preferredContact
    },

    mainPhoto{
      alt,
      asset->{
        url
      }
    },

    verificationStatus
  }
`;

export const providerListQuery = `
  *[_type == "provider" && status == "published"] | order(name asc){
    name,
    slug,
    roles,
    primaryRole,

    cities[]->{
      name_en,
      name_pt,
      name_nl
    },

    languages[]{
      language,
      level,
      services
    },

    headline_en,
    headline_pt,
    headline_nl,

    intro_en,
    intro_pt,
    intro_nl,

    mainPhoto{
      alt,
      asset->{
        url
      }
    },

    verificationStatus
  }
`;

/* ======================================================
   PROPERTY LISTING QUERY
====================================================== */

export const propertyListingQuery = `
  *[
    _type == "propertyListing" &&
    slug.current == $listingSlug &&
    status in ["available", "reserved", "sold", "rented"] &&
    (
      city->slug.current == $citySlug ||
      cityName == $citySlug
    )
  ][0]{
    title_en,
    title_pt,
    title_nl,
    slug,
    listingType,
    status,
    city->{
      name_en,
      name_pt,
      name_nl,
      slug
    },
    cityName,
    neighborhood,
    addressVisibility,
    address,
    price,
    currency,
    monthlyCondoFee,
    propertyTax,
    bedrooms,
    bathrooms,
    parkingSpaces,
    areaM2,
    floor,
    furnished,
    shortDescription_en,
    shortDescription_pt,
    shortDescription_nl,
    longDescription_en,
    longDescription_pt,
    longDescription_nl,
    features_en,
    features_pt,
    features_nl,
    mainImage{
      alt,
      asset->{
        url
      }
    },
    gallery[]{
      alt,
      asset->{
        url
      }
    },
    mapCoordinates,
    linkedRealtor->{
      name,
      slug,
      primaryRole,
      headline_en,
      headline_pt,
      headline_nl,
      contactOptions{
        email,
        phone,
        whatsapp,
        website,
        preferredContact
      },
      mainPhoto{
        alt,
        asset->{
          url
        }
      },
      verificationStatus
    },
    contact{
      whatsapp,
      email
    },
    seoTitle_en,
    seoTitle_pt,
    seoTitle_nl,
    seoDescription_en,
    seoDescription_pt,
    seoDescription_nl
  }
`;

export const propertyListingListQuery = `
  *[
    _type == "propertyListing" &&
    status in ["available", "reserved", "sold", "rented"]
  ] | order(_createdAt desc){
    title_en,
    title_pt,
    title_nl,
    slug,
    listingType,
    status,
    city->{
      name_en,
      name_pt,
      name_nl,
      slug
    },
    cityName,
    neighborhood,
    price,
    currency,
    bedrooms,
    bathrooms,
    parkingSpaces,
    areaM2,
    shortDescription_en,
    shortDescription_pt,
    shortDescription_nl,
    mainImage{
      alt,
      asset->{
        url
      }
    },
    linkedRealtor->{
      name,
      slug
    }
  }
`;

export const propertyListingsByCityQuery = `
  *[
    _type == "propertyListing" &&
    status in ["available", "reserved", "sold", "rented"] &&
    (
      city->slug.current == $citySlug ||
      cityName in $cityNames
    )
  ] | order(_createdAt desc){
    title_en,
    title_pt,
    title_nl,
    slug,
    listingType,
    status,
    city->{
      name_en,
      name_pt,
      name_nl,
      slug
    },
    cityName,
    neighborhood,
    price,
    currency,
    bedrooms,
    bathrooms,
    parkingSpaces,
    areaM2,
    shortDescription_en,
    shortDescription_pt,
    shortDescription_nl,
    mainImage{
      alt,
      asset->{
        url
      }
    },
    linkedRealtor->{
      name,
      slug
    }
  }
`;

export const realtorProviderQuery = `
  *[
    _type == "provider" &&
    status == "published" &&
    "realtor" in roles
  ] | order(name asc)[0]{
    name,
    slug,
    headline_en,
    headline_pt,
    headline_nl,
    mainPhoto{
      alt,
      asset->{
        url
      }
    }
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
