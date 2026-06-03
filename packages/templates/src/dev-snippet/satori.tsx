// Satori constraints: no className, inline styles only, display:flex on every container,
// no box-sizing, no position:absolute/relative, no background shorthand with url().
import type { TemplateProps } from "../shared/types";

const DOTS = [{ color: "#ff5f56" }, { color: "#ffbd2e" }, { color: "#27c93f" }];

export function SatoriComponent({ metadata, customizations, dimensions }: TemplateProps) {
  const bg = (customizations["bgColor"] as string) ?? "#0d1117";
  const windowBg = (customizations["windowBg"] as string) ?? "#161b22";
  const accent = (customizations["accentColor"] as string) ?? "#58a6ff";
  const language = (customizations["language"] as string) ?? "TypeScript";
  const showLineNumbers = (customizations["showLineNumbers"] as boolean) ?? true;
  const { title, description, author, siteName, tags = [] } = metadata;

  const lines = title.split("\n").slice(0, 6);

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
        paddingTop: 56,
        paddingBottom: 56,
        paddingLeft: 56,
        paddingRight: 56,
        fontFamily: "Inter",
      }}
    >
      {/* Window */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          width: "100%",
          maxWidth: 860,
          borderRadius: 12,
          overflow: "hidden",
          border: "1px solid rgba(255,255,255,0.08)",
        }}
      >
        {/* Title bar */}
        <div
          style={{
            backgroundColor: windowBg,
            paddingTop: 14,
            paddingBottom: 14,
            paddingLeft: 20,
            paddingRight: 20,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            borderBottom: "1px solid rgba(255,255,255,0.06)",
          }}
        >
          <div style={{ display: "flex", gap: 8 }}>
            {DOTS.map((d) => (
              <div
                key={d.color}
                style={{
                  width: 12,
                  height: 12,
                  borderRadius: 6,
                  backgroundColor: d.color,
                  display: "flex",
                }}
              />
            ))}
          </div>
          <div
            style={{
              display: "flex",
              fontSize: 12,
              color: "rgba(255,255,255,0.3)",
            }}
          >
            {siteName ?? author ?? "snippet"}
          </div>
          <div
            style={{
              display: "flex",
              fontSize: 11,
              fontWeight: 600,
              paddingTop: 3,
              paddingBottom: 3,
              paddingLeft: 10,
              paddingRight: 10,
              borderRadius: 4,
              backgroundColor: accent + "22",
              color: accent,
            }}
          >
            {language}
          </div>
        </div>

        {/* Code area */}
        <div
          style={{
            backgroundColor: windowBg,
            paddingTop: 28,
            paddingBottom: 28,
            paddingLeft: 24,
            paddingRight: 24,
            display: "flex",
            flexDirection: "column",
            gap: 10,
          }}
        >
          {lines.map((line, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 20 }}>
              {showLineNumbers ? (
                <div
                  style={{
                    display: "flex",
                    fontSize: 14,
                    color: "rgba(255,255,255,0.2)",
                    minWidth: 24,
                  }}
                >
                  {i + 1}
                </div>
              ) : null}
              <div
                style={{
                  display: "flex",
                  fontSize: 18,
                  color: "#e6edf3",
                  lineHeight: 1.6,
                  fontFamily: "Inter",
                }}
              >
                {line || " "}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      {(description ?? tags.length > 0) ? (
        <div
          style={{
            marginTop: 24,
            display: "flex",
            alignItems: "center",
            gap: 12,
            width: "100%",
            maxWidth: 860,
          }}
        >
          {description ? (
            <div
              style={{
                display: "flex",
                flex: 1,
                fontSize: 14,
                color: "rgba(255,255,255,0.3)",
              }}
            >
              {description}
            </div>
          ) : null}
          <div style={{ display: "flex", gap: 6 }}>
            {tags.slice(0, 3).map((t) => (
              <div
                key={t}
                style={{
                  display: "flex",
                  fontSize: 12,
                  paddingTop: 3,
                  paddingBottom: 3,
                  paddingLeft: 10,
                  paddingRight: 10,
                  borderRadius: 4,
                  border: `1px solid ${accent}44`,
                  color: accent,
                }}
              >
                #{t}
              </div>
            ))}
          </div>
        </div>
      ) : null}
    </div>
  );
}
