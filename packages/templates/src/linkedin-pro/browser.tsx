import type { TemplateProps } from "../shared/types";

export function BrowserComponent({
  metadata,
  customizations,
  dimensions,
}: TemplateProps) {
  const bg = (customizations["bgColor"] as string) ?? "#ffffff";
  const accent = (customizations["accentColor"] as string) ?? "#0a66c2";
  const textColor = (customizations["textColor"] as string) ?? "#000000";
  const role = (customizations["role"] as string) ?? "";
  const showDivider = (customizations["showDivider"] as boolean) ?? true;
  const { title, description, author, siteName, tags = [] } = metadata;

  const isWide = dimensions.w > dimensions.h;

  return (
    <div
      style={{
        width: dimensions.w,
        height: dimensions.h,
        backgroundColor: bg,
        display: "flex",
        flexDirection: "column",
        padding: isWide ? "56px 72px" : "48px 56px",
        boxSizing: "border-box",
        fontFamily: "Inter, system-ui, sans-serif",
      }}
    >
      {/* Top bar with accent stripe */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: 44,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          {/* LinkedIn-style logo block */}
          <div
            style={{
              width: 36,
              height: 36,
              borderRadius: 6,
              backgroundColor: accent,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <span
              style={{
                color: "#fff",
                fontWeight: 800,
                fontSize: 18,
                lineHeight: 1,
              }}
            >
              in
            </span>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 1 }}>
            <span style={{ fontSize: 14, fontWeight: 600, color: textColor }}>
              {siteName ?? "LinkedIn"}
            </span>
            {role && (
              <span style={{ fontSize: 12, color: textColor, opacity: 0.45 }}>
                {role}
              </span>
            )}
          </div>
        </div>
        <div
          style={{
            fontSize: 12,
            letterSpacing: "0.06em",
            color: accent,
            fontWeight: 600,
            padding: "5px 14px",
            borderRadius: 999,
            border: `1.5px solid ${accent}`,
          }}
        >
          Article
        </div>
      </div>

      {/* Divider */}
      {showDivider && (
        <div
          style={{
            width: "100%",
            height: 2,
            background: `linear-gradient(to right, ${accent}, transparent)`,
            marginBottom: 40,
            flexShrink: 0,
            borderRadius: 1,
          }}
        />
      )}

      {/* Title area */}
      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
        }}
      >
        <h1
          style={{
            fontSize: isWide ? 50 : 40,
            fontWeight: 700,
            lineHeight: 1.12,
            margin: 0,
            color: textColor,
            letterSpacing: "-0.02em",
            maxWidth: "85%",
          }}
        >
          {title}
        </h1>
        {description && (
          <p
            style={{
              fontSize: 18,
              lineHeight: 1.55,
              marginTop: 16,
              marginBottom: 0,
              color: textColor,
              opacity: 0.55,
              maxWidth: "75%",
            }}
          >
            {description}
          </p>
        )}
      </div>

      {/* Footer */}
      <div
        style={{
          marginTop: 36,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <div style={{ display: "flex", gap: 8 }}>
          {tags.slice(0, 4).map((t) => (
            <span
              key={t}
              style={{
                fontSize: 12,
                padding: "4px 12px",
                borderRadius: 4,
                backgroundColor: accent + "12",
                color: accent,
                fontWeight: 500,
              }}
            >
              #{t}
            </span>
          ))}
        </div>
        {author && (
          <span style={{ fontSize: 14, opacity: 0.5, color: textColor }}>
            {author}
          </span>
        )}
      </div>
    </div>
  );
}
