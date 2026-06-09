import type { TemplateProps } from "../shared/types";

export function SatoriComponent({
  metadata,
  customizations,
  dimensions,
}: TemplateProps) {
  const bg = (customizations["bgColor"] as string) ?? "#1a1a2e";
  const textColor = (customizations["textColor"] as string) ?? "#f8f8f2";
  const accent = (customizations["accentColor"] as string) ?? "#e63946";
  const scale = (customizations["fontScale"] as number) ?? 1;
  const {
    title,
    description,
    author,
    siteName,
    tags = [],
    publishedAt,
  } = metadata;

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
        fontFamily: "Inter",
        display: "flex",
        flexDirection: "column",
        paddingTop: 56,
        paddingBottom: 56,
        paddingLeft: 72,
        paddingRight: 72,
      }}
    >
      {/* Top row */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: 36,
        }}
      >
        <div
          style={{
            display: "flex",
            fontSize: 12,
            letterSpacing: "0.14em",
            opacity: 0.4,
            color: textColor,
          }}
        >
          {(siteName ?? "PUBLICATION").toUpperCase()}
        </div>
        {dateStr ? (
          <div
            style={{
              display: "flex",
              fontSize: 13,
              opacity: 0.35,
              color: textColor,
            }}
          >
            {dateStr}
          </div>
        ) : null}
      </div>

      {/* Accent rule */}
      <div
        style={{
          display: "flex",
          width: "100%",
          height: 3,
          backgroundColor: accent,
          marginBottom: 44,
        }}
      />

      {/* Title area */}
      <div style={{ display: "flex", flexDirection: "column", flex: 1 }}>
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            fontSize: Math.round(60 * scale),
            fontWeight: 700,
            lineHeight: 1.07,
            letterSpacing: "-0.02em",
            color: textColor,
          }}
        >
          {title}
        </div>
        {description ? (
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              fontSize: Math.round(19 * scale),
              lineHeight: 1.55,
              marginTop: 20,
              opacity: 0.6,
              color: textColor,
              maxWidth: "76%",
            }}
          >
            {description}
          </div>
        ) : null}
      </div>

      {/* Footer */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginTop: 32,
        }}
      >
        <div style={{ display: "flex", gap: 8 }}>
          {tags.slice(0, 3).map((tag) => (
            <div
              key={tag}
              style={{
                display: "flex",
                fontSize: 11,
                letterSpacing: "0.1em",
                paddingTop: 4,
                paddingBottom: 4,
                paddingLeft: 12,
                paddingRight: 12,
                border: `1.5px solid ${accent}`,
                color: accent,
                borderRadius: 2,
              }}
            >
              {tag.toUpperCase()}
            </div>
          ))}
        </div>
        {author ? (
          <div
            style={{
              display: "flex",
              fontSize: 14,
              opacity: 0.4,
              color: textColor,
            }}
          >
            {author}
          </div>
        ) : null}
      </div>
    </div>
  );
}
