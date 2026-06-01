import { getTemplate } from "@repo/templates";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { EditorClient } from "./editor-client";

export default async function EditorPage({
  params,
}: {
  params: Promise<{ templateId: string }>;
}) {
  const { templateId } = await params;
  if (!getTemplate(templateId)) notFound();

  return (
    <Suspense fallback={<div className="h-screen flex items-center justify-center text-muted-foreground text-sm">Loading editor…</div>}>
      <EditorClient templateId={templateId} />
    </Suspense>
  );
}
