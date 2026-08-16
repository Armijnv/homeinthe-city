import type { ReactNode } from "react";

export const siteUrl = "https://homeinthe.city";
export const organizationId = `${siteUrl}/#organization`;
export const websiteId = `${siteUrl}/#website`;

export const organizationRef = {
  "@type": "Organization",
  "@id": organizationId,
  name: "Home in the City",
  url: siteUrl,
};

export function JsonLdScript({ data }: { data: unknown }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(data).replace(/</g, "\\u003c"),
      }}
    />
  );
}

export function compactJsonLd<T>(value: T): T {
  if (Array.isArray(value)) {
    return value
      .map((item) => compactJsonLd(item))
      .filter((item) => item !== undefined && item !== null && item !== "") as T;
  }

  if (value && typeof value === "object") {
    return Object.fromEntries(
      Object.entries(value)
        .map(([key, item]) => [key, compactJsonLd(item)])
        .filter(([, item]) => item !== undefined && item !== null && item !== ""),
    ) as T;
  }

  return value;
}

type CityGuideJsonLdInput = {
  url: string;
  name: string;
  cityName: string;
  description?: string;
  inLanguage: string;
  administrativeRegion?: string;
  country?: string | null;
};

export function cityGuideJsonLd({
  url,
  name,
  cityName,
  description,
  inLanguage,
  administrativeRegion,
  country,
}: CityGuideJsonLdInput) {
  const destinationId = `${url}#destination`;

  return compactJsonLd({
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "TouristDestination",
        "@id": destinationId,
        name: cityName,
        description,
        url,
        inLanguage,
        containedInPlace: country
          ? {
              "@type": "Country",
              name: country,
            }
          : undefined,
        provider: organizationRef,
      },
      {
        "@type": "City",
        "@id": `${url}#city`,
        name: cityName,
        addressCountry: country,
        containedInPlace: administrativeRegion
          ? {
              "@type": "AdministrativeArea",
              name: administrativeRegion,
            }
          : undefined,
      },
      {
        "@type": "WebPage",
        "@id": `${url}#webpage`,
        name,
        description,
        url,
        inLanguage,
        isPartOf: {
          "@id": websiteId,
        },
        about: {
          "@id": destinationId,
        },
        publisher: {
          "@id": organizationId,
        },
      },
    ],
  });
}

type ServiceJsonLdInput = {
  url: string;
  serviceId?: string;
  name: string;
  description: string;
  serviceType: string | string[];
  areaServed?: unknown;
  availableLanguage?: string[];
  image?: string;
  inLanguage?: string;
};

export function serviceJsonLd({
  url,
  serviceId = `${url}#service`,
  name,
  description,
  serviceType,
  areaServed,
  availableLanguage,
  image,
  inLanguage,
}: ServiceJsonLdInput) {
  return compactJsonLd({
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Service",
        "@id": serviceId,
        name,
        description,
        url,
        image,
        serviceType,
        areaServed,
        availableLanguage,
        provider: {
          "@id": organizationId,
        },
      },
      {
        "@type": "WebPage",
        "@id": `${url}#webpage`,
        name,
        description,
        url,
        inLanguage,
        isPartOf: {
          "@id": websiteId,
        },
        about: {
          "@id": serviceId,
        },
        publisher: {
          "@id": organizationId,
        },
      },
    ],
  });
}

type PersonJsonLdInput = {
  url: string;
  name?: string;
  role?: string;
  roles?: string[];
  languages?: string[];
  cities?: string[];
  image?: string;
  description?: string;
  inLanguage?: string;
};

export function personJsonLd({
  url,
  name,
  role,
  roles,
  languages,
  cities,
  image,
  description,
  inLanguage,
}: PersonJsonLdInput) {
  const personId = `${url}#person`;

  return compactJsonLd({
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Person",
        "@id": personId,
        name,
        jobTitle: role,
        hasOccupation: roles?.map((roleName) => ({
          "@type": "Occupation",
          name: roleName,
        })),
        knowsLanguage: languages,
        workLocation: cities?.map((cityName) => ({
          "@type": "City",
          name: cityName,
        })),
        worksFor: {
          "@id": organizationId,
        },
        affiliation: {
          "@id": organizationId,
        },
        url,
        image,
        description,
      },
      {
        "@type": "ProfilePage",
        "@id": `${url}#webpage`,
        name: name ? `${name} | Home in the City` : undefined,
        description,
        url,
        inLanguage,
        isPartOf: {
          "@id": websiteId,
        },
        about: {
          "@id": personId,
        },
        mainEntity: {
          "@id": personId,
        },
        publisher: {
          "@id": organizationId,
        },
      },
    ],
  });
}

export function renderJsonLd(data: unknown): ReactNode {
  return <JsonLdScript data={data} />;
}
