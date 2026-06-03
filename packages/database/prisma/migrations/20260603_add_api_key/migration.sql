-- Add ApiKey table for Phase 8 public API + rate limiting
CREATE TABLE IF NOT EXISTS "ApiKey" (
  "id"         TEXT NOT NULL,
  "userId"     TEXT NOT NULL,
  "name"       TEXT NOT NULL,
  "keyHash"    TEXT NOT NULL,
  "keyPrefix"  TEXT NOT NULL,
  "usageCount" INTEGER NOT NULL DEFAULT 0,
  "lastUsedAt" TIMESTAMP(3),
  "createdAt"  TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT "ApiKey_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX IF NOT EXISTS "ApiKey_keyHash_key" ON "ApiKey"("keyHash");

ALTER TABLE "ApiKey"
  ADD CONSTRAINT "ApiKey_userId_fkey"
  FOREIGN KEY ("userId")
  REFERENCES "user"("id")
  ON DELETE CASCADE
  ON UPDATE CASCADE;
