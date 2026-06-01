"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardPanel,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";

type Status = "idle" | "loading" | "ok" | "error";
type PanelState = { status: Status; data: unknown };

const IDLE: PanelState = { status: "idle", data: null };

function Result({ state }: { state: PanelState }) {
  if (state.status === "idle") return null;
  if (state.status === "loading")
    return <p className="mt-3 text-sm text-muted-foreground">Loading…</p>;

  const isError = state.status === "error";
  return (
    <pre
      className={cn(
        "mt-3 p-3 rounded-md text-xs leading-relaxed overflow-x-auto max-h-80 whitespace-pre-wrap break-words border",
        isError
          ? "bg-red-50 text-red-700 border-red-200 dark:bg-red-950/40 dark:text-red-400 dark:border-red-800"
          : "bg-zinc-50 text-foreground border-zinc-200 dark:bg-zinc-900 dark:border-zinc-700",
      )}
    >
      {JSON.stringify(state.data, null, 2)}
    </pre>
  );
}

function UrlScraper() {
  const [state, setState] = useState<PanelState>(IDLE);
  const [url, setUrl] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setState({ status: "loading", data: null });
    try {
      const res = await fetch("/api/scrape", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ url }),
      });
      const json: unknown = await res.json();
      setState({ status: res.ok ? "ok" : "error", data: json });
    } catch (err) {
      setState({ status: "error", data: { error: String(err) } });
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>① URL Scraper</CardTitle>
        <CardDescription>POST /api/scrape</CardDescription>
      </CardHeader>
      <CardPanel>
        <form onSubmit={handleSubmit} className="flex gap-2">
          <Input
            type="url"
            required
            value={url}
            onChange={(e) => setUrl((e.target as HTMLInputElement).value)}
            placeholder="https://vercel.com/blog/..."
            nativeInput
          />
          <Button type="submit" loading={state.status === "loading"}>
            Submit
          </Button>
        </form>
        <Result state={state} />
      </CardPanel>
    </Card>
  );
}

function MarkdownPaste() {
  const [state, setState] = useState<PanelState>(IDLE);
  const [content, setContent] = useState(
    `---\ntitle: My Post\nauthor: Jane Doe\ntags: [nextjs, design]\ndate: 2024-01-15\n---\n\n# Hello World\n\nThis is the first paragraph of my article.`,
  );

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setState({ status: "loading", data: null });
    try {
      const res = await fetch("/api/parse", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ content }),
      });
      const json: unknown = await res.json();
      setState({ status: res.ok ? "ok" : "error", data: json });
    } catch (err) {
      setState({ status: "error", data: { error: String(err) } });
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>② Markdown Paste</CardTitle>
        <CardDescription>POST /api/parse</CardDescription>
      </CardHeader>
      <CardPanel>
        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <Textarea
            required
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={8}
            className="font-mono"
          />
          <Button type="submit" loading={state.status === "loading"} className="self-start">
            Submit
          </Button>
        </form>
        <Result state={state} />
      </CardPanel>
    </Card>
  );
}

function FileUpload() {
  const [state, setState] = useState<PanelState>(IDLE);
  const [file, setFile] = useState<File | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!file) return;
    setState({ status: "loading", data: null });
    try {
      const content = await file.text();
      const res = await fetch("/api/parse", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ content, filename: file.name }),
      });
      const json: unknown = await res.json();
      setState({ status: res.ok ? "ok" : "error", data: json });
    } catch (err) {
      setState({ status: "error", data: { error: String(err) } });
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>③ File Upload</CardTitle>
        <CardDescription>.md / .mdx → POST /api/parse</CardDescription>
      </CardHeader>
      <CardPanel>
        <form onSubmit={handleSubmit} className="flex gap-2 items-center">
          <Input
            type="file"
            accept=".md,.mdx,.txt"
            required
            onChange={(e) => setFile((e.target as HTMLInputElement).files?.[0] ?? null)}
            nativeInput
          />
          <Button type="submit" disabled={!file} loading={state.status === "loading"}>
            Submit
          </Button>
        </form>
        {file && (
          <p className="mt-1.5 text-xs text-muted-foreground">Selected: {file.name}</p>
        )}
        <Result state={state} />
      </CardPanel>
    </Card>
  );
}

export default function TestMetadataPage() {
  return (
    <div className="min-h-screen bg-zinc-100 dark:bg-zinc-950 py-12 px-6">
      <div className="max-w-2xl mx-auto">
        <div className="mb-8">
          <h1 className="text-xl font-bold text-foreground mb-1.5">
            Metadata Sources — Phase 3 Test
          </h1>
          <p className="text-sm text-muted-foreground">
            Three input paths, one{" "}
            <code className="bg-zinc-200 dark:bg-zinc-800 px-1 py-0.5 rounded text-xs">
              Metadata
            </code>{" "}
            shape. This page will be replaced by the editor UI in Phase 4.
          </p>
        </div>

        <div className="flex flex-col gap-5">
          <UrlScraper />
          <MarkdownPaste />
          <FileUpload />
        </div>
      </div>
    </div>
  );
}
