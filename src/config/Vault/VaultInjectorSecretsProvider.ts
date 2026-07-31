import fs from "node:fs/promises";

import { z } from "zod";

import type { ISecretsProvider } from "./ISecretsProvider";

const subDataObjectSchema = z.object({
  data: z.record(z.string(), z.unknown())
});

function validateStringValues(
  obj: Record<string, unknown> | object
): Record<string, string> {
  return Object.fromEntries(
    Object.entries(obj).map(([key, value]) => {
      if (typeof value !== "string") {
        throw new Error(`Vault injector secret "${key}" must be a string`);
      }
      return [key, value];
    })
  );
}

function parseSecretsFile(
  content: string,
  filePath: string
): Record<string, string> {
  const trimmed = content.trim();

  if (trimmed.startsWith("{")) {
    const parsed: unknown = JSON.parse(trimmed);
    if (
      typeof parsed !== "object" ||
      parsed === null ||
      Array.isArray(parsed)
    ) {
      throw new Error(
        `Vault injector secrets file ${filePath} must contain a JSON object`
      );
    }

    const dataObjectResult = subDataObjectSchema.safeParse(parsed);
    if (dataObjectResult.success) {
      console.debug(
        `Vault injector secrets file ${filePath} contains a "data" object; using that for secrets`
      );
      const dataObject = dataObjectResult.data.data;
      return validateStringValues(dataObject);
    }

    console.debug(
      `Vault injector secrets file ${filePath} does not contain a "data" object; using the top-level object for secrets`
    );
    return validateStringValues(parsed);
  }

  const secrets: Record<string, string> = {};

  for (const line of trimmed.split("\n")) {
    const withoutComment = line.split("#")[0]?.trim() ?? "";
    if (!withoutComment) {
      continue;
    }

    const separatorIndex = withoutComment.indexOf("=");
    if (separatorIndex === -1) {
      continue;
    }

    const key = withoutComment.slice(0, separatorIndex).trim();
    const value = withoutComment.slice(separatorIndex + 1).trim();
    if (key) {
      secrets[key] = value;
    }
  }

  return secrets;
}

export class VaultInjectorSecretsProvider implements ISecretsProvider {
  async login(): Promise<void> {
    console.info(
      "Vault Agent Injector supplies secrets on disk; skipping Vault API login"
    );
  }

  async readSecret<T extends Record<string, string>>(
    filePath: string
  ): Promise<T> {
    const content = await fs.readFile(filePath, "utf8");
    const maxLength = 25;
    console.log(
      content.length > maxLength
        ? `${content.slice(0, maxLength)} ...`
        : "Secrets file not enough content to display"
    );
    const secrets = parseSecretsFile(content, filePath);

    const watcher = fs.watch(filePath);

    for await (const event of watcher) {
      if (event.eventType === "change") {
        console.info(
          `Vault injector secrets file ${filePath} has changed; reloading secrets`
        );
      }
    }

    console.info("Vault injector secret read successfully");

    return secrets as T;
  }
}
