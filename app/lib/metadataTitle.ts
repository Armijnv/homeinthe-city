const siteTitleSuffixPattern = /(\s*\|\s*Home in the City\s*)+$/i;

export function cleanMetadataTitle(title: string | null | undefined) {
  return title?.replace(siteTitleSuffixPattern, "").trim();
}
