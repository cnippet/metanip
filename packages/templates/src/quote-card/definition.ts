import type { TemplateDefinition } from "../shared/types";
import { STANDARD_DIMENSIONS } from "../shared/tokens";
import { BrowserComponent } from "./browser";
import { SatoriComponent } from "./satori";

export const quoteCard: TemplateDefinition = {
  id: "quote-card",
  name: "Quote Card",
  description:
    "Oversized pull-quote with decorative quotation mark and attribution line.",
  category: "social",
  supportedDimensions: [...STANDARD_DIMENSIONS],
  requiredFields: ["title"],
  customizations: {
    bgColor: {
      type: "color",
      label: "Background",
      defaultValue: "#fafaf9",
    },
    textColor: {
      type: "color",
      label: "Text",
      defaultValue: "#1c1917",
    },
    accentColor: {
      type: "color",
      label: "Quote Mark",
      defaultValue: "#f97316",
    },
    fontScale: {
      type: "slider",
      label: "Font Scale",
      min: 0.7,
      max: 1.4,
      step: 0.05,
      defaultValue: 1,
    },
    alignment: {
      type: "select",
      label: "Alignment",
      options: [
        { value: "left", label: "Left" },
        { value: "center", label: "Center" },
      ],
      defaultValue: "left",
    },
  },
  defaults: {
    metadata: {
      title: "The best way to predict the future is to invent it.",
      author: "Alan Kay",
      siteName: "Quotable",
      tags: ["quote", "inspiration"],
    },
    customizations: {
      bgColor: "#fafaf9",
      textColor: "#1c1917",
      accentColor: "#f97316",
      fontScale: 1,
      alignment: "left",
    },
  },
  BrowserComponent,
  SatoriComponent,
  previewImagePath: "/templates/quote-card/preview.png",
};
