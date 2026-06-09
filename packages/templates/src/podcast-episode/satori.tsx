// Satori: no className, no position:absolute, inline styles, display:flex everywhere.
import type { TemplateProps } from "../shared/types";

export function SatoriComponent({
  metadata,
  customizations,
  dimensions,
}: TemplateProps) {
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
        paddingTop: isWide ? 56 : 56,
        paddingBottom: isWide ? 56 : 56,
        paddingLeft: isWide ? 72 : 56,
        paddingRight: isWide ? 72 : 56,
        fontFamily: "Inter",
      }}
    >
      {/* Top row */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: 40,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div
            style={{
              width: 34,
              height: 34,
              borderRadius: 17,
              backgroundColor: accent,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <div
              style={{
                width: 9,
                height: 14,
                backgroundColor: textColor,
                borderRadius: 5,
                display: "flex",
              }}
            />
          </div>
          <div
            style={{
              display: "flex",
              fontSize: 13,
              fontWeight: 600,
              letterSpacing: "0.08em",
              color: textColor,
              opacity: 0.7,
            }}
          >
            {siteName ?? "Podcast"}
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          {duration ? (
            <div
              style={{
                display: "flex",
                fontSize: 13,
                paddingTop: 5,
                paddingBottom: 5,
                paddingLeft: 14,
                paddingRight: 14,
                borderRadius: 999,
                border: `1.5px solid ${accent}`,
                color: accent,
              }}
            >
              {duration}
            </div>
          ) : null}
          <div
            style={{
              display: "flex",
              fontSize: 13,
              fontWeight: 600,
              paddingTop: 5,
              paddingBottom: 5,
              paddingLeft: 14,
              paddingRight: 14,
              borderRadius: 999,
              backgroundColor: accent,
              color: textColor,
            }}
          >
            EP. {episodeNumber}
          </div>
        </div>
      </div>

      {/* Title */}
      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
        }}
      >
        <div
          style={{
            fontSize: isWide ? 52 : 44,
            fontWeight: 800,
            lineHeight: 1.1,
            color: textColor,
            maxWidth: "80%",
            display: "flex",
            flexWrap: "wrap",
          }}
        >
          {title}
        </div>
        {description ? (
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              fontSize: 18,
              lineHeight: 1.55,
              marginTop: 20,
              color: textColor,
              opacity: 0.55,
              maxWidth: "70%",
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
                borderRadius: 4,
                backgroundColor: accent + "22",
                color: accent,
              }}
            >
              {t}
            </div>
          ))}
        </div>
        {author ? (
          <div
            style={{
              display: "flex",
              fontSize: 14,
              opacity: 0.45,
              color: textColor,
            }}
          >
            with {author}
          </div>
        ) : null}
      </div>
    </div>
  );
}
