import type { TemplateDefinition } from "../shared/types";
import { STANDARD_DIMENSIONS } from "../shared/tokens";
import { BrowserComponent } from "./browser";
import { SatoriComponent } from "./satori";

export const gradientModern: TemplateDefinition = {
  id: "gradient-modern",
  name: "Gradient Modern",
  description:
    "Vibrant diagonal gradient background with bold sans-serif typography.",
  category: "bold",
  supportedDimensions: [...STANDARD_DIMENSIONS],
  requiredFields: ["title"],
  customizations: {
    gradientFrom: {
      type: "color",
      label: "Gradient Start",
      defaultValue: "#6366f1",
    },
    gradientTo: {
      type: "color",
      label: "Gradient End",
      defaultValue: "#8b5cf6",
    },
    textColor: { type: "color", label: "Text", defaultValue: "#ffffff" },
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
      title: "Ship Faster with Modern Tooling",
      description: "How we cut our build times by 60% using the right tools.",
      siteName: "Blog",
      author: "Jane Doe",
      tags: ["performance", "devtools", "dx"],
    },
    customizations: {
      gradientFrom: "#6366f1",
      gradientTo: "#8b5cf6",
      textColor: "#ffffff",
      fontScale: 1,
    },
  },
  BrowserComponent,
  SatoriComponent,
  previewImagePath: "/templates/gradient-modern/preview.png",
};
