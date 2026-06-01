import type { ComponentType } from "react";
import type { Metadata } from "@repo/metadata";

export type Dimension = {
  w: number;
  h: number;
  label: string;
};

export type CustomizationControl =
  | { type: "color"; label: string; defaultValue: string }
  | { type: "text"; label: string; defaultValue: string }
  | {
      type: "select";
      label: string;
      options: Array<{ value: string; label: string }>;
      defaultValue: string;
    }
  | {
      type: "slider";
      label: string;
      min: number;
      max: number;
      step?: number;
      defaultValue: number;
    }
  | { type: "toggle"; label: string; defaultValue: boolean }
  | { type: "image"; label: string; defaultValue?: string };

export type CustomizationSchema = Record<string, CustomizationControl>;

export type TemplateProps = {
  metadata: Metadata;
  customizations: Record<string, unknown>;
  dimensions: Dimension;
};

export type TemplateCategory =
  | "minimal"
  | "bold"
  | "dev"
  | "podcast"
  | "social"
  | "photo"
  | "editorial"
  | "newsletter";

export type TemplateDefinition = {
  id: string;
  name: string;
  description: string;
  category: TemplateCategory;
  supportedDimensions: Dimension[];
  requiredFields: (keyof Metadata)[];
  customizations: CustomizationSchema;
  defaults: {
    metadata: Partial<Metadata>;
    customizations: Record<string, unknown>;
  };
  BrowserComponent: ComponentType<TemplateProps>;
  SatoriComponent: ComponentType<TemplateProps>;
  previewImagePath: string;
};
