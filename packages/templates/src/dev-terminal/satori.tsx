import type { TemplateProps } from "../shared/types";

const TRAFFIC_LIGHTS = ["#ff5f57", "#febc2e", "#28c840"] as const;

export function SatoriComponent({
  metadata,
  customizations,
  dimensions,
}: TemplateProps) {
  const bg = (customizations["bgColor"] as string) ?? "#0d1117";
  const promptColor = (customizations["promptColor"] as string) ?? "#7ee787";
  const textColor = (customizations["textColor"] as string) ?? "#c9d1d9";
  const scale = (customizations["fontScale"] as number) ?? 1;
  const {
    title,
    description,
    author,
    siteName,
    tags = [],
    readingTime,
  } = metadata;

  return (
    <div
      style={{
        width: dimensions.w,
        height: dimensions.h,
        backgroundColor: bg,
        color: textColor,
        fontFamily: "Inter",
        display: "flex",
        flexDirection: "column",
        paddingTop: 40,
        paddingBottom: 40,
        paddingLeft: 64,
        paddingRight: 64,
      }}
    >
      {/* Window title bar */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 8,
          marginBottom: 44,
        }}
      >
        {TRAFFIC_LIGHTS.map((c) => (
          <div
            key={c}
            style={{
              display: "flex",
              width: 13,
              height: 13,
              borderRadius: 99,
              backgroundColor: c,
              flexShrink: 0,
            }}
          />
        ))}
        <div
          style={{
            display: "flex",
            marginLeft: 16,
            fontSize: 13,
            opacity: 0.3,
            color: textColor,
          }}
        >
          {(siteName ?? "blog") + " — zsh"}
        </div>
      </div>

      {/* Shell prompt */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 10,
          marginBottom: 36,
        }}
      >
        <div
          style={{
            display: "flex",
            color: promptColor,
            fontSize: Math.round(15 * scale),
            fontWeight: 600,
          }}
        >
          ~
        </div>
        <div
          style={{
            display: "flex",
            color: promptColor,
            fontSize: Math.round(15 * scale),
            fontWeight: 600,
          }}
        >
          $
        </div>
        <div
          style={{
            display: "flex",
            fontSize: Math.round(15 * scale),
            opacity: 0.4,
            color: textColor,
          }}
        >
          cat post.md
        </div>
      </div>

      {/* Main content */}
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
            fontSize: Math.round(50 * scale),
            fontWeight: 700,
            lineHeight: 1.15,
            color: promptColor,
          }}
        >
          {title}
        </div>
        {description ? (
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              fontSize: Math.round(16 * scale),
              lineHeight: 1.55,
              opacity: 0.45,
              color: textColor,
              marginTop: 18,
            }}
          >
            {"// " + description}
          </div>
        ) : null}
      </div>

      {/* Separator */}
      <div
        style={{
          display: "flex",
          height: 1,
          backgroundColor: "rgba(255,255,255,0.07)",
          marginBottom: 24,
        }}
      />

      {/* Footer */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <div style={{ display: "flex", gap: 14 }}>
          {tags.slice(0, 4).map((tag) => (
            <div
              key={tag}
              style={{
                display: "flex",
                fontSize: 13,
                color: promptColor,
                opacity: 0.7,
              }}
            >
              {"#" + tag}
            </div>
          ))}
        </div>
        <div
          style={{
            display: "flex",
            gap: 16,
            fontSize: 13,
            opacity: 0.35,
            color: textColor,
          }}
        >
          {author ? <div style={{ display: "flex" }}>{author}</div> : null}
          {readingTime ? (
            <div style={{ display: "flex" }}>{readingTime + " min read"}</div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
