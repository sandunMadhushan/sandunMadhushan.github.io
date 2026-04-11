/**
 * Normalize pasted image URLs (e.g. Google Drive share links) for storage and <Image src>.
 * Folder links are rejected — only per-file links can become a direct image URL.
 */

const DRIVE_FOLDER = /drive\.google\.com\/drive\/folders\//;

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
        return { ok: true, url: `https://drive.google.com/uc?export=view&id=${fileMatch[1]}` };
      }
      if (u.pathname === "/open" || u.searchParams.has("id")) {
        const id = u.searchParams.get("id");
        if (id && /^[a-zA-Z0-9_-]+$/.test(id)) {
          return { ok: true, url: `https://drive.google.com/uc?export=view&id=${id}` };
        }
      }
    }
  } catch {
    return { ok: false, error: "Invalid image URL." };
  }

  return { ok: true, url: s };
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
