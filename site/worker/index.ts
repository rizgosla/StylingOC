/* Worker entry for Cloudflare Workers deploys (see wrangler.jsonc). It reuses the Pages
   Function in functions/api/inquiry.ts for the form and hands every other request to the
   static assets built by Astro, so the same code runs on Pages and on Workers. */
import { onRequestGet, onRequestPost } from '../functions/api/inquiry';

interface Env {
  ASSETS: Fetcher;
  PUBLIC_SANITY_PROJECT_ID?: string;
  PUBLIC_SANITY_DATASET?: string;
  SANITY_WRITE_TOKEN?: string;
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const { pathname } = new URL(request.url);
    if (pathname === '/api/inquiry') {
      const context = { request, env } as unknown as Parameters<typeof onRequestPost>[0];
      return request.method === 'POST' ? onRequestPost(context) : onRequestGet(context);
    }
    return env.ASSETS.fetch(request);
  },
};
