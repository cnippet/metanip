import { auth } from "@repo/auth/server";
import { prisma } from "@repo/database";
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
    where: {
      userId: session.user.id,
      ...(templateId ? { templateId } : {}),
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
    return NextResponse.json(
      { error: "name and templateId are required" },
      { status: 400 },
    );
  }

  const preset = await prisma.preset.create({
    data: {
      customizations: body.customizations ?? {},
      dimensions: body.dimensions ?? {},
      metadata: body.metadata ?? {},
      name: body.name.trim(),
      templateId: body.templateId,
      userId: session.user.id,
    },
    select: {
      createdAt: true,
      customizations: true,
      dimensions: true,
      id: true,
      metadata: true,
      name: true,
      templateId: true,
    },
  });

  return NextResponse.json({ preset }, { status: 201 });
}
