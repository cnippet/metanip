import { prisma } from "@repo/database";
import { auth } from "@repo/auth/server";
import { upload } from "@repo/storage";
import { headers } from "next/headers";
import { NextResponse } from "next/server";

export async function GET() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const generations = await prisma.generation.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: "desc" },
    take: 50,
    select: {
      id: true,
      templateId: true,
      imageUrl: true,
      metadata: true,
      createdAt: true,
    },
  });

  return NextResponse.json({ generations });
}

export async function POST(req: Request) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = (await req.json()) as {
    templateId?: string;
    metadata?: unknown;
    customizations?: unknown;
    dataUrl?: string;
  };

  if (!body.templateId) {
    return NextResponse.json({ error: "templateId is required" }, { status: 400 });
  }

  let imageUrl: string | null = null;
  let imagePublicId: string | null = null;

  if (body.dataUrl) {
    const result = await upload(body.dataUrl, { folder: "metanip/generations" });
    if (result) {
      imageUrl = result.url;
      imagePublicId = result.publicId;
    }
  }

  const generation = await prisma.generation.create({
    data: {
      userId: session.user.id,
      templateId: body.templateId,
      metadata: body.metadata ?? {},
      customizations: body.customizations ?? {},
      imageUrl,
      imagePublicId,
    },
    select: { id: true },
  });

  return NextResponse.json({ generation }, { status: 201 });
}
