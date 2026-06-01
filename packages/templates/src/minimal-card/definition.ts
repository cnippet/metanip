import type { TemplateDefinition } from "../shared/types";
import { STANDARD_DIMENSIONS } from "../shared/tokens";
import { BrowserComponent } from "./browser";
import { SatoriComponent } from "./satori";

export const minimalCard: TemplateDefinition = {
  id: "minimal-card",
  name: "Minimal Card",
  description: "Clean, minimal layout with a bold title, description, tags, and site branding.",
  category: "minimal",
  supportedDimensions: [...STANDARD_DIMENSIONS],
  requiredFields: ["title"],
  customizations: {
    bgColor: {
      type: "color",
      label: "Background",
      defaultValue: "#ffffff",
    },
    textColor: {
      type: "color",
      label: "Text",
      defaultValue: "#09090b",
    },
    accentColor: {
      type: "color",
      label: "Accent",
      defaultValue: "#3b82f6",
    },
    fontScale: {
      type: "slider",
      label: "Font Scale",
      min: 0.7,
      max: 1.4,
      step: 0.05,
      defaultValue: 1,
    },
  },
  defaults: {
    metadata: {
      title: "Hello, World",
      description: "A beautiful featured image generated in seconds.",
      siteName: "My Site",
      author: "Jane Doe",
      tags: ["nextjs", "design", "open-graph"],
    },
    customizations: {
      bgColor: "#ffffff",
      textColor: "#09090b",
      accentColor: "#3b82f6",
      fontScale: 1,
    },
  },
  BrowserComponent,
  SatoriComponent,
  previewImagePath: "/templates/minimal-card/preview.png",
};
