// Edge-safe exports: schema + types + error classes only.
// Import scrapeUrl from "@repo/metadata/scrape" (Node.js runtime only).
// Import parseMarkdown from "@repo/metadata/parse" (Node.js runtime only).
export { MetadataSchema } from "./schema";
export type { Metadata } from "./schema";
export { ScrapeError, ParseError } from "./errors";
