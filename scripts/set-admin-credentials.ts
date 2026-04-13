/**
 * Update or create the single admin user (credentials only — does not touch projects, about, etc.).
 *
 * Usage (local or against production DB):
 *   ADMIN_EMAIL=admin@portfolio.local
     ADMIN_PASSWORD='your-secret' 
     npx tsx scripts/set-admin-credentials.ts
 *
 * For production: temporarily set DATABASE_URL to your Neon/Vercel DB, run the command once, then unset.
 * Do NOT commit real passwords; do NOT run `db:seed` on production (it wipes data).
 */

import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const emailRaw = process.env.ADMIN_EMAIL?.trim();
  const password = process.env.ADMIN_PASSWORD;
  if (!emailRaw || !password) {
    console.error("Missing ADMIN_EMAIL or ADMIN_PASSWORD in the environment.");
    process.exit(1);
  }
  const email = emailRaw.toLowerCase();
  const hash = await bcrypt.hash(password, 12);

  const existing = await prisma.user.findFirst({
    where: { email: { equals: email, mode: "insensitive" } },
  });
  if (existing) {
    await prisma.user.update({
      where: { id: existing.id },
      data: { email, password: hash },
    });
    console.log(`Password updated for ${email}`);
  } else {
    await prisma.user.create({ data: { email, password: hash } });
    console.log(`Admin user created: ${email}`);
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => void prisma.$disconnect());
