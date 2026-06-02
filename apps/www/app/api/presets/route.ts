import { prisma } from "@repo/database";
import { auth } from "@repo/auth/server";
import { headers } from "next/headers";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const templateId = searchParams.get("templateId");

  const presets = await prisma.preset.findMany({
    where: {
      userId: session.user.id,
      ...(templateId ? { templateId } : {}),
    },
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

  return NextResponse.json({ presets });
}

export async function POST(req: Request) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = (await req.json()) as {
    name?: string;
    templateId?: string;
    metadata?: unknown;
    customizations?: unknown;
    dimensions?: unknown;
  };

  if (!body.name?.trim() || !body.templateId) {
    return NextResponse.json({ error: "name and templateId are required" }, { status: 400 });
  }

  const preset = await prisma.preset.create({
    data: {
      userId: session.user.id,
      name: body.name.trim(),
      templateId: body.templateId,
      metadata: body.metadata ?? {},
      customizations: body.customizations ?? {},
      dimensions: body.dimensions ?? {},
    },
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

  return NextResponse.json({ preset }, { status: 201 });
}
