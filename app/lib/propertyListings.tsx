import type { Metadata } from "next";
import {
  buildPropertyStructuredData,
  listingUrl,
  localizedListingText,
  type Lang,
  type PropertyListing,
} from "@/app/components/PropertyListingPage";
import { cleanMetadataTitle } from "@/app/lib/metadataTitle";

export const siteUrl = "https://homeinthe.city";

export const ogLocale: Record<Lang, string> = {
  en: "en_US",
  pt: "pt_BR",
  nl: "nl_NL",
};

export function listingAlternates(citySlug: string, listingSlug: string) {
  return {
    en: `${siteUrl}${listingUrl("en", citySlug, listingSlug)}`,
    pt: `${siteUrl}${listingUrl("pt", citySlug, listingSlug)}`,
    nl: `${siteUrl}${listingUrl("nl", citySlug, listingSlug)}`,
  };
}

export function propertyListingMetadata({
  listing,
  lang,
  citySlug,
  listingSlug,
}: {
  listing: PropertyListing | null;
  lang: Lang;
  citySlug: string;
  listingSlug: string;
}): Metadata {
  const title =
    cleanMetadataTitle(
      (listing && localizedListingText(listing, "seoTitle", lang)) ||
        (listing && localizedListingText(listing, "title", lang)),
    ) ||
    "Property listing";
  const description =
    (listing && localizedListingText(listing, "seoDescription", lang)) ||
    (listing && localizedListingText(listing, "shortDescription", lang)) ||
    "Premium real estate listing from Home in the City.";
  const url = `${siteUrl}${listingUrl(lang, citySlug, listingSlug)}`;
  const alternates = listingAlternates(citySlug, listingSlug);

  return {
    title,
    description,
    alternates: {
      canonical: url,
      languages: alternates,
    },
    openGraph: {
      title,
      description,
      url,
      siteName: "Home in the City",
      images: [
        {
          url: listing?.mainImage?.asset?.url || "/og-armijn2.jpg",
          width: 1200,
          height: 630,
        },
      ],
      locale: ogLocale[lang],
      type: "website",
    },
  };
}

export function PropertyListingJsonLd({
  listing,
  lang,
  citySlug,
  listingSlug,
}: {
  listing: PropertyListing;
  lang: Lang;
  citySlug: string;
  listingSlug: string;
}) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(
          buildPropertyStructuredData({ listing, lang, citySlug, listingSlug }),
        ),
      }}
    />
  );
}
