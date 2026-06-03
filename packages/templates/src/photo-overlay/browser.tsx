import type { TemplateProps } from "../shared/types";

export function BrowserComponent({ metadata, customizations, dimensions }: TemplateProps) {
  const overlayColor = (customizations["overlayColor"] as string) ?? "#000000";
  const overlayOpacity = (customizations["overlayOpacity"] as number) ?? 0.6;
  const textColor = (customizations["textColor"] as string) ?? "#ffffff";
  const accent = (customizations["accentColor"] as string) ?? "#f59e0b";
  const fallbackBg = (customizations["fallbackBg"] as string) ?? "#1e293b";
  const { title, description, author, siteName, heroImage, tags = [] } = metadata;

  // Convert hex to rgb for rgba()
  const hexToRgb = (hex: string) => {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return `${r},${g},${b}`;
  };

  const rgb = hexToRgb(overlayColor.startsWith("#") ? overlayColor : "#000000");

  return (
    <div
      style={{
        width: dimensions.w,
        height: dimensions.h,
        display: "flex",
        flexDirection: "column",
        position: "relative",
        overflow: "hidden",
        fontFamily: "Inter, system-ui, sans-serif",
        backgroundColor: fallbackBg,
        boxSizing: "border-box",
      }}
    >
      {/* Hero image */}
      {heroImage && (
        <img
          src={heroImage}
          alt=""
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            objectFit: "cover",
          }}
        />
      )}

      {/* Gradient overlay */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: `linear-gradient(to top, rgba(${rgb},${overlayOpacity + 0.3}) 0%, rgba(${rgb},${overlayOpacity}) 50%, rgba(${rgb},${Math.max(0, overlayOpacity - 0.2)}) 100%)`,
        }}
      />

      {/* Content */}
      <div
        style={{
          position: "relative",
          display: "flex",
          flexDirection: "column",
          height: "100%",
          padding: "56px 72px",
          boxSizing: "border-box",
          color: textColor,
        }}
      >
        {/* Top: site name */}
        {siteName && (
          <div
            style={{
              fontSize: 14,
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              opacity: 0.7,
              color: textColor,
            }}
          >
            {siteName}
          </div>
        )}

        {/* Spacer */}
        <div style={{ flex: 1 }} />

        {/* Accent bar */}
        <div
          style={{
            width: 48,
            height: 4,
            backgroundColor: accent,
            borderRadius: 2,
            marginBottom: 20,
            flexShrink: 0,
          }}
        />

        {/* Title */}
        <h1
          style={{
            fontSize: 56,
            fontWeight: 800,
            lineHeight: 1.1,
            margin: 0,
            color: textColor,
            letterSpacing: "-0.02em",
            maxWidth: "75%",
          }}
        >
          {title}
        </h1>

        {description && (
          <p
            style={{
              fontSize: 20,
              lineHeight: 1.5,
              marginTop: 16,
              marginBottom: 0,
              opacity: 0.75,
              maxWidth: "65%",
              color: textColor,
            }}
          >
            {description}
          </p>
        )}

        {/* Footer */}
        <div
          style={{
            marginTop: 32,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div style={{ display: "flex", gap: 8 }}>
            {tags.slice(0, 3).map((t) => (
              <span
                key={t}
                style={{
                  fontSize: 12,
                  padding: "4px 12px",
                  borderRadius: 999,
                  backgroundColor: "rgba(255,255,255,0.15)",
                  color: textColor,
                  backdropFilter: "blur(4px)",
                }}
              >
                {t}
              </span>
            ))}
          </div>
          {author && (
            <span style={{ fontSize: 14, opacity: 0.6, color: textColor }}>
              {author}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
