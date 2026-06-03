import type { TemplateProps } from "../shared/types";

export function BrowserComponent({ metadata, customizations, dimensions }: TemplateProps) {
  const bg = (customizations["bgColor"] as string) ?? "#0f0a1e";
  const accent = (customizations["accentColor"] as string) ?? "#a855f7";
  const textColor = (customizations["textColor"] as string) ?? "#f8fafc";
  const episodeNumber = (customizations["episodeNumber"] as string) ?? "1";
  const duration = (customizations["duration"] as string) ?? "";
  const { title, description, author, siteName, tags = [] } = metadata;

  const isWide = dimensions.w > dimensions.h;

  return (
    <div
      style={{
        width: dimensions.w,
        height: dimensions.h,
        backgroundColor: bg,
        color: textColor,
        display: "flex",
        flexDirection: "column",
        padding: isWide ? "56px 72px" : "56px 56px",
        boxSizing: "border-box",
        fontFamily: "Inter, system-ui, sans-serif",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Ambient circle */}
      <div
        style={{
          position: "absolute",
          top: -120,
          right: -120,
          width: 480,
          height: 480,
          borderRadius: "50%",
          background: `radial-gradient(circle, ${accent}33 0%, transparent 70%)`,
          pointerEvents: "none",
        }}
      />

      {/* Top row */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: 40,
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
          }}
        >
          {/* Mic icon approximation */}
          <div
            style={{
              width: 36,
              height: 36,
              borderRadius: "50%",
              backgroundColor: accent,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
            }}
          >
            <div style={{ width: 10, height: 16, backgroundColor: textColor, borderRadius: 5 }} />
          </div>
          <span
            style={{
              fontSize: 14,
              fontWeight: 600,
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              color: textColor,
              opacity: 0.7,
            }}
          >
            {siteName ?? "Podcast"}
          </span>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          {duration && (
            <span
              style={{
                fontSize: 13,
                padding: "5px 14px",
                borderRadius: 999,
                border: `1.5px solid ${accent}`,
                color: accent,
              }}
            >
              {duration}
            </span>
          )}
          <span
            style={{
              fontSize: 13,
              padding: "5px 14px",
              borderRadius: 999,
              backgroundColor: accent,
              color: textColor,
              fontWeight: 600,
            }}
          >
            EP. {episodeNumber}
          </span>
        </div>
      </div>

      {/* Title */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center" }}>
        <h1
          style={{
            fontSize: isWide ? 52 : 44,
            fontWeight: 800,
            lineHeight: 1.1,
            margin: 0,
            color: textColor,
            maxWidth: "80%",
            letterSpacing: "-0.02em",
          }}
        >
          {title}
        </h1>
        {description && (
          <p
            style={{
              fontSize: 18,
              lineHeight: 1.55,
              marginTop: 20,
              marginBottom: 0,
              color: textColor,
              opacity: 0.55,
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
          marginTop: 32,
        }}
      >
        <div style={{ display: "flex", gap: 8 }}>
          {tags.slice(0, 3).map((t) => (
            <span
              key={t}
              style={{
                fontSize: 12,
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                padding: "4px 12px",
                borderRadius: 4,
                backgroundColor: accent + "22",
                color: accent,
              }}
            >
              {t}
            </span>
          ))}
        </div>
        {author && (
          <span style={{ fontSize: 14, opacity: 0.45, color: textColor }}>
            with {author}
          </span>
        )}
      </div>
    </div>
  );
}
