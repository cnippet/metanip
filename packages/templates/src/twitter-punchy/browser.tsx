import type { TemplateProps } from "../shared/types";

export function BrowserComponent({ metadata, customizations, dimensions }: TemplateProps) {
  const bg = (customizations["bgColor"] as string) ?? "#000000";
  const textColor = (customizations["textColor"] as string) ?? "#ffffff";
  const accent = (customizations["accentColor"] as string) ?? "#1d9bf0";
  const showHandle = (customizations["showHandle"] as boolean) ?? true;
  const scale = (customizations["fontScale"] as number) ?? 1;
  const { title, description, author, authorHandle, siteName, tags = [] } = metadata;

  const isWide = dimensions.w > dimensions.h;

  return (
    <div
      style={{
        width: dimensions.w,
        height: dimensions.h,
        backgroundColor: bg,
        display: "flex",
        flexDirection: "column",
        padding: isWide ? "64px 88px" : "56px 64px",
        boxSizing: "border-box",
        fontFamily: "Inter, system-ui, sans-serif",
        color: textColor,
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Background accent circle */}
      <div
        style={{
          position: "absolute",
          bottom: -200,
          right: -200,
          width: 600,
          height: 600,
          borderRadius: "50%",
          backgroundColor: accent,
          opacity: 0.07,
          pointerEvents: "none",
        }}
      />

      {/* Top: platform badge */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 10,
          marginBottom: 48,
        }}
      >
        <div
          style={{
            width: 32,
            height: 32,
            borderRadius: "50%",
            backgroundColor: accent,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
          }}
        >
          <span style={{ color: "#fff", fontWeight: 900, fontSize: 16 }}>𝕏</span>
        </div>
        <span style={{ fontSize: 14, opacity: 0.4, color: textColor }}>
          {siteName ?? "Thread"}
        </span>
      </div>

      {/* Title — the punchline */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center" }}>
        <h1
          style={{
            fontSize: Math.round((isWide ? 62 : 52) * scale),
            fontWeight: 900,
            lineHeight: 1.08,
            margin: 0,
            color: textColor,
            letterSpacing: "-0.03em",
            maxWidth: "80%",
          }}
        >
          {title}
        </h1>

        {description && (
          <p
            style={{
              fontSize: Math.round(20 * scale),
              lineHeight: 1.55,
              marginTop: 20,
              marginBottom: 0,
              color: textColor,
              opacity: 0.5,
              maxWidth: "70%",
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
          marginTop: 40,
        }}
      >
        <div style={{ display: "flex", gap: 8 }}>
          {tags.slice(0, 3).map((t) => (
            <span
              key={t}
              style={{
                fontSize: 13,
                padding: "4px 14px",
                borderRadius: 999,
                border: `1.5px solid rgba(255,255,255,0.15)`,
                color: textColor,
                opacity: 0.6,
              }}
            >
              #{t}
            </span>
          ))}
        </div>

        {showHandle && (author ?? authorHandle) && (
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <div
              style={{
                width: 32,
                height: 32,
                borderRadius: "50%",
                backgroundColor: accent + "33",
                border: `1.5px solid ${accent}`,
                flexShrink: 0,
              }}
            />
            <div style={{ display: "flex", flexDirection: "column", gap: 1 }}>
              {author && (
                <span style={{ fontSize: 13, fontWeight: 600, color: textColor }}>{author}</span>
              )}
              {authorHandle && (
                <span style={{ fontSize: 12, color: accent, opacity: 0.8 }}>{authorHandle}</span>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
