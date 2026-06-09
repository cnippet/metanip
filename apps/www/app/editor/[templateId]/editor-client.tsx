"use client";

import { MetadataSchema } from "@repo/metadata";
import {
  type CustomizationControl,
  getTemplate,
  type TemplateDefinition,
  type Dimension,
} from "@repo/templates";
import { useSession } from "@repo/auth/client";
import {
  ArrowLeftIcon,
  BookmarkIcon,
  DownloadIcon,
  FolderOpenIcon,
  RotateCcwIcon,
} from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/menu";
import {
  Select,
  SelectItem,
  SelectPopup,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsList, TabsPanel, TabsTab } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { toastManager } from "@/components/ui/toast";
import { useEditorStore } from "@/lib/editor-store";

// ─── Types ────────────────────────────────────────────────────────────────────

type SavedPreset = {
  id: string;
  name: string;
  templateId: string;
  metadata: unknown;
  customizations: unknown;
  dimensions: unknown;
  createdAt: string;
};

// ─── Utils ────────────────────────────────────────────────────────────────────

function slugify(s: string) {
  return s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function debounce<Args extends unknown[]>(
  fn: (...args: Args) => void,
  ms: number,
): (...args: Args) => void {
  let timer: ReturnType<typeof setTimeout>;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), ms);
  };
}

// ─── Customization control ────────────────────────────────────────────────────

function ColorControl({
  value,
  onChange,
}: {
  value: string;
  onChange: (v: string) => void;
}) {
  const [local, setLocal] = useState(value);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const debouncedChange = useCallback(debounce(onChange, 60), [onChange]);

  useEffect(() => setLocal(value), [value]);

  function handleChange(hex: string) {
    setLocal(hex);
    debouncedChange(hex);
  }

  return (
    <div className="flex items-center gap-2">
      <input
        className="size-8 shrink-0 rounded-md border border-input bg-transparent cursor-pointer p-0.5"
        onChange={(e) => handleChange(e.target.value)}
        type="color"
        value={local}
      />
      <Input
        className="font-mono text-xs"
        nativeInput
        onChange={(e) => {
          const hex = (e.target as HTMLInputElement).value;
          setLocal(hex);
          if (/^#[0-9a-f]{6}$/i.test(hex)) debouncedChange(hex);
        }}
        value={local}
      />
    </div>
  );
}

function ControlRow({
  label,
  controlKey,
  control,
  value,
}: {
  label: string;
  controlKey: string;
  control: CustomizationControl;
  value: unknown;
}) {
  const setCustomization = useEditorStore((s) => s.setCustomization);

  const onChange = useCallback(
    (v: unknown) => setCustomization(controlKey, v),
    [controlKey, setCustomization],
  );

  return (
    <div className="flex flex-col gap-1.5">
      <Label className="text-xs text-muted-foreground">{label}</Label>
      {control.type === "color" && (
        <ColorControl onChange={onChange} value={value as string} />
      )}
      {control.type === "text" && (
        <Input
          nativeInput
          onChange={(e) => onChange((e.target as HTMLInputElement).value)}
          value={value as string}
        />
      )}
      {control.type === "slider" && (
        <div className="flex items-center gap-3">
          <Slider
            className="flex-1"
            max={control.max}
            min={control.min}
            onValueChange={(vals) => {
              const v = (vals as number[])[0];
              if (v !== undefined) onChange(v);
            }}
            step={control.step ?? 0.01}
            value={[value as number]}
          />
          <span className="text-xs text-muted-foreground w-8 text-right tabular-nums">
            {(value as number).toFixed(2)}
          </span>
        </div>
      )}
      {control.type === "select" && (
        <Select onValueChange={onChange} value={value as string}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectPopup>
            {control.options.map((opt) => (
              <SelectItem key={opt.value} value={opt.value}>
                {opt.label}
              </SelectItem>
            ))}
          </SelectPopup>
        </Select>
      )}
      {control.type === "toggle" && (
        <div className="flex items-center gap-2">
          <Switch
            checked={value as boolean}
            onCheckedChange={onChange}
            size="sm"
          />
          <span className="text-xs text-muted-foreground">
            {(value as boolean) ? "On" : "Off"}
          </span>
        </div>
      )}
      {control.type === "image" && (
        <Input
          nativeInput
          onChange={(e) =>
            onChange((e.target as HTMLInputElement).value || undefined)
          }
          placeholder="https://..."
          type="url"
          value={(value as string | undefined) ?? ""}
        />
      )}
    </div>
  );
}

// ─── Customizations panel ─────────────────────────────────────────────────────

function CustomizationsPanel({ template }: { template: TemplateDefinition }) {
  const customizations = useEditorStore((s) => s.customizations);
  const resetCustomizations = useEditorStore((s) => s.resetCustomizations);

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between px-4 py-3 border-b">
        <span className="text-sm font-medium">Customize</span>
        <Button
          onClick={() => resetCustomizations(template.defaults.customizations)}
          size="icon-xs"
          title="Reset to defaults"
          variant="ghost"
        >
          <RotateCcwIcon />
        </Button>
      </div>
      <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-4">
        {Object.entries(template.customizations).map(([key, control]) => (
          <ControlRow
            control={control}
            controlKey={key}
            key={key}
            label={control.label}
            value={customizations[key] ?? control.defaultValue}
          />
        ))}
      </div>
    </div>
  );
}

// ─── Metadata panel ───────────────────────────────────────────────────────────

function MetadataPanel({
  templateDefaults,
}: {
  templateDefaults: Record<string, unknown>;
}) {
  const metadata = useEditorStore((s) => s.metadata);
  const setField = useEditorStore((s) => s.setField);
  const init = useEditorStore((s) => s.init);
  const storeState = useEditorStore();

  function resetMeta() {
    init({
      ...storeState,
      metadata: MetadataSchema.parse({
        title: "Hello, World",
        ...templateDefaults,
      }),
    });
  }

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between px-4 py-3 border-b">
        <span className="text-sm font-medium">Metadata</span>
        <Button
          onClick={resetMeta}
          size="icon-xs"
          title="Reset to defaults"
          variant="ghost"
        >
          <RotateCcwIcon />
        </Button>
      </div>
      <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-4">
        {/* Title */}
        <div className="flex flex-col gap-1.5">
          <Label className="text-xs text-muted-foreground">Title *</Label>
          <Input
            nativeInput
            onChange={(e) =>
              setField("title", (e.target as HTMLInputElement).value)
            }
            value={metadata.title}
          />
        </div>
        {/* Subtitle */}
        <div className="flex flex-col gap-1.5">
          <Label className="text-xs text-muted-foreground">Subtitle</Label>
          <Input
            nativeInput
            onChange={(e) =>
              setField(
                "subtitle",
                (e.target as HTMLInputElement).value || undefined,
              )
            }
            value={metadata.subtitle ?? ""}
          />
        </div>
        {/* Description */}
        <div className="flex flex-col gap-1.5">
          <Label className="text-xs text-muted-foreground">Description</Label>
          <Textarea
            onChange={(e) =>
              setField("description", e.target.value || undefined)
            }
            rows={3}
            value={metadata.description ?? ""}
          />
        </div>
        {/* Author */}
        <div className="flex flex-col gap-1.5">
          <Label className="text-xs text-muted-foreground">Author</Label>
          <Input
            nativeInput
            onChange={(e) =>
              setField(
                "author",
                (e.target as HTMLInputElement).value || undefined,
              )
            }
            value={metadata.author ?? ""}
          />
        </div>
        {/* Site name */}
        <div className="flex flex-col gap-1.5">
          <Label className="text-xs text-muted-foreground">Site Name</Label>
          <Input
            nativeInput
            onChange={(e) =>
              setField(
                "siteName",
                (e.target as HTMLInputElement).value || undefined,
              )
            }
            value={metadata.siteName ?? ""}
          />
        </div>
        {/* Tags */}
        <div className="flex flex-col gap-1.5">
          <Label className="text-xs text-muted-foreground">
            Tags (comma-separated)
          </Label>
          <Input
            nativeInput
            onChange={(e) => {
              const tags = (e.target as HTMLInputElement).value
                .split(",")
                .map((t) => t.trim())
                .filter(Boolean);
              setField("tags", tags);
            }}
            placeholder="nextjs, design, og-image"
            value={metadata.tags.join(", ")}
          />
        </div>
        <Separator />
        {/* Reading time */}
        <div className="flex flex-col gap-1.5">
          <Label className="text-xs text-muted-foreground">
            Reading Time (min)
          </Label>
          <Input
            min="1"
            nativeInput
            onChange={(e) => {
              const n = Number.parseFloat((e.target as HTMLInputElement).value);
              setField("readingTime", isNaN(n) ? undefined : n);
            }}
            type="number"
            value={metadata.readingTime ?? ""}
          />
        </div>
        {/* Published at */}
        <div className="flex flex-col gap-1.5">
          <Label className="text-xs text-muted-foreground">Published At</Label>
          <Input
            nativeInput
            onChange={(e) => {
              const v = (e.target as HTMLInputElement).value;
              setField("publishedAt", v ? new Date(v) : undefined);
            }}
            type="date"
            value={
              metadata.publishedAt
                ? new Date(metadata.publishedAt).toISOString().split("T")[0]
                : ""
            }
          />
        </div>
      </div>
    </div>
  );
}

// ─── Preview container ────────────────────────────────────────────────────────

function PreviewContainer({
  template,
  previewRef,
}: {
  template: TemplateDefinition;
  previewRef: React.RefObject<HTMLDivElement | null>;
}) {
  const metadata = useEditorStore((s) => s.metadata);
  const customizations = useEditorStore((s) => s.customizations);
  const dimensions = useEditorStore((s) => s.dimensions);
  const containerRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(0.5);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const obs = new ResizeObserver(([entry]) => {
      if (!entry) return;
      const { width, height } = entry.contentRect;
      const ws = width / dimensions.w;
      const hs = height / dimensions.h;
      setScale(Math.min(ws, hs) * 0.92);
    });
    obs.observe(el);
    return () => obs.disconnect();
  }, [dimensions.w, dimensions.h]);

  const scaledW = Math.round(dimensions.w * scale);
  const scaledH = Math.round(dimensions.h * scale);
  const { BrowserComponent } = template;

  return (
    <div
      className="flex-1 flex items-center justify-center overflow-hidden p-6 bg-zinc-100 dark:bg-zinc-900"
      ref={containerRef}
    >
      <div style={{ height: scaledH, width: scaledW }}>
        <div
          className="shadow-2xl rounded-lg overflow-hidden"
          ref={previewRef}
          style={{
            height: dimensions.h,
            transform: `scale(${scale})`,
            transformOrigin: "top left",
            width: dimensions.w,
          }}
        >
          <BrowserComponent
            customizations={customizations}
            dimensions={dimensions}
            metadata={metadata}
          />
        </div>
      </div>
    </div>
  );
}

// ─── Save preset modal ────────────────────────────────────────────────────────

function SavePresetModal({
  open,
  onOpenChange,
  onSave,
  saving,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (name: string) => void;
  saving: boolean;
}) {
  const [name, setName] = useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (name.trim()) onSave(name.trim());
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent showCloseButton>
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Save preset</DialogTitle>
          </DialogHeader>
          <div className="px-6 py-4">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="preset-name">Preset name</Label>
              <Input
                autoFocus
                id="preset-name"
                nativeInput
                onChange={(e) => setName((e.target as HTMLInputElement).value)}
                placeholder="My awesome preset"
                required
                value={name}
              />
            </div>
          </div>
          <DialogFooter>
            <DialogClose render={<Button variant="outline" type="button" />}>
              Cancel
            </DialogClose>
            <Button disabled={!name.trim()} loading={saving} type="submit">
              Save
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

// ─── Top bar ──────────────────────────────────────────────────────────────────

function EditorTopbar({
  template,
  onDownload,
  downloading,
  isLoggedIn,
  presets,
  onOpenSaveModal,
  onLoadPreset,
}: {
  template: TemplateDefinition;
  onDownload: () => void;
  downloading: boolean;
  isLoggedIn: boolean;
  presets: SavedPreset[];
  onOpenSaveModal: () => void;
  onLoadPreset: (preset: SavedPreset) => void;
}) {
  const dimensions = useEditorStore((s) => s.dimensions);
  const setDimensions = useEditorStore((s) => s.setDimensions);

  return (
    <div className="h-12 shrink-0 flex items-center gap-3 border-b bg-background px-4">
      <Link
        className="text-muted-foreground hover:text-foreground transition-colors"
        href="/"
      >
        <ArrowLeftIcon className="size-4" />
      </Link>
      <Separator className="h-5" orientation="vertical" />
      <span className="font-medium text-sm text-foreground">
        {template.name}
      </span>
      <Badge variant="secondary">{template.category}</Badge>

      <div className="flex-1" />

      {/* Load preset */}
      {isLoggedIn && (
        <DropdownMenu>
          <DropdownMenuTrigger render={<Button size="sm" variant="ghost" />}>
            <FolderOpenIcon />
            <span className="hidden sm:inline">Load preset</span>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Saved presets</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {presets.length === 0 ? (
              <div className="px-2 py-3 text-xs text-muted-foreground text-center">
                No presets saved yet
              </div>
            ) : (
              presets.map((p) => (
                <DropdownMenuItem key={p.id} onClick={() => onLoadPreset(p)}>
                  {p.name}
                </DropdownMenuItem>
              ))
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      )}

      {/* Save preset */}
      {isLoggedIn ? (
        <Button onClick={onOpenSaveModal} size="sm" variant="outline">
          <BookmarkIcon />
          <span className="hidden sm:inline">Save preset</span>
        </Button>
      ) : (
        <Button
          render={<Link href="/login" />}
          size="sm"
          title="Sign in to save presets"
          variant="outline"
        >
          <BookmarkIcon />
          <span className="hidden sm:inline">Save preset</span>
        </Button>
      )}

      {/* Dimension switcher */}
      <Select
        onValueChange={(val) => {
          if (!val) return;
          const [w, h] = val.split("x").map(Number) as [number, number];
          const dim = template.supportedDimensions.find(
            (d) => d.w === w && d.h === h,
          );
          if (dim) setDimensions(dim);
        }}
        value={`${dimensions.w}x${dimensions.h}`}
      >
        <SelectTrigger className="w-36 text-xs">
          <SelectValue />
        </SelectTrigger>
        <SelectPopup>
          {template.supportedDimensions.map((d) => (
            <SelectItem key={`${d.w}x${d.h}`} value={`${d.w}x${d.h}`}>
              {d.label} ({d.w}×{d.h})
            </SelectItem>
          ))}
        </SelectPopup>
      </Select>

      {/* Download */}
      <Button loading={downloading} onClick={onDownload} size="sm">
        <DownloadIcon />
        Download PNG
      </Button>
    </div>
  );
}

// ─── Editor client ────────────────────────────────────────────────────────────

export function EditorClient({ templateId }: { templateId: string }) {
  const template = useMemo(() => getTemplate(templateId)!, [templateId]);
  const { init, resetCustomizations, ...store } = useEditorStore();
  const { data: session } = useSession();
  const isLoggedIn = Boolean(session?.user);
  const searchParams = useSearchParams();
  const [isReady, setIsReady] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [saveModalOpen, setSaveModalOpen] = useState(false);
  const [savingPreset, setSavingPreset] = useState(false);
  const [presets, setPresets] = useState<SavedPreset[]>([]);
  const previewRef = useRef<HTMLDivElement>(null);

  // Load initial editor state
  useEffect(() => {
    const mid = searchParams.get("mid");
    let metadata = MetadataSchema.parse({
      title: "Hello, World",
      ...template.defaults.metadata,
    });

    if (mid) {
      try {
        const stored = sessionStorage.getItem(`meta_${mid}`);
        if (stored) metadata = MetadataSchema.parse(JSON.parse(stored));
      } catch {
        // Fall through to defaults
      }
    }

    init({
      customizations: { ...template.defaults.customizations },
      dimensions: template.supportedDimensions[0]!,
      metadata,
      templateId: template.id,
    });
    setIsReady(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [template.id]);

  // Fetch presets for this template when logged in
  useEffect(() => {
    if (!isLoggedIn) return;
    fetch(`/api/presets?templateId=${templateId}`)
      .then((r) => r.json())
      .then((data: { presets?: SavedPreset[] }) =>
        setPresets(data.presets ?? []),
      )
      .catch(() => {});
  }, [isLoggedIn, templateId]);

  async function handleSavePreset(name: string) {
    setSavingPreset(true);
    try {
      const res = await fetch("/api/presets", {
        body: JSON.stringify({
          name,
          templateId,
          metadata: store.metadata,
          customizations: store.customizations,
          dimensions: store.dimensions,
        }),
        headers: { "content-type": "application/json" },
        method: "POST",
      });
      if (!res.ok) throw new Error("Failed");
      const data = (await res.json()) as { preset: SavedPreset };
      setPresets((prev) => [data.preset, ...prev]);
      setSaveModalOpen(false);
      toastManager.add({ title: "Preset saved!", type: "success" });
    } catch {
      toastManager.add({ title: "Failed to save preset", type: "error" });
    } finally {
      setSavingPreset(false);
    }
  }

  function handleLoadPreset(preset: SavedPreset) {
    try {
      init({
        templateId,
        metadata: MetadataSchema.parse(preset.metadata),
        customizations: preset.customizations as Record<string, unknown>,
        dimensions: preset.dimensions as Dimension,
      });
      toastManager.add({ title: `Loaded "${preset.name}"`, type: "success" });
    } catch {
      toastManager.add({ title: "Failed to load preset", type: "error" });
    }
  }

  async function handleDownload() {
    if (!previewRef.current) return;
    setDownloading(true);
    try {
      const { toPng } = await import("html-to-image");
      const { w, h } = store.dimensions;
      const png = await toPng(previewRef.current, {
        height: h,
        pixelRatio: 1,
        width: w,
      });

      // Trigger browser download
      const a = document.createElement("a");
      a.download = `${slugify(store.metadata.title)}-${templateId}.png`;
      a.href = png;
      a.click();
      toastManager.add({ title: "Downloaded!", type: "success" });

      // Track generation when logged in (fire-and-forget)
      if (isLoggedIn) {
        fetch("/api/generations", {
          body: JSON.stringify({
            templateId,
            metadata: store.metadata,
            customizations: store.customizations,
            dataUrl: png,
          }),
          headers: { "content-type": "application/json" },
          method: "POST",
        }).catch(() => {});
      }
    } catch {
      toastManager.add({
        description: "Try again or check your browser settings.",
        title: "Download failed",
        type: "error",
      });
    } finally {
      setDownloading(false);
    }
  }

  if (!isReady) {
    return (
      <div className="h-screen flex items-center justify-center text-muted-foreground text-sm">
        Loading…
      </div>
    );
  }

  const panelClass =
    "w-72 shrink-0 border bg-background flex flex-col overflow-hidden";

  return (
    <div className="h-screen flex flex-col overflow-hidden">
      <EditorTopbar
        downloading={downloading}
        isLoggedIn={isLoggedIn}
        onDownload={handleDownload}
        onLoadPreset={handleLoadPreset}
        onOpenSaveModal={() => setSaveModalOpen(true)}
        presets={presets}
        template={template}
      />

      <SavePresetModal
        onOpenChange={setSaveModalOpen}
        onSave={handleSavePreset}
        open={saveModalOpen}
        saving={savingPreset}
      />

      {/* ── Desktop layout (lg+) ── */}
      <div className="flex-1 hidden lg:flex overflow-hidden">
        <aside
          className={`${panelClass} border-r border-l-0 border-t-0 border-b-0`}
        >
          <MetadataPanel templateDefaults={template.defaults.metadata} />
        </aside>

        <PreviewContainer previewRef={previewRef} template={template} />

        <aside
          className={`${panelClass} border-l border-r-0 border-t-0 border-b-0`}
        >
          <CustomizationsPanel template={template} />
        </aside>
      </div>

      {/* ── Mobile layout (<lg) ── */}
      <div className="flex-1 flex flex-col overflow-hidden lg:hidden">
        <Tabs
          className="flex-1 flex flex-col overflow-hidden gap-0"
          defaultValue="preview"
        >
          <TabsList className="shrink-0 rounded-none border-b w-full justify-start px-4 h-10 bg-background">
            <TabsTab value="metadata">Metadata</TabsTab>
            <TabsTab value="preview">Preview</TabsTab>
            <TabsTab value="customize">Customize</TabsTab>
          </TabsList>

          <TabsPanel className="overflow-hidden" value="metadata">
            <MetadataPanel templateDefaults={template.defaults.metadata} />
          </TabsPanel>

          <TabsPanel className="overflow-hidden" value="preview">
            <PreviewContainer previewRef={previewRef} template={template} />
          </TabsPanel>

          <TabsPanel className="overflow-hidden" value="customize">
            <CustomizationsPanel template={template} />
          </TabsPanel>
        </Tabs>
      </div>
    </div>
  );
}
