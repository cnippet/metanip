import type { TemplateDefinition } from "../shared/types";
import { STANDARD_DIMENSIONS } from "../shared/tokens";
import { BrowserComponent } from "./browser";
import { SatoriComponent } from "./satori";

export const magazineSpread: TemplateDefinition = {
  id: "magazine-spread",
  name: "Magazine Spread",
  description: "Asymmetric two-column layout: oversized category label left, headline and byline right.",
  category: "editorial",
  supportedDimensions: [...STANDARD_DIMENSIONS],
  requiredFields: ["title"],
  customizations: {
    bgColor: {
      type: "color",
      label: "Background",
      defaultValue: "#fffbf5",
    },
    leftBg: {
      type: "color",
      label: "Left Panel",
      defaultValue: "#1a1a1a",
    },
    textColor: {
      type: "color",
      label: "Text",
      defaultValue: "#1a1a1a",
    },
    accentColor: {
      type: "color",
      label: "Accent",
      defaultValue: "#dc2626",
    },
    issueLabel: {
      type: "text",
      label: "Issue / Category",
      defaultValue: "FEATURE",
    },
  },
  defaults: {
    metadata: {
      title: "The Rise of the Indie Developer",
      description: "How small teams are out-shipping giants and redefining what software looks like.",
      author: "Maria Santos",
      siteName: "Increment",
      publishedAt: new Date("2024-03-15"),
      tags: ["engineering", "culture"],
    },
    customizations: {
      bgColor: "#fffbf5",
      leftBg: "#1a1a1a",
      textColor: "#1a1a1a",
      accentColor: "#dc2626",
      issueLabel: "FEATURE",
    },
  },
  BrowserComponent,
  SatoriComponent,
  previewImagePath: "/templates/magazine-spread/preview.png",
};
