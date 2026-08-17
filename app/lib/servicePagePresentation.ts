const languages: Record<string, string> = {
  en: "English",
  pt: "Portuguese",
  nl: "Dutch",
};

const localizedNames: Record<string, string> = {
  seoTitle: "search title",
  seoDescription: "search description",
  eyebrow: "small heading above the title",
  title: "page title",
  intro: "introduction",
  pricingTitle: "pricing heading",
  ctaTitle: "contact heading",
  ctaText: "contact explanation",
  button: "button label",
};

export function servicePageFieldLabel(field?: string) {
  if (!field) return "Changed field";
  if (field === "sections") return "Additional page sections";
  if (field === "pricingItems") return "Pricing rows";

  const localized = field.match(
    /^(seoTitle|seoDescription|eyebrow|title|intro|pricingTitle|ctaTitle|ctaText|button)_([a-z]{2})$/,
  );
  if (localized) {
    return `${languages[localized[2]] || localized[2].toUpperCase()} ${
      localizedNames[localized[1]]
    }`;
  }

  return field;
}
