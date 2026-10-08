"use client";

import { signIn, signUp } from "@repo/auth/client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { toastManager } from "@/components/ui/toast";

function GitHubIcon() {
  return (
    <svg aria-hidden="true" fill="currentColor" viewBox="0 0 24 24">
      <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0 1 12 6.844a9.59 9.59 0 0 1 2.504.337c1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.02 10.02 0 0 0 22 12.017C22 6.484 17.522 2 12 2z" />
    </svg>
  );
}

function GoogleIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24">
      <path
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
        fill="#4285F4"
      />
      <path
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
        fill="#34A853"
      />
      <path
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"
        fill="#FBBC05"
      />
      <path
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
        fill="#EA4335"
      />
    </svg>
  );
}

export default function SignupPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState<"email" | "google" | "github" | null>(
    null,
  );

  async function handleEmailSignUp(e: React.FormEvent) {
    e.preventDefault();
    setLoading("email");
    const { error } = await signUp.email({
      callbackURL: "/dashboard",
      email,
      name,
      password,
    });
    if (error) {
      toastManager.add({
        title: error.message ?? "Sign up failed",
        type: "error",
      });
      setLoading(null);
    } else {
      router.push("/dashboard");
    }
  }

  async function handleSocial(provider: "google" | "github") {
    setLoading(provider);
    await signIn.social({ callbackURL: "/dashboard", provider });
  }

  return (
    <div className="flex min-h-screen items-center justify-center px-4 py-12">
      <div className="w-full max-w-sm space-y-6">
        <div className="space-y-1 text-center">
          <Link
            className="inline-flex items-center gap-2 font-semibold text-foreground"
            href="/"
          >
            Metanip
          </Link>
          <h1 className="font-semibold text-xl">Create an account</h1>
          <p className="text-muted-foreground text-sm">
            Save presets and generation history
          </p>
        </div>

        <div className="space-y-3">
          <Button
            className="w-full"
            disabled={loading !== null}
            loading={loading === "google"}
            onClick={() => handleSocial("google")}
            variant="outline"
          >
            <GoogleIcon />
            Continue with Google
          </Button>
          <Button
            className="w-full"
            disabled={loading !== null}
            loading={loading === "github"}
            onClick={() => handleSocial("github")}
            variant="outline"
          >
            <GitHubIcon />
            Continue with GitHub
          </Button>
        </div>

        <div className="flex items-center gap-3">
          <Separator className="flex-1" />
          <span className="text-muted-foreground text-xs">or</span>
          <Separator className="flex-1" />
        </div>

        <form className="space-y-4" onSubmit={handleEmailSignUp}>
          <div className="space-y-1.5">
            <Label htmlFor="name">Name</Label>
            <Input
              autoComplete="name"
              id="name"
              onChange={(e) => setName(e.target.value)}
              placeholder="Your name"
              required
              type="text"
              value={name}
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="email">Email</Label>
            <Input
              autoComplete="email"
              id="email"
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              required
              type="email"
              value={email}
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="password">Password</Label>
            <Input
              autoComplete="new-password"
              id="password"
              minLength={8}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              type="password"
              value={password}
            />
          </div>
          <Button
            className="w-full"
            disabled={loading !== null}
            loading={loading === "email"}
            type="submit"
          >
            Create account
          </Button>
        </form>

        <p className="text-center text-muted-foreground text-xs">
          Already have an account?{" "}
          <Link
            className="text-foreground underline underline-offset-4"
            href="/login"
          >
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
