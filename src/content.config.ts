import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const blog = defineCollection({
	loader: glob({ base: './src/content/blog', pattern: '**/*.{md,mdx}' }),
	schema: ({ image }) =>
		z.object({
			title: z.string(),
			description: z.string(),
			pubDate: z.coerce.date(),
			updatedDate: z.coerce.date().optional(),
			heroImage: z.optional(image()),
		}),
});

const projects = defineCollection({
	loader: glob({ base: './src/content/projects', pattern: '**/*.{md,mdx}' }),
	schema: ({ image }) =>
		z.object({
			title: z.string(),
			tagline: z.string().optional(),
			description: z.string(),
			pubDate: z.coerce.date().optional(),
			cover: z.optional(image()),
			tags: z.array(z.string()).default([]),
			itchUrl: z.string().url().optional(),
			drivethruUrl: z.string().url().optional(),
			price: z.string().optional(),
			featured: z.boolean().default(false),
			// Manual ordering for the gallery (lower = earlier).
			order: z.number().default(100),
		}),
});

export const collections = { blog, projects };
