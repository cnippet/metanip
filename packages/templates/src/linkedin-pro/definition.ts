import type { TemplateDefinition } from "../shared/types";
import { STANDARD_DIMENSIONS } from "../shared/tokens";
import { BrowserComponent } from "./browser";
import { SatoriComponent } from "./satori";

export const linkedinPro: TemplateDefinition = {
  id: "linkedin-pro",
  name: "LinkedIn Pro",
  description: "Professional business-card aesthetic optimised for LinkedIn 1200×627 sharing.",
  category: "social",
  supportedDimensions: [
    { w: 1200, h: 627, label: "LinkedIn" },
    { w: 1200, h: 630, label: "OG Image" },
    { w: 1600, h: 900, label: "Twitter" },
    { w: 1080, h: 1080, label: "Square" },
  ],
  requiredFields: ["title"],
  customizations: {
    bgColor: {
      type: "color",
      label: "Background",
      defaultValue: "#ffffff",
    },
    accentColor: {
      type: "color",
      label: "Accent",
      defaultValue: "#0a66c2",
    },
    textColor: {
      type: "color",
      label: "Text",
      defaultValue: "#000000",
    },
    role: {
      type: "text",
      label: "Role / Dept",
      defaultValue: "Engineering",
    },
    showDivider: {
      type: "toggle",
      label: "Show Divider",
      defaultValue: true,
    },
  },
  defaults: {
    metadata: {
      title: "Why We Migrated 5 Million Records Overnight",
      description: "A step-by-step breakdown of the zero-downtime migration that changed how we think about data.",
      author: "Priya Sharma",
      siteName: "Acme Corp",
      tags: ["engineering", "database", "migration"],
    },
    customizations: {
      bgColor: "#ffffff",
      accentColor: "#0a66c2",
      textColor: "#000000",
      role: "Engineering",
      showDivider: true,
    },
  },
  BrowserComponent,
  SatoriComponent,
  previewImagePath: "/templates/linkedin-pro/preview.png",
};
