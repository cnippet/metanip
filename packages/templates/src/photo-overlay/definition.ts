import type { TemplateDefinition } from "../shared/types";
import { STANDARD_DIMENSIONS } from "../shared/tokens";
import { BrowserComponent } from "./browser";
import { SatoriComponent } from "./satori";

export const photoOverlay: TemplateDefinition = {
  id: "photo-overlay",
  name: "Photo Overlay",
  description:
    "Hero image with a dark gradient overlay — title and metadata float over the image.",
  category: "photo",
  supportedDimensions: [...STANDARD_DIMENSIONS],
  requiredFields: ["title"],
  customizations: {
    overlayColor: {
      type: "color",
      label: "Overlay Color",
      defaultValue: "#000000",
    },
    overlayOpacity: {
      type: "slider",
      label: "Overlay Opacity",
      min: 0.3,
      max: 0.9,
      step: 0.05,
      defaultValue: 0.6,
    },
    textColor: {
      type: "color",
      label: "Text",
      defaultValue: "#ffffff",
    },
    accentColor: {
      type: "color",
      label: "Accent",
      defaultValue: "#f59e0b",
    },
    fallbackBg: {
      type: "color",
      label: "Fallback BG",
      defaultValue: "#1e293b",
    },
  },
  defaults: {
    metadata: {
      title: "A Journey Through the Mountains",
      description: "Capturing light, silence, and the weight of altitude.",
      author: "Alex Chen",
      siteName: "Wanderlens",
      tags: ["photography", "travel", "nature"],
    },
    customizations: {
      overlayColor: "#000000",
      overlayOpacity: 0.6,
      textColor: "#ffffff",
      accentColor: "#f59e0b",
      fallbackBg: "#1e293b",
    },
  },
  BrowserComponent,
  SatoriComponent,
  previewImagePath: "/templates/photo-overlay/preview.png",
};
