import { PrismaClient } from "@prisma/client";

// Prevent multiple instances of Prisma Client in development
// This is important for serverless functions
const globalForPrisma = globalThis;

const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    // Logging configuration
    log:
      process.env.NODE_ENV === "development"
        ? ["query", "error", "warn"]
        : ["error"],
    
    // Connection timeout settings
    errorFormat: "pretty",
    
    // Optimize for serverless environments
    ...(process.env.NODE_ENV === "production" && {
      errorFormat: "minimal", // Reduce payload size
    }),
  });

// Reuse client in development, but create new one for each serverless invocation
if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}

// Graceful shutdown
process.on("SIGTERM", async () => {
  console.log("SIGTERM signal received: closing database connection");
  await prisma.$disconnect();
});

process.on("SIGINT", async () => {
  console.log("SIGINT signal received: closing database connection");
  await prisma.$disconnect();
});

export default prisma;