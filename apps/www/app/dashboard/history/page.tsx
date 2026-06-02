import { prisma } from "@repo/database";
import { auth } from "@repo/auth/server";
import { HistoryIcon } from "lucide-react";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import Link from "next/link";
import { HistoryList } from "./history-list";

export default async function HistoryPage() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) redirect("/login");

  const generations = await prisma.generation.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: "desc" },
    take: 50,
    select: {
      id: true,
      templateId: true,
      imageUrl: true,
      metadata: true,
      createdAt: true,
    },
  });

  const serialized = generations.map((g) => ({
    ...g,
    createdAt: g.createdAt.toISOString(),
  }));

  return (
    <main className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
      <div className="flex items-center gap-2 text-muted-foreground text-sm mb-1">
        <Link href="/dashboard" className="hover:text-foreground transition-colors">
          Dashboard
        </Link>
        <span>/</span>
        <span className="text-foreground">History</span>
      </div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-semibold flex items-center gap-2">
            <HistoryIcon className="size-5" />
            Generation History
          </h1>
          <p className="text-muted-foreground text-sm mt-1">
            {generations.length === 0
              ? "No generations yet"
              : `${generations.length} image${generations.length === 1 ? "" : "s"} generated`}
          </p>
        </div>
        <Link
          href="/"
          className="text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          + New image
        </Link>
      </div>

      <HistoryList initialGenerations={serialized} />
    </main>
  );
}
