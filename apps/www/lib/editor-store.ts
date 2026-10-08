import type { Metadata } from "@repo/metadata";
import type { Dimension } from "@repo/templates";
import { create } from "zustand";

type EditorStore = {
  templateId: string;
  metadata: Metadata;
  customizations: Record<string, unknown>;
  dimensions: Dimension;
  setField: (key: keyof Metadata, value: Metadata[keyof Metadata]) => void;
  setCustomization: (key: string, value: unknown) => void;
  setDimensions: (dim: Dimension) => void;
  resetCustomizations: (defaults: Record<string, unknown>) => void;
  init: (params: {
    templateId: string;
    metadata: Metadata;
    customizations: Record<string, unknown>;
    dimensions: Dimension;
  }) => void;
};

export const useEditorStore = create<EditorStore>((set) => ({
  customizations: {},
  dimensions: { h: 630, label: "OG Image", w: 1200 },
  init: (params) => set(params),
  metadata: { customFields: {}, tags: [], title: "Untitled" },
  resetCustomizations: (defaults) => set({ customizations: { ...defaults } }),
  setCustomization: (key, value) =>
    set((s) => ({ customizations: { ...s.customizations, [key]: value } })),
  setDimensions: (dim) => set({ dimensions: dim }),
  setField: (key, value) =>
    set((s) => ({ metadata: { ...s.metadata, [key]: value } })),
  templateId: "",
}));
