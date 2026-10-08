import { auth } from "@repo/auth/server";
import { prisma } from "@repo/database";
import { KeyRoundIcon } from "lucide-react";
import { headers } from "next/headers";
import Link from "next/link";
import { redirect } from "next/navigation";
import { ApiKeyManager } from "./api-key-manager";

export default async function ApiKeysPage() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) redirect("/login");

  const apiKeys = await prisma.apiKey.findMany({
    orderBy: { createdAt: "desc" },
    select: {
      createdAt: true,
      id: true,
      keyPrefix: true,
      lastUsedAt: true,
      name: true,
      usageCount: true,
    },
    where: { userId: session.user.id },
  });

  const serialized = apiKeys.map((k) => ({
    ...k,
    createdAt: k.createdAt.toISOString(),
    lastUsedAt: k.lastUsedAt?.toISOString() ?? null,
  }));

  return (
    <main className="mx-auto max-w-4xl px-4 py-12 sm:px-6">
      <div className="mb-1 flex items-center gap-2 text-muted-foreground text-sm">
        <Link
          className="transition-colors hover:text-foreground"
          href="/dashboard"
        >
          Dashboard
        </Link>
        <span>/</span>
        <span className="text-foreground">API Keys</span>
      </div>

      <div className="mb-8 flex items-start justify-between">
        <div>
          <h1 className="flex items-center gap-2 font-semibold text-2xl">
            <KeyRoundIcon className="size-5" />
            API Keys
          </h1>
          <p className="mt-1 text-muted-foreground text-sm">
            Use these keys to call{" "}
            <code className="font-mono text-xs">/api/og</code> programmatically.
            Keys are shown only once at creation.
          </p>
        </div>
        <Link
          className="text-muted-foreground text-sm transition-colors hover:text-foreground"
          href="/docs/api"
        >
          View API docs →
        </Link>
      </div>

      <ApiKeyManager initialKeys={serialized} />
    </main>
  );
}
