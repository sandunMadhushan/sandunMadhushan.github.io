export const SOCIAL_PLATFORM_IDS = [
  "github",
  "linkedin",
  "facebook",
  "blog",
  "twitter",
  "instagram",
  "youtube",
  "website",
] as const;

export type SocialPlatformId = (typeof SOCIAL_PLATFORM_IDS)[number];

export const SOCIAL_PLATFORM_OPTIONS: { id: SocialPlatformId; label: string }[] = [
  { id: "github", label: "GitHub" },
  { id: "linkedin", label: "LinkedIn" },
  { id: "facebook", label: "Facebook" },
  { id: "blog", label: "Blog" },
  { id: "twitter", label: "X / Twitter" },
  { id: "instagram", label: "Instagram" },
  { id: "youtube", label: "YouTube" },
  { id: "website", label: "Website" },
];

export function isSocialPlatformId(value: string): value is SocialPlatformId {
  return (SOCIAL_PLATFORM_IDS as readonly string[]).includes(value);
}

export function labelForSocialPlatform(platform: string): string {
  const row = SOCIAL_PLATFORM_OPTIONS.find((o) => o.id === platform);
  return row?.label ?? platform;
}

/** Returns normalized https URL or null if invalid */
export function normalizeSocialUrl(input: string): string | null {
  const t = input.trim();
  if (!t) return null;
  try {
    const withScheme = /^https?:\/\//i.test(t) ? t : `https://${t}`;
    const u = new URL(withScheme);
    if (u.protocol !== "http:" && u.protocol !== "https:") return null;
    return u.href;
  } catch {
    return null;
  }
}
