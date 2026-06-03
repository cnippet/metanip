import { prisma } from "@repo/database";
import { auth } from "@repo/auth/server";
import { headers } from "next/headers";
import { NextResponse } from "next/server";

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;

  const apiKey = await prisma.apiKey.findUnique({
    where: { id },
    select: { userId: true },
  });

  if (!apiKey) return NextResponse.json({ error: "Not found" }, { status: 404 });
  if (apiKey.userId !== session.user.id) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  await prisma.apiKey.delete({ where: { id } });
  return new Response(null, { status: 204 });
}
