import type { TemplateDefinition } from "../shared/types";
import { STANDARD_DIMENSIONS } from "../shared/tokens";
import { BrowserComponent } from "./browser";
import { SatoriComponent } from "./satori";

export const twitterPunchy: TemplateDefinition = {
  id: "twitter-punchy",
  name: "Twitter Punchy",
  description: "High-contrast, opinion-forward layout optimised for Twitter/X 1600×900 card previews.",
  category: "social",
  supportedDimensions: [
    { w: 1600, h: 900, label: "Twitter" },
    { w: 1200, h: 630, label: "OG Image" },
    { w: 1200, h: 627, label: "LinkedIn" },
    { w: 1080, h: 1080, label: "Square" },
  ],
  requiredFields: ["title"],
  customizations: {
    bgColor: {
      type: "color",
      label: "Background",
      defaultValue: "#000000",
    },
    textColor: {
      type: "color",
      label: "Text",
      defaultValue: "#ffffff",
    },
    accentColor: {
      type: "color",
      label: "Accent",
      defaultValue: "#1d9bf0",
    },
    showHandle: {
      type: "toggle",
      label: "Show Handle",
      defaultValue: true,
    },
    fontScale: {
      type: "slider",
      label: "Font Scale",
      min: 0.7,
      max: 1.3,
      step: 0.05,
      defaultValue: 1,
    },
  },
  defaults: {
    metadata: {
      title: "Hot take: most performance advice is wrong.",
      description: "Profiling 200 production apps taught me the real bottlenecks nobody talks about.",
      author: "Ali Hassan",
      authorHandle: "@alihasandev",
      siteName: "Thread",
      tags: ["performance", "webdev"],
    },
    customizations: {
      bgColor: "#000000",
      textColor: "#ffffff",
      accentColor: "#1d9bf0",
      showHandle: true,
      fontScale: 1,
    },
  },
  BrowserComponent,
  SatoriComponent,
  previewImagePath: "/templates/twitter-punchy/preview.png",
};
