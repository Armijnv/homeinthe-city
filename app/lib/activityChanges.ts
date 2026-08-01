export type ActivityFieldChange = {
  field: string;
  beforeValue?: unknown;
  afterValue?: unknown;
};

function normalizedValue(value: unknown, ignoredKeys: Set<string>): unknown {
  if (Array.isArray(value)) {
    return value.map((entry) => normalizedValue(entry, ignoredKeys));
  }

  if (value && typeof value === "object") {
    return Object.fromEntries(
      Object.entries(value as Record<string, unknown>)
        .filter(([key, entry]) => !ignoredKeys.has(key) && entry !== undefined)
        .sort(([left], [right]) => left.localeCompare(right))
        .map(([key, entry]) => [key, normalizedValue(entry, ignoredKeys)]),
    );
  }

  return value;
}

export function activityValuesEqual(
  beforeValue: unknown,
  afterValue: unknown,
  ignoredKeys: string[] = ["_type"],
) {
  const ignored = new Set(ignoredKeys);
  return (
    JSON.stringify(normalizedValue(beforeValue, ignored)) ===
    JSON.stringify(normalizedValue(afterValue, ignored))
  );
}

export function activityFieldChanges(
  before: Record<string, unknown>,
  after: Record<string, unknown>,
  ignoredKeys?: string[],
): ActivityFieldChange[] {
  return Object.entries(after).flatMap(([field, afterValue]) => {
    const beforeValue = before[field];
    return activityValuesEqual(beforeValue, afterValue, ignoredKeys)
      ? []
      : [{ field, beforeValue, afterValue }];
  });
}

export type KeyedActivityItem = { _key?: string };
export type KeyedActivityChange<T extends KeyedActivityItem> = {
  type: "added" | "updated" | "deleted";
  before?: T;
  after?: T;
};

export function keyedArrayActivityChanges<T extends KeyedActivityItem>(
  beforeItems: T[],
  afterItems: T[],
): KeyedActivityChange<T>[] {
  const beforeByKey = new Map(beforeItems.map((item) => [item._key, item]));
  const afterByKey = new Map(afterItems.map((item) => [item._key, item]));
  const changes: KeyedActivityChange<T>[] = [];

  afterItems.forEach((after, index) => {
    const before = beforeByKey.get(after._key);
    if (!before) {
      changes.push({ type: "added", after });
      return;
    }
    const beforeIndex = beforeItems.findIndex((item) => item._key === after._key);
    if (!activityValuesEqual(before, after) || beforeIndex !== index) {
      changes.push({ type: "updated", before, after });
    }
  });

  beforeItems.forEach((before) => {
    if (!afterByKey.has(before._key)) changes.push({ type: "deleted", before });
  });

  return changes;
}
