"use client";

import { DownloadIcon, TrashIcon } from "lucide-react";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { toastManager } from "@/components/ui/toast";

type RawGeneration = {
  id: string;
  templateId: string;
  imageUrl: string | null;
  metadata: unknown;
  createdAt: string;
};

function getTitle(metadata: unknown): string {
  if (metadata && typeof metadata === "object" && "title" in metadata) {
    return String((metadata as Record<string, unknown>).title ?? "Untitled");
  }
  return "Untitled";
}

export function HistoryList({
  initialGenerations,
}: {
  initialGenerations: RawGeneration[];
}) {
  const [generations, setGenerations] = useState(initialGenerations);
  const [deleting, setDeleting] = useState<string | null>(null);

  async function handleDelete(id: string) {
    setDeleting(id);
    try {
      const res = await fetch(`/api/generations/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed");
      setGenerations((prev) => prev.filter((g) => g.id !== id));
      toastManager.add({ title: "Deleted", type: "success" });
    } catch {
      toastManager.add({ title: "Failed to delete", type: "error" });
    } finally {
      setDeleting(null);
    }
  }

  if (generations.length === 0) {
    return (
      <div className="text-center py-20 text-muted-foreground">
        <p className="text-sm">No generations yet.</p>
        <p className="text-xs mt-1">
          Download an image from the editor to track it here.
        </p>
      </div>
    );
  }

  return (
    <div className="divide-y rounded-xl border bg-card overflow-hidden">
      {generations.map((gen) => (
        <div key={gen.id} className="flex items-center gap-4 px-4 py-3">
          {gen.imageUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              alt={getTitle(gen.metadata)}
              className="h-12 w-20 rounded object-cover shrink-0 border"
              src={gen.imageUrl}
            />
          ) : (
            <div className="h-12 w-20 rounded border bg-muted shrink-0 flex items-center justify-center text-[10px] text-muted-foreground">
              No image
            </div>
          )}

          <div className="flex-1 min-w-0">
            <p className="font-medium text-sm truncate">
              {getTitle(gen.metadata)}
            </p>
            <p className="text-xs text-muted-foreground mt-0.5">
              {new Date(gen.createdAt).toLocaleString()}
            </p>
          </div>

          <Badge className="shrink-0" variant="secondary">
            {gen.templateId}
          </Badge>

          <div className="flex items-center gap-1 shrink-0">
            {gen.imageUrl && (
              <Button
                onClick={() => window.open(gen.imageUrl!, "_blank")}
                size="icon-xs"
                title="Download image"
                variant="ghost"
              >
                <DownloadIcon />
              </Button>
            )}
            <Button
              loading={deleting === gen.id}
              onClick={() => handleDelete(gen.id)}
              size="icon-xs"
              title="Delete"
              variant="ghost"
            >
              <TrashIcon />
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
}
