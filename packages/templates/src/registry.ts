import type { TemplateCategory, TemplateDefinition } from "./shared/types";
import { minimalCard } from "./minimal-card/definition";
import { boldEditorial } from "./bold-editorial/definition";
import { devTerminal } from "./dev-terminal/definition";
import { gradientModern } from "./gradient-modern/definition";
import { devSnippet } from "./dev-snippet/definition";
import { podcastEpisode } from "./podcast-episode/definition";
import { quoteCard } from "./quote-card/definition";
import { photoOverlay } from "./photo-overlay/definition";
import { magazineSpread } from "./magazine-spread/definition";
import { linkedinPro } from "./linkedin-pro/definition";
import { twitterPunchy } from "./twitter-punchy/definition";
import { newsletterClassic } from "./newsletter-classic/definition";

export const templates: TemplateDefinition[] = [
  minimalCard,
  boldEditorial,
  devTerminal,
  gradientModern,
  devSnippet,
  podcastEpisode,
  quoteCard,
  photoOverlay,
  magazineSpread,
  linkedinPro,
  twitterPunchy,
  newsletterClassic,
];

export function getTemplate(id: string): TemplateDefinition | undefined {
  return templates.find((t) => t.id === id);
}

export function getTemplatesByCategory(
  category: TemplateCategory,
): TemplateDefinition[] {
  return templates.filter((t) => t.category === category);
}

export function getAllCategories(): TemplateCategory[] {
  return [...new Set(templates.map((t) => t.category))];
}
