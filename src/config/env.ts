import { z } from "zod";

const boolString = z
  .enum(["true", "false", "1", "0"], {
    error: "Expected a boolean string ('true', 'false', '1', '0')"
  })
  .transform((val) => val === "true" || val === "1");

export const preEnvSchema = z.object({
  USE_VAULT: boolString.describe(
    "Indicates if the application should use Vault for configuration"
  )
});

export const vaultMustHaveEnvSchema = z.object({
  VAULT_ADDR: z
    .string()
    .min(1, {
      error: "VAULT_ADDR is required and must be a non-empty string"
    })
    .describe("The address of the Vault server"),
  VAULT_ROLE: z
    .string()
    .min(1, {
      error: "VAULT_ROLE is required and must be a non-empty string"
    })
    .describe("Kubernetes auth role configured in Vault"),
  VAULT_SECRET_PATH: z
    .string()
    .min(1, {
      error: "VAULT_SECRET_PATH is required and must be a non-empty string"
    })
    .describe("KV v2 secret path, e.g. secret/data/myapp/config")
});

export type VaultMustHaveENV = z.infer<typeof vaultMustHaveEnvSchema>;
export type PreENV = z.infer<typeof preEnvSchema>;

export const envSchema = z.object({
  DEVELOPMENT: boolString.describe(
    "Indicates if the application is running in development mode"
  ),
  PERFORM_DATABASE_MIGRATIONS: boolString.describe(
    "Indicates if the application should perform database migrations on startup"
  ),
  PERFORM_DATABASE_SEEDING: boolString.describe(
    "Indicates if the application should perform database seeding on startup"
  ),

  // PEPPER: z.string().min(8).max(64),
  // SALT: z.string().min(8).max(64),

  DATABASE_URL: z
    .string()
    .min(1, {
      error: "DATABASE_URL is required and must be a non-empty string"
    })
    .describe("The connection string for the database")

  // JWT_ACCESS_SECRET: z.string().min(16).max(256),
  // JWT_REFRESH_SECRET: z.string().min(16).max(256)
});

export type ENV = z.infer<typeof envSchema>;
