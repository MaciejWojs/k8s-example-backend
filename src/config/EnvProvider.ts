import { env } from "bun";

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
    const preEnvResult = preEnvSchema.safeParse(environment);
    if (!preEnvResult.success) {
      console.error(
        "Pre-environment variables validation failed:",
        preEnvResult.error
      );
      process.exit(1);
    }

    if (!preEnvResult.data.USE_VAULT) {
      console.warn(
        "Vault is not used. Using environment variables for configuration."
      );

      const envResult = envSchema.safeParse(environment);
      if (!envResult.success) {
        console.error(
          "Environment variables validation failed:",
          envResult.error
        );
        process.exit(1);
      }

      return new EnvProvider(envResult.data);
    }

    const vaultEnvResult = vaultMustHaveEnvSchema.safeParse(environment);
    if (!vaultEnvResult.success) {
      console.error(
        "Vault must have environment variables validation failed:",
        vaultEnvResult.error
      );
      process.exit(1);
    }

    const vaultEnv = vaultEnvResult.data;
    const vaultProvider = new VaultProvider(vaultEnv.VAULT_ADDR);

    try {
      await vaultProvider.login(vaultEnv.VAULT_ROLE);
      const secrets = await vaultProvider.readSecret<Record<string, string>>(
        vaultEnv.VAULT_SECRET_PATH
      );

      console.info("Successfully retrieved secrets from Vault:", secrets);

      const merged = { ...environment, ...secrets };
      const envResult = envSchema.safeParse(merged);

      console.info("Merged environment variables:", merged);
      if (!envResult.success) {
        console.error(
          "Environment variables validation failed:",
          envResult.error
        );
        process.exit(1);
      }

      return new EnvProvider(envResult.data);
    } catch (err) {
      console.error("Vault initialization failed:", err);
      //eslint-disable-next-line @typescript-eslint/no-explicit-any
      console.error("Vault error body:", (err as any).response?.body);
      //eslint-disable-next-line @typescript-eslint/no-explicit-any
      console.error("Vault error status code:", (err as any).response?.statusCode);
      
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

  get<K extends keyof ENV>(key: K): ENV[K] {
    return this.#config[key];
  }

  getConfig(): ENV {
    return { ...this.#config };
  }
}

export { EnvProvider };
