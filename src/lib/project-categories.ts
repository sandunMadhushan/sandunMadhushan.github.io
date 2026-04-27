const CATEGORY_DELIMITER = "|";

export const DEFAULT_PROJECT_CATEGORIES = ["Web", "Mobile", "AI"] as const;

export function parseProjectCategories(raw: string | null | undefined): string[] {
  if (!raw) return ["Web"];

  const values = raw
    .split(CATEGORY_DELIMITER)
    .map((v) => v.trim())
    .filter(Boolean);

  const unique = Array.from(new Set(values));
  return unique.length > 0 ? unique : ["Web"];
}

export function serializeProjectCategories(categories: string[]): string {
  const unique = Array.from(
    new Set(
      categories
        .map((v) => v.trim())
        .filter(Boolean),
    ),
  );
  return (unique.length > 0 ? unique : ["Web"]).join(CATEGORY_DELIMITER);
}
