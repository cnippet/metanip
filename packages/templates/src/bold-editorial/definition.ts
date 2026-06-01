import type { TemplateDefinition } from "../shared/types";
import { STANDARD_DIMENSIONS } from "../shared/tokens";
import { BrowserComponent } from "./browser";
import { SatoriComponent } from "./satori";

export const boldEditorial: TemplateDefinition = {
  id: "bold-editorial",
  name: "Bold Editorial",
  description: "Dark dramatic layout with a full-width accent rule and large serif-style title.",
  category: "bold",
  supportedDimensions: [...STANDARD_DIMENSIONS],
  requiredFields: ["title"],
  customizations: {
    bgColor: { type: "color", label: "Background", defaultValue: "#1a1a2e" },
    textColor: { type: "color", label: "Text", defaultValue: "#f8f8f2" },
    accentColor: { type: "color", label: "Accent", defaultValue: "#e63946" },
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
      title: "The Future of Web Design",
      description:
        "Exploring the intersection of performance, aesthetics, and developer experience.",
      siteName: "Editorial",
      author: "Jane Doe",
      tags: ["design", "web", "ux"],
      publishedAt: new Date("2025-01-15"),
    },
    customizations: {
      bgColor: "#1a1a2e",
      textColor: "#f8f8f2",
      accentColor: "#e63946",
      fontScale: 1,
    },
  },
  BrowserComponent,
  SatoriComponent,
  previewImagePath: "/templates/bold-editorial/preview.png",
};
