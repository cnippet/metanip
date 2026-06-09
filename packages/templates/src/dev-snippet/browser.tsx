import type { TemplateProps } from "../shared/types";

const WINDOW_DOTS = [
  { color: "#ff5f56" },
  { color: "#ffbd2e" },
  { color: "#27c93f" },
];

export function BrowserComponent({
  metadata,
  customizations,
  dimensions,
}: TemplateProps) {
  const bg = (customizations["bgColor"] as string) ?? "#0d1117";
  const windowBg = (customizations["windowBg"] as string) ?? "#161b22";
  const accent = (customizations["accentColor"] as string) ?? "#58a6ff";
  const language = (customizations["language"] as string) ?? "TypeScript";
  const showLineNumbers =
    (customizations["showLineNumbers"] as boolean) ?? true;
  const { title, description, author, siteName, tags = [] } = metadata;

  const lines = title.split("\n");

  return (
    <div
      style={{
        width: dimensions.w,
        height: dimensions.h,
        backgroundColor: bg,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: 64,
        boxSizing: "border-box",
        fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
      }}
    >
      {/* Window chrome */}
      <div
        style={{
          width: "100%",
          maxWidth: 900,
          borderRadius: 12,
          overflow: "hidden",
          boxShadow: "0 32px 80px rgba(0,0,0,0.6)",
        }}
      >
        {/* Title bar */}
        <div
          style={{
            backgroundColor: windowBg,
            padding: "14px 20px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            borderBottom: "1px solid rgba(255,255,255,0.06)",
          }}
        >
          <div style={{ display: "flex", gap: 8 }}>
            {WINDOW_DOTS.map((d) => (
              <div
                key={d.color}
                style={{
                  width: 13,
                  height: 13,
                  borderRadius: "50%",
                  backgroundColor: d.color,
                }}
              />
            ))}
          </div>
          <span
            style={{
              fontSize: 12,
              color: "rgba(255,255,255,0.3)",
              letterSpacing: "0.05em",
            }}
          >
            {siteName ?? author ?? "snippet.ts"}
          </span>
          <span
            style={{
              fontSize: 11,
              fontWeight: 600,
              padding: "3px 10px",
              borderRadius: 4,
              backgroundColor: accent + "22",
              color: accent,
              letterSpacing: "0.04em",
            }}
          >
            {language}
          </span>
        </div>

        {/* Code area */}
        <div
          style={{
            backgroundColor: windowBg,
            padding: "28px 24px",
            display: "flex",
            flexDirection: "column",
            gap: 8,
          }}
        >
          {lines.map((line, i) => (
            <div
              key={i}
              style={{ display: "flex", alignItems: "center", gap: 20 }}
            >
              {showLineNumbers && (
                <span
                  style={{
                    fontSize: 14,
                    color: "rgba(255,255,255,0.2)",
                    minWidth: 24,
                    textAlign: "right",
                    userSelect: "none",
                  }}
                >
                  {i + 1}
                </span>
              )}
              <span
                style={{
                  fontSize: 18,
                  color: "#e6edf3",
                  lineHeight: 1.6,
                  fontFamily: "'JetBrains Mono', monospace",
                }}
              >
                {line || " "}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      {(description ?? tags.length > 0) && (
        <div
          style={{
            marginTop: 28,
            display: "flex",
            alignItems: "center",
            gap: 12,
            width: "100%",
            maxWidth: 900,
          }}
        >
          {description && (
            <span
              style={{
                fontSize: 14,
                color: "rgba(255,255,255,0.35)",
                flex: 1,
              }}
            >
              {description}
            </span>
          )}
          <div style={{ display: "flex", gap: 6 }}>
            {tags.slice(0, 3).map((t) => (
              <span
                key={t}
                style={{
                  fontSize: 12,
                  padding: "3px 10px",
                  borderRadius: 4,
                  border: `1px solid ${accent}44`,
                  color: accent,
                }}
              >
                #{t}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
