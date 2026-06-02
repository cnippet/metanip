"use client";

import { MetadataSchema } from "@repo/metadata";
import { getTemplate } from "@repo/templates";
import { TrashIcon } from "lucide-react";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { toastManager } from "@/components/ui/toast";

type RawPreset = {
  id: string;
  name: string;
  templateId: string;
  metadata: unknown;
  customizations: unknown;
  dimensions: unknown;
  createdAt: string;
};

type Dim = { w: number; h: number; label: string };

function PresetThumbnail({ preset }: { preset: RawPreset }) {
  const template = getTemplate(preset.templateId);
  const containerRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(0.2);

  useEffect(() => {
    const el = containerRef.current;
    if (!el || !template) return;
    const dim = (preset.dimensions as Dim) ?? template.supportedDimensions[0]!;
    const obs = new ResizeObserver(([entry]) => {
      if (entry) setScale(entry.contentRect.width / dim.w);
    });
    obs.observe(el);
    return () => obs.disconnect();
  }, [preset.dimensions, template]);

  if (!template) {
    return (
      <div className="aspect-video bg-muted flex items-center justify-center text-xs text-muted-foreground">
        Unknown template
      </div>
    );
  }

  const dim = (preset.dimensions as Dim) ?? template.supportedDimensions[0]!;

  let metadata;
  try {
    metadata = MetadataSchema.parse(preset.metadata);
  } catch {
    metadata = MetadataSchema.parse({ title: "Preset" });
  }

  const { BrowserComponent } = template;

  return (
    <div
      className="relative overflow-hidden bg-zinc-100 dark:bg-zinc-900"
      ref={containerRef}
      style={{ aspectRatio: `${dim.w}/${dim.h}` }}
    >
      <div
        style={{
          height: dim.h,
          left: 0,
          position: "absolute",
          top: 0,
          transform: `scale(${scale})`,
          transformOrigin: "top left",
          width: dim.w,
        }}
      >
        <BrowserComponent
          customizations={preset.customizations as Record<string, unknown>}
          dimensions={dim}
          metadata={metadata}
        />
      </div>
    </div>
  );
}

export function PresetsGrid({ initialPresets }: { initialPresets: RawPreset[] }) {
  const [presets, setPresets] = useState(initialPresets);
  const [deleting, setDeleting] = useState<string | null>(null);

  async function handleDelete(id: string) {
    setDeleting(id);
    try {
      const res = await fetch(`/api/presets/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed");
      setPresets((prev) => prev.filter((p) => p.id !== id));
      toastManager.add({ title: "Preset deleted", type: "success" });
    } catch {
      toastManager.add({ title: "Failed to delete preset", type: "error" });
    } finally {
      setDeleting(null);
    }
  }

  function getEditorUrl(preset: RawPreset) {
    const key = crypto.randomUUID();
    const meta = preset.metadata as Record<string, unknown>;
    if (typeof window !== "undefined") {
      sessionStorage.setItem(
        `meta_${key}`,
        JSON.stringify({
          ...meta,
          publishedAt:
            meta.publishedAt instanceof Date
              ? meta.publishedAt.toISOString()
              : meta.publishedAt,
        }),
      );
    }
    return `/editor/${preset.templateId}?mid=${key}`;
  }

  if (presets.length === 0) {
    return (
      <div className="text-center py-20 text-muted-foreground">
        <p className="text-sm">No presets saved yet.</p>
        <p className="text-xs mt-1">
          Open the editor and click &quot;Save preset&quot; to save your first one.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {presets.map((preset) => (
        <div
          key={preset.id}
          className="rounded-xl border bg-card overflow-hidden shadow-xs/5 hover:shadow-md transition-shadow"
        >
          <Link href={getEditorUrl(preset)} className="block">
            <PresetThumbnail preset={preset} />
          </Link>
          <div className="flex items-center justify-between px-4 py-3">
            <div className="min-w-0">
              <p className="font-medium text-sm truncate">{preset.name}</p>
              <p className="text-xs text-muted-foreground mt-0.5">
                {new Date(preset.createdAt).toLocaleDateString()}
              </p>
            </div>
            <div className="flex items-center gap-2 shrink-0 ml-2">
              <Badge variant="secondary">{preset.templateId}</Badge>
              <Button
                loading={deleting === preset.id}
                onClick={() => handleDelete(preset.id)}
                size="icon-xs"
                title="Delete preset"
                variant="ghost"
              >
                <TrashIcon />
              </Button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
