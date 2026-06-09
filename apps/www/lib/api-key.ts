import crypto from "crypto";

const PREFIX = "mnp_";

export function generateApiKey(): {
  raw: string;
  hash: string;
  prefix: string;
} {
  const raw = PREFIX + crypto.randomBytes(32).toString("base64url");
  const hash = hashApiKey(raw);
  const prefix = raw.slice(0, 16) + "…";
  return { raw, hash, prefix };
}

export function hashApiKey(raw: string): string {
  return crypto.createHash("sha256").update(raw).digest("hex");
}

export function extractBearerToken(authHeader: string | null): string | null {
  if (!authHeader?.startsWith("Bearer ")) return null;
  return authHeader.slice(7).trim() || null;
}
