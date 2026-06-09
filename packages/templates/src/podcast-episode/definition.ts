import type { TemplateDefinition } from "../shared/types";
import { STANDARD_DIMENSIONS } from "../shared/tokens";
import { BrowserComponent } from "./browser";
import { SatoriComponent } from "./satori";

export const podcastEpisode: TemplateDefinition = {
  id: "podcast-episode",
  name: "Podcast Episode",
  description:
    "Cover art + episode number, title, host name, and duration badge.",
  category: "podcast",
  supportedDimensions: [...STANDARD_DIMENSIONS],
  requiredFields: ["title"],
  customizations: {
    bgColor: {
      type: "color",
      label: "Background",
      defaultValue: "#0f0a1e",
    },
    accentColor: {
      type: "color",
      label: "Accent",
      defaultValue: "#a855f7",
    },
    textColor: {
      type: "color",
      label: "Text",
      defaultValue: "#f8fafc",
    },
    episodeNumber: {
      type: "text",
      label: "Episode #",
      defaultValue: "42",
    },
    duration: {
      type: "text",
      label: "Duration",
      defaultValue: "45 min",
    },
  },
  defaults: {
    metadata: {
      title: "Building in Public: Lessons from 100 Days",
      description:
        "We cover the reality of shipping solo, handling rejection, and keeping momentum.",
      author: "Jane Doe",
      siteName: "The Indie Podcast",
      tags: ["indie", "startup", "shipping"],
    },
    customizations: {
      bgColor: "#0f0a1e",
      accentColor: "#a855f7",
      textColor: "#f8fafc",
      episodeNumber: "42",
      duration: "45 min",
    },
  },
  BrowserComponent,
  SatoriComponent,
  previewImagePath: "/templates/podcast-episode/preview.png",
};
