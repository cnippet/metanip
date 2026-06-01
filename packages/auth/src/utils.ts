import { randomBytes } from "crypto";

export function generateUserCid(): string {
  const PREFIX = "cn_";
  const raw = randomBytes(8)
    .toString("base64")
    .replace(/[^a-zA-Z0-9]/g, "");
  const candidate = PREFIX + raw.substring(0, 6).toLowerCase();
  return candidate;
}
