// @ts-check
import { defineConfig } from 'astro/config';
import sanity from '@sanity/astro';
import react from '@astrojs/react';
import { loadEnv } from 'vite';

const env = loadEnv(process.env.NODE_ENV ?? 'production', process.cwd(), '');
const projectId = env.PUBLIC_SANITY_PROJECT_ID || process.env.PUBLIC_SANITY_PROJECT_ID || '';
const dataset = env.PUBLIC_SANITY_DATASET || process.env.PUBLIC_SANITY_DATASET || 'production';

// Static output: every public page is prerendered HTML with no client framework.
// The Sanity Studio is the only React island and lives at /studio (hash router,
// which is what a static build requires). When no project id is configured the
// site renders from sanity/seed/content.ts so the design can be built and
// reviewed before the CMS exists.
export default defineConfig({
  output: 'static',
  site: env.PUBLIC_SITE_URL || 'https://stylingoc.pages.dev',
  compressHTML: true,
  integrations: [
    ...(projectId
      ? [
          sanity({
            projectId,
            dataset,
            useCdn: true,
            apiVersion: '2026-08-31',
            studioBasePath: '/studio',
            studioRouterHistory: 'hash',
          }),
          react(),
        ]
      : []),
  ],
  image: { domains: ['cdn.sanity.io'] },
});
