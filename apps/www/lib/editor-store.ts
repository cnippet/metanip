import { create } from "zustand";
import type { Metadata } from "@repo/metadata";
import type { Dimension } from "@repo/templates";

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
  templateId: "",
  metadata: { title: "Untitled", tags: [], customFields: {} },
  customizations: {},
  dimensions: { w: 1200, h: 630, label: "OG Image" },
  setField: (key, value) =>
    set((s) => ({ metadata: { ...s.metadata, [key]: value } })),
  setCustomization: (key, value) =>
    set((s) => ({ customizations: { ...s.customizations, [key]: value } })),
  setDimensions: (dim) => set({ dimensions: dim }),
  resetCustomizations: (defaults) => set({ customizations: { ...defaults } }),
  init: (params) => set(params),
}));
