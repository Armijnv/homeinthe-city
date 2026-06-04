import type { StructureResolver } from "sanity/structure";

// https://www.sanity.io/docs/structure-builder-cheat-sheet
export const structure: StructureResolver = (S) =>
  S.list()
    .title("Content")
    .items([
      S.listItem()
        .title("Provider Profiles")
        .child(
          S.list()
            .title("Provider Profiles")
            .items([
              S.listItem()
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
                .title("Provider Submissions")
                .child(
                  S.list()
                    .title("Provider Submissions")
                    .items([
                      S.listItem()
                        .title("Pending Review")
                        .child(
                          S.documentTypeList("providerSubmission")
                            .title("Pending Review")
                            .filter(
                              '_type == "providerSubmission" && status == "review"',
                            ),
                        ),
                      S.listItem()
                        .title("Approved")
                        .child(
                          S.documentTypeList("providerSubmission")
                            .title("Approved")
                            .filter(
                              '_type == "providerSubmission" && status == "approved"',
                            ),
                        ),
                      S.listItem()
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
      S.documentTypeListItem("host").title("Legacy Hosts"),
      S.documentTypeListItem("city").title("Cities"),
      S.listItem()
        .title("Property Listings")
        .child(
          S.list()
            .title("Property Listings")
            .items([
              S.listItem()
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
    ]);
