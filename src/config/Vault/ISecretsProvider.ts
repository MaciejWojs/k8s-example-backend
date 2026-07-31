export interface ISecretsProvider {
  login(role: string): Promise<void>;

  readSecret<T extends Record<string, string>>(path: string): Promise<T>;
}
