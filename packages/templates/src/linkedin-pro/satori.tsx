// Satori: no className, inline styles only, display:flex everywhere.
import type { TemplateProps } from "../shared/types";

export function SatoriComponent({
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
        paddingTop: isWide ? 56 : 48,
        paddingBottom: isWide ? 56 : 48,
        paddingLeft: isWide ? 72 : 56,
        paddingRight: isWide ? 72 : 56,
        fontFamily: "Inter",
      }}
    >
      {/* Top bar */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: 40,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div
            style={{
              display: "flex",
              width: 36,
              height: 36,
              borderRadius: 6,
              backgroundColor: accent,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <div
              style={{
                display: "flex",
                color: "#fff",
                fontWeight: 800,
                fontSize: 18,
              }}
            >
              in
            </div>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
            <div
              style={{
                display: "flex",
                fontSize: 14,
                fontWeight: 600,
                color: textColor,
              }}
            >
              {siteName ?? "LinkedIn"}
            </div>
            {role ? (
              <div
                style={{
                  display: "flex",
                  fontSize: 12,
                  color: textColor,
                  opacity: 0.45,
                }}
              >
                {role}
              </div>
            ) : null}
          </div>
        </div>
        <div
          style={{
            display: "flex",
            fontSize: 12,
            fontWeight: 600,
            paddingTop: 5,
            paddingBottom: 5,
            paddingLeft: 14,
            paddingRight: 14,
            borderRadius: 999,
            border: `1.5px solid ${accent}`,
            color: accent,
          }}
        >
          Article
        </div>
      </div>

      {/* Divider */}
      {showDivider ? (
        <div
          style={{
            display: "flex",
            width: "100%",
            height: 2,
            backgroundColor: accent,
            marginBottom: 36,
            borderRadius: 1,
            opacity: 0.4,
          }}
        />
      ) : null}

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
            display: "flex",
            flexWrap: "wrap",
            fontSize: isWide ? 50 : 40,
            fontWeight: 700,
            lineHeight: 1.12,
            color: textColor,
            maxWidth: "85%",
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
              marginTop: 16,
              color: textColor,
              opacity: 0.55,
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
          {tags.slice(0, 4).map((t) => (
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
                backgroundColor: accent + "12",
                color: accent,
                fontWeight: 500,
              }}
            >
              #{t}
            </div>
          ))}
        </div>
        {author ? (
          <div
            style={{
              display: "flex",
              fontSize: 14,
              opacity: 0.5,
              color: textColor,
            }}
          >
            {author}
          </div>
        ) : null}
      </div>
    </div>
  );
}
