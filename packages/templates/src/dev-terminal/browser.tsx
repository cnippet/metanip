import type { TemplateProps } from "../shared/types";

const TRAFFIC_LIGHTS = ["#ff5f57", "#febc2e", "#28c840"] as const;

export function BrowserComponent({
  metadata,
  customizations,
  dimensions,
}: TemplateProps) {
  const bg = (customizations["bgColor"] as string) ?? "#0d1117";
  const promptColor = (customizations["promptColor"] as string) ?? "#7ee787";
  const textColor = (customizations["textColor"] as string) ?? "#c9d1d9";
  const scale = (customizations["fontScale"] as number) ?? 1;
  const {
    title,
    description,
    author,
    siteName,
    tags = [],
    readingTime,
  } = metadata;

  return (
    <div
      style={{
        width: dimensions.w,
        height: dimensions.h,
        backgroundColor: bg,
        color: textColor,
        fontFamily: "'JetBrains Mono', 'Fira Code', 'Courier New', monospace",
        display: "flex",
        flexDirection: "column",
        padding: "40px 64px",
        boxSizing: "border-box",
      }}
    >
      {/* Window title bar */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 8,
          marginBottom: 44,
        }}
      >
        {TRAFFIC_LIGHTS.map((c) => (
          <div
            key={c}
            style={{
              width: 13,
              height: 13,
              borderRadius: "50%",
              backgroundColor: c,
              flexShrink: 0,
            }}
          />
        ))}
        <span
          style={{
            marginLeft: 16,
            fontSize: 13,
            opacity: 0.3,
            color: textColor,
            fontFamily: "system-ui, sans-serif",
          }}
        >
          {siteName ?? "blog"} — zsh
        </span>
      </div>

      {/* Shell prompt */}
      <div
        style={{
          display: "flex",
          alignItems: "baseline",
          gap: 10,
          marginBottom: 36,
        }}
      >
        <span
          style={{
            color: promptColor,
            fontSize: Math.round(15 * scale),
            fontWeight: 600,
          }}
        >
          ~
        </span>
        <span
          style={{
            color: promptColor,
            fontSize: Math.round(15 * scale),
            fontWeight: 600,
          }}
        >
          ❯
        </span>
        <span
          style={{
            fontSize: Math.round(15 * scale),
            opacity: 0.4,
            color: textColor,
          }}
        >
          cat post.md
        </span>
      </div>

      {/* Main content */}
      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
        }}
      >
        <div
          style={{
            fontSize: Math.round(50 * scale),
            fontWeight: 700,
            lineHeight: 1.15,
            color: promptColor,
            overflow: "hidden",
          }}
        >
          {title}
        </div>
        {description && (
          <div
            style={{
              fontSize: Math.round(16 * scale),
              lineHeight: 1.55,
              opacity: 0.45,
              color: textColor,
              marginTop: 18,
            }}
          >
            {"// " + description}
          </div>
        )}
      </div>

      {/* Footer separator + meta */}
      <div
        style={{
          borderTop: "1px solid rgba(255,255,255,0.07)",
          paddingTop: 24,
          marginTop: 24,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <div style={{ display: "flex", gap: 14 }}>
          {tags.slice(0, 4).map((tag) => (
            <span
              key={tag}
              style={{ fontSize: 13, color: promptColor, opacity: 0.7 }}
            >
              #{tag}
            </span>
          ))}
        </div>
        <div
          style={{
            display: "flex",
            gap: 16,
            fontSize: 13,
            opacity: 0.35,
            color: textColor,
          }}
        >
          {author && <span>{author}</span>}
          {readingTime && <span>{readingTime} min read</span>}
        </div>
      </div>
    </div>
  );
}
