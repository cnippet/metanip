import { MetadataSchema } from "@repo/metadata";
import { getTemplate, loadInterFonts } from "@repo/templates";
import { ImageResponse } from "next/og";
import type { NextRequest } from "next/server";

export const runtime = "edge";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = request.nextUrl;

    // 1. Resolve template
    const templateId = searchParams.get("templateId");
    if (!templateId) {
      return new Response("Missing templateId", { status: 400 });
    }
    const template = getTemplate(templateId);
    if (!template) {
      return new Response(`Template "${templateId}" not found`, { status: 404 });
    }

    // 2. Parse metadata from query params
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
    if (tags.length > 0) rawMetadata["tags"] = tags;
    const readingTime = searchParams.get("readingTime");
    if (readingTime) rawMetadata["readingTime"] = Number(readingTime);

    const metadata = MetadataSchema.parse({
      title: "Untitled",
      ...template.defaults.metadata,
      ...rawMetadata,
    });

    // 3. Parse customizations (start from template defaults, override with query params)
    const customizations: Record<string, unknown> = {
      ...template.defaults.customizations,
    };
    for (const [key, control] of Object.entries(template.customizations)) {
      const val = searchParams.get(key);
      if (val === null) continue;
      if (control.type === "slider") customizations[key] = parseFloat(val);
      else if (control.type === "toggle") customizations[key] = val === "true";
      else customizations[key] = val;
    }

    // 4. Resolve dimension (default to first; accept ?dimension=Twitter etc.)
    const dimLabel = searchParams.get("dimension");
    const dimension =
      (dimLabel
        ? template.supportedDimensions.find((d) => d.label === dimLabel)
        : undefined) ?? template.supportedDimensions[0];

    if (!dimension) {
      return new Response("No supported dimensions for template", { status: 500 });
    }

    // 5. Load fonts in parallel with everything above already done
    const fonts = await loadInterFonts();

    // 6. Render
    const { SatoriComponent } = template;

    return new ImageResponse(
      <SatoriComponent
        metadata={metadata}
        customizations={customizations}
        dimensions={dimension}
      />,
      {
        width: dimension.w,
        height: dimension.h,
        fonts,
        headers: {
          "Cache-Control": "public, immutable, max-age=31536000",
        },
      },
    );
  } catch (err) {
    console.error("[/api/og]", err);
    return new Response("Failed to generate image", { status: 500 });
  }
}
