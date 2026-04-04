/**
 * One-shot: copy `src/lib/about-content.ts` into the live About row (headline, intro, content).
 * Preserves other keys in `stats` (timeline, statCards, …).
 *
 * Usage: npm run about:sync  (requires DATABASE_URL and an existing About row)
 */
import { PrismaClient } from "@prisma/client";
import {
  DEFAULT_ABOUT_HEADLINE,
  DEFAULT_ABOUT_INTRO,
  getDefaultAboutContent,
} from "../src/lib/about-content";

const prisma = new PrismaClient();

async function main() {
  const row = await prisma.about.findFirst({ orderBy: { updatedAt: "desc" } });
  if (!row) {
    console.error("No About row found. Run: npm run db:seed");
    process.exit(1);
  }
  const prev = (row.stats as Record<string, unknown>) ?? {};
  const stats = {
    ...prev,
    aboutHeadline: DEFAULT_ABOUT_HEADLINE,
    aboutIntro: [...DEFAULT_ABOUT_INTRO],
  };
  await prisma.about.update({
    where: { id: row.id },
    data: {
      content: getDefaultAboutContent(),
      stats,
    },
  });
  console.log("About headline, intro, and content updated from src/lib/about-content.ts");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
