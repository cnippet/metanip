import { auth } from "@repo/auth/server";
import { prisma } from "@repo/database";
import { BookmarkIcon } from "lucide-react";
import { headers } from "next/headers";
import Link from "next/link";
import { redirect } from "next/navigation";
import { PresetsGrid } from "./presets-grid";

export default async function PresetsPage() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) redirect("/login");

  const presets = await prisma.preset.findMany({
    orderBy: { createdAt: "desc" },
    select: {
      createdAt: true,
      customizations: true,
      dimensions: true,
      id: true,
      metadata: true,
      name: true,
      templateId: true,
    },
    where: { userId: session.user.id },
  });

  const serialized = presets.map((p) => ({
    ...p,
    createdAt: p.createdAt.toISOString(),
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
        <span className="text-foreground">Presets</span>
      </div>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="flex items-center gap-2 font-semibold text-2xl">
            <BookmarkIcon className="size-5" />
            Presets
          </h1>
          <p className="mt-1 text-muted-foreground text-sm">
            {presets.length === 0
              ? "No presets yet"
              : `${presets.length} saved preset${presets.length === 1 ? "" : "s"}`}
          </p>
        </div>
        <Link
          className="text-muted-foreground text-sm transition-colors hover:text-foreground"
          href="/"
        >
          + New image
        </Link>
      </div>

      <PresetsGrid initialPresets={serialized} />
    </main>
  );
}
