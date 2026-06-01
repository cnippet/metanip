import { prisma } from "@repo/database";
import { render } from "@react-email/render";
import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { createElement } from "react";
import { Resend } from "resend";

import { ResetPasswordEmail } from "./emails/reset-password";
import { SignInEmail } from "./emails/sign-in";
import { WelcomeEmail } from "./emails/welcome-email";
import { generateUserCid } from "./utils";

const notify_resend = process.env.NOTIFY_RESEND_API_KEY
  ? new Resend(process.env.NOTIFY_RESEND_API_KEY)
  : null;

const team_resend = process.env.TEAM_RESEND_API_KEY
  ? new Resend(process.env.TEAM_RESEND_API_KEY)
  : null;

const system_resend = process.env.SYSTEM_RESEND_API_KEY
  ? new Resend(process.env.SYSTEM_RESEND_API_KEY)
  : null;

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_DOMAIN || "https://blocks.cnippet.dev";

export const auth = betterAuth({
  baseURL: process.env.NEXT_PUBLIC_URL ?? "http://localhost:3000",
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),

  databaseHooks: {
    session: {
      create: {
        after: async (session) => {
          try {
            // Only handle social users — email/password logins are handled in the app
            const socialAccount = await prisma.account.findFirst({
              where: {
                userId: session.userId,
                providerId: { not: "credential" },
              },
            });
            if (!socialAccount) return;

            const user = await prisma.user.findUnique({
              select: { createdAt: true, email: true, name: true },
              where: { id: session.userId },
            });
            if (!user) return;

            // Skip the initial registration session (created within 60 s of account)
            const sessionCreatedAt =
              session.createdAt instanceof Date
                ? session.createdAt
                : new Date(session.createdAt as string);
            if (sessionCreatedAt.getTime() - user.createdAt.getTime() < 60_000)
              return;

            const time = new Date().toLocaleString("en-US", {
              day: "numeric",
              hour: "2-digit",
              minute: "2-digit",
              month: "long",
              timeZone: "UTC",
              timeZoneName: "short",
              weekday: "long",
              year: "numeric",
            });

            const html = await render(
              createElement(SignInEmail, {
                ip: session.ipAddress || "Unknown",
                manageNotificationsUrl: `${SITE_URL}/account/settings`,
                securityUrl: `${SITE_URL}/account/settings/authentication`,
                time,
                userAgent: session.userAgent || "Unknown",
                userEmail: user.email,
                username: user.name || "there",
              }),
            );

            await notify_resend?.emails.send({
              from: "Cnippet <no-reply@notifications.cnippet.dev>",
              html,
              subject: "New sign-in to your Cnippet account",
              to: user.email,
            });
          } catch (err) {
            console.error("sign-in notification error:", err);
          }
        },
      },
    },
    user: {
      create: {
        after: async (user) => {
          try {
            // Only send welcome email for social sign-ups.
            // Email/password registrations have emailVerified: false at creation
            // and are handled by verifyOTPAndSignUp in the app.
            if (!user.emailVerified) return;

            const html = await render(
              createElement(WelcomeEmail, {
                loginUrl: `${SITE_URL}/account`,
                userEmail: user.email,
                username: user.name || "there",
              }),
            );

            await team_resend?.emails.send({
              from: "Vaishnavi <vaishnavi@team.cnippet.dev>",
              html,
              subject: "Welcome to Cnippet!",
              to: user.email,
            });
          } catch (err) {
            console.error("welcome email error:", err);
          }
        },
      },
    },
  },

  emailAndPassword: {
    enabled: true,
    sendResetPassword: async ({ user, url }) => {
      const html = await render(
        createElement(ResetPasswordEmail, {
          resetLink: url,
          userEmail: user.email,
        }),
      );

      await system_resend?.emails.send({
        from: "Cnippet <no-reply@system.cnippet.dev>",
        html,
        subject: "Reset your password",
        to: user.email,
      });
    },
  },
  socialProviders: {
    github: {
      clientId: process.env.GITHUB_CLIENT_ID as string,
      clientSecret: process.env.GITHUB_CLIENT_SECRET as string,
    },
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    },
  },
  trustedOrigins: [
    "http://localhost:3000",
    ...(process.env.NEXT_PUBLIC_URL ? [process.env.NEXT_PUBLIC_URL] : []),
  ],
  user: {
    additionalFields: {
      cId: {
        defaultValue: generateUserCid,
        input: false,
        required: false,
        type: "string",
      },
      pro: {
        defaultValue: false,
        input: false,
        required: false,
        type: "boolean",
      },
    },
  },
});

export type Auth = ReturnType<typeof betterAuth>;
export type Session = Auth["$Infer"]["Session"];
