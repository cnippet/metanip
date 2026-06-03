// Satori: no className, inline styles only, display:flex everywhere.
import type { TemplateProps } from "../shared/types";

export function SatoriComponent({ metadata, customizations, dimensions }: TemplateProps) {
  const bg = (customizations["bgColor"] as string) ?? "#fef9f0";
  const textColor = (customizations["textColor"] as string) ?? "#1c1917";
  const accent = (customizations["accentColor"] as string) ?? "#92400e";
  const issueNumber = (customizations["issueNumber"] as string) ?? "№ 1";
  const scale = (customizations["fontScale"] as number) ?? 1;
  const { title, description, author, siteName, publishedAt, tags = [] } = metadata;

  const dateStr = publishedAt
    ? new Date(publishedAt).toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
      })
    : null;

  const isWide = dimensions.w > dimensions.h;

  return (
    <div
      style={{
        width: dimensions.w,
        height: dimensions.h,
        backgroundColor: bg,
        display: "flex",
        flexDirection: "column",
        paddingTop: isWide ? 56 : 48,
        paddingBottom: isWide ? 56 : 48,
        paddingLeft: isWide ? 88 : 64,
        paddingRight: isWide ? 88 : 64,
        fontFamily: "Inter",
        color: textColor,
      }}
    >
      {/* Masthead */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          paddingBottom: 20,
          borderBottom: `1.5px solid ${textColor}20`,
          marginBottom: 44,
        }}
      >
        <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
          <div
            style={{
              display: "flex",
              fontSize: 16,
              fontWeight: 700,
              letterSpacing: "0.04em",
              color: accent,
            }}
          >
            {siteName ?? "The Letter"}
          </div>
          {dateStr ? (
            <div style={{ display: "flex", fontSize: 12, opacity: 0.4, color: textColor }}>
              {dateStr}
            </div>
          ) : null}
        </div>
        <div
          style={{
            display: "flex",
            fontSize: 13,
            opacity: 0.4,
            color: textColor,
            fontStyle: "italic",
          }}
        >
          {issueNumber}
        </div>
      </div>

      {/* Headline */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center" }}>
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            fontSize: Math.round((isWide ? 54 : 44) * scale),
            fontWeight: 700,
            lineHeight: 1.15,
            color: textColor,
            maxWidth: "82%",
          }}
        >
          {title}
        </div>

        {/* Accent rule */}
        <div
          style={{
            display: "flex",
            width: 56,
            height: 2,
            backgroundColor: accent,
            borderRadius: 1,
            marginTop: 28,
            marginBottom: 20,
          }}
        />

        {description ? (
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              fontSize: Math.round(19 * scale),
              lineHeight: 1.65,
              color: textColor,
              opacity: 0.6,
              maxWidth: "75%",
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
                paddingTop: 3,
                paddingBottom: 3,
                paddingLeft: 10,
                paddingRight: 10,
                borderRadius: 3,
                border: `1px solid ${accent}40`,
                color: accent,
              }}
            >
              {t}
            </div>
          ))}
        </div>
        {author ? (
          <div style={{ display: "flex", fontSize: 13, opacity: 0.4, color: textColor }}>
            {author}
          </div>
        ) : null}
      </div>
    </div>
  );
}
