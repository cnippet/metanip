import type { TemplateDefinition } from "../shared/types";
import { STANDARD_DIMENSIONS } from "../shared/tokens";
import { BrowserComponent } from "./browser";
import { SatoriComponent } from "./satori";

export const devSnippet: TemplateDefinition = {
  id: "dev-snippet",
  name: "Dev Snippet",
  description:
    "Carbon/ray.so-style code window with syntax highlight aesthetic and window chrome.",
  category: "dev",
  supportedDimensions: [...STANDARD_DIMENSIONS],
  requiredFields: ["title"],
  customizations: {
    bgColor: {
      type: "color",
      label: "Background",
      defaultValue: "#0d1117",
    },
    windowBg: {
      type: "color",
      label: "Window",
      defaultValue: "#161b22",
    },
    accentColor: {
      type: "color",
      label: "Accent",
      defaultValue: "#58a6ff",
    },
    language: {
      type: "text",
      label: "Language Badge",
      defaultValue: "TypeScript",
    },
    showLineNumbers: {
      type: "toggle",
      label: "Line Numbers",
      defaultValue: true,
    },
  },
  defaults: {
    metadata: {
      title: "const greet = (name: string) => `Hello, ${name}!`",
      description: "A utility snippet from the codebase.",
      siteName: "dev.to",
      author: "janedev",
      tags: ["typescript", "snippet"],
    },
    customizations: {
      bgColor: "#0d1117",
      windowBg: "#161b22",
      accentColor: "#58a6ff",
      language: "TypeScript",
      showLineNumbers: true,
    },
  },
  BrowserComponent,
  SatoriComponent,
  previewImagePath: "/templates/dev-snippet/preview.png",
};
