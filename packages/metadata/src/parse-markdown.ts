import matter from "gray-matter";
import { ParseError } from "./errors";
import { MetadataSchema, type Metadata } from "./schema";

export function parseMarkdown(content: string): Metadata {
  let fm: Record<string, unknown>;
  let body: string;

  try {
    const parsed = matter(content);
    fm = parsed.data as Record<string, unknown>;
    body = parsed.content;
  } catch (err) {
    throw new ParseError("Failed to parse markdown frontmatter.", err);
  }

  const title = str(fm["title"]) ?? extractFirstH1(body) ?? "Untitled";

  const description =
    str(fm["description"]) ?? str(fm["excerpt"]) ?? extractFirstParagraph(body);

  const tags = normalizeTags(fm["tags"]);

  const heroImage =
    str(fm["heroImage"]) ??
    str(fm["image"]) ??
    str(fm["cover"]) ??
    str(fm["thumbnail"]);

  return MetadataSchema.parse({
    title,
    subtitle: str(fm["subtitle"]),
    description,
    author: str(fm["author"]),
    authorHandle: str(fm["authorHandle"]) ?? str(fm["twitter"]),
    siteName: str(fm["siteName"]) ?? str(fm["site"]),
    heroImage,
    publishedAt: fm["date"] ?? fm["publishedAt"],
    readingTime:
      typeof fm["readingTime"] === "number" ? fm["readingTime"] : undefined,
    tags,
    themeColor: str(fm["themeColor"]) ?? str(fm["color"]),
  });
}

// ─── Helpers ────────────────────────────────────────────────────────────────

function str(v: unknown): string | undefined {
  return typeof v === "string" && v.length > 0 ? v : undefined;
}

function normalizeTags(v: unknown): string[] {
  if (!v) return [];
  if (Array.isArray(v)) return v.map(String).filter(Boolean);
  if (typeof v === "string")
    return v
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);
  return [];
}

function extractFirstH1(body: string): string | undefined {
  const match = body.match(/^#[ \t]+(.+)$/m);
  return match?.[1]?.trim();
}

function extractFirstParagraph(body: string): string | undefined {
  const lines = body.split("\n");
  const collected: string[] = [];
  let inCode = false;

  for (const line of lines) {
    if (/^(`{3}|~{3})/.test(line)) {
      inCode = !inCode;
      continue;
    }
    if (inCode) continue;
    // Skip headings, horizontal rules, images, list items, blockquotes, HTML
    if (
      /^(#{1,6}[ \t]|---|===|\*{3}|-{3}|_{3}|!\[|[-*+][ \t]|\d+\.[ \t]|>[ \t]|<)/.test(
        line,
      )
    )
      continue;
    if (line.trim() === "") {
      if (collected.length > 0) break;
      continue;
    }
    collected.push(line.trim());
  }

  return collected.length > 0 ? collected.join(" ") : undefined;
}
