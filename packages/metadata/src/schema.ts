import { z } from "zod";

export const MetadataSchema = z.object({
  title: z.string().min(1),
  subtitle: z.string().optional(),
  description: z.string().optional(),
  author: z.string().optional(),
  authorAvatar: z.string().url().optional(),
  authorHandle: z.string().optional(),
  siteName: z.string().optional(),
  siteUrl: z.string().url().optional(),
  siteLogo: z.string().url().optional(),
  tags: z.array(z.string()).default([]),
  publishedAt: z.coerce.date().optional(),
  readingTime: z.number().positive().optional(),
  heroImage: z.string().url().optional(),
  themeColor: z.string().optional(),
  customFields: z.record(z.string(), z.string()).default({}),
});

export type Metadata = z.infer<typeof MetadataSchema>;
