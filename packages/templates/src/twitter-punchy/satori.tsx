// Satori: no className, inline styles only, display:flex everywhere, no position:absolute.
import type { TemplateProps } from "../shared/types";

export function SatoriComponent({ metadata, customizations, dimensions }: TemplateProps) {
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
        paddingTop: isWide ? 64 : 56,
        paddingBottom: isWide ? 64 : 56,
        paddingLeft: isWide ? 88 : 64,
        paddingRight: isWide ? 88 : 64,
        fontFamily: "Inter",
        color: textColor,
      }}
    >
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
            display: "flex",
            width: 32,
            height: 32,
            borderRadius: 16,
            backgroundColor: accent,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <div style={{ display: "flex", color: "#fff", fontWeight: 900, fontSize: 14 }}>X</div>
        </div>
        <div style={{ display: "flex", fontSize: 14, opacity: 0.4, color: textColor }}>
          {siteName ?? "Thread"}
        </div>
      </div>

      {/* Title */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center" }}>
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            fontSize: Math.round((isWide ? 62 : 52) * scale),
            fontWeight: 900,
            lineHeight: 1.08,
            color: textColor,
            maxWidth: "80%",
          }}
        >
          {title}
        </div>

        {description ? (
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              fontSize: Math.round(20 * scale),
              lineHeight: 1.55,
              marginTop: 20,
              color: textColor,
              opacity: 0.5,
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
          marginTop: 40,
        }}
      >
        <div style={{ display: "flex", gap: 8 }}>
          {tags.slice(0, 3).map((t) => (
            <div
              key={t}
              style={{
                display: "flex",
                fontSize: 13,
                paddingTop: 4,
                paddingBottom: 4,
                paddingLeft: 14,
                paddingRight: 14,
                borderRadius: 999,
                border: "1.5px solid rgba(255,255,255,0.15)",
                color: textColor,
                opacity: 0.6,
              }}
            >
              #{t}
            </div>
          ))}
        </div>

        {showHandle && (author ?? authorHandle) ? (
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <div
              style={{
                display: "flex",
                width: 32,
                height: 32,
                borderRadius: 16,
                backgroundColor: accent + "33",
                border: `1.5px solid ${accent}`,
              }}
            />
            <div style={{ display: "flex", flexDirection: "column", gap: 1 }}>
              {author ? (
                <div style={{ display: "flex", fontSize: 13, fontWeight: 600, color: textColor }}>
                  {author}
                </div>
              ) : null}
              {authorHandle ? (
                <div style={{ display: "flex", fontSize: 12, color: accent, opacity: 0.8 }}>
                  {authorHandle}
                </div>
              ) : null}
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}
