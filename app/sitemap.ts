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
  hostListQuery,
  propertyListingListQuery,
  providerListQuery,
} from "@/sanity/lib/queries";
import {
  interpreterAlternates,
  interpreterCities,
  interpreterHubAlternates,
  interpreterHubPaths,
} from "@/app/lib/interpreterPages";

type SitemapProvider = {
  _updatedAt?: string;
  slug?: {
    current?: string;
  };
};

type SitemapPropertyListing = {
  _updatedAt?: string;
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

type SitemapHost = {
  _updatedAt?: string;
  slug?: {
    current?: string;
  };
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
  };
}

function contentEntry(path: string, updatedAt?: string) {
  const hasValidUpdatedAt = updatedAt && !Number.isNaN(Date.parse(updatedAt));

  return {
    ...staticEntry(path),
    ...(hasValidUpdatedAt ? { lastModified: updatedAt } : {}),
  };
}

function languageAlternates(languages: Record<string, string>) {
  return {
    ...languages,
    "x-default": languages.en || Object.values(languages)[0],
  };
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [providers, hosts, propertyListings, cityGuides] = await Promise.all([
    client.fetch<SitemapProvider[]>(providerListQuery),
    client.fetch<SitemapHost[]>(hostListQuery),
    client.fetch<SitemapPropertyListing[]>(propertyListingListQuery),
    client.fetch<SitemapCityGuide[]>(cityGuideListQuery),
  ]);

  const providerEntries = providers.flatMap((provider) => {
    const slug = provider.slug?.current;
    if (!slug) return [];

    return [
      contentEntry(`/providers/${slug}`, provider._updatedAt),
      contentEntry(`/pt/profissionais/${slug}`, provider._updatedAt),
      contentEntry(`/nl/professionals/${slug}`, provider._updatedAt),
    ];
  });

  const hostEntries = hosts.flatMap((host) => {
    const slug = host.slug?.current;
    if (!slug || slug === "armijn") return [];

    return [
      contentEntry(`/hosts/${slug}`, host._updatedAt),
      contentEntry(`/pt/hosts/${slug}`, host._updatedAt),
      contentEntry(`/nl/hosts/${slug}`, host._updatedAt),
    ];
  });

  const propertyEntries = propertyListings.flatMap((listing) => {
    const listingSlug = listing.slug?.current;
    const citySlug = listing.city?.slug?.current || citySlugFromName(listing.cityName);
    if (!listingSlug || !citySlug) return [];

    return [
      contentEntry(
        `/real-estate/${citySlug}/${listingSlug}`,
        listing._updatedAt,
      ),
      contentEntry(`/pt/imoveis/${citySlug}/${listingSlug}`, listing._updatedAt),
      contentEntry(`/nl/vastgoed/${citySlug}/${listingSlug}`, listing._updatedAt),
    ];
  });

  const cityGuideEntries = cityGuides.flatMap((city) => {
    const citySlug = city.slug?.current;
    if (!citySlug || !cityGuideIsPublic(city)) return [];

    const alternates = languageAlternates(
      Object.fromEntries(
        cityGuideEnabledLanguages(city).map((language) => [
          language,
          `${siteUrl}${cityGuidePath(language, citySlug)}`,
        ]),
      ),
    );

    return cityGuideEnabledLanguages(city).map((language) =>
      ({
        ...contentEntry(cityGuidePath(language, citySlug), city._updatedAt),
        alternates: { languages: alternates },
      }),
    );
  });

  const interpreterEntries = Object.values(interpreterCities).flatMap((city) =>
    city.languages.flatMap((language) => {
      const path = city.paths[language];
      if (!path) return [];

      return [{
        url: `${siteUrl}${path}`,
        alternates: { languages: interpreterAlternates(city) },
      }];
    }),
  );

  const interpreterHubEntries = Object.values(interpreterHubPaths).map((path) => ({
    url: `${siteUrl}${path}`,
    alternates: { languages: interpreterHubAlternates() },
  }));

  return [
    /* ======================================================
       HOME
    ====================================================== */

    {
      url: "https://homeinthe.city",
    },

    {
      url: "https://homeinthe.city/pt",
    },

    {
      url: "https://homeinthe.city/nl",
    },

    /* ======================================================
       INTERPRETER PAGES
    ====================================================== */

    ...interpreterHubEntries,
    ...interpreterEntries,

    /* ======================================================
       TRANSLATION PAGES
    ====================================================== */

    {
      url: "https://homeinthe.city/translation-services",
    },

    {
      url: "https://homeinthe.city/pt/servicos-de-traducao",
    },

    {
      url: "https://homeinthe.city/nl/vertaaldiensten",
    },

    /* ======================================================
       REAL ESTATE PAGES
    ====================================================== */

    {
      url: "https://homeinthe.city/real-estate",
    },

    {
      url: "https://homeinthe.city/real-estate/porto-alegre",
    },

    {
      url: "https://homeinthe.city/real-estate/florianopolis",
    },

    {
      url: "https://homeinthe.city/pt/imoveis",
    },

    {
      url: "https://homeinthe.city/pt/imoveis/porto-alegre",
    },

    {
      url: "https://homeinthe.city/pt/imoveis/florianopolis",
    },

    {
      url: "https://homeinthe.city/nl/vastgoed",
    },

    {
      url: "https://homeinthe.city/nl/vastgoed/porto-alegre",
    },

    {
      url: "https://homeinthe.city/nl/vastgoed/florianopolis",
    },

    ...hostEntries,
    ...providerEntries,
    ...cityGuideEntries,
    ...propertyEntries,
  ];
}
