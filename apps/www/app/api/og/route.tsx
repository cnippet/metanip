import { auth } from "@repo/auth/server";
import { prisma } from "@repo/database";
import { MetadataSchema } from "@repo/metadata";
import { getTemplate, loadInterFonts } from "@repo/templates";
import { headers } from "next/headers";
import { ImageResponse } from "next/og";
import type { NextRequest } from "next/server";
import { extractBearerToken, hashApiKey } from "@/lib/api-key";
import {
  anonOgLimit,
  authedOgLimit,
  getClientIp,
} from "@/lib/upstash-rate-limit";

// Node.js runtime — required for Prisma (API key lookup) and crypto
export const runtime = "nodejs";

async function resolveIdentity(
  request: NextRequest,
): Promise<
  | { type: "anon"; ip: string }
  | { type: "authed"; id: string; apiKeyId?: string }
> {
  // 1. Check for API key in query param or Authorization header
  const rawKey =
    request.nextUrl.searchParams.get("apiKey") ??
    extractBearerToken(request.headers.get("authorization"));

  if (rawKey) {
    const hash = hashApiKey(rawKey);
    const apiKey = await prisma.apiKey.findUnique({
      select: { id: true, userId: true },
      where: { keyHash: hash },
    });
    if (apiKey) {
      // Update usage in background — don't await to keep response fast
      void prisma.apiKey.update({
        data: { lastUsedAt: new Date(), usageCount: { increment: 1 } },
        where: { id: apiKey.id },
      });
      return { apiKeyId: apiKey.id, id: apiKey.userId, type: "authed" };
    }
    // Invalid key — treat as anon (or you could return 401; being lenient here)
  }

  // 2. Check session cookie
  const session = await auth.api.getSession({ headers: await headers() });
  if (session) {
    return { id: session.user.id, type: "authed" };
  }

  return { ip: getClientIp(request), type: "anon" };
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = request.nextUrl;

    // 1. Resolve who is calling and apply rate limits
    const identity = await resolveIdentity(request);

    if (identity.type === "anon") {
      if (anonOgLimit) {
        const { success, limit, remaining, reset } = await anonOgLimit.limit(
          identity.ip,
        );
        if (!success) {
          return new Response(
            "Rate limit exceeded. 10 requests per hour for anonymous callers.",
            {
              headers: {
                "Retry-After": String(Math.ceil((reset - Date.now()) / 1000)),
                "X-RateLimit-Limit": String(limit),
                "X-RateLimit-Remaining": String(remaining),
                "X-RateLimit-Reset": String(reset),
              },
              status: 429,
            },
          );
        }
      }
    } else {
      if (authedOgLimit) {
        const { success, limit, remaining, reset } = await authedOgLimit.limit(
          identity.id,
        );
        if (!success) {
          return new Response(
            "Rate limit exceeded. 100 requests per day for authenticated callers.",
            {
              headers: {
                "Retry-After": String(Math.ceil((reset - Date.now()) / 1000)),
                "X-RateLimit-Limit": String(limit),
                "X-RateLimit-Remaining": String(remaining),
                "X-RateLimit-Reset": String(reset),
              },
              status: 429,
            },
          );
        }
      }
    }

    // 2. Resolve template
    const templateId = searchParams.get("templateId");
    if (!templateId) {
      return new Response("Missing templateId", { status: 400 });
    }
    const template = getTemplate(templateId);
    if (!template) {
      return new Response(`Template "${templateId}" not found`, {
        status: 404,
      });
    }

    // 3. Parse metadata from query params
    const rawMetadata: Record<string, unknown> = {};
    const stringFields = [
      "title",
      "subtitle",
      "description",
      "author",
      "authorAvatar",
      "authorHandle",
      "siteName",
      "siteUrl",
      "siteLogo",
      "heroImage",
      "themeColor",
    ] as const;
    for (const field of stringFields) {
      const val = searchParams.get(field);
      if (val !== null) rawMetadata[field] = val;
    }
    const tags = searchParams.getAll("tags");
    if (tags.length > 0) rawMetadata.tags = tags;
    const readingTime = searchParams.get("readingTime");
    if (readingTime) rawMetadata.readingTime = Number(readingTime);

    const metadata = MetadataSchema.parse({
      title: "Untitled",
      ...template.defaults.metadata,
      ...rawMetadata,
    });

    // 4. Parse customizations
    const customizations: Record<string, unknown> = {
      ...template.defaults.customizations,
    };
    for (const [key, control] of Object.entries(template.customizations)) {
      const val = searchParams.get(key);
      if (val === null) continue;
      if (control.type === "slider")
        customizations[key] = Number.parseFloat(val);
      else if (control.type === "toggle") customizations[key] = val === "true";
      else customizations[key] = val;
    }

    // 5. Resolve dimension
    const dimLabel = searchParams.get("dimension");
    const dimension =
      (dimLabel
        ? template.supportedDimensions.find((d) => d.label === dimLabel)
        : undefined) ?? template.supportedDimensions[0];

    if (!dimension) {
      return new Response("No supported dimensions for template", {
        status: 500,
      });
    }

    // 6. Load fonts
    const fonts = await loadInterFonts();

    // 7. Render
    const { SatoriComponent } = template;

    return new ImageResponse(
      <SatoriComponent
        customizations={customizations}
        dimensions={dimension}
        metadata={metadata}
      />,
      {
        fonts,
        headers: {
          "Cache-Control": "public, immutable, max-age=31536000",
        },
        height: dimension.h,
        width: dimension.w,
      },
    );
  } catch (err) {
    console.error("[/api/og]", err);
    return new Response("Failed to generate image", { status: 500 });
  }
}
