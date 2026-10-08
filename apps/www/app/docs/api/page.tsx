import { templates } from "@repo/templates";
import Link from "next/link";

const BASE_URL = process.env.NEXT_PUBLIC_SITE_DOMAIN ?? "https://metanip.app";

const EXAMPLE_TEMPLATE = "minimal-card";
const EXAMPLE_URL = `${BASE_URL}/api/og?templateId=${EXAMPLE_TEMPLATE}&title=Hello+World&description=My+open+graph+image&siteName=My+Blog`;

const CURL_EXAMPLE = `curl -L "${EXAMPLE_URL}" \\
  -o image.png`;

const CURL_WITH_KEY = `curl -L "${BASE_URL}/api/og?templateId=${EXAMPLE_TEMPLATE}&title=Hello+World" \\
  -H "Authorization: Bearer mnp_your_api_key_here" \\
  -o image.png`;

const JS_EXAMPLE = `const params = new URLSearchParams({
  templateId: "${EXAMPLE_TEMPLATE}",
  title: "Hello World",
  description: "My open graph image",
  siteName: "My Blog",
});

const res = await fetch(\`${BASE_URL}/api/og?\${params}\`, {
  headers: { Authorization: \`Bearer \${process.env.METANIP_API_KEY}\` },
});

const buffer = await res.arrayBuffer();
// Use buffer as needed (write to disk, upload to CDN, etc.)`;

const NEXT_JS_EXAMPLE = `// app/og/route.tsx — proxy through your own endpoint
import type { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  const title = req.nextUrl.searchParams.get("title") ?? "Untitled";

  const params = new URLSearchParams({
    templateId: "${EXAMPLE_TEMPLATE}",
    title,
    siteName: "My Site",
  });

  return fetch(
    \`${BASE_URL}/api/og?\${params}\`,
    { headers: { Authorization: \`Bearer \${process.env.METANIP_API_KEY}\` } },
  );
}`;

function CodeBlock({ code, lang = "bash" }: { code: string; lang?: string }) {
  return (
    <pre className="overflow-x-auto rounded-xl border bg-zinc-950 p-5 text-sm text-zinc-100 leading-relaxed">
      <code className={`language-${lang}`}>{code}</code>
    </pre>
  );
}

function Section({
  id,
  title,
  children,
}: {
  id: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="scroll-mt-24 space-y-4" id={id}>
      <h2 className="font-semibold text-xl">{title}</h2>
      {children}
    </section>
  );
}

export const metadata = {
  description:
    "Generate open graph images programmatically with the Metanip REST API.",
  title: "API Reference — Metanip",
};

export default function ApiDocsPage() {
  const templateList = templates.map((t) => ({
    category: t.category,
    customizations: Object.entries(t.customizations).map(([key, ctrl]) => ({
      key,
      label: ctrl.label,
      type: ctrl.type,
    })),
    id: t.id,
    name: t.name,
  }));

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-4xl px-6 py-16">
        {/* Header */}
        <div className="mb-12">
          <div className="mb-3 flex items-center gap-2 text-muted-foreground text-sm">
            <Link className="transition-colors hover:text-foreground" href="/">
              Metanip
            </Link>
            <span>/</span>
            <span className="text-foreground">API Reference</span>
          </div>
          <h1 className="mb-3 font-bold text-4xl tracking-tight">
            API Reference
          </h1>
          <p className="max-w-2xl text-lg text-muted-foreground">
            Generate beautiful open graph images programmatically. One GET
            request returns a PNG — no SDK required.
          </p>
          <div className="mt-6 flex gap-3">
            <Link
              className="inline-flex items-center rounded-lg bg-foreground px-4 py-2 font-medium text-background text-sm transition-opacity hover:opacity-90"
              href="/dashboard/api-keys"
            >
              Get your API key →
            </Link>
            <a
              className="inline-flex items-center rounded-lg border px-4 py-2 font-medium text-sm transition-colors hover:bg-muted"
              href="#templates"
            >
              Browse templates
            </a>
          </div>
        </div>

        <div className="space-y-16">
          {/* Endpoint */}
          <Section id="endpoint" title="Endpoint">
            <div className="flex items-center gap-3 rounded-lg border bg-card px-4 py-3 font-mono text-sm">
              <span className="font-semibold text-emerald-500">GET</span>
              <span className="text-foreground">/api/og</span>
            </div>
            <p className="text-muted-foreground text-sm">
              Returns a PNG image. All parameters are passed as query string
              values. The response is cached at the CDN layer with a 1-year{" "}
              <code>Cache-Control: public, immutable</code> header.
            </p>
          </Section>

          {/* Authentication */}
          <Section id="authentication" title="Authentication">
            <p className="text-muted-foreground text-sm">
              Pass your API key via the{" "}
              <code className="font-mono">Authorization</code> header or the{" "}
              <code className="font-mono">apiKey</code> query param. Anonymous
              requests are accepted but rate-limited more aggressively.
            </p>
            <div className="overflow-hidden rounded-lg border text-sm">
              <table className="w-full">
                <thead className="bg-muted/50">
                  <tr>
                    <th className="px-4 py-2 text-left font-medium">Tier</th>
                    <th className="px-4 py-2 text-left font-medium">Limit</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  <tr>
                    <td className="px-4 py-2 font-mono text-xs">
                      Anonymous (per IP)
                    </td>
                    <td className="px-4 py-2 text-muted-foreground">
                      10 requests / hour
                    </td>
                  </tr>
                  <tr>
                    <td className="px-4 py-2 font-mono text-xs">API key</td>
                    <td className="px-4 py-2 text-muted-foreground">
                      100 requests / day
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            <CodeBlock code={CURL_WITH_KEY} />
          </Section>

          {/* Parameters */}
          <Section id="parameters" title="Parameters">
            <p className="text-muted-foreground text-sm">
              All metadata fields are optional — each template falls back to its
              own defaults when a field is omitted.
            </p>
            <div className="overflow-hidden rounded-lg border text-sm">
              <table className="w-full">
                <thead className="bg-muted/50">
                  <tr>
                    <th className="px-4 py-2 text-left font-medium">
                      Parameter
                    </th>
                    <th className="px-4 py-2 text-left font-medium">Type</th>
                    <th className="px-4 py-2 text-left font-medium">
                      Description
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y text-xs">
                  {[
                    ["templateId", "string *", "Template ID (see list below)"],
                    ["title", "string", "Main headline"],
                    ["description", "string", "Subtitle or description"],
                    ["author", "string", "Author name"],
                    ["authorHandle", "string", "Author handle (e.g. @user)"],
                    ["siteName", "string", "Site or publication name"],
                    ["heroImage", "string", "URL of hero/background image"],
                    ["tags", "string[]", "Repeat param: &tags=a&tags=b"],
                    ["publishedAt", "ISO date", "Publication date"],
                    ["readingTime", "number", "Minutes to read"],
                    [
                      "dimension",
                      "string",
                      "OG Image · Twitter · LinkedIn · Square",
                    ],
                    [
                      "apiKey",
                      "string",
                      "API key (alt. to Authorization header)",
                    ],
                  ].map(([param, type, desc]) => (
                    <tr key={param}>
                      <td className="px-4 py-2 font-mono">{param}</td>
                      <td className="px-4 py-2 text-muted-foreground">
                        {type}
                      </td>
                      <td className="px-4 py-2 text-muted-foreground">
                        {desc}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="text-muted-foreground text-xs">* required</p>
          </Section>

          {/* Quick examples */}
          <Section id="examples" title="Examples">
            <h3 className="font-medium text-sm">Anonymous (no auth)</h3>
            <CodeBlock code={CURL_EXAMPLE} />

            <h3 className="mt-6 font-medium text-sm">With API key</h3>
            <CodeBlock code={CURL_WITH_KEY} />

            <h3 className="mt-6 font-medium text-sm">
              JavaScript / TypeScript
            </h3>
            <CodeBlock code={JS_EXAMPLE} lang="js" />

            <h3 className="mt-6 font-medium text-sm">Next.js proxy route</h3>
            <CodeBlock code={NEXT_JS_EXAMPLE} lang="tsx" />
          </Section>

          {/* Response */}
          <Section id="response" title="Response">
            <div className="overflow-hidden rounded-lg border text-sm">
              <table className="w-full">
                <thead className="bg-muted/50">
                  <tr>
                    <th className="px-4 py-2 text-left font-medium">Status</th>
                    <th className="px-4 py-2 text-left font-medium">Meaning</th>
                  </tr>
                </thead>
                <tbody className="divide-y text-xs">
                  {[
                    ["200", "PNG image returned"],
                    ["400", "Missing or invalid parameter"],
                    ["404", "templateId not found"],
                    ["429", "Rate limit exceeded — check Retry-After header"],
                    ["500", "Internal rendering error"],
                  ].map(([status, meaning]) => (
                    <tr key={status}>
                      <td className="px-4 py-2 font-mono">{status}</td>
                      <td className="px-4 py-2 text-muted-foreground">
                        {meaning}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="text-muted-foreground text-sm">
              On <code className="font-mono">429</code>, the response includes{" "}
              <code className="font-mono">X-RateLimit-Limit</code>,{" "}
              <code className="font-mono">X-RateLimit-Remaining</code>,{" "}
              <code className="font-mono">X-RateLimit-Reset</code>, and{" "}
              <code className="font-mono">Retry-After</code> headers.
            </p>
          </Section>

          {/* Templates */}
          <Section id="templates" title="Templates">
            <p className="text-muted-foreground text-sm">
              Each template accepts its own customization parameters in addition
              to the standard metadata fields above.
            </p>
            <div className="space-y-4">
              {templateList.map((t) => (
                <div className="rounded-lg border bg-card p-4" key={t.id}>
                  <div className="mb-3 flex items-center justify-between">
                    <div>
                      <span className="font-semibold text-sm">{t.name}</span>
                      <span className="ml-2 font-mono text-muted-foreground text-xs">
                        {t.id}
                      </span>
                    </div>
                    <span className="rounded-full border px-2 py-0.5 text-muted-foreground text-xs">
                      {t.category}
                    </span>
                  </div>
                  {t.customizations.length > 0 && (
                    <div className="space-y-1 text-muted-foreground text-xs">
                      <p className="mb-1 font-medium text-foreground">
                        Custom params:
                      </p>
                      <div className="grid grid-cols-2 gap-x-4 gap-y-1 font-mono sm:grid-cols-3">
                        {t.customizations.map((c) => (
                          <span key={c.key}>
                            <span className="text-foreground">{c.key}</span>
                            <span className="text-muted-foreground">
                              {" "}
                              ({c.type})
                            </span>
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                  <div className="mt-3 border-t pt-3">
                    <a
                      className="text-muted-foreground text-xs transition-colors hover:text-foreground"
                      href={`/api/og?templateId=${t.id}&title=Preview`}
                      rel="noopener noreferrer"
                      target="_blank"
                    >
                      Preview default →
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </Section>
        </div>
      </div>
    </div>
  );
}
