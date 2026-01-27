import dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.join(process.cwd(), ".env") });

export const envConfig = {
  port: process.env.PORT,
  dbUrl: process.env.DATABASE_URL,
};
