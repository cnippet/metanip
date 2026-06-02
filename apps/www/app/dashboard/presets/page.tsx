import { prisma } from "@repo/database";
import { auth } from "@repo/auth/server";
import { BookmarkIcon } from "lucide-react";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import Link from "next/link";
import { PresetsGrid } from "./presets-grid";

export default async function PresetsPage() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) redirect("/login");

  const presets = await prisma.preset.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      name: true,
      templateId: true,
      metadata: true,
      customizations: true,
      dimensions: true,
      createdAt: true,
    },
  });

  const serialized = presets.map((p) => ({
    ...p,
    createdAt: p.createdAt.toISOString(),
  }));

  return (
    <main className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
      <div className="flex items-center gap-2 text-muted-foreground text-sm mb-1">
        <Link href="/dashboard" className="hover:text-foreground transition-colors">
          Dashboard
        </Link>
        <span>/</span>
        <span className="text-foreground">Presets</span>
      </div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-semibold flex items-center gap-2">
            <BookmarkIcon className="size-5" />
            Presets
          </h1>
          <p className="text-muted-foreground text-sm mt-1">
            {presets.length === 0
              ? "No presets yet"
              : `${presets.length} saved preset${presets.length === 1 ? "" : "s"}`}
          </p>
        </div>
        <Link
          href="/"
          className="text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          + New image
        </Link>
      </div>

      <PresetsGrid initialPresets={serialized} />
    </main>
  );
}
