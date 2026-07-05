import { z } from "zod";

export const envSchema = z.object({
  DEVELOPMENT: z
    .enum(["true", "false", "1", "0"])
    .transform((val) => val === "true" || val === "1"),

  // PEPPER: z.string().min(8).max(64),
  // SALT: z.string().min(8).max(64),

  DATABASE_URL: z.string().min(1)

  // JWT_ACCESS_SECRET: z.string().min(16).max(256),
  // JWT_REFRESH_SECRET: z.string().min(16).max(256)
});

export type ENV = z.infer<typeof envSchema>;
