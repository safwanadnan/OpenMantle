import { createHash, randomBytes, randomUUID } from "node:crypto";
import * as argon2 from "argon2";

export async function hashPassword(password: string): Promise<string> {
  return argon2.hash(password, { type: argon2.argon2id });
}

export async function verifyPassword(hash: string, password: string): Promise<boolean> {
  try {
    return await argon2.verify(hash, password);
  } catch {
    return false;
  }
}

export function createApiKey(): { key: string; prefix: string; secretHash: string } {
  const prefix = `om_${randomUUID().replaceAll("-", "").slice(0, 12)}`;
  const secret = randomBytes(32).toString("base64url");
  return { key: `${prefix}.${secret}`, prefix, secretHash: hashApiKeySecret(secret) };
}

export function hashApiKeySecret(secret: string): string {
  return createHash("sha256").update(secret).digest("hex");
}

export function parseApiKey(value: string): { prefix: string; secretHash: string } | null {
  const [prefix, secret, extra] = value.split(".");
  if (!prefix?.startsWith("om_") || !secret || extra) return null;
  return { prefix, secretHash: hashApiKeySecret(secret) };
}
