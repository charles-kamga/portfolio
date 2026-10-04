import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const projects = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/projects' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    category: z.enum(['sys', 'web', 'desktop', 'ai']),
    categoryLabel: z.string(),
    date: z.string(),
    tags: z.array(z.string()),
    sourceUrl: z.string().url().optional(),
    demoUrl: z.string().url().optional(),
    image: z.string(),
    badge: z.string(),
    featured: z.boolean().default(false),
    metrics: z.array(z.object({
      label: z.string(),
      value: z.string(),
    })).optional(),
  }),
});

export const collections = {
  projects,
};
