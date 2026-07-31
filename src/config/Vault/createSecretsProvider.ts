import type { VaultMustHaveENV } from "../env";
import type { ISecretsProvider } from "./ISecretsProvider";
import { VaultInjectorSecretsProvider } from "./VaultInjectorSecretsProvider";
import { VaultProvider } from "./VaultProvider";

export function createSecretsProvider(
  vaultEnv: VaultMustHaveENV
): ISecretsProvider {
  if (vaultEnv.VAULT_SECRETS_MODE === "injector") {
    return new VaultInjectorSecretsProvider();
  }

  return new VaultProvider(vaultEnv.VAULT_ADDR);
}
