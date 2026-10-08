import { auth } from "@repo/auth/server";
import { prisma } from "@repo/database";
import { upload } from "@repo/storage";
import { headers } from "next/headers";
import { NextResponse } from "next/server";

export async function GET() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const generations = await prisma.generation.findMany({
    orderBy: { createdAt: "desc" },
    select: {
      createdAt: true,
      id: true,
      imageUrl: true,
      metadata: true,
      templateId: true,
    },
    take: 50,
    where: { userId: session.user.id },
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
    return NextResponse.json(
      { error: "templateId is required" },
      { status: 400 },
    );
  }

  let imageUrl: string | null = null;
  let imagePublicId: string | null = null;

  if (body.dataUrl) {
    const result = await upload(body.dataUrl, {
      folder: "metanip/generations",
    });
    if (result) {
      imageUrl = result.url;
      imagePublicId = result.publicId;
    }
  }

  const generation = await prisma.generation.create({
    data: {
      customizations: body.customizations ?? {},
      imagePublicId,
      imageUrl,
      metadata: body.metadata ?? {},
      templateId: body.templateId,
      userId: session.user.id,
    },
    select: { id: true },
  });

  return NextResponse.json({ generation }, { status: 201 });
}
