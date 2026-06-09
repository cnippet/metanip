import type { TemplateProps } from "../shared/types";

export function BrowserComponent({
  metadata,
  customizations,
  dimensions,
}: TemplateProps) {
  const bg = (customizations["bgColor"] as string) ?? "#fef9f0";
  const textColor = (customizations["textColor"] as string) ?? "#1c1917";
  const accent = (customizations["accentColor"] as string) ?? "#92400e";
  const issueNumber = (customizations["issueNumber"] as string) ?? "№ 1";
  const scale = (customizations["fontScale"] as number) ?? 1;
  const {
    title,
    description,
    author,
    siteName,
    publishedAt,
    tags = [],
  } = metadata;

  const dateStr = publishedAt
    ? new Date(publishedAt).toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
      })
    : null;

  const isWide = dimensions.w > dimensions.h;

  return (
    <div
      style={{
        width: dimensions.w,
        height: dimensions.h,
        backgroundColor: bg,
        display: "flex",
        flexDirection: "column",
        padding: isWide ? "56px 88px" : "48px 64px",
        boxSizing: "border-box",
        fontFamily: "Georgia, 'Times New Roman', serif",
        color: textColor,
      }}
    >
      {/* Masthead */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          paddingBottom: 20,
          borderBottom: `1.5px solid ${textColor}20`,
          marginBottom: 44,
          fontFamily: "Inter, system-ui, sans-serif",
        }}
      >
        <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
          <span
            style={{
              fontSize: 16,
              fontWeight: 700,
              letterSpacing: "0.04em",
              textTransform: "uppercase",
              color: accent,
            }}
          >
            {siteName ?? "The Letter"}
          </span>
          {dateStr && (
            <span style={{ fontSize: 12, opacity: 0.4, color: textColor }}>
              {dateStr}
            </span>
          )}
        </div>
        <span
          style={{
            fontSize: 13,
            fontFamily: "Georgia, serif",
            fontStyle: "italic",
            opacity: 0.4,
            color: textColor,
          }}
        >
          {issueNumber}
        </span>
      </div>

      {/* Headline area */}
      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
        }}
      >
        <h1
          style={{
            fontSize: Math.round((isWide ? 54 : 44) * scale),
            fontWeight: 700,
            lineHeight: 1.15,
            margin: 0,
            color: textColor,
            letterSpacing: "-0.015em",
            maxWidth: "82%",
          }}
        >
          {title}
        </h1>

        {/* Drop cap rule */}
        <div
          style={{
            width: 56,
            height: 2,
            backgroundColor: accent,
            borderRadius: 1,
            marginTop: 28,
            marginBottom: 20,
            flexShrink: 0,
          }}
        />

        {description && (
          <p
            style={{
              fontSize: Math.round(19 * scale),
              lineHeight: 1.65,
              margin: 0,
              color: textColor,
              opacity: 0.6,
              maxWidth: "75%",
              fontFamily: "Inter, system-ui, sans-serif",
            }}
          >
            {description}
          </p>
        )}
      </div>

      {/* Footer */}
      <div
        style={{
          marginTop: 36,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          fontFamily: "Inter, system-ui, sans-serif",
        }}
      >
        <div style={{ display: "flex", gap: 8 }}>
          {tags.slice(0, 3).map((t) => (
            <span
              key={t}
              style={{
                fontSize: 12,
                padding: "3px 10px",
                borderRadius: 3,
                border: `1px solid ${accent}40`,
                color: accent,
              }}
            >
              {t}
            </span>
          ))}
        </div>
        {author && (
          <span
            style={{
              fontSize: 13,
              opacity: 0.4,
              color: textColor,
              fontStyle: "italic",
            }}
          >
            {author}
          </span>
        )}
      </div>
    </div>
  );
}
