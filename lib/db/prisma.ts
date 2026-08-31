import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import pg from "pg";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

function createPrismaClient(): PrismaClient {
  const connectionString = process.env.DATABASE_URL || "postgresql://postgres:steveal@04@localhost:5432/postforge";
  
  try {
    const isLocalhost = connectionString.includes("localhost") || connectionString.includes("127.0.0.1");
    const pool = new pg.Pool({
      connectionString,
      connectionTimeoutMillis: 10000,
      ssl: isLocalhost ? false : { rejectUnauthorized: false },
    });
    const adapter = new PrismaPg(pool);

    return new PrismaClient({
      adapter,
      log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
    });
  } catch (err) {
    console.error("Failed to initialize Prisma adapter:", err);
    return new PrismaClient({
      log: ["error"],
    });
  }
}

export const prisma = globalForPrisma.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
