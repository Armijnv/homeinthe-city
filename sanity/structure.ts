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
              S.documentTypeListItem("provider").title(
                "Published Provider Profiles",
              ),
              S.documentTypeListItem("providerSubmission").title(
                "Provider Submissions",
              ),
            ]),
        ),
      S.documentTypeListItem("host").title("Legacy Hosts"),
      S.documentTypeListItem("city").title("Cities"),
      S.documentTypeListItem("servicePage").title("Service Pages"),
    ]);
