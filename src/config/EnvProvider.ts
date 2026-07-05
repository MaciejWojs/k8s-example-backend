import { env } from "bun";

import { type ENV, envSchema } from "./env";

class EnvProvider {
  private static instance: EnvProvider | undefined;

  private readonly config: ENV;

  private constructor(environment: Record<string, string | undefined> = env) {
    try {
      this.config = envSchema.parse(environment);
    } catch (error) {
      console.error("Environment variables validation failed:", error);
      process.exit(1);
    }
  }

  public static getInstance(
    environment?: Record<string, string | undefined>
  ): EnvProvider {
    if (!EnvProvider.instance) {
      EnvProvider.instance = new EnvProvider(environment ?? env);
    }
    return EnvProvider.instance;
  }

  get<K extends keyof ENV>(key: K): ENV[K] {
    return this.config[key];
  }

  getConfig(): ENV {
    return { ...this.config };
  }
}

export const envProvider = EnvProvider.getInstance();
