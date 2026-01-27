import dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.join(process.cwd(), ".env") });

export const envConfig = {
  port: process.env.PORT,
  dbUrl: process.env.DATABASE_URL,
  origin_url: process.env.ORIGIN_URL,
  app_user: process.env.APP_USER,
  app_pass: process.env.APP_PASS,
};
