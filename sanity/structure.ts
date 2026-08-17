import type { StructureResolver } from "sanity/structure";

// https://www.sanity.io/docs/structure-builder-cheat-sheet
export const structure: StructureResolver = (S) =>
  S.list()
    .title("Content")
    .items([
      S.listItem()
        .id("providerProfiles")
        .title("Provider Profiles")
        .child(
          S.list()
            .id("providerProfilesList")
            .title("Provider Profiles")
            .items([
              S.listItem()
                .id("publishedProviders")
                .title("Published Provider Profiles")
                .child(
                  S.documentTypeList("provider")
                    .title("Published Provider Profiles")
                    .filter(
                      '_type == "provider" && status == "published" && !(_id in path("drafts.**"))',
                    ),
                ),
              S.documentTypeListItem("provider").title("All Provider Profiles"),
              S.listItem()
                .id("providerSubmissions")
                .title("Provider Submissions")
                .child(
                  S.list()
                    .id("providerSubmissionsList")
                    .title("Provider Submissions")
                    .items([
                      S.listItem()
                        .id("providerSubmissionsReview")
                        .title("Pending Review")
                        .child(
                          S.documentTypeList("providerSubmission")
                            .title("Pending Review")
                            .filter(
                              '_type == "providerSubmission" && status == "review"',
                            ),
                        ),
                      S.listItem()
                        .id("providerSubmissionsApproved")
                        .title("Approved")
                        .child(
                          S.documentTypeList("providerSubmission")
                            .title("Approved")
                            .filter(
                              '_type == "providerSubmission" && status == "approved"',
                            ),
                        ),
                      S.listItem()
                        .id("providerSubmissionsRejected")
                        .title("Rejected")
                        .child(
                          S.documentTypeList("providerSubmission")
                            .title("Rejected")
                            .filter(
                              '_type == "providerSubmission" && status == "rejected"',
                            ),
                        ),
                      S.documentTypeListItem("providerSubmission").title(
                        "All Submissions",
                      ),
                    ]),
                ),
            ]),
        ),
      S.documentTypeListItem("city").title("Cities"),
      S.documentTypeListItem("cityChangeLog").title("City Change Log"),
      S.documentTypeListItem("providerChangeLog").title("Provider Change Log"),
      S.documentTypeListItem("propertyChangeLog").title("Property Change Log"),
      S.listItem()
        .id("propertyListings")
        .title("Property Listings")
        .child(
          S.list()
            .id("propertyListingsList")
            .title("Property Listings")
            .items([
              S.listItem()
                .id("publicPropertyListings")
                .title("Public Property Listings")
                .child(
                  S.documentTypeList("propertyListing")
                    .title("Public Property Listings")
                    .filter(
                      '_type == "propertyListing" && status in ["available", "reserved", "sold", "rented"] && !(_id in path("drafts.**"))',
                    ),
                ),
              S.documentTypeListItem("propertyListing").title("All Property Listings"),
            ]),
        ),
      S.documentTypeListItem("servicePage").title("Service Pages"),
      S.documentTypeListItem("servicePageChangeLog").title(
        "Service Page Change Log",
      ),
    ]);
