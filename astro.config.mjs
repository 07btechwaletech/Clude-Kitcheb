// @ts-check
import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';

import { SITE } from './src/lib/site.ts';

// Fully static output — `npm run build` emits plain HTML/CSS/JS into ./dist,
// ready for Cloudflare Pages, Vercel, Netlify or any static host.
export default defineConfig({
  site: SITE.url,
  output: 'static',
  trailingSlash: 'ignore',
  integrations: [react(), sitemap({ lastmod: new Date() })],
  vite: { plugins: [tailwindcss()] },
  build: { inlineStylesheets: 'auto' },
  prefetch: { prefetchAll: true, defaultStrategy: 'viewport' },
});
