"use client";

import { signOut, useSession } from "@repo/auth/client";
import {
  ImageIcon,
  LayoutDashboardIcon,
  LogOutIcon,
  UserIcon,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/menu";

function UserMenu({
  name,
  email,
  image,
}: {
  name: string;
  email: string;
  image?: string | null;
}) {
  const router = useRouter();

  async function handleSignOut() {
    await signOut({ fetchOptions: { onSuccess: () => router.push("/") } });
  }

  const initials = name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        className="rounded-full outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1 focus-visible:ring-offset-background"
        aria-label="User menu"
      >
        <Avatar className="size-8">
          {image && <AvatarImage src={image} alt={name} />}
          <AvatarFallback>{initials}</AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" side="bottom" sideOffset={8}>
        <div className="px-2 py-1.5">
          <p className="text-sm font-medium leading-none">{name}</p>
          <p className="text-xs text-muted-foreground mt-0.5">{email}</p>
        </div>
        <DropdownMenuSeparator />
        <DropdownMenuItem render={<Link href="/dashboard" />}>
          <LayoutDashboardIcon />
          Dashboard
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleSignOut} variant="destructive">
          <LogOutIcon />
          Sign out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export function Header() {
  const { data: session, isPending } = useSession();
  const user = session?.user;

  return (
    <header className="sticky top-0 z-40 border-b bg-background/80 backdrop-blur-sm">
      <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4 sm:px-6">
        <Link
          href="/"
          className="flex items-center gap-2 font-semibold text-foreground hover:opacity-80 transition-opacity"
        >
          <ImageIcon className="size-5" />
          Metanip
        </Link>

        <div className="flex items-center gap-2">
          {isPending ? (
            <div className="size-8 animate-pulse rounded-full bg-muted" />
          ) : user ? (
            <UserMenu name={user.name} email={user.email} image={user.image} />
          ) : (
            <Button variant="outline" size="sm" render={<Link href="/login" />}>
              <UserIcon />
              Sign in
            </Button>
          )}
        </div>
      </div>
    </header>
  );
}
