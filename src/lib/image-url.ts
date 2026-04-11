/**
 * Normalize pasted image URLs (e.g. Google Drive share links) for storage and <Image src>.
 * Folder links are rejected — only per-file links can become a direct image URL.
 */

const DRIVE_FOLDER = /drive\.google\.com\/drive\/folders\//;

/** Embeddable Drive image URL (redirects to lh3.googleusercontent.com; works better than uc?export=view in Next/Image). */
function driveThumbnailUrl(fileId: string): string {
  return `https://drive.google.com/thumbnail?id=${encodeURIComponent(fileId)}&sz=w2000`;
}

export function normalizeProjectImageUrl(raw: string): { ok: true; url: string } | { ok: false; error: string } {
  const s = raw.trim();
  if (!s) return { ok: false, error: "Empty image URL." };

  if (s.startsWith("/")) {
    return { ok: true, url: s };
  }

  if (!/^https?:\/\//i.test(s)) {
    return {
      ok: false,
      error: "Each image must be a full URL (https://…) or a path on this site starting with /.",
    };
  }

  if (DRIVE_FOLDER.test(s)) {
    return {
      ok: false,
      error:
        "That is a Google Drive folder link, not an image. Open each image in Drive → Share → Anyone with the link → copy the file link and paste one URL per line.",
    };
  }

  try {
    const u = new URL(s);

    if (u.hostname === "drive.google.com" || u.hostname === "docs.google.com") {
      const fileMatch = u.pathname.match(/\/file\/d\/([a-zA-Z0-9_-]+)/);
      if (fileMatch) {
        return { ok: true, url: driveThumbnailUrl(fileMatch[1]) };
      }
      if (u.pathname === "/open" || u.searchParams.has("id")) {
        const id = u.searchParams.get("id");
        if (id && /^[a-zA-Z0-9_-]+$/.test(id)) {
          return { ok: true, url: driveThumbnailUrl(id) };
        }
      }
    }
  } catch {
    return { ok: false, error: "Invalid image URL." };
  }

  return { ok: true, url: s };
}

/**
 * Use on public pages when rendering stored image URLs: converts Google Drive file share
 * links to the thumbnail endpoint; leaves `/…` paths and normal https URLs unchanged.
 */
export function resolveDisplayImageSrc(raw: string): string {
  const s = raw.trim();
  if (!s) return s;
  const n = normalizeProjectImageUrl(s);
  return n.ok ? n.url : s;
}

/** Fix legacy stored `uc?export=view` links (they redirect to hosts Next/Image may block). */
export function resolveProjectImageSrc(url: string): string {
  try {
    const u = new URL(url.trim());
    if (u.hostname !== "drive.google.com") return url.trim();
    if (u.pathname === "/uc" && u.searchParams.get("export") === "view") {
      const id = u.searchParams.get("id");
      if (id && /^[a-zA-Z0-9_-]+$/.test(id)) return driveThumbnailUrl(id);
    }
    return url.trim();
  } catch {
    return url.trim();
  }
}

/**
 * Prefer Vercel Blob / local paths over Google Drive for the hero (Drive is unreliable for hotlinking).
 */
export function sortProjectImagesForDisplay(urls: string[]): string[] {
  const rank = (u: string): number => {
    const s = u.trim();
    if (s.startsWith("/")) return 100;
    if (/\.public\.blob\.vercel-storage\.com/i.test(s)) return 95;
    if (/drive\.google\.com/i.test(s)) return 20;
    return 50;
  };
  return [...urls].sort((a, b) => rank(b) - rank(a));
}

/** Resolve legacy Drive URLs, prefer Blob/local for cover, then merge with fallback portrait. */
export function prepareProjectGallery(urls: string[], fallback: string): string[] {
  if (!urls.length) return [fallback];
  const resolved = urls.map(resolveProjectImageSrc);
  return sortProjectImagesForDisplay(resolved);
}

export function normalizeProjectImageUrls(urls: string[]): { ok: true; urls: string[] } | { ok: false; error: string } {
  const out: string[] = [];
  for (const raw of urls) {
    const r = normalizeProjectImageUrl(raw);
    if (!r.ok) return { ok: false, error: r.error };
    out.push(r.url);
  }
  return { ok: true, urls: out };
}

/** Absolute http(s) URLs should bypass the image optimizer (Drive, CDNs, etc.). */
export function isRemoteImageSrc(src: string): boolean {
  return /^https?:\/\//i.test(src);
}
