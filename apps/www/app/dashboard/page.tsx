import { prisma } from "@repo/database";
import { auth } from "@repo/auth/server";
import {
  HistoryIcon,
  KeyRoundIcon,
  LayoutDashboardIcon,
  BookmarkIcon,
} from "lucide-react";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default async function DashboardPage() {
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session) {
    redirect("/login");
  }

  const { user } = session;
  const firstName = user.name.split(" ")[0];

  const [presetCount, generationCount, apiKeyCount] = await Promise.all([
    prisma.preset.count({ where: { userId: user.id } }),
    prisma.generation.count({ where: { userId: user.id } }),
    prisma.apiKey.count({ where: { userId: user.id } }),
  ]);

  return (
    <main className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-muted-foreground text-sm">
            <LayoutDashboardIcon className="size-4" />
            Dashboard
          </div>
          <h1 className="text-2xl font-semibold">Hello, {firstName}!</h1>
          <p className="text-muted-foreground text-sm">{user.email}</p>
        </div>
        <Button render={<Link href="/" />}>Create image</Button>
      </div>

      <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <Link
          href="/dashboard/presets"
          className="rounded-xl border bg-card p-6 space-y-2 hover:border-foreground/20 hover:shadow-sm transition-all"
        >
          <div className="flex items-center justify-between">
            <p className="font-medium text-sm">Presets</p>
            <BookmarkIcon className="size-4 text-muted-foreground" />
          </div>
          <p className="text-3xl font-semibold">{presetCount}</p>
          <p className="text-muted-foreground text-xs">
            Saved template configurations
          </p>
        </Link>

        <Link
          href="/dashboard/history"
          className="rounded-xl border bg-card p-6 space-y-2 hover:border-foreground/20 hover:shadow-sm transition-all"
        >
          <div className="flex items-center justify-between">
            <p className="font-medium text-sm">Generations</p>
            <HistoryIcon className="size-4 text-muted-foreground" />
          </div>
          <p className="text-3xl font-semibold">{generationCount}</p>
          <p className="text-muted-foreground text-xs">
            Images generated so far
          </p>
        </Link>

        <Link
          href="/dashboard/api-keys"
          className="rounded-xl border bg-card p-6 space-y-2 hover:border-foreground/20 hover:shadow-sm transition-all"
        >
          <div className="flex items-center justify-between">
            <p className="font-medium text-sm">API Keys</p>
            <KeyRoundIcon className="size-4 text-muted-foreground" />
          </div>
          <p className="text-3xl font-semibold">{apiKeyCount}</p>
          <p className="text-muted-foreground text-xs">
            Active keys · 100 req / day each
          </p>
        </Link>
      </div>
    </main>
  );
}
