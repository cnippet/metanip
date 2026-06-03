// Satori: no className, inline styles only, display:flex everywhere.
import type { TemplateProps } from "../shared/types";

export function SatoriComponent({ metadata, customizations, dimensions }: TemplateProps) {
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
        paddingTop: 64,
        paddingBottom: 64,
        paddingLeft: 80,
        paddingRight: 80,
        fontFamily: "Inter",
      }}
    >
      {/* Large decorative quote mark */}
      <div
        style={{
          display: "flex",
          fontSize: Math.round(140 * scale),
          lineHeight: 0.7,
          color: accent,
          fontFamily: "Inter",
          marginBottom: 20,
          fontWeight: 700,
        }}
      >
        "
      </div>

      {/* Quote text */}
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          fontSize: Math.round(44 * scale),
          fontWeight: 700,
          lineHeight: 1.2,
          color: textColor,
          maxWidth: isCenter ? "80%" : "85%",
          fontFamily: "Inter",
          textAlign: isCenter ? "center" : "left",
        }}
      >
        {title}
      </div>

      {/* Attribution */}
      {(author ?? siteName) ? (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 12,
            marginTop: 40,
          }}
        >
          <div
            style={{
              display: "flex",
              width: 32,
              height: 3,
              backgroundColor: accent,
              borderRadius: 2,
            }}
          />
          <div
            style={{
              display: "flex",
              fontSize: 18,
              fontFamily: "Inter",
              color: textColor,
              opacity: 0.6,
            }}
          >
            {author ?? siteName}
          </div>
        </div>
      ) : null}
    </div>
  );
}
