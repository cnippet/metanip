import type { TemplateCategory, TemplateDefinition } from "./shared/types";

export const templates: TemplateDefinition[] = [];

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
