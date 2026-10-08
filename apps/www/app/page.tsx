//biome-ignore-all lint/style/noNonNullAssertion:<>

"use client";

import { type Metadata, MetadataSchema } from "@repo/metadata";
import {
  getAllCategories,
  type TemplateCategory,
  type TemplateDefinition,
  templates,
} from "@repo/templates";
import { LinkIcon, SearchIcon, UploadIcon, XIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
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
      className="group overflow-hidden rounded-xl border bg-card text-left shadow-xs/5 transition-shadow hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
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
        <p className="font-medium text-foreground text-sm">{name}</p>
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
      <div className="min-w-0 flex-1">
        <p className="mb-0.5 font-medium text-success-foreground text-xs">
          {source === "url" ? "Scraped from URL" : "Parsed from file"}
        </p>
        <p className="truncate font-semibold text-foreground text-sm">
          {metadata.title}
        </p>
        {metadata.description && (
          <p className="mt-0.5 line-clamp-2 text-muted-foreground text-xs">
            {metadata.description}
          </p>
        )}
        <div className="mt-1.5 flex flex-wrap gap-1">
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
        className="shrink-0 text-muted-foreground transition-colors hover:text-foreground"
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

const CATEGORY_LABELS: Record<TemplateCategory, string> = {
  bold: "Bold",
  dev: "Dev",
  editorial: "Editorial",
  minimal: "Minimal",
  newsletter: "Newsletter",
  photo: "Photo",
  podcast: "Podcast",
  social: "Social",
};

export default function Home() {
  const router = useRouter();
  const [url, setUrl] = useState("");
  const [urlLoading, setUrlLoading] = useState(false);
  const [fileLoading, setFileLoading] = useState(false);
  const [scraped, setScraped] = useState<Scraped | null>(null);
  const [error, setError] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);
  const [activeCategory, setActiveCategory] = useState<
    TemplateCategory | "all"
  >("all");
  const [search, setSearch] = useState("");

  const categories = useMemo(() => getAllCategories(), []);

  const filteredTemplates = useMemo(() => {
    return templates.filter((t) => {
      const categoryMatch =
        activeCategory === "all" || t.category === activeCategory;
      const searchMatch =
        search.trim() === "" ||
        t.name.toLowerCase().includes(search.toLowerCase()) ||
        t.description.toLowerCase().includes(search.toLowerCase()) ||
        t.category.toLowerCase().includes(search.toLowerCase());
      return categoryMatch && searchMatch;
    });
  }, [activeCategory, search]);

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
      <div className="mx-auto max-w-4xl px-6 py-16">
        {/* Hero */}
        <div className="mb-12 text-center">
          <h1 className="mb-3 font-bold text-4xl text-foreground tracking-tight">
            Metanip
          </h1>
          <p className="mx-auto max-w-md text-lg text-muted-foreground">
            Generate beautiful featured images for your blog, social media, and
            more.
          </p>
        </div>

        {/* Input section */}
        <div className="mb-10 rounded-2xl border bg-card p-6 shadow-xs/5">
          <p className="mb-3 font-medium text-foreground text-sm">
            Start with a URL — we&apos;ll extract the metadata for you
          </p>

          {/* URL scraper */}
          <form className="mb-4 flex gap-2" onSubmit={handleScrape}>
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
          <div className="mb-4 flex items-center gap-3">
            <Separator className="flex-1" />
            <span className="text-muted-foreground text-xs">or</span>
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
            <span className="text-muted-foreground text-xs">
              We&apos;ll parse frontmatter + content
            </span>
          </div>

          {/* Error */}
          {error && (
            <p className="mt-3 rounded-md bg-destructive/8 px-3 py-2 text-destructive-foreground text-sm">
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
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-semibold text-foreground">Pick a template</h2>
            <p className="text-muted-foreground text-sm">
              {scraped
                ? "Metadata ready — click any template to open the editor"
                : "Click any template to start"}
            </p>
          </div>

          {/* Filters row */}
          <div className="mb-5 flex flex-wrap items-center gap-2">
            {/* Search */}
            <div className="relative min-w-[180px] max-w-xs flex-1">
              <SearchIcon className="pointer-events-none absolute top-1/2 left-2.5 size-3.5 -translate-y-1/2 text-muted-foreground" />
              <input
                className="w-full rounded-md border border-input bg-background py-1.5 pr-3 pl-8 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search templates…"
                type="search"
                value={search}
              />
            </div>

            {/* Category pills */}
            <div className="flex flex-wrap gap-1.5">
              <button
                className={`rounded-full px-3 py-1 font-medium text-xs transition-colors ${
                  activeCategory === "all"
                    ? "bg-foreground text-background"
                    : "bg-muted text-muted-foreground hover:bg-muted/80"
                }`}
                onClick={() => setActiveCategory("all")}
                type="button"
              >
                All ({templates.length})
              </button>
              {categories.map((cat) => {
                const count = templates.filter(
                  (t) => t.category === cat,
                ).length;
                return (
                  <button
                    className={`rounded-full px-3 py-1 font-medium text-xs transition-colors ${
                      activeCategory === cat
                        ? "bg-foreground text-background"
                        : "bg-muted text-muted-foreground hover:bg-muted/80"
                    }`}
                    key={cat}
                    onClick={() => setActiveCategory(cat)}
                    type="button"
                  >
                    {CATEGORY_LABELS[cat]} ({count})
                  </button>
                );
              })}
            </div>
          </div>

          {filteredTemplates.length > 0 ? (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {filteredTemplates.map((template) => (
                <TemplateCard
                  key={template.id}
                  onClick={() => pickTemplate(template.id)}
                  template={template}
                />
              ))}
            </div>
          ) : (
            <div className="py-16 text-center text-muted-foreground text-sm">
              No templates match{" "}
              <span className="font-medium">&quot;{search}&quot;</span>.{" "}
              <button
                className="underline underline-offset-2"
                onClick={() => {
                  setSearch("");
                  setActiveCategory("all");
                }}
                type="button"
              >
                Clear filters
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
