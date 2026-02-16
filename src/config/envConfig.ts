import dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.join(process.cwd(), ".env") });

export const envConfig = {
  NODE_ENV: process.env.NODE_ENV,
  port: process.env.PORT,
  dbUrl: process.env.DATABASE_URL,
  origin_url: process.env.ORIGIN_URL,
  better_auth_url: process.env.BETTER_AUTH_URL,
  app_user: process.env.APP_USER,
  app_pass: process.env.APP_PASS,
  google_client_id: process.env.GOOGLE_CLIENT_ID,
  google_client_secret: process.env.GOOGLE_CLIENT_SECRET,
};
