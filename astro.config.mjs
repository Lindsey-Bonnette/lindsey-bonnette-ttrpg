// @ts-check

import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import { defineConfig, fontProviders } from 'astro/config';

// https://astro.build/config
export default defineConfig({
	site: 'https://www.lindseybonnetterpgpublishing.com',
	integrations: [mdx(), sitemap()],
	fonts: [
		{
			provider: fontProviders.google(),
			name: 'Cormorant Garamond',
			cssVariable: '--font-cormorant',
			fallbacks: ['Georgia', 'serif'],
			weights: [500, 600],
			styles: ['normal', 'italic'],
			subsets: ['latin'],
		},
		{
			provider: fontProviders.google(),
			name: 'Inter',
			cssVariable: '--font-inter',
			fallbacks: ['system-ui', 'sans-serif'],
			weights: [400, 500, 600],
			subsets: ['latin'],
		},
	],
});
