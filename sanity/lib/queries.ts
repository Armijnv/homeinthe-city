/* ======================================================
   CITY QUERY
====================================================== */

const cityGuideProjection = `
    _updatedAt,
    name_en,
    name_pt,
    name_nl,
    slug,
    guideStatus,
    enabledLanguages,
    latitude,
    longitude,
    country,

    "hasInterpreterCoverage": count(*[
      _type == "provider" &&
      status == "published" &&
      (primaryRole == "interpreter" || "interpreter" in roles) &&
      ^._id in cities[]._ref
    ]) > 0,

    heroImage{
      alt,
      asset->{
        url
      }
    },
    cityPageBackgroundMode,

    primaryHost->{
      name,
      slug,
      status,
      roles,
      primaryRole,
      languages[]{
        language
      },

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
      }
    },

    headline_en,
    headline_pt,
    headline_nl,

    intro_en,
    intro_pt,
    intro_nl,

    introBlocks_en,
    introBlocks_pt,
    introBlocks_nl,
    cityPageExperience{
      ...,
      livingServices{
        ...,
        interpreter{
          ...,
          image{
            ...,
            asset->{
              "_type": "reference",
              "_ref": _id,
              url
            }
          }
        },
        realEstate{
          ...,
          image{
            ...,
            asset->{
              "_type": "reference",
              "_ref": _id,
              url
            }
          }
        }
      }
    },

    mapPlaces[]{
      _key,
      name_en,
      name_pt,
      name_nl,
      categoryPreset,
      categoryLabel_en,
      categoryLabel_pt,
      categoryLabel_nl,
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
        alt,
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

    recommendationGuides[]{
      _key,
      title_en,
      title_pt,
      title_nl,
      introduction_en,
      introduction_pt,
      introduction_nl,
      content_en,
      content_pt,
      content_nl,
      recommendationType,
      customCategory_en,
      customCategory_pt,
      customCategory_nl,
      relatedMapPlaceKeys,
      featuredImage{
        alt,
        asset->{url}
      },
      relatedProvider->{
        name,
        slug,
        status,
        roles,
        primaryRole,
        languages[]{language},
        mainPhoto{
          alt,
          asset->{url}
        }
      },
      relatedCity->{
        name_en,
        name_pt,
        name_nl,
        slug
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

    informationCards[]{
      _key,
      section,
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
      href_nl,
      image{
        alt,
        asset->{url}
      }
    },

    cta_en,
    cta_pt,
    cta_nl
`;

export const cityQuery = `
  *[_type == "city" && slug.current == $slug][0]{
${cityGuideProjection}
  }
`;

export const cityGuideListQuery = `
  *[
    _type == "city" &&
    defined(slug.current) &&
    coalesce(guideStatus, "live") != "hidden"
  ] | order(name_en asc){
${cityGuideProjection}
  }
`;

export const cityNavigationQuery = `
  *[
    _type == "city" &&
    defined(slug.current) &&
    coalesce(guideStatus, "live") != "hidden"
  ] | order(name_en asc){
    name_en,
    name_pt,
    name_nl,
    enabledLanguages,
    slug,
    guideStatus,
    headline_en,
    headline_pt,
    headline_nl,
    intro_en,
    intro_pt,
    intro_nl,
    introBlocks_en,
    introBlocks_pt,
    introBlocks_nl,
    mapPlaces[]{_key},
    recommendationGuides[]{_key},
    sidebarCards[]{_key},
    informationCards[]{_key},
    "hasInterpreterCoverage": count(*[
      _type == "provider" &&
      status == "published" &&
      (primaryRole == "interpreter" || "interpreter" in roles) &&
      ^._id in cities[]._ref
    ]) > 0,
    primaryHost->{
      status,
      languages[]{language}
    }
  }
`;

/* ======================================================
   SERVICE PAGE QUERY
====================================================== */

export const servicePageQuery = `
  *[_type == "servicePage" && slug.current == $slug][0]{
    _id,
    _rev,
    name,
    slug,
    kind,
    city->{
      _id,
      name_en,
      name_pt,
      name_nl,
      slug
    },

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
      _key,
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
      _key,
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

export const cityInterpreterCoverageQuery = `
  *[
    _type == "city" &&
    defined(slug.current) &&
    coalesce(guideStatus, "live") != "hidden" &&
    count(*[
      _type == "provider" &&
      status == "published" &&
      (primaryRole == "interpreter" || "interpreter" in roles) &&
      ^._id in cities[]._ref
    ]) > 0
  ] | order(name_en asc){
    _id,
    _updatedAt,
    name_en,
    name_pt,
    name_nl,
    slug,
    country,
    primaryHost->{
      _id,
      name,
      slug,
      status,
      roles,
      primaryRole
    },
    "interpreters": *[
      _type == "provider" &&
      status == "published" &&
      (primaryRole == "interpreter" || "interpreter" in roles) &&
      ^._id in cities[]._ref
    ] | order(name asc){
      _id,
      name,
      slug,
      roles,
      primaryRole,
      languages[]{language, services},
      mainPhoto{alt, asset->{url}}
    },
    "servicePage": *[
      _type == "servicePage" &&
      (
        (kind == "cityInterpreter" && city._ref == ^._id) ||
        slug.current == "interpreter-" + ^.slug.current
      )
    ] | order(kind desc)[0]{
      _id,
      _updatedAt,
      slug
    }
  }
`;

export const cityInterpreterCoverageBySlugQuery = `
  *[_type == "city" && slug.current == $citySlug][0]{
    _id,
    _updatedAt,
    name_en,
    name_pt,
    name_nl,
    slug,
    country,
    primaryHost->{_id, name, slug, status, roles, primaryRole},
    "interpreters": *[
      _type == "provider" &&
      status == "published" &&
      (primaryRole == "interpreter" || "interpreter" in roles) &&
      ^._id in cities[]._ref
    ] | order(name asc){
      _id, name, slug, roles, primaryRole,
      languages[]{language, services},
      mainPhoto{alt, asset->{url}}
    },
    "servicePage": *[
      _type == "servicePage" &&
      (
        (kind == "cityInterpreter" && city._ref == ^._id) ||
        slug.current == "interpreter-" + ^.slug.current
      )
    ] | order(kind desc)[0]{_id, _rev, _updatedAt, slug}
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

    servicesTitle_en,
    servicesTitle_pt,
    servicesTitle_nl,

    services[]{
      _key,
      roles,
      title_en,
      title_pt,
      title_nl,
      description_en,
      description_pt,
      description_nl
    },

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
    _updatedAt,
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

export const providerLanguageNavigationQuery = `
  *[
    _type == "provider" &&
    status == "published" &&
    defined(slug.current)
  ]{
    "slug": slug.current,
    languages[]{language}
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
      slug,
      country
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
    minimumStay,
    maximumGuests,
    utilitiesIncluded,
    internetIncluded,
    cleaningIncluded,
    availableFrom,
    petsAllowed,
    financingPossible,
    occupancyStatus,
    yearBuilt,
    shortDescription_en,
    shortDescription_pt,
    shortDescription_nl,
    longDescription_en,
    longDescription_pt,
    longDescription_nl,
    features_en,
    features_pt,
    features_nl,
    buildingAmenities,
    apartmentAmenities,
    parkingAmenities,
    lifestyleAmenities,
    neighborhoodDescription_en,
    neighborhoodDescription_pt,
    neighborhoodDescription_nl,
    nearbyHighlights_en,
    nearbyHighlights_pt,
    nearbyHighlights_nl,
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
    videoUrl,
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
    _updatedAt,
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

export const propertyListingNavigationQuery = `
  *[
    _type == "propertyListing" &&
    status in ["available", "reserved", "sold", "rented"]
  ]{
    city->{name_en, name_pt, name_nl, slug},
    cityName
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

export const cityMapPropertyListingsQuery = `
  *[
    _type == "propertyListing" &&
    status in ["available", "reserved", "sold", "rented"] &&
    defined(slug.current) &&
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
    mapCoordinates
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
