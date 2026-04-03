import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

function newPrismaClient() {
  return new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
  });
}

function getPrisma(): PrismaClient {
  const g = globalForPrisma;
  let client = g.prisma;

  if (process.env.NODE_ENV !== "production" && client) {
    const delegate = (client as unknown as { socialLink?: { findMany?: unknown } }).socialLink;
    if (typeof delegate?.findMany !== "function") {
      void client.$disconnect().catch(() => {});
      g.prisma = undefined;
      client = undefined;
    }
  }

  if (!client) {
    client = newPrismaClient();
    if (process.env.NODE_ENV !== "production") g.prisma = client;
  }

  return client;
}

export const prisma = getPrisma();
