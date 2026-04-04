/**
 * One-shot: remove "in Colombo" from About.content and About.stats (homeAboutBody, aboutIntro).
 * Run: npx tsx scripts/strip-colombo-about.ts
 */
import { PrismaClient } from "@prisma/client";
import { stripColomboFromCopy } from "../src/lib/about-content";

const prisma = new PrismaClient();

async function main() {
  const rows = await prisma.about.findMany();
  let n = 0;
  for (const row of rows) {
    const stats = { ...((row.stats as Record<string, unknown>) ?? {}) };
    let changed = false;

    if (typeof stats.homeAboutBody === "string") {
      const next = stripColomboFromCopy(stats.homeAboutBody);
      if (next !== stats.homeAboutBody) {
        stats.homeAboutBody = next;
        changed = true;
      }
    }
    if (Array.isArray(stats.aboutIntro)) {
      const next = stats.aboutIntro.map((p) =>
        typeof p === "string" ? stripColomboFromCopy(p) : p,
      );
      if (JSON.stringify(next) !== JSON.stringify(stats.aboutIntro)) {
        stats.aboutIntro = next;
        changed = true;
      }
    }

    const contentNext = stripColomboFromCopy(row.content ?? "");
    const contentChanged = contentNext !== row.content;

    if (changed || contentChanged) {
      await prisma.about.update({
        where: { id: row.id },
        data: {
          ...(contentChanged && { content: contentNext }),
          ...(changed && { stats }),
        },
      });
      n += 1;
    }
  }
  console.log(`strip-colombo-about: updated ${n} row(s) (of ${rows.length} total).`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
