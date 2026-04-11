/**
 * Canonical origin for metadata, sitemap, and robots (no trailing slash).
 * Set NEXT_PUBLIC_APP_URL in production (e.g. https://madhushan.vercel.app).
 */
export function getSiteUrl(): string {
  const explicit = process.env.NEXT_PUBLIC_APP_URL?.trim().replace(/\/$/, "");
  if (explicit) return explicit;

  const vercel = process.env.VERCEL_URL?.trim();
  if (vercel) {
    const host = vercel.replace(/^https?:\/\//i, "");
    return `https://${host}`;
  }

  return "http://localhost:3000";
}
