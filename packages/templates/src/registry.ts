import type { TemplateCategory, TemplateDefinition } from "./shared/types";
import { minimalCard } from "./minimal-card/definition";
import { boldEditorial } from "./bold-editorial/definition";
import { devTerminal } from "./dev-terminal/definition";
import { gradientModern } from "./gradient-modern/definition";

export const templates: TemplateDefinition[] = [
  minimalCard,
  boldEditorial,
  devTerminal,
  gradientModern,
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
