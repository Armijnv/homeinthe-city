const directLabels: Record<string, string> = {
  name: "Name",
  cities: "Cities served",
  managedCities: "Managed cities",
  languages: "Languages",
  mainPhoto: "Profile photo",
  contactOptions: "Contact options",
  roles: "Roles",
  primaryRole: "Primary role",
  status: "Publication status",
  verificationStatus: "Verification status",
  "ownership.ownerUserId": "Account connected",
  "ownership.ownershipStatus": "Ownership status",
  "ownership.contactEmail": "Account email",
  "ownership.selfEditEnabled": "Self-editing",
  "ownership.selfEditableFields": "Editable profile sections",
};

const languages: Record<string, string> = {
  en: "English",
  pt: "Portuguese",
  nl: "Dutch",
  es: "Spanish",
  de: "German",
  fr: "French",
};

const localizedFields: Record<string, string> = {
  headline: "headline",
  intro: "intro",
  about: "bio",
};

export function providerChangeFieldLabel(field?: string) {
  if (!field) return "Changed field";
  if (directLabels[field]) return directLabels[field];
  const localized = field.match(/^(headline|intro|about)_([a-z]{2})$/);
  if (localized) {
    return `${languages[localized[2]] || localized[2].toUpperCase()} ${localizedFields[localized[1]]}`;
  }
  return field
    .replace(/([a-z])([A-Z])/g, "$1 $2")
    .replace(/[._-]+/g, " ")
    .replace(/^./, (letter) => letter.toUpperCase());
}

function parsedValue(value?: string) {
  if (!value || value === "Not set") return undefined;
  try {
    return JSON.parse(value);
  } catch {
    return value;
  }
}

function humanObject(value: unknown, cityNames: Record<string, string>): string {
  if (value === undefined || value === null || value === "") return "Not set";
  if (typeof value === "string") return languages[value] || cityNames[value] || value;
  if (typeof value === "number" || typeof value === "boolean") return String(value);
  if (Array.isArray(value)) {
    if (!value.length) return "None";
    return value.map((entry) => humanObject(entry, cityNames)).join(", ");
  }
  if (typeof value === "object") {
    const object = value as Record<string, unknown>;
    if (typeof object._ref === "string") return cityNames[object._ref] || "Linked record";
    if (typeof object.language === "string") {
      const language = languages[object.language] || object.language;
      const level = typeof object.level === "string" ? ` (${object.level})` : "";
      return `${language}${level}`;
    }
    return Object.entries(object)
      .filter(([key]) => !key.startsWith("_"))
      .map(([key, entry]) => `${providerChangeFieldLabel(key)}: ${humanObject(entry, cityNames)}`)
      .join(" · ");
  }
  return String(value);
}

export function providerChangeValue(
  value: string | undefined,
  cityNames: Record<string, string> = {},
) {
  return humanObject(parsedValue(value), cityNames);
}

