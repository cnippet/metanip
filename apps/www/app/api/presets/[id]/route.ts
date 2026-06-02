import { prisma } from "@repo/database";
import { auth } from "@repo/auth/server";
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

  const preset = await prisma.preset.findUnique({ where: { id } });
  if (!preset || preset.userId !== session.user.id) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  await prisma.preset.delete({ where: { id } });

  return new NextResponse(null, { status: 204 });
}
