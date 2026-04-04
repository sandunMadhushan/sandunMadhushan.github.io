/**
 * Default About hero copy for the public /about page.
 * Stored in `About.stats` (aboutHeadline, aboutIntro); synced via seed or `npm run about:sync`.
 */

/** Substring in `DEFAULT_ABOUT_HEADLINE` to render in the accent color (case-insensitive). */
export const ABOUT_HEADLINE_ACCENT = "full-stack";

/** Same cadence as “Crafting digital landscapes with surgical precision.” — tuned for software engineering. */
export const DEFAULT_ABOUT_HEADLINE =
  "Crafting full-stack systems with surgical precision.";

/** Home hero line under the name; stored in `About.stats.heroTagline`. */
export const DEFAULT_HERO_TAGLINE =
  "Aspiring Software Engineer—always learning and building reliable full-stack web apps with React, TypeScript, and Node.js.";

const LEGACY_HERO_SNIPPET = "Software Engineering undergraduate";

/** Uses DB copy when set; replaces legacy “undergraduate …” wording with {@link DEFAULT_HERO_TAGLINE}. */
export function resolveHeroTagline(stored: unknown): string {
  const s = typeof stored === "string" ? stored.trim() : "";
  if (!s || s.includes(LEGACY_HERO_SNIPPET)) return DEFAULT_HERO_TAGLINE;
  return s;
}

export const DEFAULT_ABOUT_INTRO = [
  "I am an aspiring software engineer, drawn to the place where disciplined engineering meets clarity of expression—where systems behave predictably and interfaces respect the person on the other side of the screen. My work is shaped by the belief that code is a long-term asset: it should read like something your future self and your teammates can follow without guessing.",
  "I'm still learning every day—through coursework and hands-on work with React, TypeScript, and Node.js—and I build full-stack applications that aim to shrink the gap between a clear requirement and software someone can rely on day after day. I don't just assemble UIs; I care how data moves, how failures surface, and how the stack holds together—because that's the craft I'm strengthening as I grow into the role.",
] as const;

/** Home “About me” block under the headline; stored in `About.stats.homeAboutBody`. */
export const DEFAULT_HOME_ABOUT_BODY =
  "I'm a Software Engineering student, working toward a career as a Software Engineer. I care about clean structure, solid fundamentals, and interfaces that feel as good as they perform.";

/** Removes legacy “in Colombo” phrasing from any stored copy (DB / admin). */
export function stripColomboFromCopy(text: string): string {
  let t = text;
  t = t.replace(/\s+in\s+Colombo\s*,/gi, ",");
  t = t.replace(/\s+in\s+Colombo\./gi, ".");
  t = t.replace(/\s+in\s+Colombo\b/gi, "");
  t = t.replace(/\s*,\s*,/g, ",");
  t = t.replace(/\s{2,}/g, " ");
  return t.trim();
}

/** Home section body: default when empty; strips “in Colombo” from older DB values. */
export function resolveHomeAboutBody(stored: unknown): string {
  const s = typeof stored === "string" ? stored.trim() : "";
  if (!s) return DEFAULT_HOME_ABOUT_BODY;
  return stripColomboFromCopy(s);
}

/** Short bio stored on `About.content` (admin + fallbacks elsewhere). */
export function getDefaultAboutContent(): string {
  return `${DEFAULT_ABOUT_INTRO[0]} ${DEFAULT_ABOUT_INTRO[1]}`;
}
