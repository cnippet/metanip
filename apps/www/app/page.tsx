"use client";

import { type Metadata, MetadataSchema } from "@repo/metadata";
import { type TemplateDefinition, templates } from "@repo/templates";
import { LinkIcon, UploadIcon, XIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";

// ─── Template card ────────────────────────────────────────────────────────────

function TemplateCard({
  template,
  onClick,
}: {
  template: TemplateDefinition;
  onClick: () => void;
}) {
  const { BrowserComponent, defaults, supportedDimensions, name, category } =
    template;
  const dim = supportedDimensions[0]!;
  const containerRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(0.25);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const obs = new ResizeObserver(([entry]) => {
      if (entry) setScale(entry.contentRect.width / dim.w);
    });
    obs.observe(el);
    return () => obs.disconnect();
  }, [dim.w]);

  const defaultMetadata = MetadataSchema.parse({
    title: "Hello, World",
    ...defaults.metadata,
  });

  return (
    <button
      className="group rounded-xl border bg-card text-left overflow-hidden shadow-xs/5 hover:shadow-md transition-shadow focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
      onClick={onClick}
      type="button"
    >
      <div
        className="relative overflow-hidden bg-zinc-100"
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
            customizations={defaults.customizations}
            dimensions={dim}
            metadata={defaultMetadata}
          />
        </div>
      </div>
      <div className="flex items-center justify-between px-4 py-3">
        <p className="font-medium text-sm text-foreground">{name}</p>
        <Badge variant="secondary">{category}</Badge>
      </div>
    </button>
  );
}

// ─── Metadata summary card ────────────────────────────────────────────────────

function MetadataSummaryCard({
  metadata,
  source,
  onClear,
}: {
  metadata: Metadata;
  source: "url" | "file";
  onClear: () => void;
}) {
  return (
    <div className="flex items-start gap-3 rounded-lg border border-success/30 bg-success/5 px-4 py-3">
      <div className="flex-1 min-w-0">
        <p className="text-xs text-success-foreground font-medium mb-0.5">
          {source === "url" ? "Scraped from URL" : "Parsed from file"}
        </p>
        <p className="font-semibold text-sm text-foreground truncate">
          {metadata.title}
        </p>
        {metadata.description && (
          <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">
            {metadata.description}
          </p>
        )}
        <div className="flex flex-wrap gap-1 mt-1.5">
          {metadata.author && (
            <Badge size="sm" variant="outline">
              {metadata.author}
            </Badge>
          )}
          {metadata.siteName && (
            <Badge size="sm" variant="outline">
              {metadata.siteName}
            </Badge>
          )}
          {metadata.tags.slice(0, 3).map((t) => (
            <Badge key={t} size="sm" variant="secondary">
              {t}
            </Badge>
          ))}
        </div>
      </div>
      <button
        aria-label="Clear metadata"
        className="shrink-0 text-muted-foreground hover:text-foreground transition-colors"
        onClick={onClear}
        type="button"
      >
        <XIcon className="size-4" />
      </button>
    </div>
  );
}

// ─── Home page ────────────────────────────────────────────────────────────────

type Scraped = { source: "url" | "file"; data: Metadata };

export default function Home() {
  const router = useRouter();
  const [url, setUrl] = useState("");
  const [urlLoading, setUrlLoading] = useState(false);
  const [fileLoading, setFileLoading] = useState(false);
  const [scraped, setScraped] = useState<Scraped | null>(null);
  const [error, setError] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);

  async function handleScrape(e: React.FormEvent) {
    e.preventDefault();
    setUrlLoading(true);
    setError("");
    try {
      const res = await fetch("/api/scrape", {
        body: JSON.stringify({ url }),
        headers: { "content-type": "application/json" },
        method: "POST",
      });
      const json = await res.json();
      if (!res.ok) {
        setError((json as { error?: string }).error ?? "Scrape failed");
        return;
      }
      setScraped({ data: MetadataSchema.parse(json), source: "url" });
    } catch (err) {
      setError(String(err));
    } finally {
      setUrlLoading(false);
    }
  }

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setFileLoading(true);
    setError("");
    try {
      const content = await file.text();
      const res = await fetch("/api/parse", {
        body: JSON.stringify({ content, filename: file.name }),
        headers: { "content-type": "application/json" },
        method: "POST",
      });
      const json = await res.json();
      if (!res.ok) {
        setError((json as { error?: string }).error ?? "Parse failed");
        return;
      }
      setScraped({ data: MetadataSchema.parse(json), source: "file" });
    } catch (err) {
      setError(String(err));
    } finally {
      setFileLoading(false);
      // Reset file input so the same file can be picked again
      if (fileRef.current) fileRef.current.value = "";
    }
  }

  function pickTemplate(templateId: string) {
    if (scraped) {
      const key = crypto.randomUUID();
      sessionStorage.setItem(
        `meta_${key}`,
        JSON.stringify({
          ...scraped.data,
          publishedAt: scraped.data.publishedAt?.toISOString(),
        }),
      );
      router.push(`/editor/${templateId}?mid=${key}`);
    } else {
      router.push(`/editor/${templateId}`);
    }
  }

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950">
      <div className="max-w-4xl mx-auto px-6 py-16">
        {/* Hero */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold tracking-tight text-foreground mb-3">
            Metanip
          </h1>
          <p className="text-lg text-muted-foreground max-w-md mx-auto">
            Generate beautiful featured images for your blog, social media, and
            more.
          </p>
        </div>

        {/* Input section */}
        <div className="bg-card border rounded-2xl p-6 shadow-xs/5 mb-10">
          <p className="text-sm font-medium text-foreground mb-3">
            Start with a URL — we'll extract the metadata for you
          </p>

          {/* URL scraper */}
          <form className="flex gap-2 mb-4" onSubmit={handleScrape}>
            <Input
              nativeInput
              onChange={(e) => setUrl((e.target as HTMLInputElement).value)}
              placeholder="https://vercel.com/blog/..."
              required
              type="url"
              value={url}
            />
            <Button loading={urlLoading} type="submit">
              <LinkIcon />
              Scrape
            </Button>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-3 mb-4">
            <Separator className="flex-1" />
            <span className="text-xs text-muted-foreground">or</span>
            <Separator className="flex-1" />
          </div>

          {/* File upload */}
          <div className="flex items-center gap-3">
            <input
              accept=".md,.mdx"
              className="hidden"
              onChange={handleFileChange}
              ref={fileRef}
              type="file"
            />
            <Button
              loading={fileLoading}
              onClick={() => fileRef.current?.click()}
              type="button"
              variant="outline"
            >
              <UploadIcon />
              Upload .md / .mdx
            </Button>
            <span className="text-xs text-muted-foreground">
              We'll parse frontmatter + content
            </span>
          </div>

          {/* Error */}
          {error && (
            <p className="mt-3 text-sm text-destructive-foreground bg-destructive/8 rounded-md px-3 py-2">
              {error}
            </p>
          )}

          {/* Metadata summary */}
          {scraped && (
            <div className="mt-4">
              <MetadataSummaryCard
                metadata={scraped.data}
                onClear={() => setScraped(null)}
                source={scraped.source}
              />
            </div>
          )}
        </div>

        {/* Template grid */}
        <div>
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-semibold text-foreground">Pick a template</h2>
            <p className="text-sm text-muted-foreground">
              {scraped
                ? "Metadata ready — click any template to open the editor"
                : "Click any template to start"}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {templates.map((template) => (
              <TemplateCard
                key={template.id}
                onClick={() => pickTemplate(template.id)}
                template={template}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
