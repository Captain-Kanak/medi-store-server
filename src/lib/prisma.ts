import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@prisma/client";
import { envConfig } from "../config/envConfig.js";

if (!envConfig.dbUrl) {
  throw new Error("DATABASE_URL is not defined");
}

const connectionString = `${envConfig.dbUrl}`;
const adapter = new PrismaPg({ connectionString });
const prisma = new PrismaClient({ adapter });

export { prisma };
