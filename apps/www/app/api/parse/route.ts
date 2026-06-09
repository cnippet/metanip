import { ParseError } from "@repo/metadata";
import { parseMarkdown } from "@repo/metadata/parse";
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
    return Response.json(
      { error: "Request body must be JSON." },
      { status: 400 },
    );
  }

  if (
    typeof body !== "object" ||
    body === null ||
    typeof (body as Record<string, unknown>)["content"] !== "string"
  ) {
    return Response.json(
      { error: 'Missing required field: "content" (string).' },
      { status: 400 },
    );
  }

  const content = (body as Record<string, unknown>)["content"] as string;
  if (!content.trim()) {
    return Response.json(
      { error: '"content" must not be empty.' },
      { status: 400 },
    );
  }

  try {
    const metadata = parseMarkdown(content);
    return Response.json(metadata, {
      headers: { "X-RateLimit-Remaining": String(remaining) },
    });
  } catch (err) {
    if (err instanceof ParseError) {
      return Response.json({ error: err.message }, { status: 422 });
    }
    return Response.json(
      { error: "Unexpected error while parsing." },
      { status: 500 },
    );
  }
}
