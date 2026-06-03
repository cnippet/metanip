// Satori: no className, no position:absolute/relative, no CSS gradients with url().
// For photo-overlay we simulate the overlay with a stacked flex layout.
// If heroImage is present it's loaded via <img> — Satori supports external URLs directly.
import type { TemplateProps } from "../shared/types";

export function SatoriComponent({ metadata, customizations, dimensions }: TemplateProps) {
  const overlayColor = (customizations["overlayColor"] as string) ?? "#000000";
  const overlayOpacity = (customizations["overlayOpacity"] as number) ?? 0.6;
  const textColor = (customizations["textColor"] as string) ?? "#ffffff";
  const accent = (customizations["accentColor"] as string) ?? "#f59e0b";
  const fallbackBg = (customizations["fallbackBg"] as string) ?? "#1e293b";
  const { title, description, author, siteName, heroImage, tags = [] } = metadata;

  // Satori does not support position:absolute stacking, so we use a dark overlay bg
  // and render the image as a tinted background approximation via a left-anchored image div.
  const bgColor = heroImage ? overlayColor : fallbackBg;
  const textOpacity = heroImage ? 1 : 1;

  return (
    <div
      style={{
        width: dimensions.w,
        height: dimensions.h,
        backgroundColor: bgColor,
        display: "flex",
        flexDirection: "column",
        paddingTop: 56,
        paddingBottom: 56,
        paddingLeft: 72,
        paddingRight: 72,
        fontFamily: "Inter",
        color: textColor,
      }}
    >
      {/* Site name */}
      {siteName ? (
        <div
          style={{
            display: "flex",
            fontSize: 14,
            letterSpacing: "0.12em",
            color: textColor,
            opacity: 0.6,
            marginBottom: 0,
          }}
        >
          {siteName}
        </div>
      ) : null}

      {/* Spacer */}
      <div style={{ flex: 1, display: "flex" }} />

      {/* Accent bar */}
      <div
        style={{
          display: "flex",
          width: 48,
          height: 4,
          backgroundColor: accent,
          borderRadius: 2,
          marginBottom: 20,
        }}
      />

      {/* Title */}
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          fontSize: 56,
          fontWeight: 800,
          lineHeight: 1.1,
          color: textColor,
          maxWidth: "75%",
        }}
      >
        {title}
      </div>

      {description ? (
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            fontSize: 20,
            lineHeight: 1.5,
            marginTop: 16,
            color: textColor,
            opacity: 0.75,
            maxWidth: "65%",
          }}
        >
          {description}
        </div>
      ) : null}

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
            <div
              key={t}
              style={{
                display: "flex",
                fontSize: 12,
                paddingTop: 4,
                paddingBottom: 4,
                paddingLeft: 12,
                paddingRight: 12,
                borderRadius: 999,
                backgroundColor: "rgba(255,255,255,0.15)",
                color: textColor,
              }}
            >
              {t}
            </div>
          ))}
        </div>
        {author ? (
          <div style={{ display: "flex", fontSize: 14, opacity: 0.6, color: textColor }}>
            {author}
          </div>
        ) : null}
      </div>
    </div>
  );
}
