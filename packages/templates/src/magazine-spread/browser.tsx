import type { TemplateProps } from "../shared/types";

export function BrowserComponent({
  metadata,
  customizations,
  dimensions,
}: TemplateProps) {
  const bg = (customizations["bgColor"] as string) ?? "#fffbf5";
  const leftBg = (customizations["leftBg"] as string) ?? "#1a1a1a";
  const textColor = (customizations["textColor"] as string) ?? "#1a1a1a";
  const accent = (customizations["accentColor"] as string) ?? "#dc2626";
  const issueLabel = (customizations["issueLabel"] as string) ?? "FEATURE";
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
        year: "numeric",
      })
    : null;

  const isWide = dimensions.w > dimensions.h;
  const leftW = isWide
    ? Math.round(dimensions.w * 0.28)
    : Math.round(dimensions.w * 0.32);

  return (
    <div
      style={{
        width: dimensions.w,
        height: dimensions.h,
        backgroundColor: bg,
        display: "flex",
        flexDirection: "row",
        fontFamily: "Inter, system-ui, sans-serif",
        overflow: "hidden",
        boxSizing: "border-box",
      }}
    >
      {/* Left panel */}
      <div
        style={{
          width: leftW,
          height: "100%",
          backgroundColor: leftBg,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "48px 24px",
          boxSizing: "border-box",
          flexShrink: 0,
        }}
      >
        {/* Rotated category label */}
        <div
          style={{
            fontSize: 11,
            letterSpacing: "0.2em",
            textTransform: "uppercase",
            color: "rgba(255,255,255,0.4)",
            transform: "rotate(-90deg)",
            whiteSpace: "nowrap",
          }}
        >
          {siteName ?? "Publication"}
        </div>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 8,
          }}
        >
          <div
            style={{
              width: 40,
              height: 40,
              backgroundColor: accent,
              borderRadius: 4,
            }}
          />
          <span
            style={{
              fontSize: 11,
              letterSpacing: "0.14em",
              textTransform: "uppercase",
              color: "rgba(255,255,255,0.35)",
            }}
          >
            {dateStr ?? "2024"}
          </span>
        </div>

        <div
          style={{
            fontSize: 11,
            letterSpacing: "0.14em",
            textTransform: "uppercase",
            color: "rgba(255,255,255,0.2)",
          }}
        >
          ·
        </div>
      </div>

      {/* Right panel */}
      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          padding: isWide ? "56px 64px" : "40px 44px",
          boxSizing: "border-box",
        }}
      >
        {/* Category badge */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 12,
            marginBottom: 36,
          }}
        >
          <div
            style={{
              width: 28,
              height: 3,
              backgroundColor: accent,
              borderRadius: 2,
            }}
          />
          <span
            style={{
              fontSize: 11,
              letterSpacing: "0.18em",
              textTransform: "uppercase",
              color: accent,
              fontWeight: 700,
            }}
          >
            {issueLabel}
          </span>
        </div>

        {/* Title */}
        <h1
          style={{
            fontSize: isWide ? 52 : 40,
            fontWeight: 800,
            lineHeight: 1.08,
            margin: 0,
            color: textColor,
            fontFamily: "Georgia, 'Times New Roman', serif",
            letterSpacing: "-0.02em",
            flex: 1,
          }}
        >
          {title}
        </h1>

        {description && (
          <p
            style={{
              fontSize: 17,
              lineHeight: 1.6,
              color: textColor,
              opacity: 0.6,
              margin: "20px 0 0",
              maxWidth: "90%",
              fontFamily: "Inter, system-ui, sans-serif",
            }}
          >
            {description}
          </p>
        )}

        {/* Footer */}
        <div
          style={{
            marginTop: 36,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div style={{ display: "flex", gap: 6 }}>
            {tags.slice(0, 3).map((t) => (
              <span
                key={t}
                style={{
                  fontSize: 11,
                  padding: "3px 10px",
                  borderRadius: 2,
                  backgroundColor: accent + "15",
                  color: accent,
                  textTransform: "uppercase",
                  letterSpacing: "0.06em",
                }}
              >
                {t}
              </span>
            ))}
          </div>
          {author && (
            <span style={{ fontSize: 13, opacity: 0.45, color: textColor }}>
              {author}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
