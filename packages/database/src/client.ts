import { PrismaClient } from "@prisma/client";
import { withAccelerate } from "@prisma/extension-accelerate";

// Create the extended client type
const createPrismaClient = () => {
  return new PrismaClient({
    log: ["query"],
  }).$extends(withAccelerate());
};

type ExtendedPrismaClient = ReturnType<typeof createPrismaClient>;

// Prevent multiple instances of Prisma Client in development
const globalForPrisma = globalThis as unknown as {
  prisma: ExtendedPrismaClient | undefined;
};

export const prisma: ExtendedPrismaClient =
  globalForPrisma.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
