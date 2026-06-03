// Satori: no className, inline styles only, display:flex on every container.
import type { TemplateProps } from "../shared/types";

export function SatoriComponent({ metadata, customizations, dimensions }: TemplateProps) {
  const bg = (customizations["bgColor"] as string) ?? "#fffbf5";
  const leftBg = (customizations["leftBg"] as string) ?? "#1a1a1a";
  const textColor = (customizations["textColor"] as string) ?? "#1a1a1a";
  const accent = (customizations["accentColor"] as string) ?? "#dc2626";
  const issueLabel = (customizations["issueLabel"] as string) ?? "FEATURE";
  const { title, description, author, siteName, publishedAt, tags = [] } = metadata;

  const dateStr = publishedAt
    ? new Date(publishedAt).toLocaleDateString("en-US", { month: "long", year: "numeric" })
    : null;

  const isWide = dimensions.w > dimensions.h;
  const leftW = isWide ? Math.round(dimensions.w * 0.28) : Math.round(dimensions.w * 0.32);

  return (
    <div
      style={{
        width: dimensions.w,
        height: dimensions.h,
        backgroundColor: bg,
        display: "flex",
        flexDirection: "row",
        fontFamily: "Inter",
        overflow: "hidden",
      }}
    >
      {/* Left panel */}
      <div
        style={{
          width: leftW,
          height: "100%",
          backgroundColor: leftBg,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "space-between",
          paddingTop: 48,
          paddingBottom: 48,
          paddingLeft: 24,
          paddingRight: 24,
          flexShrink: 0,
        }}
      >
        <div
          style={{
            display: "flex",
            fontSize: 11,
            color: "rgba(255,255,255,0.35)",
          }}
        >
          {siteName ?? "Publication"}
        </div>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 8,
          }}
        >
          <div
            style={{
              display: "flex",
              width: 40,
              height: 40,
              backgroundColor: accent,
              borderRadius: 4,
            }}
          />
          <div
            style={{
              display: "flex",
              fontSize: 11,
              color: "rgba(255,255,255,0.3)",
            }}
          >
            {dateStr ?? "2024"}
          </div>
        </div>

        <div style={{ display: "flex", fontSize: 11, color: "rgba(255,255,255,0.15)" }}>·</div>
      </div>

      {/* Right panel */}
      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          paddingTop: isWide ? 56 : 40,
          paddingBottom: isWide ? 56 : 40,
          paddingLeft: isWide ? 64 : 44,
          paddingRight: isWide ? 64 : 44,
        }}
      >
        {/* Category badge */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 12,
            marginBottom: 36,
          }}
        >
          <div
            style={{
              display: "flex",
              width: 28,
              height: 3,
              backgroundColor: accent,
              borderRadius: 2,
            }}
          />
          <div
            style={{
              display: "flex",
              fontSize: 11,
              letterSpacing: "0.18em",
              color: accent,
              fontWeight: 700,
            }}
          >
            {issueLabel}
          </div>
        </div>

        {/* Title */}
        <div
          style={{
            flex: 1,
            display: "flex",
            flexWrap: "wrap",
            alignContent: "flex-start",
            fontSize: isWide ? 52 : 40,
            fontWeight: 800,
            lineHeight: 1.08,
            color: textColor,
            fontFamily: "Inter",
          }}
        >
          {title}
        </div>

        {description ? (
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              fontSize: 17,
              lineHeight: 1.6,
              color: textColor,
              opacity: 0.6,
              maxWidth: "90%",
              marginTop: 16,
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
          <div style={{ display: "flex", gap: 6 }}>
            {tags.slice(0, 3).map((t) => (
              <div
                key={t}
                style={{
                  display: "flex",
                  fontSize: 11,
                  paddingTop: 3,
                  paddingBottom: 3,
                  paddingLeft: 10,
                  paddingRight: 10,
                  borderRadius: 2,
                  backgroundColor: accent + "15",
                  color: accent,
                }}
              >
                {t}
              </div>
            ))}
          </div>
          {author ? (
            <div style={{ display: "flex", fontSize: 13, opacity: 0.45, color: textColor }}>
              {author}
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
