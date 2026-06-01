import { ScrapeError } from "@repo/metadata";
import { scrapeUrl } from "@repo/metadata/scrape";
import { checkRateLimit, getClientIp } from "@/lib/rate-limit";

export async function POST(request: Request) {
  const { allowed, remaining } = checkRateLimit(getClientIp(request));
  if (!allowed) {
    return Response.json(
      { error: "Rate limit exceeded — 20 requests per minute." },
      { status: 429 },
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Request body must be JSON." }, { status: 400 });
  }

  if (
    typeof body !== "object" ||
    body === null ||
    typeof (body as Record<string, unknown>)["url"] !== "string"
  ) {
    return Response.json({ error: 'Missing required field: "url" (string).' }, { status: 400 });
  }

  const url = (body as Record<string, unknown>)["url"] as string;
  if (!url.trim()) {
    return Response.json({ error: '"url" must not be empty.' }, { status: 400 });
  }

  try {
    const metadata = await scrapeUrl(url);
    return Response.json(metadata, {
      headers: { "X-RateLimit-Remaining": String(remaining) },
    });
  } catch (err) {
    if (err instanceof ScrapeError) {
      return Response.json({ error: err.message }, { status: 422 });
    }
    return Response.json({ error: "Unexpected error while scraping." }, { status: 500 });
  }
}
