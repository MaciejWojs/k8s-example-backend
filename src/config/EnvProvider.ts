import { env } from "bun";
import type { z } from "zod";

import {
  type ENV,
  envSchema,
  preEnvSchema,
  vaultMustHaveEnvSchema
} from "./env";
import { VaultProvider } from "./VaultProvider";

class EnvProvider {
  private static instance: EnvProvider | undefined;

  readonly #config: ENV;

  private constructor(config: ENV) {
    this.#config = config;
  }

  static async create(
    environment: Record<string, string | undefined> = env
  ): Promise<EnvProvider> {
    const preEnv = this.validateOrThrow(
      preEnvSchema,
      environment,
      "Pre-environment variables validation failed"
    );

    const finalEnv = preEnv.USE_VAULT
      ? await this.fetchSecretsFromVault(environment)
      : environment;

    if (!preEnv.USE_VAULT) {
      console.warn(
        "Vault is not used. Using environment variables for configuration."
      );
    }

    const config = this.validateOrThrow(
      envSchema,
      finalEnv,
      "Environment variables validation failed"
    );

    return new EnvProvider(config);
  }

  private static async fetchSecretsFromVault(
    environment: Record<string, string | undefined>
  ) {
    const vaultEnv = this.validateOrThrow(
      vaultMustHaveEnvSchema,
      environment,
      "Vault must have environment variables validation failed"
    );
    const vaultProvider = new VaultProvider(vaultEnv.VAULT_ADDR);

    try {
      await vaultProvider.login(vaultEnv.VAULT_ROLE);
      const secrets = await vaultProvider.readSecret<Record<string, string>>(
        vaultEnv.VAULT_SECRET_PATH
      );
      const trimmedSecrets = Object.fromEntries(
        Object.entries(secrets).map(([key, value]) => [key, value.trim()])
      );
      return { ...environment, ...trimmedSecrets };
    } catch (err) {
      console.error("Vault initialization failed:", err);
      process.exit(1);
    }
  }

  static async getInstance(
    environment?: Record<string, string | undefined>
  ): Promise<EnvProvider> {
    if (!EnvProvider.instance) {
      EnvProvider.instance = await EnvProvider.create(environment ?? env);
    }
    return EnvProvider.instance;
  }

  private static validateOrThrow<S extends z.ZodType>(
    schema: S,
    data: Record<string, string | undefined>,
    errorMessage: string
  ): z.infer<S> {
    const result = schema.safeParse(data);
    if (!result.success) {
      console.error(errorMessage, result.error);
      process.exit(1);
    }
    return result.data;
  }

  get<K extends keyof ENV>(key: K): ENV[K] {
    return this.#config[key];
  }

  getConfig(): ENV {
    return { ...this.#config };
  }
}

export { EnvProvider };
