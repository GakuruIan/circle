import { prisma } from "./dist/index.js";

async function main() {
  console.log("Testing database package...");

  try {
    // Test if the package imports correctly
    console.log("✅ Package imported successfully!");
    console.log("Prisma client:", typeof prisma);

    // Test database connection (only if you have a database running)
    // await prisma.$connect();
    // console.log("✅ Database connected successfully!");
  } catch (error) {
    console.error("❌ Test failed:", error);
  } finally {
    // await prisma.$disconnect();
  }
}

main();
