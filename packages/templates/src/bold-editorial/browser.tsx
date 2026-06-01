import type { TemplateProps } from "../shared/types";

export function BrowserComponent({
  metadata,
  customizations,
  dimensions,
}: TemplateProps) {
  const bg = (customizations["bgColor"] as string) ?? "#1a1a2e";
  const textColor = (customizations["textColor"] as string) ?? "#f8f8f2";
  const accent = (customizations["accentColor"] as string) ?? "#e63946";
  const scale = (customizations["fontScale"] as number) ?? 1;
  const { title, description, author, siteName, tags = [], publishedAt } = metadata;

  const dateStr = publishedAt
    ? new Date(publishedAt).toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
      })
    : null;

  return (
    <div
      style={{
        width: dimensions.w,
        height: dimensions.h,
        backgroundColor: bg,
        color: textColor,
        fontFamily: "Georgia, 'Times New Roman', serif",
        display: "flex",
        flexDirection: "column",
        padding: "56px 72px",
        boxSizing: "border-box",
      }}
    >
      {/* Top row */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: 36,
          fontFamily: "system-ui, sans-serif",
        }}
      >
        <span
          style={{
            fontSize: 12,
            letterSpacing: "0.14em",
            textTransform: "uppercase",
            opacity: 0.4,
            color: textColor,
          }}
        >
          {siteName ?? "Publication"}
        </span>
        {dateStr && (
          <span style={{ fontSize: 13, opacity: 0.35, color: textColor }}>
            {dateStr}
          </span>
        )}
      </div>

      {/* Full-width accent rule */}
      <div
        style={{
          width: "100%",
          height: 3,
          backgroundColor: accent,
          marginBottom: 44,
          flexShrink: 0,
        }}
      />

      {/* Title area — grows to fill space */}
      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
        }}
      >
        <h1
          style={{
            fontSize: Math.round(60 * scale),
            fontWeight: 700,
            lineHeight: 1.07,
            margin: 0,
            letterSpacing: "-0.02em",
            color: textColor,
          }}
        >
          {title}
        </h1>
        {description && (
          <p
            style={{
              fontFamily: "system-ui, sans-serif",
              fontSize: Math.round(19 * scale),
              lineHeight: 1.55,
              margin: "20px 0 0",
              opacity: 0.6,
              color: textColor,
              maxWidth: "76%",
            }}
          >
            {description}
          </p>
        )}
      </div>

      {/* Footer */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          fontFamily: "system-ui, sans-serif",
          marginTop: 32,
        }}
      >
        <div style={{ display: "flex", gap: 8 }}>
          {tags.slice(0, 3).map((tag) => (
            <span
              key={tag}
              style={{
                fontSize: 11,
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                padding: "4px 12px",
                border: `1.5px solid ${accent}`,
                color: accent,
                borderRadius: 2,
              }}
            >
              {tag}
            </span>
          ))}
        </div>
        {author && (
          <span style={{ fontSize: 14, opacity: 0.4, color: textColor }}>
            {author}
          </span>
        )}
      </div>
    </div>
  );
}
