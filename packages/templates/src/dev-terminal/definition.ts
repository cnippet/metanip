import type { TemplateDefinition } from "../shared/types";
import { STANDARD_DIMENSIONS } from "../shared/tokens";
import { BrowserComponent } from "./browser";
import { SatoriComponent } from "./satori";

export const devTerminal: TemplateDefinition = {
  id: "dev-terminal",
  name: "Dev Terminal",
  description:
    "Dark terminal aesthetic with monospace type and code-style formatting.",
  category: "dev",
  supportedDimensions: [...STANDARD_DIMENSIONS],
  requiredFields: ["title"],
  customizations: {
    bgColor: { type: "color", label: "Background", defaultValue: "#0d1117" },
    promptColor: {
      type: "color",
      label: "Prompt / Accent",
      defaultValue: "#7ee787",
    },
    textColor: { type: "color", label: "Text", defaultValue: "#c9d1d9" },
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
      title: "Building a CLI Tool with Node.js",
      description:
        "A deep dive into building production-ready command-line tools.",
      siteName: "devblog",
      author: "jane_dev",
      tags: ["nodejs", "cli", "typescript"],
      readingTime: 8,
    },
    customizations: {
      bgColor: "#0d1117",
      promptColor: "#7ee787",
      textColor: "#c9d1d9",
      fontScale: 1,
    },
  },
  BrowserComponent,
  SatoriComponent,
  previewImagePath: "/templates/dev-terminal/preview.png",
};
