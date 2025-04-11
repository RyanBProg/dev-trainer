import { z } from "zod";
import dotenv from "dotenv";

dotenv.config();

const envSchema = z.object({
  PORT: z.string(),
  MONGO_URL: z.string(),
  REDIS_URL: z.string(),
  SESSION_SECRET: z.string(),
  ADMIN_PASSWORD: z.string(),
  NODE_ENV: z.enum(["production", "development"]),
  FRONTEND_URL: z.string(),
  BACKEND_URL: z.string(),
  OAUTH_CLIENT_ID: z.string(),
  OAUTH_CLIENT_SECRET: z.string(),
  OAUTH_REDIRECT_URL: z.string(),
});

export const env = envSchema.parse(process.env);
