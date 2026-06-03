import type { TemplateProps } from "../shared/types";

export function BrowserComponent({ metadata, customizations, dimensions }: TemplateProps) {
  const bg = (customizations["bgColor"] as string) ?? "#fafaf9";
  const textColor = (customizations["textColor"] as string) ?? "#1c1917";
  const accent = (customizations["accentColor"] as string) ?? "#f97316";
  const scale = (customizations["fontScale"] as number) ?? 1;
  const alignment = (customizations["alignment"] as string) ?? "left";
  const { title, author, siteName } = metadata;

  const isCenter = alignment === "center";

  return (
    <div
      style={{
        width: dimensions.w,
        height: dimensions.h,
        backgroundColor: bg,
        display: "flex",
        flexDirection: "column",
        alignItems: isCenter ? "center" : "flex-start",
        justifyContent: "center",
        padding: "64px 80px",
        boxSizing: "border-box",
        fontFamily: "Georgia, 'Times New Roman', serif",
        textAlign: isCenter ? "center" : "left",
      }}
    >
      {/* Decorative quote mark */}
      <div
        style={{
          fontSize: Math.round(160 * scale),
          lineHeight: 0.7,
          color: accent,
          fontFamily: "Georgia, serif",
          marginBottom: 24,
          fontWeight: 700,
          userSelect: "none",
        }}
      >
        "
      </div>

      {/* Quote text */}
      <p
        style={{
          fontSize: Math.round(44 * scale),
          fontWeight: 700,
          lineHeight: 1.2,
          color: textColor,
          margin: 0,
          maxWidth: isCenter ? "80%" : "85%",
          letterSpacing: "-0.01em",
        }}
      >
        {title}
      </p>

      {/* Attribution */}
      {(author ?? siteName) && (
        <div
          style={{
            marginTop: 40,
            display: "flex",
            alignItems: "center",
            gap: 12,
          }}
        >
          <div
            style={{
              width: 32,
              height: 3,
              backgroundColor: accent,
              borderRadius: 2,
              flexShrink: 0,
            }}
          />
          <span
            style={{
              fontSize: 18,
              fontFamily: "Inter, system-ui, sans-serif",
              color: textColor,
              opacity: 0.6,
              fontStyle: "italic",
            }}
          >
            {author ?? siteName}
          </span>
        </div>
      )}
    </div>
  );
}
