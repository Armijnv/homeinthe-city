import type { MetadataRoute } from "next";
import { client } from "@/sanity/lib/client";
import {
  cityGuideEnabledLanguages,
  cityGuideIsPublic,
  cityGuidePath,
  type CityGuideContent,
} from "@/app/lib/cityGuides";
import {
  cityGuideListQuery,
  propertyListingListQuery,
  providerListQuery,
} from "@/sanity/lib/queries";

type SitemapProvider = {
  slug?: {
    current?: string;
  };
};

type SitemapPropertyListing = {
  slug?: {
    current?: string;
  };
  city?: {
    slug?: {
      current?: string;
    };
  };
  cityName?: string;
};

type SitemapCityGuide = CityGuideContent;

const siteUrl = "https://homeinthe.city";

function citySlugFromName(cityName?: string) {
  return cityName
    ?.normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function staticEntry(path = "") {
  return {
    url: `${siteUrl}${path}`,
    lastModified: new Date(),
  };
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [providers, propertyListings, cityGuides] = await Promise.all([
    client.fetch<SitemapProvider[]>(providerListQuery),
    client.fetch<SitemapPropertyListing[]>(propertyListingListQuery),
    client.fetch<SitemapCityGuide[]>(cityGuideListQuery),
  ]);

  const providerEntries = providers.flatMap((provider) => {
    const slug = provider.slug?.current;
    if (!slug) return [];

    return [
      staticEntry(`/providers/${slug}`),
      staticEntry(`/pt/profissionais/${slug}`),
      staticEntry(`/nl/professionals/${slug}`),
    ];
  });

  const propertyEntries = propertyListings.flatMap((listing) => {
    const listingSlug = listing.slug?.current;
    const citySlug = listing.city?.slug?.current || citySlugFromName(listing.cityName);
    if (!listingSlug || !citySlug) return [];

    return [
      staticEntry(`/real-estate/${citySlug}/${listingSlug}`),
      staticEntry(`/pt/imoveis/${citySlug}/${listingSlug}`),
      staticEntry(`/nl/vastgoed/${citySlug}/${listingSlug}`),
    ];
  });

  const cityGuideEntries = cityGuides.flatMap((city) => {
    const citySlug = city.slug?.current;
    if (!citySlug || !cityGuideIsPublic(city)) return [];

    return cityGuideEnabledLanguages(city).map((language) =>
      staticEntry(cityGuidePath(language, citySlug)),
    );
  });

  return [
    /* ======================================================
       HOME
    ====================================================== */

    {
      url: "https://homeinthe.city",
      lastModified: new Date(),
    },

    {
      url: "https://homeinthe.city/pt",
      lastModified: new Date(),
    },

    {
      url: "https://homeinthe.city/nl",
      lastModified: new Date(),
    },

    /* ======================================================
       INTERPRETER PAGES
    ====================================================== */

    {
      url: "https://homeinthe.city/interpreter-porto-alegre",
      lastModified: new Date(),
    },

    {
      url: "https://homeinthe.city/pt/interprete-porto-alegre",
      lastModified: new Date(),
    },

    {
      url: "https://homeinthe.city/nl/tolk-porto-alegre",
      lastModified: new Date(),
    },

    /* ======================================================
       TRANSLATION PAGES
    ====================================================== */

    {
      url: "https://homeinthe.city/translation-services",
      lastModified: new Date(),
    },

    {
      url: "https://homeinthe.city/pt/servicos-de-traducao",
      lastModified: new Date(),
    },

    {
      url: "https://homeinthe.city/nl/vertaaldiensten",
      lastModified: new Date(),
    },

    /* ======================================================
       REAL ESTATE PAGES
    ====================================================== */

    {
      url: "https://homeinthe.city/real-estate",
      lastModified: new Date(),
    },

    {
      url: "https://homeinthe.city/real-estate/porto-alegre",
      lastModified: new Date(),
    },

    {
      url: "https://homeinthe.city/real-estate/florianopolis",
      lastModified: new Date(),
    },

    {
      url: "https://homeinthe.city/pt/imoveis",
      lastModified: new Date(),
    },

    {
      url: "https://homeinthe.city/pt/imoveis/porto-alegre",
      lastModified: new Date(),
    },

    {
      url: "https://homeinthe.city/pt/imoveis/florianopolis",
      lastModified: new Date(),
    },

    {
      url: "https://homeinthe.city/nl/vastgoed",
      lastModified: new Date(),
    },

    {
      url: "https://homeinthe.city/nl/vastgoed/porto-alegre",
      lastModified: new Date(),
    },

    {
      url: "https://homeinthe.city/nl/vastgoed/florianopolis",
      lastModified: new Date(),
    },

    /* ======================================================
       HOST PAGE
    ====================================================== */

    {
      url: "https://homeinthe.city/hosts/armijn",
      lastModified: new Date(),
    },

    {
      url: "https://homeinthe.city/pt/hosts/armijn",
      lastModified: new Date(),
    },

    {
      url: "https://homeinthe.city/nl/hosts/armijn",
      lastModified: new Date(),
    },

    ...providerEntries,
    ...cityGuideEntries,
    ...propertyEntries,
  ];
}
