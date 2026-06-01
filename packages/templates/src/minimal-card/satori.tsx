// Satori constraints: no className, inline styles only, display:flex on every container,
// use div instead of semantic elements (h1/p) to avoid implicit block display issues,
// no box-sizing, no margin shorthand — use explicit paddingTop/Bottom/Left/Right.
import type { TemplateProps } from "../shared/types";

export function SatoriComponent({
  metadata,
  customizations,
  dimensions,
}: TemplateProps) {
  const bg = (customizations["bgColor"] as string) ?? "#ffffff";
  const fg = (customizations["textColor"] as string) ?? "#09090b";
  const accent = (customizations["accentColor"] as string) ?? "#3b82f6";
  const scale = (customizations["fontScale"] as number) ?? 1;
  const { title, description, siteName, author, tags = [] } = metadata;

  return (
    <div
      style={{
        width: dimensions.w,
        height: dimensions.h,
        backgroundColor: bg,
        color: fg,
        fontFamily: "Inter",
        display: "flex",
        flexDirection: "column",
        paddingTop: 64,
        paddingBottom: 64,
        paddingLeft: 64,
        paddingRight: 64,
      }}
    >
      {/* Accent bar */}
      <div
        style={{
          width: 56,
          height: 5,
          backgroundColor: accent,
          borderRadius: 3,
          marginBottom: 40,
          display: "flex",
        }}
      />

      {/* Body */}
      <div style={{ display: "flex", flexDirection: "column", flex: 1 }}>
        {/* Title */}
        <div
          style={{
            fontSize: Math.round(52 * scale),
            fontWeight: 700,
            lineHeight: 1.1,
            marginBottom: 20,
            letterSpacing: "-0.02em",
            display: "flex",
            flexWrap: "wrap",
            color: fg,
          }}
        >
          {title}
        </div>

        {/* Description */}
        {description ? (
          <div
            style={{
              fontSize: Math.round(22 * scale),
              lineHeight: 1.55,
              opacity: 0.65,
              maxWidth: "75%",
              display: "flex",
              flexWrap: "wrap",
              color: fg,
            }}
          >
            {description}
          </div>
        ) : null}

        {/* Spacer */}
        <div style={{ flex: 1, display: "flex" }} />

        {/* Footer */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          {/* Tags */}
          <div style={{ display: "flex", gap: 8 }}>
            {tags.slice(0, 4).map((tag) => (
              <div
                key={tag}
                style={{
                  fontSize: 14,
                  fontWeight: 500,
                  paddingTop: 5,
                  paddingBottom: 5,
                  paddingLeft: 14,
                  paddingRight: 14,
                  borderRadius: 999,
                  border: `1.5px solid ${accent}`,
                  color: accent,
                  display: "flex",
                }}
              >
                {tag}
              </div>
            ))}
          </div>

          {/* Site / Author */}
          {(siteName ?? author) ? (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 6,
                fontSize: 16,
                opacity: 0.5,
                color: fg,
              }}
            >
              {siteName ? <span>{siteName}</span> : null}
              {siteName && author ? <span> · </span> : null}
              {author ? <span>{author}</span> : null}
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
