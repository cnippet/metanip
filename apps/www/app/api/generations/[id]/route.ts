import { prisma } from "@repo/database";
import { auth } from "@repo/auth/server";
import { remove } from "@repo/storage";
import { headers } from "next/headers";
import { NextResponse } from "next/server";

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;

  const generation = await prisma.generation.findUnique({ where: { id } });
  if (!generation || generation.userId !== session.user.id) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  if (generation.imagePublicId) {
    await remove(generation.imagePublicId).catch(() => {});
  }

  await prisma.generation.delete({ where: { id } });

  return new NextResponse(null, { status: 204 });
}
