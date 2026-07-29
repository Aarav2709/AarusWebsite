import { defineCollection, z } from "astro:content";
import { glob } from "astro/loaders";

const projectsCollection = defineCollection({
  loader: glob({
    pattern: "**/*.md",
    base: "src/content/projects",
  }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    tech: z.array(z.string()),
    github: z.string().url().optional(),
    live: z.string().url().optional(),
    previewImage: z.string().optional(),
    previewAlt: z.string().optional(),
    stars: z.number().optional(),
    featured: z.boolean().default(false),
    order: z.number().default(999),
  }),
});

const blogCollection = defineCollection({
  loader: glob({
    pattern: "**/*.md",
    base: "src/content/blog",
  }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    date: z.coerce.date(),
    cover: z.string().optional(),
    draft: z.boolean().default(false),
  }),
});

export const collections = {
  projects: projectsCollection,
  blog: blogCollection,
};
