import type { TemplateProps } from "../shared/types";

export function BrowserComponent({
  metadata,
  customizations,
  dimensions,
}: TemplateProps) {
  const bg = (customizations["bgColor"] as string) ?? "#ffffff";
  const fg = (customizations["textColor"] as string) ?? "#09090b";
  const accent = (customizations["accentColor"] as string) ?? "#3b82f6";
  const scale = (customizations["fontScale"] as number) ?? 1;
  const { title, description, siteName, author, tags = [] } = metadata;

  return (
    <div
      style={{
        width: dimensions.w,
        height: dimensions.h,
        backgroundColor: bg,
        color: fg,
        fontFamily: "Inter, system-ui, sans-serif",
        display: "flex",
        flexDirection: "column",
        padding: 64,
        boxSizing: "border-box",
      }}
    >
      {/* Accent bar */}
      <div
        style={{
          width: 56,
          height: 5,
          backgroundColor: accent,
          borderRadius: 3,
          marginBottom: 40,
          flexShrink: 0,
        }}
      />

      {/* Body */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          flex: 1,
          minHeight: 0,
        }}
      >
        <h1
          style={{
            fontSize: Math.round(52 * scale),
            fontWeight: 700,
            lineHeight: 1.1,
            margin: 0,
            marginBottom: 20,
            letterSpacing: "-0.02em",
            color: fg,
          }}
        >
          {title}
        </h1>

        {description && (
          <p
            style={{
              fontSize: Math.round(22 * scale),
              lineHeight: 1.55,
              margin: 0,
              color: fg,
              opacity: 0.65,
              maxWidth: "75%",
            }}
          >
            {description}
          </p>
        )}

        <div style={{ flex: 1 }} />

        {/* Footer */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            {tags.slice(0, 4).map((tag) => (
              <span
                key={tag}
                style={{
                  fontSize: 14,
                  fontWeight: 500,
                  padding: "5px 14px",
                  borderRadius: 999,
                  border: `1.5px solid ${accent}`,
                  color: accent,
                }}
              >
                {tag}
              </span>
            ))}
          </div>

          {(siteName ?? author) && (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 6,
                fontSize: 16,
                color: fg,
                opacity: 0.5,
              }}
            >
              {siteName && <span>{siteName}</span>}
              {siteName && author && <span>·</span>}
              {author && <span>{author}</span>}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
