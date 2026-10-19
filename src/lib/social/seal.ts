import "server-only";
import { createCipheriv, createDecipheriv, hkdfSync, randomBytes } from "node:crypto";

// Токены соцсетей лежат в базе зашифрованными (AES-256-GCM). Ключ выводится из
// SESSION_SECRET, отдельного секрета не нужно; сменился SESSION_SECRET — аккаунты
// подключаются заново.

function key(): Buffer {
  const secret = process.env.SESSION_SECRET;
  if (!secret) throw new Error("SESSION_SECRET is not set");
  return Buffer.from(hkdfSync("sha256", secret, "neuralcosmology", "social-tokens", 32));
}

export function seal(plain: string): string {
  const iv = randomBytes(12);
  const c = createCipheriv("aes-256-gcm", key(), iv);
  const body = Buffer.concat([c.update(plain, "utf8"), c.final()]);
  return ["v1", iv.toString("base64url"), c.getAuthTag().toString("base64url"), body.toString("base64url")].join(".");
}

export function unseal(sealed: string): string {
  const [v, iv, tag, body] = sealed.split(".");
  if (v !== "v1" || !iv || !tag || !body) throw new Error("bad sealed token");
  const d = createDecipheriv("aes-256-gcm", key(), Buffer.from(iv, "base64url"));
  d.setAuthTag(Buffer.from(tag, "base64url"));
  return Buffer.concat([d.update(Buffer.from(body, "base64url")), d.final()]).toString("utf8");
}
