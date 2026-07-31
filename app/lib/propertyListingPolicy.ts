export type PropertyProvider = {
  _id: string;
  roles?: string[];
  primaryRole?: string;
};

export type OwnedPropertyListing = {
  _id?: string;
  linkedRealtor?: {
    _ref?: string;
  };
};

export const agentEditablePropertyFields = [
  "title_en",
  "title_pt",
  "title_nl",
  "listingType",
  "city",
  "neighborhood",
  "addressVisibility",
  "address",
  "price",
  "currency",
  "monthlyCondoFee",
  "propertyTax",
  "bedrooms",
  "bathrooms",
  "parkingSpaces",
  "areaM2",
  "floor",
  "furnished",
  "minimumStay",
  "maximumGuests",
  "utilitiesIncluded",
  "internetIncluded",
  "cleaningIncluded",
  "availableFrom",
  "petsAllowed",
  "financingPossible",
  "occupancyStatus",
  "yearBuilt",
  "shortDescription_en",
  "shortDescription_pt",
  "shortDescription_nl",
  "longDescription_en",
  "longDescription_pt",
  "longDescription_nl",
  "features_en",
  "features_pt",
  "features_nl",
  "buildingAmenities",
  "apartmentAmenities",
  "parkingAmenities",
  "lifestyleAmenities",
  "neighborhoodDescription_en",
  "neighborhoodDescription_pt",
  "neighborhoodDescription_nl",
  "nearbyHighlights_en",
  "nearbyHighlights_pt",
  "nearbyHighlights_nl",
  "mainImage",
  "gallery",
  "mapCoordinates",
  "videoUrl",
  "contact",
  "seoTitle_en",
  "seoTitle_pt",
  "seoTitle_nl",
  "seoDescription_en",
  "seoDescription_pt",
  "seoDescription_nl",
] as const;

export const propertyAdministratorOnlyFields = [
  "_id",
  "_rev",
  "_type",
  "slug",
  "status",
  "linkedRealtor",
  "verificationStatus",
  "publicationStatus",
] as const;

export function hasRealtorRole(provider: PropertyProvider | null | undefined) {
  return (
    provider?.primaryRole === "realtor" || provider?.roles?.includes("realtor") === true
  );
}

export function canCreatePropertyListing(
  provider: PropertyProvider | null | undefined,
  isAdmin: boolean,
) {
  return isAdmin || hasRealtorRole(provider);
}

export function propertyOwnerForCreate(
  provider: PropertyProvider | null | undefined,
  isAdmin: boolean,
  administratorSelectedProviderId?: string,
) {
  if (isAdmin) return administratorSelectedProviderId || undefined;
  return hasRealtorRole(provider) ? provider?._id : undefined;
}

export function propertyStatusForCreate(
  isAdmin: boolean,
  administratorSelectedStatus?: string,
) {
  return isAdmin ? administratorSelectedStatus || "hidden" : "hidden";
}

export function canEditPropertyListing({
  provider,
  isAdmin,
  listing,
}: {
  provider: PropertyProvider | null | undefined;
  isAdmin: boolean;
  listing: OwnedPropertyListing | null | undefined;
}) {
  if (isAdmin) return true;
  return Boolean(
    hasRealtorRole(provider) &&
      provider?._id &&
      listing?.linkedRealtor?._ref === provider._id,
  );
}
