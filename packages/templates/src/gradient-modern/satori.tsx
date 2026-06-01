import type { TemplateProps } from "../shared/types";

export function SatoriComponent({
  metadata,
  customizations,
  dimensions,
}: TemplateProps) {
  const gradFrom = (customizations["gradientFrom"] as string) ?? "#6366f1";
  const gradTo = (customizations["gradientTo"] as string) ?? "#8b5cf6";
  const textColor = (customizations["textColor"] as string) ?? "#ffffff";
  const scale = (customizations["fontScale"] as number) ?? 1;
  const { title, description, author, siteName, tags = [] } = metadata;

  return (
    <div
      style={{
        width: dimensions.w,
        height: dimensions.h,
        background: `linear-gradient(135deg, ${gradFrom} 0%, ${gradTo} 100%)`,
        color: textColor,
        fontFamily: "Inter",
        display: "flex",
        flexDirection: "column",
        paddingTop: 60,
        paddingBottom: 60,
        paddingLeft: 72,
        paddingRight: 72,
      }}
    >
      {/* Site badge */}
      <div style={{ display: "flex", marginBottom: 48 }}>
        <div
          style={{
            display: "flex",
            fontSize: 13,
            fontWeight: 600,
            letterSpacing: "0.04em",
            paddingTop: 7,
            paddingBottom: 7,
            paddingLeft: 18,
            paddingRight: 18,
            borderRadius: 999,
            backgroundColor: "rgba(255,255,255,0.18)",
            color: textColor,
          }}
        >
          {siteName ?? "Blog"}
        </div>
      </div>

      {/* Title + description */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          flex: 1,
          justifyContent: "center",
        }}
      >
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            fontSize: Math.round(62 * scale),
            fontWeight: 800,
            lineHeight: 1.04,
            letterSpacing: "-0.03em",
            color: textColor,
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
              lineHeight: 1.5,
              marginTop: 22,
              opacity: 0.82,
              color: textColor,
              maxWidth: "68%",
            }}
          >
            {description}
          </div>
        ) : null}
      </div>

      {/* Footer */}
      <div
        style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}
      >
        <div style={{ display: "flex", gap: 8 }}>
          {tags.slice(0, 3).map((tag) => (
            <div
              key={tag}
              style={{
                display: "flex",
                fontSize: 13,
                fontWeight: 500,
                paddingTop: 6,
                paddingBottom: 6,
                paddingLeft: 16,
                paddingRight: 16,
                borderRadius: 999,
                backgroundColor: "rgba(255,255,255,0.2)",
                color: textColor,
              }}
            >
              {tag}
            </div>
          ))}
        </div>
        {author ? (
          <div
            style={{ display: "flex", fontSize: 15, opacity: 0.78, color: textColor, fontWeight: 500 }}
          >
            {author}
          </div>
        ) : null}
      </div>
    </div>
  );
}
