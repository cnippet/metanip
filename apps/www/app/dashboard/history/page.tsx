import { auth } from "@repo/auth/server";
import { prisma } from "@repo/database";
import { HistoryIcon } from "lucide-react";
import { headers } from "next/headers";
import Link from "next/link";
import { redirect } from "next/navigation";
import { HistoryList } from "./history-list";

export default async function HistoryPage() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) redirect("/login");

  const generations = await prisma.generation.findMany({
    orderBy: { createdAt: "desc" },
    select: {
      createdAt: true,
      id: true,
      imageUrl: true,
      metadata: true,
      templateId: true,
    },
    take: 50,
    where: { userId: session.user.id },
  });

  const serialized = generations.map((g) => ({
    ...g,
    createdAt: g.createdAt.toISOString(),
  }));

  return (
    <main className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
      <div className="mb-1 flex items-center gap-2 text-muted-foreground text-sm">
        <Link
          className="transition-colors hover:text-foreground"
          href="/dashboard"
        >
          Dashboard
        </Link>
        <span>/</span>
        <span className="text-foreground">History</span>
      </div>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="flex items-center gap-2 font-semibold text-2xl">
            <HistoryIcon className="size-5" />
            Generation History
          </h1>
          <p className="mt-1 text-muted-foreground text-sm">
            {generations.length === 0
              ? "No generations yet"
              : `${generations.length} image${generations.length === 1 ? "" : "s"} generated`}
          </p>
        </div>
        <Link
          className="text-muted-foreground text-sm transition-colors hover:text-foreground"
          href="/"
        >
          + New image
        </Link>
      </div>

      <HistoryList initialGenerations={serialized} />
    </main>
  );
}
