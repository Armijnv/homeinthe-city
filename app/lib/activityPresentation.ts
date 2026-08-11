import { providerChangeFieldLabel } from "@/app/lib/providerChangePresentation";

export type ActivityReference = { name: string; type?: string; imageUrl?: string };

const fieldLabels: Record<string, string> = {
  status: "Publication status",
  guideStatus: "Publication status",
  linkedRealtor: "Assigned realtor",
  realtor: "Assigned realtor",
  owner: "Owner",
  title_en: "English title",
  title_pt: "Portuguese title",
  title_nl: "Dutch title",
  name_en: "English city name",
  name_pt: "Portuguese city name",
  name_nl: "Dutch city name",
  headline_en: "English hero tagline",
  headline_pt: "Portuguese hero tagline",
  headline_nl: "Dutch hero tagline",
  intro_en: "English introduction",
  intro_pt: "Portuguese introduction",
  intro_nl: "Dutch introduction",
  description_en: "English description",
  description_pt: "Portuguese description",
  description_nl: "Dutch description",
  mainImage: "Main image",
  heroImage: "City page background",
  gallery: "Property photos",
  mapCoordinates: "Map coordinates",
  mapPlaces: "Map places",
  recommendations: "Recommendations",
  cityPageExperience: "Porto Alegre page sections",
  primaryHost: "Primary host",
  content: "City information",
  summary: "Change summary",
};

const languageNames: Record<string, string> = { en: "English", pt: "Portuguese", nl: "Dutch", es: "Spanish", de: "German", fr: "French" };

export function activityFieldLabel(field?: string) {
  return fieldLabels[field || ""] || providerChangeFieldLabel(field);
}

export function parseActivityValue(value?: string): unknown {
  if (!value || value === "Not set" || value === "Not retained") return undefined;
  try { return JSON.parse(value); } catch { return value; }
}

export function activityValueEqual(left?: string, right?: string) {
  return JSON.stringify(parseActivityValue(left)) === JSON.stringify(parseActivityValue(right));
}

export function humanActivityValue(value: unknown, references: Record<string, ActivityReference> = {}): string {
  if (value === undefined || value === null || value === "") return "Not set";
  if (typeof value === "string") return languageNames[value] || references[value]?.name || value;
  if (typeof value === "number" || typeof value === "boolean") return String(value);
  if (Array.isArray(value)) return value.length ? value.map((entry) => humanActivityValue(entry, references)).join(", ") : "None";
  if (typeof value === "object") {
    const record = value as Record<string, unknown>;
    if (typeof record._ref === "string") return references[record._ref]?.name || "Linked item";
    if (typeof record.language === "string") {
      const level = typeof record.level === "string" ? ` (${record.level})` : "";
      return `${languageNames[record.language] || record.language}${level}`;
    }
    return Object.entries(record)
      .filter(([key]) => !key.startsWith("_"))
      .map(([key, entry]) => `${activityFieldLabel(key)}: ${humanActivityValue(entry, references)}`)
      .join(" · ") || "Not set";
  }
  return String(value);
}

export type DiffPart = { value: string; type: "same" | "added" | "removed" };

export function wordDiff(before: string, after: string): DiffPart[] {
  const left = before.split(/(\s+)/).filter(Boolean);
  const right = after.split(/(\s+)/).filter(Boolean);
  const lengths = Array.from({ length: left.length + 1 }, () => Array<number>(right.length + 1).fill(0));
  for (let i = left.length - 1; i >= 0; i -= 1) for (let j = right.length - 1; j >= 0; j -= 1) lengths[i][j] = left[i] === right[j] ? lengths[i + 1][j + 1] + 1 : Math.max(lengths[i + 1][j], lengths[i][j + 1]);
  const result: DiffPart[] = [];
  const append = (value: string, type: DiffPart["type"]) => {
    const last = result.at(-1);
    if (last?.type === type) last.value += value;
    else result.push({ value, type });
  };
  let i = 0; let j = 0;
  while (i < left.length && j < right.length) {
    if (left[i] === right[j]) { append(left[i], "same"); i += 1; j += 1; }
    else if (lengths[i + 1][j] >= lengths[i][j + 1]) { append(left[i], "removed"); i += 1; }
    else { append(right[j], "added"); j += 1; }
  }
  while (i < left.length) { append(left[i], "removed"); i += 1; }
  while (j < right.length) { append(right[j], "added"); j += 1; }
  return result;
}

export function imageUrls(value: unknown, references: Record<string, ActivityReference> = {}) {
  const urls = new Set<string>();
  const visit = (entry: unknown) => {
    if (Array.isArray(entry)) return entry.forEach(visit);
    if (!entry || typeof entry !== "object") return;
    const record = entry as Record<string, unknown>;
    if (typeof record._ref === "string" && references[record._ref]?.imageUrl) urls.add(references[record._ref].imageUrl!);
    Object.values(record).forEach(visit);
  };
  visit(value);
  return [...urls];
}
