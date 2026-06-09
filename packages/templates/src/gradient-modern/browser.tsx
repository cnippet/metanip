import type { TemplateProps } from "../shared/types";

export function BrowserComponent({
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
        fontFamily: "Inter, system-ui, sans-serif",
        display: "flex",
        flexDirection: "column",
        padding: "60px 72px",
        boxSizing: "border-box",
      }}
    >
      {/* Site badge */}
      <div style={{ display: "flex", marginBottom: 48 }}>
        <span
          style={{
            fontSize: 13,
            fontWeight: 600,
            letterSpacing: "0.04em",
            padding: "7px 18px",
            borderRadius: 999,
            backgroundColor: "rgba(255,255,255,0.18)",
            color: textColor,
          }}
        >
          {siteName ?? "Blog"}
        </span>
      </div>

      {/* Title + description */}
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
            fontSize: Math.round(62 * scale),
            fontWeight: 800,
            lineHeight: 1.04,
            margin: 0,
            letterSpacing: "-0.03em",
            color: textColor,
          }}
        >
          {title}
        </h1>
        {description && (
          <p
            style={{
              fontSize: Math.round(20 * scale),
              lineHeight: 1.5,
              margin: "22px 0 0",
              opacity: 0.82,
              color: textColor,
              maxWidth: "68%",
            }}
          >
            {description}
          </p>
        )}
      </div>

      {/* Footer */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <div style={{ display: "flex", gap: 8 }}>
          {tags.slice(0, 3).map((tag) => (
            <span
              key={tag}
              style={{
                fontSize: 13,
                fontWeight: 500,
                padding: "6px 16px",
                borderRadius: 999,
                backgroundColor: "rgba(255,255,255,0.2)",
                color: textColor,
              }}
            >
              {tag}
            </span>
          ))}
        </div>
        {author && (
          <span
            style={{
              fontSize: 15,
              opacity: 0.78,
              color: textColor,
              fontWeight: 500,
            }}
          >
            {author}
          </span>
        )}
      </div>
    </div>
  );
}
