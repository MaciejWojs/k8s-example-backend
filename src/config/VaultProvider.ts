import fs from "node:fs/promises";

import vault from "node-vault";

export class VaultProvider {
  readonly #client;

  constructor(vaultAddr: string) {
    this.#client = vault({
      endpoint: vaultAddr
    });
  }

  async login(role: string): Promise<void> {
    const jwt = await fs.readFile(
      "/var/run/secrets/kubernetes.io/serviceaccount/token",
      "utf8"
    );

    const result = await this.#client.write("auth/kubernetes/login", {
      role,
      jwt
    });

    this.#client.token = result.auth.client_token;
  }

  async readSecret<T extends Record<string, string>>(path: string): Promise<T> {
    const result = await this.#client.read(path);

    console.info("Vault secret read successfully:");

    return result.data.data as T;
  }
}
