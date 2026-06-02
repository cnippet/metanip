"use client";

import { inferAdditionalFields } from "better-auth/client/plugins";
import { createAuthClient as createBetterAuthClient } from "better-auth/react";
import type { auth } from "./server";

// BetterAuthClientBase uses the non-generic return type to produce a portable
// type for declaration emit. better-auth 1.6.x references internal .mjs types
// (InferSignUpEmailCtx, InferUserUpdateCtx) via the inferAdditionalFields plugin
// generic, which TypeScript's declaration emitter cannot import.
type BetterAuthClientBase = ReturnType<typeof createBetterAuthClient>;

const authClient = createBetterAuthClient({
  plugins: [inferAdditionalFields<typeof auth>()],
});

const _base = authClient as unknown as BetterAuthClientBase;

export const signIn: BetterAuthClientBase["signIn"] = _base.signIn;
export const signUp: BetterAuthClientBase["signUp"] = _base.signUp;
export const signOut: BetterAuthClientBase["signOut"] = _base.signOut;
export const useSession: BetterAuthClientBase["useSession"] = _base.useSession;
export const changePassword: BetterAuthClientBase["changePassword"] = _base.changePassword;
export const linkSocial: BetterAuthClientBase["linkSocial"] = _base.linkSocial;
export const unlinkAccount: BetterAuthClientBase["unlinkAccount"] = _base.unlinkAccount;

// forgetPassword and resetPassword exist at runtime via better-auth's dynamic
// proxy but are absent from the TypeScript types without explicit server-type
// binding. Export them with explicit signatures so callers stay fully typed.
type BetterAuthResponse<T = unknown> = Promise<{
  data: T | null;
  error: { message?: string; status: number; statusText: string } | null;
}>;

const _client = authClient as Record<string, unknown>;

// The server endpoint is /request-password-reset (not /forget-password).
// The proxy converts camelCase → kebab-case, so requestPasswordReset → /request-password-reset.
export const forgetPassword = _client.requestPasswordReset as (data: {
  email: string;
  redirectTo?: string;
}) => BetterAuthResponse<{ status: boolean }>;

export const resetPassword = _client.resetPassword as (data: {
  newPassword: string;
  token: string;
}) => BetterAuthResponse<void>;

export const createAuthClient = (): BetterAuthClientBase => _base;
export type SignIn = typeof signIn;
