import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import mdx from '@astrojs/mdx';
import cloudflare from '@astrojs/cloudflare';

// https://astro.build/config
export default defineConfig({
  output: 'server',
  adapter: cloudflare({
    imageService: 'passthrough',
    platformProxy: {
      enabled: true,
    },
  }),
  integrations: [
    tailwind({
      applyBaseStyles: false,
    }),
    mdx(),
  ],
  site: 'https://ranggadimas.dev',
  // The blog moved to its own app; keep old links working.
  redirects: {
    '/blog': 'https://blog.ranggadimas.com',
    '/blog/[...slug]': 'https://blog.ranggadimas.com',
  },
});
