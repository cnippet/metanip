import ogs from "open-graph-scraper";
import { ScrapeError } from "./errors";
import { MetadataSchema, type Metadata } from "./schema";

export async function scrapeUrl(rawUrl: string): Promise<Metadata> {
  // Validate URL format before hitting the network
  let url: URL;
  try {
    url = new URL(rawUrl);
  } catch {
    throw new ScrapeError(`"${rawUrl}" is not a valid URL.`);
  }
  if (url.protocol !== "http:" && url.protocol !== "https:") {
    throw new ScrapeError("URL must use http or https.");
  }

  let result: Awaited<ReturnType<typeof ogs>>["result"];
  try {
    const res = await ogs({
      url: url.toString(),
      timeout: 10_000,
      fetchOptions: { headers: { "user-agent": "Metanip/1.0 (featured-image-generator)" } },
    });
    if (res.error) throw new Error("ogs error flag set");
    result = res.result;
  } catch (err) {
    throw new ScrapeError(
      `Could not fetch "${url.toString()}". The site may block scrapers or the URL may be unreachable.`,
      err,
    );
  }

  // Collect tags — articleTag can be string or string[]
  const rawTags = result.articleTag;
  const tags: string[] = rawTags
    ? Array.isArray(rawTags)
      ? rawTags.map(String)
      : [String(rawTags)]
    : [];

  // Hero image — prefer OG, fall back to Twitter
  const heroImageUrl =
    result.ogImage?.[0]?.url ?? result.twitterImage?.[0]?.url;
  const heroImage =
    heroImageUrl && isAbsoluteUrl(heroImageUrl) ? heroImageUrl : undefined;

  // Author — article:author array or plain author meta
  const articleAuthors = result.articleAuthor;
  const author =
    (Array.isArray(articleAuthors) ? articleAuthors[0] : articleAuthors) ??
    result.author ??
    undefined;

  return MetadataSchema.parse({
    title: result.ogTitle ?? result.twitterTitle ?? "Untitled",
    description: result.ogDescription ?? result.twitterDescription,
    heroImage,
    siteName: result.ogSiteName,
    siteUrl: result.ogUrl ?? url.toString(),
    author,
    publishedAt: result.articlePublishedTime ?? undefined,
    tags,
  });
}

function isAbsoluteUrl(s: string): boolean {
  try {
    new URL(s);
    return true;
  } catch {
    return false;
  }
}
