/**
 * Default About hero copy for the public /about page.
 * Stored in `About.stats` (aboutHeadline, aboutIntro); synced via seed or `npm run about:sync`.
 */

/** Substring in `DEFAULT_ABOUT_HEADLINE` to render in the accent color (case-insensitive). */
export const ABOUT_HEADLINE_ACCENT = "full-stack";

/** Same cadence as “Crafting digital landscapes with surgical precision.” — tuned for software engineering. */
export const DEFAULT_ABOUT_HEADLINE =
  "Crafting full-stack systems with surgical precision.";

export const DEFAULT_ABOUT_INTRO = [
  "I am a Software Engineering undergraduate in Colombo, drawn to the place where disciplined engineering meets clarity of expression—where systems behave predictably and interfaces respect the person on the other side of the screen. My work is shaped by the belief that code is a long-term asset: it should read like something your future self and your teammates can follow without guessing.",
  "With a foundation in formal software engineering study and a growing practice across React, TypeScript, and Node.js, I build full-stack applications that aim to shrink the gap between a clear requirement and software someone can rely on day after day. I don't just assemble UIs; I care how data moves, how failures surface, and how the stack holds together—because that's the craft I'm strengthening on the path to becoming a software engineer.",
] as const;

/** Short bio stored on `About.content` (admin + fallbacks elsewhere). */
export function getDefaultAboutContent(): string {
  return `${DEFAULT_ABOUT_INTRO[0]} ${DEFAULT_ABOUT_INTRO[1]}`;
}
