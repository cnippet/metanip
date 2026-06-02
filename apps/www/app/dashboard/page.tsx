import { auth } from "@repo/auth/server";
import { LayoutDashboardIcon } from "lucide-react";
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
        <div className="rounded-xl border bg-card p-6 space-y-2">
          <p className="font-medium text-sm">Presets</p>
          <p className="text-3xl font-semibold">0</p>
          <p className="text-muted-foreground text-xs">Saved template configurations</p>
        </div>
        <div className="rounded-xl border bg-card p-6 space-y-2">
          <p className="font-medium text-sm">Generations</p>
          <p className="text-3xl font-semibold">0</p>
          <p className="text-muted-foreground text-xs">Images generated so far</p>
        </div>
      </div>
    </main>
  );
}
