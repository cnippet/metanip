import type { TemplateDefinition } from "../shared/types";
import { STANDARD_DIMENSIONS } from "../shared/tokens";
import { BrowserComponent } from "./browser";
import { SatoriComponent } from "./satori";

export const newsletterClassic: TemplateDefinition = {
  id: "newsletter-classic",
  name: "Newsletter Classic",
  description: "Refined letter-style layout with serif headline, issue number, and editorial footer.",
  category: "newsletter",
  supportedDimensions: [...STANDARD_DIMENSIONS],
  requiredFields: ["title"],
  customizations: {
    bgColor: {
      type: "color",
      label: "Background",
      defaultValue: "#fef9f0",
    },
    textColor: {
      type: "color",
      label: "Text",
      defaultValue: "#1c1917",
    },
    accentColor: {
      type: "color",
      label: "Accent",
      defaultValue: "#92400e",
    },
    issueNumber: {
      type: "text",
      label: "Issue #",
      defaultValue: "№ 12",
    },
    fontScale: {
      type: "slider",
      label: "Font Scale",
      min: 0.75,
      max: 1.3,
      step: 0.05,
      defaultValue: 1,
    },
  },
  defaults: {
    metadata: {
      title: "The Slow Web & Why It Matters",
      description: "This week: reclaiming depth in a distracted era, plus the tools helping developers ship more intentionally.",
      author: "Clara Osei",
      siteName: "Thoughtware",
      publishedAt: new Date("2024-04-01"),
      tags: ["newsletter", "productivity", "web"],
    },
    customizations: {
      bgColor: "#fef9f0",
      textColor: "#1c1917",
      accentColor: "#92400e",
      issueNumber: "№ 12",
      fontScale: 1,
    },
  },
  BrowserComponent,
  SatoriComponent,
  previewImagePath: "/templates/newsletter-classic/preview.png",
};
