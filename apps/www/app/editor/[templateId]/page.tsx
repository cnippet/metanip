import { MetadataSchema } from "@repo/metadata";
import { getTemplate } from "@repo/templates";
import { notFound } from "next/navigation";

const PREVIEW_SCALE = 0.55;

export default async function EditorPage({
  params,
}: {
  params: Promise<{ templateId: string }>;
}) {
  const { templateId } = await params;
  const template = getTemplate(templateId);
  if (!template) notFound();

  const { BrowserComponent } = template;

  const metadata = MetadataSchema.parse({
    title: "Hello, World",
    ...template.defaults.metadata,
  });
  const customizations = template.defaults.customizations;
  const dimension = template.supportedDimensions[0]!;

  const scaledW = Math.round(dimension.w * PREVIEW_SCALE);
  const scaledH = Math.round(dimension.h * PREVIEW_SCALE);

  return (
    <div className="min-h-screen bg-zinc-100 dark:bg-zinc-950 flex flex-col items-center py-12 px-6">
      <div className="flex flex-col items-center gap-1.5 mb-8 text-center">
        <p className="text-xs text-muted-foreground">
          Phase 2 preview — editor UI coming in Phase 4
        </p>
        <h1 className="text-xl font-semibold text-foreground">{template.name}</h1>
        <p className="text-sm text-muted-foreground">{template.description}</p>
      </div>

      <div style={{ width: scaledW, height: scaledH }}>
        <div
          className="shadow-2xl rounded-lg overflow-hidden"
          style={{
            transform: `scale(${PREVIEW_SCALE})`,
            transformOrigin: "top left",
            width: dimension.w,
            height: dimension.h,
          }}
        >
          <BrowserComponent
            metadata={metadata}
            customizations={customizations}
            dimensions={dimension}
          />
        </div>
      </div>

      <p className="mt-8 text-xs text-muted-foreground">
        Satori API:{" "}
        <code className="bg-zinc-200 dark:bg-zinc-800 px-1.5 py-0.5 rounded text-xs">
          {`/api/og?templateId=${templateId}&title=Hello+World`}
        </code>
      </p>
    </div>
  );
}
