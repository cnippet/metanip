import { auth } from "@repo/auth/server";
import { prisma } from "@repo/database";
import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { generateApiKey } from "@/lib/api-key";

export async function GET() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const apiKeys = await prisma.apiKey.findMany({
    orderBy: { createdAt: "desc" },
    select: {
      createdAt: true,
      id: true,
      keyPrefix: true,
      lastUsedAt: true,
      name: true,
      usageCount: true,
    },
    where: { userId: session.user.id },
  });

  return NextResponse.json({ apiKeys });
}

export async function POST(req: Request) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = (await req.json()) as { name?: string };
  const name = body.name?.trim();
  if (!name)
    return NextResponse.json({ error: "name is required" }, { status: 400 });

  const existing = await prisma.apiKey.count({
    where: { userId: session.user.id },
  });
  if (existing >= 10) {
    return NextResponse.json(
      { error: "Maximum of 10 API keys per account" },
      { status: 400 },
    );
  }

  const { raw, hash, prefix } = generateApiKey();

  const apiKey = await prisma.apiKey.create({
    data: {
      keyHash: hash,
      keyPrefix: prefix,
      name,
      userId: session.user.id,
    },
    select: { createdAt: true, id: true, keyPrefix: true, name: true },
  });

  // Return the raw key only once — never stored in plain text
  return NextResponse.json(
    { apiKey: { ...apiKey, rawKey: raw } },
    { status: 201 },
  );
}
