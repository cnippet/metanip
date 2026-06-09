import { prisma } from "@repo/database";
import { auth } from "@repo/auth/server";
import { KeyRoundIcon } from "lucide-react";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import Link from "next/link";
import { ApiKeyManager } from "./api-key-manager";

export default async function ApiKeysPage() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) redirect("/login");

  const apiKeys = await prisma.apiKey.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      name: true,
      keyPrefix: true,
      usageCount: true,
      lastUsedAt: true,
      createdAt: true,
    },
  });

  const serialized = apiKeys.map((k) => ({
    ...k,
    lastUsedAt: k.lastUsedAt?.toISOString() ?? null,
    createdAt: k.createdAt.toISOString(),
  }));

  return (
    <main className="mx-auto max-w-4xl px-4 py-12 sm:px-6">
      <div className="flex items-center gap-2 text-muted-foreground text-sm mb-1">
        <Link
          href="/dashboard"
          className="hover:text-foreground transition-colors"
        >
          Dashboard
        </Link>
        <span>/</span>
        <span className="text-foreground">API Keys</span>
      </div>

      <div className="flex items-start justify-between mb-8">
        <div>
          <h1 className="text-2xl font-semibold flex items-center gap-2">
            <KeyRoundIcon className="size-5" />
            API Keys
          </h1>
          <p className="text-muted-foreground text-sm mt-1">
            Use these keys to call{" "}
            <code className="font-mono text-xs">/api/og</code> programmatically.
            Keys are shown only once at creation.
          </p>
        </div>
        <Link
          href="/docs/api"
          className="text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          View API docs →
        </Link>
      </div>

      <ApiKeyManager initialKeys={serialized} />
    </main>
  );
}
