/** Public folder portrait (filename has a space — encoded for URLs). */
export const DEFAULT_PORTRAIT_SRC = "/sandun-madhushan.png";

/**
 * DB may still store old seed URLs (Google demo art). Those override the fallback
 * unless we normalize them to the local portrait.
 */
export function resolvePortraitSrc(stored: string | undefined | null): string {
  const s = typeof stored === "string" ? stored.trim() : "";
  if (!s) return DEFAULT_PORTRAIT_SRC;
  if (s.startsWith("/")) return s;
  if (s.includes("googleusercontent.com/aida-public"))
    return DEFAULT_PORTRAIT_SRC;
  return s;
}
